<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LessonCompletionController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\AdminOrTeacherMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'courses' => Auth::user()->courses()->latest()->get()
        ]);
    })->name('dashboard');

    Route::resource('courses', CourseController::class);
    Route::post('/join-room', [CourseController::class, 'join'])->name('courses.join');
    Route::get('/courses/{course}/students', [CourseController::class, 'students'])->name('courses.students');

    // Course student management routes
    Route::post('/courses/{course}/invite', [CourseController::class, 'invite'])->name('courses.invite');
    Route::delete('/courses/{course}/students/{student}', [CourseController::class, 'removeStudent'])->name('courses.remove-student');
});

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

Route::post('/lessons/{lesson}/complete', [LessonCompletionController::class, 'store'])
    ->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
Route::post('/chat/send', [ChatController::class, 'send'])->name('chat.send');
Route::post('/courses/{course}/messages', [CourseController::class, 'storeMessage'])->name('courses.storeMessage');

Route::get('/courses/{course}/essay', [CourseController::class, 'essay'])
    ->name('courses.essay');
Route::post('/courses/{course}/essay', [CourseController::class, 'storeEssay'])
    ->name('courses.essay.store');
require __DIR__.'/auth.php';
