import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

export default function Index({ courses, auth }) {
    const { user } = auth; // Assuming the authenticated user is passed as `auth.user`
    const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Courses
                </h2>
            }
        >
            <Head title="Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Courses</h3>
                                {isTeacherOrAdmin && (
                                    <Link
                                        href="/courses/create"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Create Course
                                    </Link>
                                )}
                            </div>
                            <ul>
                                {courses.map((course) => (
                                    <li key={course.id} className="mb-2">
                                        <Link
                                            href={`/courses/${course.id}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {course.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
