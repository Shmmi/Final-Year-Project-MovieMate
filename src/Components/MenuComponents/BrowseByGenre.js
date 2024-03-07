
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Header from '../Header';
import Footer from '../Footer';

// Create a new context for managing selected movie information
const SelectedMovieContext = React.createContext();

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

function BrowseByGenre() {
  const [selectedGenre, setSelectedGenre] = useState('28'); // Default genre ID for 'Action'
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userIsSignedIn, setUserIsSignedIn] = useState(false); // Set the user sign-in status

  useEffect(() => {
    fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetchMoviesByGenre(selectedGenre);
  }, [selectedGenre]);

  const fetchMoviesByGenre = (genreId) => {
    fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const playTrailer = async (movie) => {
    setIsLoading(true);
    setSelectedMovie(movie);

    const response = await fetch(
      `${baseUrl}/movie/${movie.id}/videos?api_key=${apiKey}`
    );
    const data = await response.json();

    const trailer = data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    setTrailerVideo(trailer);
    setIsLoading(false);

    // Set the user sign-in status to true
    setUserIsSignedIn(true);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
    setTrailerVideo(null);
  };

  return (
    <div>
      <Header />
      <h2>Browse Movies by Genre</h2>
      <div>
        <label>
          <h3 style={{ color: 'white' }}>Select Genre:</h3>
        </label>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres &&
            genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
        </select>
      </div>
      <div
        className="movies-list"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card" style={{ margin: '10px', flex: '1 1 calc(20% - 20px)' }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ height: '300px', width: '100%' }}
            />
            <h3>{movie.title}</h3>
            <button onClick={() => playTrailer(movie)}>Play Trailer</button>
          </div>
        ))}
      </div>
      {trailerVideo && (
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
              width: '70%', // Increase the width to 90%
              height: '70%', // Increase the height to 90%
              padding: 0,
              overflow: 'hidden',
            },
          }}
        >
          <div className={`modal-content ${trailerVideo ? 'open' : ''}`}>
            {isLoading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '70%',
                  height: '70%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="loader"></div>
              </div>
            )}
            {userIsSignedIn ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerVideo.key}`}
                title={trailerVideo.name}
                allowFullScreen
                style={{
                  width: '900px',
                  height: '437px',
                }}
              />
            ) : (
              <p>Please sign in to play the trailer.</p>
            )}
          </div>
          <button
            onClick={closeTrailer}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#000')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'grey')}
            style={{
              position: 'fixed',
              top: 10,
              right: 10,
              fontSize: '24px',
              backgroundColor: 'grey',
              border: 'none',
              color: '#fff',
            }}
          >
            ×
          </button>
        </Modal>
      )}
      <Footer />
    </div>
  );
}

export default BrowseByGenre;
