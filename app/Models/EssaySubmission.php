<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EssaySubmission extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'content',
        'score',
        'submitted_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
