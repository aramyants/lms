// resources/js/Pages/Lessons/Create.jsx
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ course }) {
    const { data, setData, post, errors } = useForm({
        title: '',
        content: '',
        video: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('lessons.store', course.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <Head title="Create Lesson" />

            <h1 className="text-2xl font-bold mb-4">Add Lesson to {course.title}</h1>

            <form onSubmit={submit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Content</label>
                    <textarea
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                        className="w-full p-2 border rounded h-32"
                    />
                    {errors.content && <div className="text-red-500 text-sm">{errors.content}</div>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Video</label>
                    <input
                        type="file"
                        onChange={e => setData('video', e.target.files[0])}
                        className="w-full p-2 border rounded"
                    />
                    {errors.video && <div className="text-red-500 text-sm">{errors.video}</div>}
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Create Lesson
                    </button>
                    <Link
                        href={route('courses.show', course.id)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
