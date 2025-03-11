// resources/js/Pages/Courses/Show.jsx
import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

export default function Show({ course, canEdit }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Course
                </h2>
            }
        >
            <Head title="Courses" />
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <Head title={course.title} />

                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-gray-700">{course.description || "No description provided."}</p>


                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Lessons</h2>

                    {course.lessons.map(lesson => (
                        <div key={lesson.id} className="mb-6 p-4 bg-gray-50 rounded">
                            <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                            <p className="text-gray-600 mb-4">{lesson.content}</p>
                            {lesson.video && (
                                <video
                                    controls
                                    className="w-full rounded"
                                    src={`/storage/${lesson.video}`}
                                />
                            )}
                        </div>
                    ))}

                    {canEdit && (
                        <Link
                            href={route('lessons.create', course.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Add Lesson
                        </Link>
                    )}
                </div>

                <div className="mt-6">
                    <Link
                        href={route('courses')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
