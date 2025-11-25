import React, { useState, useEffect } from 'react';
import VideoFrame from '../components/ui/VideoFrame';

const ContentPage = ({ data, onNavigateToFinal }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        setCurrentVideoIndex(0);
    }, [data.id]);

    const toggleVideo = () => {
        setCurrentVideoIndex((prev) => (prev === 0 ? 1 : 0));
    };

    return (
        <div className="content-grid">
            <div className="text-card">
                <h1 className="page-title">{data.title}</h1>
                <div className="title-decoration"></div>
                <p className="page-description">{data.content}</p>
                <img src={data.image} alt={data.title} className="page-image" />
            </div>

            <div className="video-column">
                <VideoFrame videoId={data.videos[currentVideoIndex]} />

                <div className="action-buttons">
                    <button onClick={toggleVideo} className="btn btn-secondary">
                        Alternar Vídeo
                    </button>

                    <button onClick={onNavigateToFinal} className="btn btn-primary">
                        Ir para Conclusão →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentPage;