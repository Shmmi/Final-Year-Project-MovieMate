import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import moviesListStyles from '../CSS/movieslist.module.css';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

function SearchResults({ searchResults, addToWatchlist , isGrid, loggedInUser}) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);

  const navigate = useNavigate();
  const handleAddToWatchlist = (movie) => {
    if (loggedInUser) {
      addToWatchlist(movie);
    } else {
      navigate('/login');
    }
  };
  const handleMovieClick = async (movie) => {
    const interactionResponse = await fetch('http://localhost:3001/api/storeInteraction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id, 
        movieId: movie.id,
        interactionType: 'view_details',
        timestamp: Date.now(),
      }),
      credentials : 'include' 
    });
    
    const interactionData = await interactionResponse.json();
    if (interactionData && interactionData.message) {
    console.log(interactionData.message);
    } else {
    console.log('No message in the response', interactionData);
    }
  };
  
  const playTrailer = async (movie) => {
    setSelectedMovie(movie);
  
    // Fetching the videos for the selected movie from the TMDb API
    const response = await axios.get(
      `${baseUrl}/movie/${movie.id}/videos`,
      {
        params: {
          api_key: apiKey,
        },
      }
    );
  
    // Finding the first video with type "Trailer"
    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
  
    // Setting the trailer video state
    setTrailerVideo(trailer);
      // Store 'play_trailer' interaction in database
      const interactionResponse = await fetch('/api/storeInteraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: loggedInUser.id,
          movieId: movie.id,
          interactionType: 'play_trailer',
          timestamp: Date.now(),
        }),
      });
  
      const interactionData = await interactionResponse.json();
      console.log(interactionData.message);
  };
  
  const closeTrailer = () => {
    setSelectedMovie(null);
    setTrailerVideo(null);
  };

  const handleScrollClick = (direction) => {
    const container = document.querySelector('.movies-container');
    if (direction === 'left') {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    } else if (direction === 'right') {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  return (
    <div>
      <div className={isGrid ? moviesListStyles['movies-grid'] : moviesListStyles['movies-list']}>
        {searchResults.map((result) => (
          <div key={result.id} className={isGrid ? moviesListStyles['movie-grid-item'] : moviesListStyles['movie-card']} >
            <Link to={`/movie/${result.id}`}  onClick={() => handleMovieClick(movie)} className={moviesListStyles['movie-card']}>
              <img
                src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                alt={result.title}
                style={{ height: '300px' }}
              />
              <h3 style={{ height: '40px', zIndex: 1 }}>{result.title}</h3>
            </Link>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => handleAddToWatchlist(result)}>
                  Watchlist <span>+</span>
                </button>
                <button onClick={() => playTrailer(result)}>
                  <span>▶</span> Play
                </button>
              </div>
            </div>
          ))}
      </div>
      {trailerVideo && (
        <>
          <Modal
            isOpen={true}
            onRequestClose={closeTrailer}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                padding: 0,
                overflow : 'hidden'
              },
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerVideo.key}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Modal>
        </>
      )}
    </div>
  );
}

export default SearchResults;