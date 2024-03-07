import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';
const topBoxOfficeStyles = {
    container: {
      padding: '20px',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    moviesListContainer: {
      display: 'flex',
      overflowX: 'auto',
      gap: '20px',
      padding: '10px',
    },
    movieCard: {
      width: '400px',
      border: '1px solid #ddd',
      padding: '10px',
      color:'white',
      backgroundColor: 'rgb(91, 124, 120)',
      textAlign: 'center',
    },
    movieImage: {
      maxWidth: '200px',
      height: 'auto',
    },
    movieTitle: {
      margin: '10px 0',
    },
    movieDetails: {
      marginBottom: '10px',
    },
    rating: {
      display: 'flex',
      justifyContent: 'center',
    },
    star: {
      color: 'gold',
      fontSize: '24px',
      cursor: 'pointer',
    },
    trailerButton: {
      backgroundColor: 'blue',
      color: 'white',
      padding: '5px 10px',
      margin: '5px',
      cursor: 'pointer',
      borderRadius: '5px',
    },
    shareButton: {
      backgroundColor: '#4267B2', // Facebook blue
      color: 'white',
      padding: '5px 10px',
      margin: '5px',
      cursor: 'pointer',
      borderRadius: '5px',
    },
    addToWatchlistButton: {
      backgroundColor: 'green',
      color: 'white',
      padding: '5px 10px',
      margin: '5px',
      cursor: 'pointer',
      borderRadius: '5px',
    },
    scrollButton: {
      backgroundColor: 'gray',
      color: 'white',
      padding: '5px 10px',
      margin: '5px',
      cursor: 'pointer',
      borderRadius: '5px',
    },
  };
  
function TopBoxOffice() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [trailerVideo, setTrailerVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [scrollIndex, setScrollIndex] = useState(0);
    useEffect(() => {
      fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          setMovies(data.results);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
      const addToWatchlist = (movie) => {
      // Implement logic to add the movie to the user's watchlist
      // You can use local storage or a backend API to manage the watchlist
      // Example using local storage:
      const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      alert('Movie added to watchlist.');
    };
     const handleRatingClick = (movie, star) => {
      // Implement logic to allow users to rate the movie
      // Update the rating for the selected movie
      // You can send this rating to your backend API if needed
      // Example:
      const updatedMovie = { ...movie, userRating: star };
      setMovies((prevMovies) =>
        prevMovies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
      );
    };
    
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
    const handleScrollClick = (direction) => {
      const container = document.querySelector('.moviesListContainer');
      if (container) {
        if (direction === 'left') {
          container.scrollLeft -= 300; // Scroll left by 300 pixels
        } else if (direction === 'right') {
          container.scrollLeft += 300; // Scroll right by 300 pixels
        }
      }
    };
  
    return (
      
      <div style={topBoxOfficeStyles.container}>
      <Header/>
        <h2 style={topBoxOfficeStyles.heading}>Top Box Office</h2>
      
        <div style={topBoxOfficeStyles.moviesListContainer}>
        {/*<button className="scroll-button" onClick={() => handleScrollClick('left')}>
            {'<'}
          </button>*/}
          {movies.map((movie) => (
            <div key={movie.id} style={topBoxOfficeStyles.movieCard}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={topBoxOfficeStyles.movieImage}
              />
              <h3 style={topBoxOfficeStyles.movieTitle}>{movie.title}</h3>
              <div style={topBoxOfficeStyles.movieDetails}>
                <p>Weekend Gross: ${movie.weekend_gross}M</p>
                <p>Total Gross: ${movie.total_gross}M</p>
                <p>Weeks Released: {movie.weeks_released}</p>
                <div style={topBoxOfficeStyles.rating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      onClick={() => handleRatingClick(movie, star)}
                      //style={topBoxOfficeStyles.star}
                      style={{ color: star <= movie.userRating ? 'gold' : 'white', cursor: 'pointer' }}
                    >
                      ★
                    </div>
                  ))}
                </div>
              </div>
              <button
                style={topBoxOfficeStyles.trailerButton}
                onClick={() => playTrailer(movie)}
              >
                Play Trailer
              </button>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={topBoxOfficeStyles.shareButton}>Share on Facebook</button>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={topBoxOfficeStyles.shareButton}>Share on Twitter</button>
              </a>
              <button
                style={topBoxOfficeStyles.addToWatchlistButton}
                onClick={() => addToWatchlist(movie)}
              >
                Add to Watchlist
              </button>
            
            </div>
          ))}
          <button className="scroll-button" onClick={() => handleScrollClick('right')}>
            {'>'}
          </button>
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
            <div className={`modal-content ${trailerVideo ? 'open' : ''}`}>
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
      <Footer/>  
      </div>
      
    );
  }
  
  export default TopBoxOffice;
  