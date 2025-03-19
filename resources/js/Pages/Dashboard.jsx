import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage, router, Link} from '@inertiajs/react';

export default function Dashboard({courses}) {
    const user = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setRoomCode('');
        setError('');
    };

    const handleSubmit = () => {
        if (!/^\d{9}$/.test(roomCode)) {
            setError('Room code must be exactly 9 digits');
            return;
        }

        router.post('/join-room', { code: roomCode }, {
            onSuccess: () => closeModal(),
            onError: (errors) => setError(errors.code || 'Failed to join room'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {user.role === 'student' && (
                                <button
                                    onClick={openModal}
                                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    Join room
                                </button>
                            )}


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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Enter Room Code</h2>
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter 9-digit code"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
