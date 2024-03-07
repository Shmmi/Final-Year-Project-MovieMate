
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import Modal from 'react-modal'; 
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

import hero from '../CSS/hero.module.css';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

function HeroSection({ addToWatchlist }) {
  const { user } = useContext(UserContext); // Get user from UserContext
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const navigate = useNavigate();

  const fetchPopularMovies = async () => {
    const response = await axios.get(`${baseUrl}/movie/popular`, {
      params: {
        api_key: apiKey,
      },
    });
    setMovies(response.data.results);
  };
  const playTrailer = async (movie) => {
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
    const interactionResponse = await fetch('http://localhost:3001/api/storeInteraction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id, // Now user is defined
        movieId: movie.id,
        interactionType: 'play_trailer',
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
  const handleMovieClick = async (movie) => {
    const interactionResponse = await fetch('http://localhost:3001/api/storeInteraction', {
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

  const closeTrailer = () => {
    setSelectedMovie(null);
    setTrailerVideo(null);
  };
  useEffect(() => {
    fetchPopularMovies();
  }, []);

return (
   <div>
     <div className={hero.HeroSection}>
      <Slider>
        {movies.map((movie) => (
          <div key={movie.id}>
            <div className={hero.MovieContainer}>
              <Link to={`/movie/${movie.id}`} onClick={() => handleMovieClick(movie)}>
                <img className={hero['hero-img']} src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} />
              </Link>
              <div className={hero.HeroContent}>
                <h1 className={hero.Heading}>{movie.title}</h1>
                <h2 className={hero.Subheading}>{movie.overview}</h2>
                <h3 className={hero.ReleaseDate}>Release date: {movie.release_date}</h3>
                <button className={hero.AddButton} onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
                <button className={hero.PlayButton} onClick={() => playTrailer(movie)}>Play Trailer</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
     <Modal isOpen={trailerVideo !== null} onRequestClose={closeTrailer}>
       {trailerVideo && (
         <iframe
           width="560"
           height="315"
           src={`https://www.youtube.com/embed/${trailerVideo.key}`}
           title="YouTube video player"
           frameBorder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen
         ></iframe>
       )}
     </Modal>
   </div>
  );
}


export default HeroSection;
