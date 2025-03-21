import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, useForm } from "@inertiajs/react";

export default function CreateCourse() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        video: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.video) {
            formData.append("video", data.video);
        }

        post("/courses", formData);
    };

    const handleVideoChange = (e) => {
        setData("video", e.target.files[0]);
    };

    return (
        <AuthenticatedLayout header="Create Course">
            <Head title="Create Course" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="max-w-2xl mx-auto">
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Create a New Course
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Fill in the details below to create a
                                        new course. You can add a video and
                                        description to help students understand
                                        what they'll learn.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    encType="multipart/form-data"
                                    className="space-y-6"
                                >
                                    {/* Title Field */}
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Course Title
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Enter course title"
                                                required
                                            />
                                        </div>
                                        {errors.title && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description Field */}
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Course Description
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="description"
                                                rows={4}
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Describe what students will learn in this course"
                                            />
                                        </div>
                                        {errors.description && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Video Upload Field */}
                                    <div>
                                        <label
                                            htmlFor="video"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Course Video
                                        </label>
                                        <div className="mt-1">
                                            <div className="flex items-center justify-center w-full">
                                                <label
                                                    htmlFor="video"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg
                                                            className="w-8 h-8 mb-2 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                            />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">
                                                                Click to upload
                                                            </span>{" "}
                                                            or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            MP4, MOV, AVI, FLV,
                                                            or MKV (MAX. 100MB)
                                                        </p>
                                                    </div>
                                                    <input
                                                        id="video"
                                                        type="file"
                                                        accept="video/*"
                                                        onChange={
                                                            handleVideoChange
                                                        }
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            {data.video && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Selected file:{" "}
                                                    {data.video.name}
                                                </p>
                                            )}
                                        </div>
                                        {errors.video && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.video}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <>
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
                                                    Creating...
                                                </>
                                            ) : (
                                                "Create Course"
                                            )}
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
