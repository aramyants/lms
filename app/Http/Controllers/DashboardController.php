<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $courses = $user->assignedCourses;
        return Inertia::render('Dashboard', compact('courses'));
    }
}
