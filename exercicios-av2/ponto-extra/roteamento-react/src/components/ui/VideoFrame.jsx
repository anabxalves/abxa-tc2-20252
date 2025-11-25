import React from 'react';

const VideoFrame = ({ videoId }) => {
    return (
        <div className="mac-window">
            <div className="window-bar">
                <div className="window-title">Video Player</div>
            </div>
            <div className="video-container">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default VideoFrame;