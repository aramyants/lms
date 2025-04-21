<?php

namespace App\Http\Controllers;

use App\Models\Lesson;

class LessonCompletionController extends Controller
{
    public function store(Lesson $lesson)
    {
        auth()->user()->completedLessons()->syncWithoutDetaching([$lesson->id => [
            'completed_at' => now()
        ]]);

        return response()->json(['message' => 'Lesson marked as completed']);
    }
}
