import VideoPlayer from "@/Components/VideoPlayer";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import "@videojs/themes/dist/forest/index.css";
import { useEffect, useRef, useState } from "react";
import "video.js/dist/video-js.css";

const styles = `
    .course-container {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        padding: 2rem;
        max-width: 1800px;
        margin: 0 auto;
        min-height: calc(100vh - 150px);
        background: #f3f4f6;
    }

    .main-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .video-section {
        background: #000;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    }

    .content-info {
        background: white;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
    }

    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f3f4f6;
    }

    .content-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #111827;
        line-height: 1.3;
    }

    .back-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #6366f1;
        font-size: 0.875rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.2s ease;
        border: 1px solid #e5e7eb;
    }

    .back-button:hover {
        color: #4f46e5;
        background: #f9fafb;
        border-color: #6366f1;
    }

    .content-description {
        color: #4b5563;
        line-height: 1.7;
        font-size: 1.05rem;
    }

    .course-meta {
        display: flex;
        gap: 2rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 2px solid #f3f4f6;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #6b7280;
        font-size: 0.95rem;
    }

    .meta-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: #6366f1;
    }

    .sidebar {
        background: white;
        border-radius: 16px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        height: fit-content;
        position: sticky;
        top: 2rem;
        overflow: hidden;
    }

    .admin-controls {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
    }

    .admin-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
        width: 100%;
        justify-content: center;
        height: 36px;
    }

    .admin-button svg {
        width: 1rem;
        height: 1rem;
    }

    .admin-button-primary {
        background: #6366f1;
        color: white;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .admin-button-primary:hover {
        background: #4f46e5;
        transform: translateY(-1px);
    }

    .admin-button-secondary {
        background: white;
        color: #4b5563;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .admin-button-secondary:hover {
        background: #f9fafb;
        border-color: #6366f1;
        color: #6366f1;
        transform: translateY(-1px);
    }

    .lesson-list {
        padding: 1.5rem;
    }

    .lesson-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f3f4f6;
    }

    .lesson-list-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
    }

    .lesson-count {
        background: #eef2ff;
        color: #6366f1;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .lesson-items {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-height: calc(100vh - 300px);
        overflow-y: auto;
        padding-right: 0.75rem;
    }

    .lesson-items::-webkit-scrollbar {
        width: 4px;
    }

    .lesson-items::-webkit-scrollbar-track {
        background: transparent;
    }

    .lesson-items::-webkit-scrollbar-thumb {
        background-color: #e5e7eb;
        border-radius: 9999px;
    }

    .lesson-items:hover::-webkit-scrollbar-thumb {
        background-color: #6366f1;
    }

    .lesson-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        transition: all 0.2s ease;
        cursor: pointer;
        background: white;
    }

    .lesson-item:hover {
        transform: translateX(4px);
        border-color: #6366f1;
        background: #f9fafb;
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
    }

    .lesson-item.active {
        border-color: #6366f1;
        background: #eef2ff;
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
    }

    .lesson-icon {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: #f3f4f6;
        flex-shrink: 0;
        transition: all 0.2s ease;
    }

    .lesson-item.active .lesson-icon {
        background: #e0e7ff;
        color: #6366f1;
    }

    .lesson-content {
        flex: 1;
        min-width: 0;
    }

    .lesson-title {
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
        font-size: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .lesson-description {
        font-size: 0.875rem;
        color: #6b7280;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
    }

    @media (max-width: 1280px) {
        .course-container {
            grid-template-columns: 1fr 350px;
        }
    }

    @media (max-width: 1024px) {
        .course-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .sidebar {
            position: static;
        }
    }

    .lesson-icon.completed {
        background: #dcfce7;
        color: #22c55e;
    }

    .completed-check {
        stroke: #22c55e;
    }
`;

export default function Show({ auth, course, lessons = [] }) {
    const [currentLesson, setCurrentLesson] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Ensure lessons is always an array
    const lessonsList = Array.isArray(lessons) ? lessons : [];

    const getVideoUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        // Remove any leading slashes and add storage path
        const cleanPath = path.replace(/^\/+/, "");
        return `/storage/${cleanPath}`;
    };

    const handleLessonClick = (lesson) => {
        setIsLoading(true);
        setCurrentLesson(lesson);
        // Add a small delay to show loading state
        setTimeout(() => setIsLoading(false), 500);
    };

    const currentVideo = currentLesson
        ? getVideoUrl(currentLesson.video_path)
        : getVideoUrl(course?.video_path);
    const currentPoster = currentLesson?.thumbnail_path
        ? getVideoUrl(currentLesson.thumbnail_path)
        : null;
    console.log(lessonsList);
    const [completedLessonIds, setCompletedLessonIds] = useState(
        lessonsList.filter(lesson => lesson.is_completed).map(lesson => lesson.id)
    );

    const handleVideoEnd = () => {
        if (currentLesson && !completedLessonIds.includes(currentLesson.id)) {
            axios.post(`/lessons/${currentLesson.id}/complete`)
                .then(() => {
                    setCompletedLessonIds([...completedLessonIds, currentLesson.id]);
                })
                .catch(console.error);
        }
    };


    // Add error state for missing course data
    if (!course) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-red-600">
                                Error: Course not found
                            </p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <style>{styles}</style>
            <Head title={currentLesson?.title || course.title} />

            <div className="course-container">
                <div className="main-content">
                    <div className="video-section">
                        {isLoading ? (
                            <div className="loading-spinner">Loading...</div>
                        ) : (
                            <VideoPlayer
                                src={currentVideo}
                                poster={currentPoster}
                                onEnded={handleVideoEnd}
                            />
                        )}
                    </div>
                    <div className="content-info">
                        <div className="content-header">
                            <h1 className="content-title">
                                {currentLesson
                                    ? currentLesson.title
                                    : course.title}
                            </h1>
                            {currentLesson && (
                                <button
                                    onClick={() => setCurrentLesson(null)}
                                    className="back-button"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                    Back to Course Overview
                                </button>
                            )}
                        </div>
                        <p className="content-description">
                            {currentLesson
                                ? currentLesson.description
                                : course.description ||
                                  "No description provided."}
                        </p>
                        {!currentLesson && (
                            <div className="course-meta">
                                <div className="meta-item">
                                    <svg
                                        className="meta-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>
                                        Instructor: {course.instructor_name}
                                    </span>
                                </div>
                                <div className="meta-item">
                                    <svg
                                        className="meta-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                        />
                                    </svg>
                                    <span>Course Code: {course.code}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="sidebar">
                    {auth.user.id === course.instructor_id && (
                        <div className="admin-controls">
                            <Link
                                href={`/courses/${course.id}/lessons/create`}
                                className="admin-button admin-button-primary"
                            >
                                <svg
                                    className="w-4 h-4"
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
                                Add Lesson
                            </Link>
                            <Link
                                href={`/courses/${course.id}/students`}
                                className="admin-button admin-button-secondary"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                View Students
                            </Link>
                        </div>
                    )}
                    <div className="lesson-list">
                        <div className="lesson-list-header">
                            <h2 className="lesson-list-title">
                                Course Lessons
                            </h2>
                            <span className="lesson-count">
                                {lessonsList.length} lessons
                            </span>
                        </div>
                        {lessonsList.length > 0 ? (
                            <div className="lesson-items">
                                {lessonsList.map((lesson) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() =>
                                            handleLessonClick(lesson)
                                        }
                                        className={`lesson-item ${
                                            currentLesson?.id === lesson.id
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <div className="lesson-icon">
                                            {completedLessonIds.includes(lesson.id) ? (
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="lesson-content">
                                            <h3 className="lesson-title">
                                                {lesson.title}
                                            </h3>
                                            <p className="lesson-description">
                                                {lesson.description ||
                                                    "No description available"}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="no-lessons">
                                <p>No lessons available yet.</p>
                                {auth.user.id === course.instructor_id && (
                                    <Link
                                        href={route("lessons.create", {
                                            course: course.id,
                                        })}
                                        className="create-lesson-btn"
                                    >
                                        <svg
                                            className="w-4 h-4"
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
                                        Create New Lesson
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
