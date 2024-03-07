import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

const apiKey = '499d99db6ce23991d21afde0deede0f1'; // Replace with your TMDB API key
const baseUrl = 'https://api.themoviedb.org/3';

const MostPopularTvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [trailerKey, setTrailerKey] = useState('');
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/tv/popular?api_key=${apiKey}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTvShows(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTvShows();
  }, []);

  const addToWatchlist = (show) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, show]);
  };

  const fetchTrailerKey = (showId) => {
    // Fetch the trailer key from TMDB for the selected show
    fetch(`${baseUrl}/tv/${showId}/videos?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const trailer = data.results.find(
            (video) =>
              video.type === 'Trailer' && video.site === 'YouTube'
          );
          if (trailer) {
            setTrailerKey(trailer.key);
          } else {
            console.error('No trailer available for this show.');
          }
        } else {
          console.error('No video data available for this show.');
        }
      })
      .catch((error) => {
        console.error('Error fetching trailer data:', error);
      });
  };

  const toggleRating = () => {
    setShowRating(!showRating);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating / 2) {
        stars.push(
          <span key={i} className="star-filled">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-empty">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <>
    <Header />
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', color: 'white' }}>
        Most Popular TV Shows
      </h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {tvShows.map((show) => (
          <div
            key={show.id}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
              width: '250px',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => fetchTrailerKey(show.id)} // Add click event to fetch trailer key
          >
            <div style={{ position: 'relative' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                alt={show.name}
                style={{ maxWidth: '100%' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                }}
              >
                <span className="play-button">▶</span>
              </div>
            </div>
            <h2>{show.name}</h2>
            {showRating && (
              <div>
                <p>Rating: {show.vote_average}</p>
                <p>Stars: {renderStars(show.vote_average)}</p>
              </div>
            )}
            <p>Release Date: {show.first_air_date}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  margin: '5px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => addToWatchlist(show)}
              >
                Add to Watchlist
              </button>
              <button
                onClick={toggleRating}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  margin: '5px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {showRating ? 'Hide Rating' : 'Show Rating'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {trailerKey && (
        <div style={{ position: 'fixed', top: '10%', left: '10%', width: '80%', height: '80%', background: 'rgba(0, 0, 0, 0.8)' }}>
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              padding: '10px',
              cursor: 'pointer',
              color: 'white',
            }}
            onClick={() => setTrailerKey('')}
          >
            Close
          </div>
        </div>
      )}
      <div style={{ marginTop: '30px' }}>
        <h2>Watchlist</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {watchlist.map((show) => (
            <div
              key={show.id}
              style={{ textAlign: 'center', position: 'relative' }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                alt={show.name}
                style={{ maxWidth: '100%' }}
              />
              <h3>{show.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default MostPopularTvShows;


