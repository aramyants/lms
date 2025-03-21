import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link } from "@inertiajs/react";

export default function Index({ courses, auth }) {
    const { user } = auth;
    const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

    return (
        <AuthenticatedLayout header="Courses">
            <Head title="Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Available Courses
                                </h3>
                                {isTeacherOrAdmin && (
                                    <Link
                                        href="/courses/create"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Create Course
                                    </Link>
                                )}
                            </div>

                            {courses.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">
                                        No courses available yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="p-6">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {course.title}
                                                </h4>
                                                {course.description && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                )}
                                                <Link
                                                    href={`/courses/${course.id}`}
                                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                                >
                                                    View Course
                                                    <svg
                                                        className="w-4 h-4 ml-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
