import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Header from '../Header';
import Footer from '../Footer';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

function TopRatedMovies({ addToWatchlist }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${baseUrl}/movie/top_rated`, {
        params: {
          api_key: apiKey,
        },
      });
      const moviesWithRating = response.data.results.map((movie) => ({
        ...movie,
        rating: 0,
      }));
      setMovies(moviesWithRating);
    };
    fetchData();
  }, []);

  const playTrailer = async (movie) => {
    setIsLoading(true);
    setSelectedMovie(movie);

    const response = await axios.get(
      `${baseUrl}/movie/${movie.id}/videos`,
      {
        params: {
          api_key: apiKey,
        },
      }
    );

    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    setTrailerVideo(trailer);
    setIsLoading(false);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
    setTrailerVideo(null);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortMovies = () => {
    if (sortBy === 'rating') {
      return [...movies].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'moviemateRating') {
      return [...movies];
    } else if (sortBy === 'reviews') {
      return [...movies];
    }
  };

  return (
    <div>
      <Header />
      <h2>Top Rated Movies</h2>
      <div className="sort-dropdown">
        <label htmlFor="sort" style={{ color: 'white', fontSize: 'large' }}>
          Sort By:
        </label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="rating">Rating</option>
          <option value="moviemateRating">Moviemate Rating</option>
          <option value="reviews">Reviews</option>
        </select>
      </div>
      <div className="scrolling-line">
        <div className="movies-list" style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
          {sortMovies().map((movie) => (
            <div key={movie.id} className="movie-card" style={{ display: 'inline-block', margin: '10px' }}>
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  style={{ height: '300px', width: '200px' }}
                />
                <h3 style={{ height: '40px', zIndex: 1 }}>{movie.title}</h3>
              </Link>
              <div className="movie-info">
                <p>Release Date: {movie.release_date}</p>
                <p>Duration: {movie.runtime} min</p>
                <p>Total Views: {movie.popularity}</p>
              </div>
              <div className="button-container">
                <button onClick={() => addToWatchlist(movie)}>
                  Watchlist <span>+</span>
                </button>
                <button onClick={() => playTrailer(movie)}>
                  <span>▶</span> Play
                </button>
              </div>
            </div>
          ))}
        </div>
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
              width: '80%',
              height: '80%',
              padding: 0,
              overflow: 'hidden',
            },
          }}
        >
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div className="loader"></div>
            </div>
          )}
          <iframe
            src={`https://www.youtube.com/embed/${trailerVideo.key}`}
            title={trailerVideo.name}
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
            }}
          />
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

export default TopRatedMovies
