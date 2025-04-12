<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function create(Course $course)
    {
        // Check if user can create lessons for this course
        if (!Gate::allows('manageLessons', $course)) {
            abort(403);
        }

        return Inertia::render('Lessons/Create', [
            'course' => $course
        ]);
    }

    public function store(Request $request, Course $course)
    {
        // Check if user can create lessons for this course
        if (!Gate::allows('manageLessons', $course)) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video' => 'nullable|file|mimes:mp4,mov,avi,flv,mkv|max:102400',
        ]);

        $videoPath = null;
        if ($request->hasFile('video')) {
            try {
                $file = $request->file('video');
                $filename = uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
                $videoPath = $file->storeAs('lessons', $filename, 'public');

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
            $lesson = $course->lessons()->create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'video' => $videoPath,
            ]);

            return redirect()->route('courses.show', $course)
                ->with('success', 'Lesson created successfully.');
        } catch (\Exception $e) {
            // If lesson creation fails, clean up the uploaded video
            if ($videoPath && Storage::disk('public')->exists($videoPath)) {
                Storage::disk('public')->delete($videoPath);
            }
            Log::error('Lesson creation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to create lesson. Please try again.']);
        }
    }
}
