import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Header from '../Header';
import Footer from '../Footer';
const apiKey = '499d99db6ce23991d21afde0deede0f1'; // Replace with your actual TMDb API key
const baseUrl = 'https://api.themoviedb.org/3';

const newsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
};

const newsCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px',
  width: '300px',
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '5px',
  color:'white'
};

const newsImageStyle = {
  width: '100%',
  height: '400px',
  objectFit: 'cover',
};

const dropdownStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const trailerButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  padding: '5px 10px',
  margin: '5px',
  cursor: 'pointer',
  borderRadius: '5px',
};

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '800px', // Adjust the width as needed
    maxHeight: '80%',
    height:'350px',
    padding: 0,
    overflow: 'hidden',
  },
};


function CelebsNews() {
    const [celebNews, setCelebNews] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
  
    useEffect(() => {
      // Define the TMDb API endpoint for fetching trending celebrity news
      const tmdbEndpoint = `/trending/person/week`;
  
      // Make an API request to fetch trending celebrity news worldwide
      axios
        .get(`${baseUrl}${tmdbEndpoint}`, {
          params: {
            api_key: apiKey,
          },
        })
        .then(async (response) => {
          const newsData = response.data.results;
  
          // Fetch additional information for each celebrity
          const celebDataPromises = newsData.map(async (news) => {
            const celebResponse = await axios.get(
              `${baseUrl}/person/${news.id}`,
              {
                params: {
                  api_key: apiKey,
                },
              }
            );
  
            const movieCreditsResponse = await axios.get(
              `${baseUrl}/person/${news.id}/movie_credits`,
              {
                params: {
                  api_key: apiKey,
                },
              }
            );
  
            // Combine the data and return it
            const combinedData = {
              ...news,
              date_of_birth: celebResponse.data.birthday,
              known_for: celebResponse.data.known_for_department,
              movies: movieCreditsResponse.data.cast || [],
              awards: celebResponse.data.awards || [],
            };
  
            return combinedData;
          });
  
          const celebData = await Promise.all(celebDataPromises);
          setCelebNews(celebData);
        })
        .catch((error) => {
          console.error('Error fetching celebrity news:', error);
        });
    }, []);
  
    const openTrailerModal = (movieId) => {
      setSelectedMovie(movieId);
    };
  
    const closeTrailerModal = () => {
      setSelectedMovie(null);
    };
  
    const playMovieTrailer = async (movieId) => {
      try {
        // Fetch movie details to get trailer information
        const movieResponse = await axios.get(`${baseUrl}/movie/${movieId}`, {
          params: {
            api_key: apiKey,
            append_to_response: 'videos', // Include video details
          },
        });
  
        const videos = movieResponse.data.videos.results;
  
        // Find the trailer video (assuming the type is 'Trailer')
        const trailerVideo = videos.find((video) => video.type === 'Trailer');
  
        if (trailerVideo) {
          openTrailerModal(trailerVideo.key);
        } else {
          console.log('Trailer not found for this movie.');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
  
    return (
      <div>
      <Header/>
        <h2>Celebs News</h2>
        <div style={newsContainerStyle}>
          {celebNews.map((news) => (
            <div key={news.id} style={newsCardStyle}>
              <img
                src={`https://image.tmdb.org/t/p/w500${news.profile_path}`}
                alt={news.name}
                style={newsImageStyle}
              />
              <h3>{news.name}</h3>
              <p>Date of Birth: {news.date_of_birth}</p>
              <p>Known For: {news.known_for}</p>
              <h4>Movies:</h4>
              <select
                style={dropdownStyle}
                onChange={(e) => playMovieTrailer(e.target.value)}
              >
                {news.movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              <button
                style={trailerButtonStyle}
                onClick={() => playMovieTrailer(news.movies[0].id)}
              >
                Play Trailer
              </button>
              {/*<h4>Awards:</h4>*/}
              <ul>
                {news.awards.map((award) => (
                  <li key={award.id}>{award.name}</li>
                ))}
              </ul>
              <p>{news.title}</p>
              <p>{news.overview}</p>
            </div>
          ))}
        </div>
        {/* Modal for playing trailers */}
        <Modal
          isOpen={selectedMovie !== null}
          onRequestClose={closeTrailerModal}
          style={modalStyle}
          contentLabel="Trailer Modal"
        >
          {/* Replace this with your video player component */}
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selectedMovie}`}
            title="Trailer"
            allowFullScreen
          ></iframe>
          <button
            onClick={closeTrailerModal}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontSize: '24px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </Modal>
        <Footer/>
      </div>
    );
  }
  
  export default CelebsNews;
  