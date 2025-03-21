// resources/js/Pages/Lessons/Create.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Create({ course }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
        video: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lessons.store", course.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Lesson - {course.title}
                </h2>
            }
        >
            <Head title={`Create Lesson - ${course.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="max-w-2xl mx-auto">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Lesson Title
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="title"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Enter lesson title"
                                            />
                                        </div>
                                        {errors.title && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="content"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Lesson Content
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="content"
                                                rows={4}
                                                value={data.content}
                                                onChange={(e) =>
                                                    setData(
                                                        "content",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Enter lesson content"
                                            />
                                        </div>
                                        {errors.content && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.content}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="video"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Lesson Video
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="file"
                                                id="video"
                                                accept="video/*"
                                                onChange={(e) =>
                                                    setData(
                                                        "video",
                                                        e.target.files[0]
                                                    )
                                                }
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Upload a video file (MP4, MOV, AVI,
                                            FLV, or MKV, max 100MB)
                                        </p>
                                        {errors.video && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.video}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <a
                                            href={route(
                                                "courses.show",
                                                course.id
                                            )}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </a>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {processing
                                                ? "Creating..."
                                                : "Create Lesson"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
