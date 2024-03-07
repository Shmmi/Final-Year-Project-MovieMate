import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Header from '../Header';
import Footer from '../Footer';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

const movieCardStyles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    maxWidth: '300px',
    margin: '10px',
  },
  poster: {
    maxWidth: '100%',
    height: 'auto',
  },
  trailerButton: {
    cursor: 'pointer',
    display: 'block',
    textAlign: 'center',
    padding: '5px',
    backgroundColor: 'blue',
    color: 'white',
  },
};

function MostPopularMovies() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCast, setShowCast] = useState(false); // Added a state for showing/hiding cast

  const fetchMovieDetails = async (movieId) => {
    try {
      const [detailsResponse, creditsResponse, videosResponse] = await Promise.all([
        axios.get(`${baseUrl}/movie/${movieId}`, {
          params: {
            api_key: apiKey,
          },
        }),
        axios.get(`${baseUrl}/movie/${movieId}/credits`, {
          params: {
            api_key: apiKey,
          },
        }),
        axios.get(`${baseUrl}/movie/${movieId}/videos`, {
          params: {
            api_key: apiKey,
          },
        }),
      ]);

      const movieDetails = detailsResponse.data;
      const cast = creditsResponse.data.cast;
      const videos = videosResponse.data.results;

      const trailer = videos.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );

      setSelectedMovie({
        ...movieDetails,
        cast,
        trailer,
      });

      // Show cast when the movie details are fetched
      setShowCast(true);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const playTrailer = async (movieId) => {
    setIsLoading(true);
    await fetchMovieDetails(movieId);
    setIsLoading(false);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
    setShowCast(false); // Hide cast when the trailer is closed
  };

  useEffect(() => {
    const fetchMostPopularMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/movie/popular`, {
          params: {
            api_key: apiKey,
          },
        });
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching most popular movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMostPopularMovies();
  }, []);

  return (
    <div>
      <Header />
      <h2>Most Popular Movies</h2>
      <div className="movies-list" style={movieCardStyles.container}>
        {movies.map((movie) => (
          <div key={movie.id} style={movieCardStyles.card}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={movieCardStyles.poster}
            />
            <h3>{movie.title}</h3>
            <button
              onClick={() => {
                playTrailer(movie.id);
                setShowCast(false); // Hide cast when playing the trailer
              }}
              style={movieCardStyles.trailerButton}
            >
              <span>▶</span> Play Trailer
            </button>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <Modal
          isOpen={true}
          onRequestClose={closeTrailer}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              border: 'none',
              background: 'transparent',
              padding: '0',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <iframe
            width="1460px"
            height="350px"
            src={`https://www.youtube.com/embed/${selectedMovie.trailer.key}`}
            title={selectedMovie.trailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1px',
              background: 'white',
              marginBottom: '10px',
            }}
          >
            <h1>{selectedMovie.title}</h1>
            <p>Release Date: {selectedMovie.release_date}</p>
            <p>Total Views: {selectedMovie.popularity}</p>
            <p>Rating: {selectedMovie.vote_average}</p>

            {showCast && ( // Conditionally render the cast if showCast is true
              <>
                <h2>Cast</h2>
                <div
                  className="cast-list"
                  style={{ paddingTop: '0px', display: 'flex', overflowX: 'auto' }}
                >
                  {selectedMovie.cast.map((actor) => (
                    <div key={actor.id} className="cast-card">
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                      />
                      <p>{actor.name}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
      <Footer />
    </div>
  );
}

export default MostPopularMovies;
