import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({ courses }) {
    const user = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setRoomCode("");
        setError("");
    };

    const handleSubmit = () => {
        if (!/^\d{9}$/.test(roomCode)) {
            setError("Room code must be exactly 9 digits");
            return;
        }

        router.post(
            "/join-room",
            { code: roomCode },
            {
                onSuccess: () => closeModal(),
                onError: (errors) =>
                    setError(errors.code || "Failed to join room"),
            }
        );
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user.name}!
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {user.role === "student"
                                ? "Continue learning from your enrolled courses"
                                : "Manage your courses and students"}
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {user.role === "student" && (
                            <button
                                onClick={openModal}
                                className="flex items-center justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-indigo-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                                        Join a Course
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Enter a course code to join
                                    </p>
                                </div>
                            </button>
                        )}

                        {(user.role === "teacher" || user.role === "admin") && (
                            <Link
                                href="/courses/create"
                                className="flex items-center justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-indigo-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                                        Create Course
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Add a new course to your curriculum
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Courses Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">
                                {user.role === "student"
                                    ? "Your Enrolled Courses"
                                    : "Your Courses"}
                            </h3>

                            {courses.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No courses
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {user.role === "student"
                                            ? "Get started by joining a course"
                                            : "Get started by creating a course"}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <Link
                                            key={course.id}
                                            href={`/courses/${course.id}`}
                                            className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
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
                                                <div className="flex items-center text-indigo-600 hover:text-indigo-800">
                                                    <span className="text-sm font-medium">
                                                        View Course
                                                    </span>
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
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Join Room Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg
                                            className="h-6 w-6 text-indigo-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Join a Course
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Enter the 9-digit course code to
                                                join a course.
                                            </p>
                                            <input
                                                type="text"
                                                value={roomCode}
                                                onChange={(e) =>
                                                    setRoomCode(e.target.value)
                                                }
                                                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Enter 9-digit code"
                                            />
                                            {error && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {error}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Join Course
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
