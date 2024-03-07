import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import Footer from '../Footer';
const TVNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const TMDB_API_KEY = '499d99db6ce23991d21afde0deede0f1'; // Replace with your TMDB API key

  useEffect(() => {
    // Fetch news items from TMDB
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`
      )
      .then((response) => {
        const trendingNews = response.data.results.map((result) => ({
          id: result.id,
          title: result.title || result.name,
          image: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
          overview: result.overview,
          trailerUrl: `https://www.youtube.com/watch?v=${result.video_key}`,
        }));
        setNewsItems(trendingNews);
      })
      .catch((error) => {
        console.error('Error fetching TMDB data:', error);
      });
  }, [TMDB_API_KEY]);

  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseDetails = () => {
    setSelectedNews(null);
  };

  const styles = {
    tvNews: {
      textAlign: 'center',
      margin: '20px',
    },
    newsList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    newsCard: {
      margin: '20px',
      cursor: 'pointer',
      maxWidth: '250px',
      position: 'relative',
    },
    newsCardImage: {
      width: '100%',
      height: 'auto',
    },
    newsBox: {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '300px',
      height: '100%',
      backgroundColor: '#f2f2f2',
      padding: '10px',
      display: 'none',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      textAlign: 'left',
      overflowY: 'auto',
    },
    newsBoxActive: {
      display: 'block',
    },
    closeButton: {
      cursor: 'pointer',
    },
    newsHeading: {
      cursor: 'pointer',
      textDecoration: 'underline',
      color: 'blue',
    },
    newsPoster: {
      width: '100%',
      height: 'auto',
    },
    trailerContainer: {
      position: 'relative',
      paddingTop: '56.25%', // 16:9 aspect ratio
    },
    trailerIframe: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
  };

  return (
    <>
    <Header />
    <div style={styles.tvNews}>
      <h2>Latest TV News</h2>
      <div style={styles.newsList}>
        {newsItems.map((newsItem) => (
          <div
            key={newsItem.id}
            style={styles.newsCard}
            onClick={() => handleNewsClick(newsItem)}
          >
            <img
              src={newsItem.image}
              alt={newsItem.title}
              style={styles.newsCardImage}
            />
            <h3>{newsItem.title}</h3>
          </div>
        ))}
      </div>
      {selectedNews && (
        <div
          style={{
            ...styles.newsBox,
            ...styles.newsBoxActive,
          }}
        >
          <button onClick={handleCloseDetails} style={styles.closeButton}>
            Close
          </button>
          <h3>{selectedNews.title}</h3>
          <img
            src={selectedNews.image}
            alt={selectedNews.title}
            style={styles.newsPoster}
          />
          <p>{selectedNews.overview}</p>
          <div style={styles.trailerContainer}>
            <iframe
              title="Trailer"
              src={selectedNews.trailerUrl}
              style={styles.trailerIframe}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default TVNews;


