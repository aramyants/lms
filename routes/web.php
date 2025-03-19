<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\AdminOrTeacherMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('courses')->group(function () {
    Route::get('/create', [CourseController::class, 'create'])
        ->name('courses.create')
        ->middleware(AdminOrTeacherMiddleware::class);

    Route::get('/', [CourseController::class, 'index'])->name('courses');
    Route::get('/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::get('{course}/lessons/create', [LessonController::class, 'create'])->name('lessons.create');
    Route::post('{course}/lessons', [LessonController::class, 'store'])->name('lessons.store');

    Route::post('/', [CourseController::class, 'store'])
        ->name('courses.store')
        ->middleware(AdminOrTeacherMiddleware::class);

})->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    Route::post('/join-room', [CourseController::class, 'join']);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
