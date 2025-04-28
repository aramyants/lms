import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Essay({ auth, course, characterLimit, existingEssay }) {
    const { flash } = usePage().props; // Get flash from page props
    const [content, setContent] = useState(existingEssay?.content ? JSON.parse(existingEssay?.content).content : '');
    const [charCount, setCharCount] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [isSubmitted] = useState(!!existingEssay?.score);
    useEffect(() => {
        setCharCount(content.length);
    }, [content]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(route('courses.essay.store', course.id), { content }, {
            onFinish: () => setSubmitting(false)
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Final Essay - ${course.title}`} />

            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <Link
                            href={route('courses.show', course.id)}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                            ← Back to Course
                        </Link>
                        <h1 className="text-3xl font-bold mt-4">{course.title} - Final Essay</h1>
                        <p className="text-gray-600 mt-2">
                            Please write your essay below ({characterLimit.toLocaleString()} character maximum)
                        </p>
                    </div>
                    {existingEssay?.score && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-blue-800">
                                        Final Score: {existingEssay.score}/100
                                    </h3>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Submitted on: {new Date(existingEssay.submitted_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-800">
                                    {existingEssay.score >= 70 ? 'Passed' : 'Needs Improvement'}
                                </div>
                            </div>
                            {existingEssay.score < 70 && (
                                <p className="mt-3 text-sm text-blue-700">
                                    You can resubmit after improving your essay.
                                </p>
                            )}
                        </div>
                    )}
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className={`w-full h-64 p-4 border rounded-lg focus:ring-2 ${
                                    isSubmitted ? 'bg-gray-50 cursor-not-allowed' : ''
                                }`}
                                placeholder="Write your essay here..."
                                disabled={submitting || isSubmitted}
                            />
                        </div>

                        {!isSubmitted ? (
                            <>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        <span className={charCount > characterLimit ? 'text-red-600' : ''}>
                                            {charCount.toLocaleString()}
                                        </span> / {characterLimit.toLocaleString()} characters
                                        </div>
                                    <button
                                        type="submit"
                                        disabled={submitting || charCount > characterLimit || charCount < 500}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Essay'}
                                    </button>
                                </div>

                                {charCount < 500 && (
                                    <p className="text-red-600 text-sm mt-2">
                                        Minimum 500 characters required
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-600">
                                    {existingEssay.score >= 70
                                        ? 'Congratulations! Your submission has been graded.'
                                        : 'Please review the feedback and resubmit if needed.'}
                                </p>
                            </div>
                        )}
                    </form>

                    {existingEssay?.submitted_at && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-semibold">Previously Submitted</h3>
                            <p className="text-gray-600 text-sm">
                                Submitted on: {new Date(existingEssay.submitted_at).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
