import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';
const newsEndpoint = '/movie/now_playing';

const movieNewsStyles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Add space between posters
    color: 'white',
  },
  newsItem: {
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px',
    maxWidth: '300px',
    cursor: 'pointer',
    flex: '1 1 calc(20% - 20px)', // Set the width and add flex properties
  },
  poster: {
    maxWidth: '100%',
    height: 'auto',
  },
  detailedView: {
    display: 'none',
    color: 'white',
  },
  backButton: {
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'underline',
    margin: '10px 0',
  },
};

const postersPerRow = 4; // Number of posters per row

function MovieNews() {
  const [movieNews, setMovieNews] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}${newsEndpoint}?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        setMovieNews(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBackClick = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <Header />
      <h1 style={{ color: 'white' }}>Movie News</h1>
      <div style={movieNewsStyles.container}>
        {movieNews &&
          movieNews.length > 0 &&
          movieNews.map((newsItem, index) => (
            <div
              key={newsItem.id}
              style={movieNewsStyles.newsItem}
              onClick={() => handleMovieClick(newsItem)}
              className="news-item"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${newsItem.poster_path}`}
                alt={newsItem.title}
                style={movieNewsStyles.poster}
              />
              <h3>{newsItem.title}</h3>
              <p>{newsItem.overview}</p>
              <p>Release Date: {newsItem.release_date}</p>
              <p>Popularity: {newsItem.popularity}</p>
              <Link to={`/movie/${newsItem.id}`} style={movieNewsStyles.seeMoreButton}>
                <h3 style={{backgroundColor:'tomato',width:'155px',color:'black'}}>See More Details</h3>
              </Link>
            </div>
          ))}
      </div>
      {selectedMovie && (
        <div style={movieNewsStyles.detailedView}>
          <h2>{selectedMovie.title}</h2>
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
            style={movieNewsStyles.poster}
          />
          <p>{selectedMovie.overview}</p>
          <p>Release Date: {selectedMovie.release_date}</p>
          <p>Popularity: {selectedMovie.popularity}</p>
          <button onClick={handleBackClick} style={movieNewsStyles.backButton}>
            Back to News
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default MovieNews;
