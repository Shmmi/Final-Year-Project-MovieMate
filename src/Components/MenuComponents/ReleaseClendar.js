import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Footer from '../Footer';
import Header from '../Header';

const apiKey = '499d99db6ce23991d21afde0deede0f1';
const baseUrl = 'https://api.themoviedb.org/3';

function ReleaseCalendar() {
  const [movies, setMovies] = useState([]);
  const [releaseDates, setReleaseDates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US'); // Default to United States
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);

  const playTrailer = async (movie) => {
    setIsLoading(true);
    setSelectedMovie(movie);

    const response = await axios.get(`${baseUrl}/movie/${movie.id}/videos`, {
      params: {
        api_key: apiKey,
      },
    });

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

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${baseUrl}/movie/upcoming`, {
        params: {
          api_key: apiKey,
          region: selectedCountry, // Use the selected country as the region
        },
      });

      const dates = response.data.results.map((movie) => movie.release_date);
      setReleaseDates(dates);
      setMovies(response.data.results);
    };
    fetchData();
  }, [selectedCountry]); // Re-fetch data when the selected country changes

  const handleScrollClick = (direction) => {
    const container = document.querySelector('.movies-container-release');
    if (direction === 'left') {
      container.scrollLeft -= 300;
      setScrollLeft(container.scrollLeft);
    } else if (direction === 'right') {
      container.scrollLeft += 300;
      setScrollLeft(container.scrollLeft);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ marginRight: '10px' }}>Release Calendar</h2>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          style={{
            padding: '5px',
            fontSize: '16px',
            borderRadius: '5px',
          }}
        > 
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CN">China</option>
          <option value="PK">Pakistan</option>
          <option value="SA">Saudi Arabia</option>
          <option value="KR">South Korea</option>
          <option value="JP">Japan</option>
          <option value="IN">India</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
          <option value="AU">Australia</option>
          <option value="CA">Canada</option>
          <option value="BR">Brazil</option>
          <option value="MX">Mexico</option>
          <option value="RU">Russia</option>
          <option value="AR">Argentina</option>
          <option value="ES">Spain</option>
<option value="IT">Italy</option>
<option value="TR">Turkey</option>
<option value="GR">Greece</option>
<option value="NL">Netherlands</option>
<option value="BE">Belgium</option>
<option value="SE">Sweden</option>
<option value="NO">Norway</option>
<option value="DK">Denmark</option>
<option value="FI">Finland</option>
<option value="CH">Switzerland</option>
<option value="AT">Austria</option>
<option value="PL">Poland</option>
<option value="CZ">Czech Republic</option>
<option value="HU">Hungary</option>
<option value="SK">Slovakia</option>
<option value="RO">Romania</option>
<option value="BG">Bulgaria</option>
<option value="HR">Croatia</option>
<option value="SI">Slovenia</option>
<option value="RS">Serbia</option>
<option value="PT">Portugal</option>
<option value="IE">Ireland</option>
<option value="IL">Israel</option>
<option value="AE">United Arab Emirates</option>
<option value="SG">Singapore</option>
<option value="MY">Malaysia</option>
<option value="TH">Thailand</option>
<option value="PH">Philippines</option>
<option value="ID">Indonesia</option>
<option value="VN">Vietnam</option>
<option value="PH">Philippines</option>
<option value="NZ">New Zealand</option>

        </select>
      </div>
      <div className="movies-list" style={{ display: 'flex', alignItems: 'center' }}>
        <button className="scroll-button" onClick={() => handleScrollClick('left')}>
          {'<'}
        </button>
        <div className="movies-container movies-container-release" style={{ overflowX: 'scroll', whiteSpace: 'nowrap', width: '100%', padding: '20px' }}>
          {movies.map((movie, index) => (
            <div key={movie.id} className="movie-card" style={{ display: 'inline-block', width: '200px', margin: '10px' }}>
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} // Adjusted poster size
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p>Release Date: {releaseDates[index]}</p>
              </Link>
              <div>
                <button onClick={() => playTrailer(movie)}>
                  <span>▶</span> Play
                </button>
              </div>
            </div>
          ))}
        </div>
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
              marginRight: '-40%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              padding: '0%',
              overflow: 'hidden',
            },
          }}
        >
          <div className={`modal-content ${trailerVideo ? 'open' : ''}`}>
            {isLoading && (
              <div className="loader"></div>
            )}
            <iframe
              src={`https://www.youtube.com/embed/${trailerVideo.key}`}
              title={trailerVideo.name}
              allowFullScreen
              style={{
                width: '100%',
                height: '380px',
                marginTop: '0px',
              }}
            />
          </div>
          <button
            onClick={closeTrailer}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#000')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'grey')}
            style={{
              position: 'fixed',
              top: 5,
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
      <Footer />
    </div>
  );
}

export default ReleaseCalendar;
