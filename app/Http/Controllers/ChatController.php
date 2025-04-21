<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ClaudeService;
use Inertia\Inertia;
use App\Models\AiMessage;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    protected $claude;

    public function __construct(ClaudeService $claude)
    {
        $this->claude = $claude;
    }

    public function index()
    {
        // Retrieve all AiMessages from the database
        $AiMessages = AiMessage::all();

        return Inertia::render('Chat', [
            'messages' => $AiMessages,
        ]);
    }

    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required|string', // For user message
            'image' => 'nullable|image', // If an image is attached
        ]);

        $user = auth()->user();
        $name = $user->name ?? 'Unknown';
        $systemPrompt = "You are an AI assistant helping a user improve their education level on an LMS platform. "
            . "The user’s name is $name. "
            . "Provide helpful, clear, and motivating responses.";

        $userAiMessage = $request->input('message');

        // Initialize imageUrl as null
        $imageUrl = null;
        if ($request->hasFile('image')) {
            // Store the image in the 'public/images' directory
            $imagePath = $request->file('image')->store('images', 'public');

            // Generate the URL to access the image publicly
            $imageUrl = asset('storage/' . $imagePath);
        }

        // Send the message and image URL to the Claude service
        $response = $this->claude->chat($systemPrompt, $userAiMessage, $imageUrl);

        // Save the user's message and AI's response to the database
        $userMessage = AiMessage::create([
            'user_id' => $user->id,
            'content' => $userAiMessage,
            'type' => 'user',
            'image' => $imageUrl, // Save the image path in the database
        ]);

        AiMessage::create([
            'user_id' => $user->id,
            'content' => $response['content'][0]['text'] ?? 'No response from Claude.',
            'type' => 'ai',
            'image' => null, // AI response won't have an image
        ]);

        return response()->json([
            'reply' => $response['content'][0]['text'] ?? 'No response from Claude.',
            'image_url' => $imageUrl ?? null, // Return the image URL if uploaded
        ]);
    }
}
