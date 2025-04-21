<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiMessage extends Model
{
    use HasFactory;

    // Define the table associated with the model (optional, as Laravel will use the plural form of the model name by default)
    protected $table = 'ai_messages';

    // Specify the attributes that are mass assignable
    protected $fillable = [
        'user_id',  // The user who sent the message
        'content',  // The text content of the message
        'type',     // The type of message (e.g., 'user', 'ai', 'error')
        'image',    // Optionally store image URL or file path (if applicable)
    ];

    // Optionally, you can define the relationships for the model. For example, a message belongs to a user.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // If you have images stored in the file system, you could add an accessor to retrieve the full image URL
    public function getImageUrlAttribute()
    {
        // This assumes that images are stored in a 'messages' directory
        return asset('storage/messages/' . $this->image);
    }

    // Add any additional logic, such as scopes or methods to format the content, etc.
}
