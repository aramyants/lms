<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function create(Course $course)
    {
        Gate::authorize('update', $course);

        return Inertia::render('Lessons/Create', [
            'course' => $course
        ]);
    }

    public function store(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'video' => 'nullable|mimes:mp4,mov,avi,flv,mkv|max:102400',
        ]);

        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('lessons/videos', 'public');
        }

        $course->lessons()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'video' => $videoPath,
        ]);

        return redirect()->route('courses.show', $course);
    }
}
