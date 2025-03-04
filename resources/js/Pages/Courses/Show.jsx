import { Head, Link } from '@inertiajs/react';

export default function Show({ course }) {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <Head title={course.title} />

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-700">{course.description || "No description provided."}</p>

            <div className="mt-6">
                <Link
                    href={route('courses')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Back to Courses
                </Link>
            </div>
        </div>
    );
}
