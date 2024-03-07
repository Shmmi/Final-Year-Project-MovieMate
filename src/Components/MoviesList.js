
// Importing necessary modules and components
import React, { useState, useEffect , useRef, useContext} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'; 
import UserContext from './UserContext';
import moviesListStyles from '../CSS/movieslist.module.css';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

function MoviesList({ category, addToWatchlist , loggedInUser}) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UserContext);
  const containerRef = useRef(null);
  

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
  const interactionResponse = await fetch('/api/storeInteraction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id,
      movieId: movie.id,
      interactionType: 'click',
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
  const closeTrailer = () => {
    setSelectedMovie(null);
    setTrailerVideo(null);
  };
  const handleMovieClick = async (movie) => {
    const interactionResponse = await fetch('/api/storeInteraction', {
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
  
  useEffect(() => {
    const fetchData = async () => {
      let endpoint;
      switch (category) {
        case 'Hollywood':
          endpoint = '/movie/popular';
          break;
        case 'Bollywood':
          endpoint = '/discover/movie?with_original_language=hi';
          break;
        case 'Lollywood':
          endpoint = '/discover/movie?with_original_language=ur';
          break;
          case 'Recommended':
            if (user) {
              endpoint = '/movie/top_rated'; // Fetch top rated movies for recommendations
            }
            break;
        default:
          return;
      }
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        params: {
          api_key: apiKey,
        },
      });
      setMovies(response.data.results);
    };
    fetchData();
  }, [category, user]);
  const handleScrollClick = (direction) => {
    const container = containerRef.current; // Use the ref to access the container
    if (direction === 'left') {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    } else if (direction === 'right') {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <div>
      <div className={moviesListStyles['movies-list']}>
        <button className={moviesListStyles['scroll-button']} onClick={() => handleScrollClick('left')}>
          {'<'}
        </button>
        <div ref={containerRef} className={moviesListStyles['movies-container']}>
          {movies.map((movie) => (
            <div key={movie.id} className={moviesListStyles['movie-card']}>
              <Link to={`/movie/${movie.id}`} onClick={() => handleMovieClick(movie)} >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ height: '300px' }}
                />
                <h3 style={{ height: '40px', zIndex: 1 }}>{movie.title}</h3>
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => addToWatchlist(movie)}>
                  Watchlist <span>+</span>
                </button>
                <button  onClick={() => playTrailer(movie)}>
                  <span>▶</span> Play
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className={moviesListStyles['scroll-button']} onClick={() => handleScrollClick('right')}>
          {'>'}
        </button>
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
                overflow : 'hidden',
              },
            }}
          >
            <div
              className={`modal-content ${trailerVideo ? 'open' : ''}`}
              style={{ position: 'relative', width: '100%', height: '100%' }} // Add styles to make the div fill its parent container
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
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div >
            <div>
            <button
            onClick={closeTrailer}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#000')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'grey')}
          >
            <span 
            style={{
              position: 'fixed',
              top: 10,
              right: 10,
              fontSize: '24px',
              border: 'none',
              color: 'white',
              background : 'none',
              cursor : 'pointer',
              padding : '4px',
              marginLeft : '18px'
            }}
            >X</span>
          </button>
            </div>

          </Modal>
        </>
      )}
    </div>
  );
}
export default MoviesList;
