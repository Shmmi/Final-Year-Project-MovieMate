import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header';
import Footer from '../Footer';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

const IndiaMovieSpotlight = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch Indian movies (Bollywood and South Indian) from TMDB
    const fetchIndianMovies = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/discover/movie?api_key=${apiKey}&region=IN&language=en-IN&sort_by=popularity.desc`
        );

        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching Indian movies:', error);
      }
    };

    fetchIndianMovies();
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

  return (
    <div>
      <Header />
      <h1 style={{ color: 'white' }}>All Movie Spotlight</h1>
      <div className="movie-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card" style={{ margin: '10px', width: '300px', color: 'white' }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <h3>{movie.title}</h3>
            <p>Release Date: {movie.release_date}</p>
            <p>Total Views: {movie.popularity}</p>
            <p>Overview: {movie.overview}</p>
            <button onClick={() => playTrailer(movie)}>
              Play Trailer
            </button>
          </div>
        ))}
      </div>
      {selectedMovie && (
        <div className="movie-details" style={{ color: 'white' }}>
          <h2>{selectedMovie.title}</h2>
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <p>Release Date: {selectedMovie.release_date}</p>
          <p>Total Views: {selectedMovie.popularity}</p>
          <p>Overview: {selectedMovie.overview}</p>
          {trailerVideo && (
            <div>
              <iframe
                src={`https://www.youtube.com/embed/${trailerVideo.key}`}
                title={selectedMovie.title}
                allowFullScreen
                style={{ width: '100%', height: '400px' }}
              />
            </div>
          )}
          <button onClick={() => setSelectedMovie(null)}>Close</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default IndiaMovieSpotlight;
