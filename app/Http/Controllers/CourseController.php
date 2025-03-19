<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::latest()->get();
        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'auth' => [
                'courses' => $courses,
                'user' => [
                    'role' => Auth::user()->role,
                ],
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
            'video' => 'nullable|mimes:mp4,mov,avi,flv,mkv|max:102400', // Video validation
        ]);

        $videoPath = null;

        // Handle the video upload if a file is provided
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('videos', 'public'); // Save video in 'public/videos'
        }
        do {
            $code = str_pad(mt_rand(0, 999999999), 9, '0', STR_PAD_LEFT);
        } while (Course::where('code', $code)->exists());
        // Store the course along with the video path
        $courseData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'video' => $videoPath, // Save the video path in the database
            'code' => $code,
        ];

        // Create the course and associate it with the authenticated user
        $course = $request->user()->courses()->create($courseData);

        return redirect()->route('courses.show', $course);
    }

    public function show(Course $course)
    {
        $course->load('lessons');
        return Inertia::render('Courses/Show', [
            'course' => $course,
            'canEdit' => Auth::user()?->can('update', $course)
        ]);
    }

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:9',
        ]);

        // Find the course by code
        $course = Course::where('code', $request->code)->firstOrFail();

        // Get the currently authenticated user
        $user = auth()->user();

        // Assign the course (without duplicating)
        $user->assignedCourses()->syncWithoutDetaching($course->id);

        return redirect()->route('dashboard')->with('success', 'Successfully joined the room.');
    }
}

