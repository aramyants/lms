<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'course_id',
        'video'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function usersCompleted()
    {
        return $this->belongsToMany(User::class, 'lesson_user')
            ->withPivot('completed_at')
            ->withTimestamps();
    }
}
