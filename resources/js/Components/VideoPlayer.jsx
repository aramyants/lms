import { useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ src, thumbnail }) => {
    const [hasStarted, setHasStarted] = useState(false);

    return (
        <div className="video-container">
            <style>{`
                .video-container {
                    position: relative;
                    padding-top: 56.25%;
                    background: #000;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease;
                }

                .video-container:hover {
                    transform: scale(1.002);
                }

                .player-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .thumbnail {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .thumbnail::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .thumbnail:hover::before {
                    opacity: 1;
                }

                .thumbnail::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }

                .thumbnail:hover::after {
                    background: rgba(0, 0, 0, 0.3);
                }

                .play-icon {
                    position: relative;
                    z-index: 2;
                    width: 72px;
                    height: 72px;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .play-icon::after {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }

                .thumbnail:hover .play-icon {
                    transform: scale(1.05);
                    background: white;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
                }

                .thumbnail:hover .play-icon::after {
                    border-color: rgba(255, 255, 255, 0.4);
                }

                .play-icon svg {
                    width: 28px;
                    height: 28px;
                    fill: #6366f1;
                    margin-left: 4px;
                    transition: fill 0.3s ease;
                }

                .thumbnail:hover .play-icon svg {
                    fill: #4f46e5;
                }

                /* Player Styles */
                .react-player video {
                    object-fit: cover;
                }

                .react-player__controls {
                    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%) !important;
                    padding: 24px 16px 12px !important;
                    opacity: 0;
                    transition: opacity 0.3s ease !important;
                }

                .react-player__controls:hover {
                    opacity: 1 !important;
                }

                .react-player__control-bar {
                    padding: 0 16px !important;
                }

                .react-player__progress {
                    background: rgba(255, 255, 255, 0.2) !important;
                    height: 4px !important;
                    transition: height 0.2s ease !important;
                }

                .react-player__progress:hover {
                    height: 6px !important;
                }

                .react-player__progress-filled {
                    background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%) !important;
                }

                .react-player__volume {
                    background: rgba(255, 255, 255, 0.2) !important;
                    border-radius: 4px !important;
                }

                .react-player__volume-filled {
                    background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%) !important;
                }

                .react-player__controls button {
                    opacity: 0.85;
                    transition: all 0.2s ease !important;
                }

                .react-player__controls button:hover {
                    opacity: 1;
                    transform: scale(1.05);
                }

                .react-player__controls button:active {
                    transform: scale(0.95);
                }
            `}</style>

            <div className="player-wrapper">
                {!hasStarted && thumbnail ? (
                    <div
                        className="thumbnail"
                        style={{ backgroundImage: `url(${thumbnail})` }}
                        onClick={() => setHasStarted(true)}
                    >
                        <div className="play-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                ) : (
                    <ReactPlayer
                        url={src}
                        width="100%"
                        height="100%"
                        playing={hasStarted}
                        controls={true}
                        playsinline
                        config={{
                            file: {
                                attributes: {
                                    style: { width: "100%", height: "100%" },
                                    controlsList: "nodownload",
                                },
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
