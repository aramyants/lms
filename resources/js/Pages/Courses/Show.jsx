// resources/js/Pages/Courses/Show.jsx
import VideoPlayer from "@/Components/VideoPlayer";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import "@videojs/themes/dist/forest/index.css";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Remove HLS plugins since we're not using them
// import "videojs-contrib-quality-levels";
// import "videojs-hls-quality-selector";

// Custom Video.js component
const VideoPlayerComponent = ({ options, onReady }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;

            // Create and initialize the player
            const player = videojs(
                videoElement,
                {
                    ...options,
                    controls: true,
                    fluid: true,
                    preload: "auto",
                    html5: {
                        nativeAudioTracks: false,
                        nativeVideoTracks: false,
                    },
                    controlBar: {
                        children: [
                            "playToggle",
                            "volumePanel",
                            "currentTimeDisplay",
                            "timeDivider",
                            "durationDisplay",
                            "progressControl",
                            "remainingTimeDisplay",
                            "playbackRateMenuButton",
                            "fullscreenToggle",
                        ],
                    },
                    playbackRates: [0.5, 1, 1.5, 2],
                },
                () => {
                    playerRef.current = player;
                    setIsLoading(false);
                    onReady && onReady(player);
                }
            );

            // Add error handling with more detailed messages
            player.on("error", () => {
                const error = player.error();
                let errorMessage =
                    "Error loading video. Please try again later.";

                if (error) {
                    switch (error.code) {
                        case 1:
                            errorMessage =
                                "The video file was not found. Please check the URL.";
                            break;
                        case 2:
                            errorMessage = "The video playback was aborted.";
                            break;
                        case 3:
                            errorMessage =
                                "The video is not in a supported format.";
                            break;
                        case 4:
                            errorMessage = "The video file is not accessible.";
                            break;
                        case 5:
                            errorMessage =
                                "There was an error decoding the video.";
                            break;
                    }
                }

                setError(errorMessage);
                setIsLoading(false);
                console.error("Video.js Error:", error);
            });

            // Add loading handling
            player.on("loadstart", () => {
                setIsLoading(true);
                setError(null);
            });

            player.on("loadeddata", () => {
                setIsLoading(false);
            });

            // Add keyboard shortcuts
            player.on("keydown", (e) => {
                switch (e.key) {
                    case " ":
                    case "k":
                        if (player.paused()) player.play();
                        else player.pause();
                        e.preventDefault();
                        break;
                    case "ArrowRight":
                        player.currentTime(player.currentTime() + 10);
                        e.preventDefault();
                        break;
                    case "ArrowLeft":
                        player.currentTime(player.currentTime() - 10);
                        e.preventDefault();
                        break;
                    case "f":
                        if (player.isFullscreen()) player.exitFullscreen();
                        else player.requestFullscreen();
                        e.preventDefault();
                        break;
                    case "m":
                        player.muted(!player.muted());
                        e.preventDefault();
                        break;
                }
            });
        }

        // Cleanup function
        return () => {
            const player = playerRef.current;
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [options, videoRef]);

    return (
        <div className="relative">
            <div data-vjs-player>
                <video
                    ref={videoRef}
                    className="video-js vjs-theme-forest vjs-big-play-centered"
                >
                    {options.sources &&
                        options.sources.map((source, index) => (
                            <source key={index} {...source} />
                        ))}
                    <p className="vjs-no-js">
                        To view this video please enable JavaScript, and
                        consider upgrading to a web browser that supports HTML5
                        video
                    </p>
                </video>
            </div>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-center p-4">
                        <svg
                            className="mx-auto h-12 w-12 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="mt-2">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

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
                                onTimeUpdate={(time) => {
                                    console.log("Video time:", time);
                                }}
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
                    {(auth.user.id === course.instructor_id ||
                        auth.user.role === "admin") && (
                        <div className="admin-controls">
                            <Link
                                href={route("lessons.create", {
                                    course: course.id,
                                })}
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
                                href={route("courses.students", course.id)}
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
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
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
