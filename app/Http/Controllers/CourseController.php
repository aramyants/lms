<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $courses = Course::latest()->get();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Courses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video' => 'nullable|file|mimes:mp4,mov,avi,flv,mkv|max:102400',
        ]);

        $videoPath = null;
        if ($request->hasFile('video')) {
            try {
                $file = $request->file('video');
                $filename = uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
                $videoPath = $file->storeAs('videos', $filename, 'public');

                // Verify the file was actually saved
                if (!Storage::disk('public')->exists($videoPath)) {
                    throw new \Exception('Failed to save video file.');
                }
            } catch (\Exception $e) {
                Log::error('Video upload failed: ' . $e->getMessage());
                return redirect()->back()->withErrors(['video' => 'Failed to upload video. Please try again.']);
            }
        }

        try {
            do {
                $code = str_pad(mt_rand(0, 999999999), 9, '0', STR_PAD_LEFT);
            } while (Course::where('code', $code)->exists());

            $courseData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'video' => $videoPath,
                'code' => $code,
            ];

            $course = $request->user()->teachingCourses()->create($courseData);

            return redirect()->route('courses.show', $course);
        } catch (\Exception $e) {
            // If course creation fails, clean up the uploaded video
            if ($videoPath && Storage::disk('public')->exists($videoPath)) {
                Storage::disk('public')->delete($videoPath);
            }
            Log::error('Course creation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to create course. Please try again.']);
        }
    }

    public function show(Course $course)
    {
        $user = Auth::user();
        $isEnrolled = $user->courses()->where('course_id', $course->id)->exists();

        // Load the course with its relationships
        $course->load(['lessons', 'teacher']);

        // Transform the course data to include instructor name and video path
        $courseData = array_merge($course->toArray(), [
            'instructor_id' => $course->user_id,
            'instructor_name' => $course->teacher->name,
            'video_path' => $course->video
        ]);

        return Inertia::render('Courses/Show', [
            'auth' => ['user' => $user],
            'course' => $courseData,
            'lessons' => $course->lessons->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'description' => $lesson->content,
                    'video_path' => $lesson->video
                ];
            })
        ]);
    }

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:9',
        ]);

        $course = Course::where('code', $request->code)->firstOrFail();
        $user = Auth::user();

        // Check if user is already enrolled
        if ($user->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('dashboard')->with('error', 'You are already enrolled in this course.');
        }

        // Enroll the student
        $user->courses()->attach($course->id);

        return redirect()->route('dashboard')->with('success', 'Successfully enrolled in the course.');
    }

    public function students(Course $course)
    {
        if (Auth::user()->id !== $course->user_id) {
            abort(403);
        }

        // Get all students except those already enrolled in the course
        $availableStudents = User::whereNotIn('id', $course->students->pluck('id'))
            ->where('id', '!=', Auth::user()->id)
            ->get();

        return Inertia::render('Courses/Students', [
            'course' => $course->load('students'),
            'availableStudents' => $availableStudents,
        ]);
    }

    public function invite(Request $request, Course $course)
    {
        // Check if user can invite students to this course
        if (Auth::user()->id !== $course->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $student = User::where('email', $validated['email'])->first();

        // Check if student is already enrolled
        if ($course->students()->where('user_id', $student->id)->exists()) {
            return back()->with('error', 'Student is already enrolled in this course.');
        }

        // Enroll the student
        $course->students()->attach($student->id);

        return back()->with('success', 'Student has been invited to the course.');
    }

    public function removeStudent(Course $course, User $student)
    {
        // Check if user can remove students from this course
        if (auth()->id() !== $course->user_id) {
            abort(403);
        }

        $course->students()->detach($student->id);

        return back()->with('success', 'Student has been removed from the course.');
    }
}

