import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Transition } from "@headlessui/react";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";

// Custom styles for scrollbars and loading states
const styles = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
    }

    .loading-shimmer {
        background: linear-gradient(
            90deg,
            #f3f4f6 0%,
            #e5e7eb 50%,
            #f3f4f6 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    .modal-transition {
        transition: all 0.3s ease-out;
    }

    .modal-enter {
        opacity: 0;
        transform: scale(0.95);
    }

    .modal-enter-active {
        opacity: 1;
        transform: scale(1);
    }
`;

export default function Students({ course, availableStudents }) {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(false);
    const [processingInvite, setProcessingInvite] = useState(null);
    const [studentToRemove, setStudentToRemove] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        email: "",
    });

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(course.code);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const handleInvite = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(route("courses.invite", course.id), {
            onSuccess: () => {
                reset();
                setShowInviteModal(false);
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const handleDirectInvite = (studentId) => {
        if (processingInvite === studentId) return;

        setProcessingInvite(studentId);
        router.post(
            route("courses.invite", course.id),
            {
                email: availableStudents.find((s) => s.id === studentId).email,
            },
            {
                onSuccess: () => {
                    setProcessingInvite(null);
                },
                onError: () => {
                    setProcessingInvite(null);
                },
            }
        );
    };

    const handleRemoveStudent = () => {
        if (!studentToRemove) return;

        setIsLoading(true);
        router.delete(
            route("courses.remove-student", {
                course: course.id,
                student: studentToRemove.id,
            }),
            {
                onSuccess: () => {
                    setStudentToRemove(null);
                    setIsLoading(false);
                },
                onError: () => {
                    setStudentToRemove(null);
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Students - {course.title}
                </h2>
            }
        >
            <style>{styles}</style>
            <Head title={`Students - ${course.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Course Code Share Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 transform transition-all duration-300 hover:shadow-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Course Code
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Share this code with students to let
                                        them join the course
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 px-4 py-2 rounded-md">
                                        <span className="text-lg font-mono font-semibold">
                                            {course.code}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
                                    >
                                        {copyFeedback ? "Copied!" : "Copy"}
                                        <Transition
                                            show={copyFeedback}
                                            enter="transition-opacity duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition-opacity duration-300"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                                Copied!
                                            </div>
                                        </Transition>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg transform transition-all duration-300 hover:shadow-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Enrolled Students ({course.students.length})
                                </h3>
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
                                >
                                    Invite Student
                                </button>
                            </div>

                            {course.students.length === 0 ? (
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
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No students enrolled
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Share the course code with students or
                                        invite them directly.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Email
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Joined
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="relative px-6 py-3"
                                                >
                                                    <span className="sr-only">
                                                        Actions
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {course.students.map((student) => (
                                                <tr
                                                    key={student.id}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {student.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(
                                                            student.pivot.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                setStudentToRemove(
                                                                    student
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <span className="loading-shimmer">
                                                                    Removing...
                                                                </span>
                                                            ) : (
                                                                "Remove"
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Student Modal */}
            <Transition
                show={showInviteModal}
                enter="modal-transition modal-enter"
                enterFrom="modal-enter"
                enterTo="modal-enter-active"
                leave="modal-transition"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowInviteModal(false)}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                            Invite Student
                                        </h3>

                                        <form onSubmit={handleInvite}>
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="student@example.com"
                                                    disabled={processing}
                                                />
                                                {errors.email && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors.email}
                                                    </p>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        processing || isLoading
                                                    }
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processing ? (
                                                        <span className="flex items-center">
                                                            <svg
                                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            Sending...
                                                        </span>
                                                    ) : (
                                                        "Send Invitation"
                                                    )}
                                                </button>
                                            </div>
                                        </form>

                                        {/* Available Students List */}
                                        <div className="mt-6">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Available Students
                                            </h4>
                                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                {availableStudents?.length >
                                                0 ? (
                                                    <div className="space-y-2">
                                                        {availableStudents.map(
                                                            (student) => (
                                                                <div
                                                                    key={
                                                                        student.id
                                                                    }
                                                                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors duration-150"
                                                                >
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {
                                                                                student.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            {
                                                                                student.email
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDirectInvite(
                                                                                student.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processingInvite ===
                                                                            student.id
                                                                        }
                                                                        className="inline-flex items-center p-1 border border-transparent rounded-full text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                                    >
                                                                        {processingInvite ===
                                                                        student.id ? (
                                                                            <svg
                                                                                className="animate-spin h-5 w-5"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <circle
                                                                                    className="opacity-25"
                                                                                    cx="12"
                                                                                    cy="12"
                                                                                    r="10"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="4"
                                                                                ></circle>
                                                                                <path
                                                                                    className="opacity-75"
                                                                                    fill="currentColor"
                                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                ></path>
                                                                            </svg>
                                                                        ) : (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-5 w-5"
                                                                                viewBox="0 0 20 20"
                                                                                fill="currentColor"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                                                    clipRule="evenodd"
                                                                                />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-4">
                                                        No available students
                                                        found
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-200 hover:scale-105"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

            {/* Confirmation Modal */}
            <Transition
                show={!!studentToRemove}
                enter="modal-transition modal-enter"
                enterFrom="modal-enter"
                enterTo="modal-enter-active"
                leave="modal-transition"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setStudentToRemove(null)}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Remove Student
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to remove{" "}
                                                <span className="font-medium text-gray-900">
                                                    {studentToRemove?.name}
                                                </span>{" "}
                                                from this course? This action
                                                cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleRemoveStudent}
                                    disabled={isLoading}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Removing...
                                        </span>
                                    ) : (
                                        "Remove"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStudentToRemove(null)}
                                    disabled={isLoading}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </AuthenticatedLayout>
    );
}
