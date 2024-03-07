import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Header from '../Header';
import Footer from '../Footer';
const apiKey = '499d99db6ce23991d21afde0deede0f1'; // Replace with your actual TMDb API key
const baseUrl = 'https://api.themoviedb.org/3';


const celebrityListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
};

const celebrityCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px',
  width: '250px',
};

const celebrityImageStyle = {
  width: '200px',
  height: '300px',
  objectFit: 'cover',
  cursor: 'pointer',
};

const trailerButtonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  padding: '5px 10px',
  margin: '5px',
  cursor: 'pointer',
  borderRadius: '5px',
};

const trailerContainerStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const trailerStyle = {
  width: '70%',
  height: '70%',
};


function PopularCelebrities({ category }) {
    const [popularCelebrities, setPopularCelebrities] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
  
    useEffect(() => {
      // Define the TMDb API endpoint for fetching popular celebrities
      const tmdbEndpoint = `/person/popular`;
  
      // Make an API request to fetch popular celebrities in the specified category
      axios
        .get(`${baseUrl}${tmdbEndpoint}`, {
          params: {
            api_key: apiKey,
            language: 'en-US', // You can adjust the language as needed
            page: 1, // Page number, you can fetch more pages if needed
          },
        })
        .then((response) => {
          setPopularCelebrities(response.data.results);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, [category]);
  
    const playMovieTrailer = async (movieId) => {
      try {
        const response = await axios.get(`${baseUrl}/movie/${movieId}/videos`, {
          params: {
            api_key: apiKey,
            language: 'en-US',
          },
        });
  
        const videos = response.data.results;
  
        if (videos.length > 0) {
          const trailer = videos.find((video) => video.type === 'Trailer');
          if (trailer) {
            setSelectedMovie(trailer.key);
          } else {
            console.log('Trailer not found for this movie.');
          }
        } else {
          console.log('No videos available for this movie.');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
  
    const closeTrailer = () => {
      setSelectedMovie(null);
    };
  
    return (
      <div>
        <Header />
        <h2>Most Popular Celebrities in {category}</h2>
        <div style={celebrityListStyle}>
          {popularCelebrities.map((celebrity) => (
            <div key={celebrity.id} style={celebrityCardStyle}>
              <img
                src={`https://image.tmdb.org/t/p/w500${celebrity.profile_path}`}
                alt={celebrity.name}
                style={celebrityImageStyle}
              />
              <div style={{ textAlign: 'center' }}>
                <h3>{celebrity.name}</h3>
                {celebrity.known_for.map((movie) => (
                  <button
                    key={movie.id}
                    style={trailerButtonStyle}
                    onClick={() => playMovieTrailer(movie.id)}
                  >
                    Play Trailer: {movie.title}
                  </button>
                ))}
                <p>Known For: {celebrity.known_for_department}</p>
                <p>Popularity: {celebrity.popularity}</p>
              </div>
            </div>
          ))}
        </div>
        {selectedMovie && (
          <Modal
            isOpen={true}
            onRequestClose={closeTrailer}
            style={{
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
                width: '65%',
                height: '65%',
                padding: 0,
                overflow: 'hidden',
              },
            }}
          >
            <div className={`modal-content`}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedMovie}`}
                title="Movie Trailer"
                allowFullScreen
                style={{trailerStyle,height:'410px',width:'820px'}}
              />
              <button
                onClick={closeTrailer}
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
            </div>
          </Modal>
        )}
        <Footer />
      </div>
    );
  }
  
  export default PopularCelebrities;
  