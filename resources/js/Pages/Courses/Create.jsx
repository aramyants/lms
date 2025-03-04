import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

export default function CreateCourse() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        video: null, // Added for video file
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Create a FormData instance to handle file upload
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.video) {
            formData.append('video', data.video);
        }

        post('/courses', formData);
    };

    const handleVideoChange = (e) => {
        setData('video', e.target.files[0]); // Set the selected video
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Courses
                </h2>
            }
        >
            <Head title="Create Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div>
                                <h1>Create a New Course</h1>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div>
                                        <label htmlFor="title">Title</label>
                                        <input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                        {errors.title && <span>{errors.title}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        {errors.description && <span>{errors.description}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="video">Video</label>
                                        <input
                                            id="video"
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                        />
                                        {errors.video && <span>{errors.video}</span>}
                                    </div>

                                    <button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Course'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
