<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('ai_messages', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID for the message
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to users table
            $table->text('content'); // Content of the message
            $table->enum('type', ['user', 'ai', 'error'])->default('user'); // Type of message (user, ai, error)
            $table->string('image')->nullable(); // Store image file path, if any
            $table->timestamps(); // Automatically add created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
