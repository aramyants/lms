<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'video',
        'code',
    ];

    // Relationship to the user who created the course
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_user')
            ->withTimestamps();
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
