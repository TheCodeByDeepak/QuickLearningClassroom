import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaYoutube, FaTrash } from 'react-icons/fa'; // Import YouTube and Trash icons
import './CSS/VideoDetails.css'

const VideoDetails = ({ classroomId }) => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/videos/getVideosByClassroomId?classroomId=${classroomId}`
        );
        setVideoData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchVideoData();
    }
  }, [classroomId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVideos = videoData.filter(
    (video) =>
      video.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    // eslint-disable-next-line
    const youtubeRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([a-zA-Z0-9_-]{11}))|(?:youtu\.be\/([a-zA-Z0-9_-]{11}))|(?:https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11}))/;
    const match = url.match(youtubeRegex);
    return match ? match[1] || match[2] || match[3] : null;
  };

  const handlePlayVideo = (videoLink) => {
    const videoId = extractVideoId(videoLink);
    if (videoId) {
      setPlayingVideo(videoId);
    } else {
      console.error("Invalid YouTube URL");
    }
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  // Handle deletion of video
  const handleDeleteVideo = async (date, subject, videoLink) => {
    // Optimistically update UI: remove the video immediately
    setVideoData((prevVideos) =>
      prevVideos.filter(
        (video) =>
          !(video.date === date && video.subject === subject && video.videoLink === videoLink)
      )
    );

    try {
      const response = await axios.delete(
        'http://localhost:5000/api/videos/deleteVideo',
        {
          data: {
            classroomId,
            date,
            subject,
            videoLink,
          },
        }
      );
      console.log(response.data.message);

      // Set success message
      setSuccessMessage('Video deleted successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting video:', error);

      // Revert the UI update if deletion fails
      setVideoData((prevVideos) => [
        ...prevVideos,
        { date, subject, videoLink },
      ]);
    }
  };

  if (loading) return <p>Loading video data...</p>;
  if (error) return <p>No video data found for this classroom</p>;

  return (
    <div>
      <h3>Video Details</h3>

      {/* Success message */}
      {successMessage && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {successMessage}
        </p>
      )}

      {/* Search Bar with Clear Button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by Subject or Description"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button
          onClick={() => setSearchTerm('')}
         className="clear-button"
        >
          Clear
        </button>
      </div>

      {/* Table displaying video details */}
      <table
       className="video-table"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Video</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredVideos.length === 0 ? (
            <tr>
              <td colSpan="5">No video details found for this classroom.</td>
            </tr>
          ) : (
            filteredVideos.map((video, index) => (
              <tr key={index}>
                <td>{video.date}</td>
                <td>{video.subject}</td>
                <td>{video.description}</td>
                <td>
                  <button
                    onClick={() => handlePlayVideo(video.videoLink)}
                    disabled={playingVideo}
                    className="youtube-button"
                  >
                    <FaYoutube size={24} className="youtube-icon" />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleDeleteVideo(video.date, video.subject, video.videoLink)
                    }
                    style={{
                      color: 'red',
                      fontSize: '24px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Show video player if a video is selected */}
      {playingVideo && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '600px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleCloseVideo}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            X
          </button>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
