<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ClaudeService
{
    protected $endpoint = 'https://api.anthropic.com/v1/messages';

    public function chat($systemPrompt, $userMessage, $imageBase64 = null)
    {
        // Build the message payload
        $messages = [
            ['role' => 'user', 'content' => $userMessage]
        ];

        // Optionally include the base64 image data in the prompt
        if ($imageBase64) {
            $messages[] = ['role' => 'user', 'content' => "Here is an image to help you: $imageBase64"];
        }

        $response = Http::withoutVerifying()->withHeaders([
            'x-api-key' => env('CLAUDE_API_KEY'),
            'anthropic-version' => '2023-06-01',
            'Content-Type' => 'application/json',
        ])->post($this->endpoint, [
            'model' => 'claude-3-7-sonnet-latest',
            'max_tokens' => 1000,
            'system' => $systemPrompt,
            'messages' => $messages
        ]);

        return $response->json();
    }
}
