import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

const BrowseTvShowbyGenre = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [trailerKey, setTrailerKey] = useState('');
  const apiKey = '499d99db6ce23991d21afde0deede0f1'; // Replace with your TMDB API key

  useEffect(() => {
    // Fetch the list of genres from TMDB API
    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
      });
  }, [apiKey]);

  useEffect(() => {
    if (selectedGenre) {
      fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${selectedGenre}`
      )
        .then((response) => response.json())
        .then((data) => {
          setTvShows(data.results);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [selectedGenre, apiKey]);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setSelectedShow(null); // Clear the selected show when changing genres
  };

  const playTrailer = (showId) => {
    // Fetch trailer information for the selected show
    fetch(
      `https://api.themoviedb.org/3/tv/${showId}/videos?api_key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Find the first trailer in the list of videos (if available)
        const trailer = data.results.find((video) => video.type === 'Trailer');

        // Set the selected show and trailer key
        setSelectedShow(showId);
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          console.warn('No trailer found for this show.');
        }
      })
      .catch((error) => {
        console.error('Error fetching trailer data:', error);
      });
  };

  // Function to close the trailer
  const closeTrailer = () => {
    setSelectedShow(null);
    setTrailerKey('');
  };

  // Function to share the current TV show or trailer on social media
  const shareOnSocialMedia = (media) => {
    let shareText = '';
    let shareURL = '';

    if (selectedShow) {
      shareText = `Check out this amazing TV show on #MyTVApp: `;
      shareURL = `https://www.youtube.com/watch?v=${trailerKey}`;
    } else if (selectedGenre) {
      shareText = `Check out TV shows in the "${selectedGenre}" genre on #MyTVApp: `;
      shareURL = window.location.href;
    }

    switch (media) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + shareURL)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + shareURL)}`, '_blank');
        break;
      default:
        break;
    }
  };

  const styles = {
    browseContainer: {
      textAlign: 'center',
    },
    genreSelect: {
      marginBottom: '20px',
      color: 'white'
    },
    genreList: {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'auto',
    },
    genreItem: {
      margin: '5px',
      padding: '5px 10px',
      borderRadius: '5px',
      backgroundColor: '#0073e6', // Facebook blue color
      color: 'white',
      cursor: 'pointer',
    },
    tvShowsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    tvShow: {
      margin: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    tvShowImg: {
      width: '185px',
      height: '278px',
      cursor: 'pointer',
    },
    playIcon: {
      fontSize: '24px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    trailerBox: {
      marginLeft: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    closeBtn: {
      fontSize: '24px',
      cursor: 'pointer',
    },
    trailerIframe: {
      width: '300px',
      height: '200px',
    },
    socialButtons: {
      marginTop: '10px',
    },
    shareButton: {
      margin: '5px',
      padding: '5px 10px',
      borderRadius: '5px',
      backgroundColor: '#0073e6', // Facebook blue color
      color: 'white',
      cursor: 'pointer',
    },
  };

  return (
    <>
    <Header/>
    <div style={styles.browseContainer}>
      <h2>Browse TV Shows by Genre</h2>
      <div style={styles.genreSelect}>
        <label htmlFor="genreSelect">Select a Genre:</label>
        <select
          id="genreSelect"
          onChange={(e) => handleGenreChange(e.target.value)}
        >
          <option value="">Select Genre</option>
          {genres.length > 0 &&
            genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
        </select>
      </div>
      <div style={styles.genreList}>
        {genres.length > 0 &&
          genres.map((genre) => (
            <div
              key={genre.id}
              style={styles.genreItem}
              onClick={() => handleGenreChange(genre.id)}
            >
              {genre.name}
            </div>
          ))}
      </div>
      <div style={styles.tvShowsContainer}>
        {tvShows.map((show) => (
          <div key={show.id} style={styles.tvShow}>
            <img
              src={`https://image.tmdb.org/t/p/w185${show.poster_path}`}
              alt={show.name}
              style={styles.tvShowImg}
              onClick={() => playTrailer(show.id)}
            />
            <span
              onClick={() => playTrailer(show.id)}
              style={styles.playIcon}
            >
              ▶️
            </span>
            {selectedShow === show.id && (
              <div style={styles.trailerBox}>
                <span
                  onClick={closeTrailer}
                  style={styles.closeBtn}
                >
                  &#x2716;
                </span>
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Trailer"
                  frameBorder="0"
                  allowFullScreen
                  style={styles.trailerIframe}
                ></iframe>
                <div style={styles.socialButtons}>
                  <button style={styles.shareButton} onClick={() => shareOnSocialMedia('facebook')}>
                    Share on Facebook
                  </button>
                  <button style={styles.shareButton} onClick={() => shareOnSocialMedia('whatsapp')}>
                    Share on WhatsApp
                  </button>
                  <button style={styles.shareButton} onClick={() => shareOnSocialMedia('twitter')}>
                    Share on Twitter
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default BrowseTvShowbyGenre;


