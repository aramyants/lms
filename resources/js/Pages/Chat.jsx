import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import axios from 'axios';

export default function Chat({ messages: initialMessages }, auth) {
    const [messages, setMessages] = useState(initialMessages || []);
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = auth;

    useEffect(() => {
        // Keep the initial messages state synchronized if it's updated externally.
        setMessages(initialMessages);
    }, [initialMessages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() && !image) return;

        const formData = new FormData();
        if (input.trim()) formData.append('message', input);
        let newUserMessage;
        if (image) {
            formData.append('image', image);

            let image_path = URL.createObjectURL(image);
            newUserMessage = { type: 'user', content: input, image: image_path ?? null };
        } else {
            newUserMessage = { type: 'user', content: input };
        }
        setMessages((prev) => [...prev, newUserMessage]);
        setLoading(true);

        try {
            const response = await axios.post('/chat/send', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newClaudeMessage = { type: 'ai', content: response.data.reply };
            setMessages((prev) => [...prev, newClaudeMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { type: 'error', content: 'Something went wrong. Try again.' },
            ]);
        } finally {
            setLoading(false);
            setInput('');
            setImage(null);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    return (
        <AuthenticatedLayout header="Chat Assistant">
            <Head title="Claude Chat" />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
                <h1 className="text-2xl font-bold mb-4">🤖 Chat with Claude</h1>

                <div className="w-full max-w-2xl bg-white shadow rounded-lg p-4 flex flex-col space-y-2 overflow-y-auto h-[500px]">
                    {messages && messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-2 rounded-lg ${msg.type === 'user'
                                ? 'bg-blue-100 self-end text-right'
                                : msg.type === 'ai'
                                    ? 'bg-green-100 self-start'
                                    : 'bg-red-100 self-start'
                            }`}
                        >
                            {msg.content}
                            {msg.image && (
                                <img
                                    src={msg.image}
                                    alt="Uploaded"
                                    className="mt-2 max-w-full rounded-lg"
                                />
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="text-gray-400 italic">Claude is thinking...</div>
                    )}
                </div>

                <form
                    onSubmit={sendMessage}
                    className="w-full max-w-2xl flex mt-4 space-x-2"
                >
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                        onChange={handleImageChange}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        disabled={loading}
                    >
                        Send
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
            );
}
