// Importing necessary modules and components
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import WatchlistPage from './pages/WatchlistPage';
import SearchResultsPage from './pages/SearchResultsPage';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import Profile from './pages/Profile';
import MoviesList from './Components/MoviesList';
import MoviePage from './pages/MoviePage'; 
import FavouriteList from './pages/FavouriteList';
import PollList from './pages/PollList';
import ReleaseCalendar from './Components/MenuComponents/ReleaseClendar';
import MovieNews from './Components/MenuComponents/MovieNews';
import TopRatedMovies from './Components/MenuComponents/TopRatedmovies';
import BrowseMoviesByGenre from './Components/MenuComponents/BrowseByGenre';
import TopBoxOffice from './Components/MenuComponents/TopBoxOffice';
import IndianMovieSpotlight from './Components/MenuComponents/IndianMovieSpotlight';
import MostPopularMovies from './Components/MenuComponents/MostPopularMovies';
import PopularCelebrities from './Components/MenuComponents/MostPopularcelebs';
import CelebsNews from './Components/MenuComponents/CelebsNews';
import MostPopularTvShows from './Components/MenuComponents/MostPopularTvShow';
import BrowseTvShowbyGenre from './Components/MenuComponents/BrowseTvShowByGenre';
import TVNews from './Components/MenuComponents/TvNews';
import { UserProvider } from './Components/UserContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  
   useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);
   
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  const addToWatchlist = async (movie) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, movie]);
  
    const interactionResponse = await fetch('http://localhost:3001/api/storeInteraction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id, 
        movieId: movie.id,
        interactionType: 'add_to_watchlist',
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
  

  const removeFromWatchlist = (movieToRemove) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.id !== movieToRemove.id)
    );
  };

  function login(userData) {
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.authenticated) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        console.error('Failed to authenticate user');
      }
    })
    .catch(error => console.error('Error:', error));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
  }

return (
  <UserProvider value={{ user, setUser, login, logout }}> 
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <Home
            watchlist={watchlist}
            addToWatchlist={addToWatchlist}
          />
        }
      />
      <Route
        path="/watchlist"
        element={
          <WatchlistPage
            watchlist={watchlist}
            setWatchlist={setWatchlist}
            removeFromWatchlist={removeFromWatchlist}
          />
        }
      />
      <Route
        path="/searchresults"
        element={
          <SearchResultsPage
            addToWatchlist={addToWatchlist}
          />
        }
      />
      <Route path="/signup" element={<Signup />} /> // Adding a Route for the Signup page
      <Route
        path="/login"
        element={<Login  />}
      />
      <Route
        path="/profile"
        element={
          <Profile/>
        }
      />
      <Route exact path="/" component={MoviesList} />
      <Route
        path="/movie/:id"
        element={<MoviePage 
          watchlist={watchlist}
          addToWatchlist={addToWatchlist}
        /> }
      />
      <Route path="/release-calendar" element={<ReleaseCalendar/>} />
      <Route path="/top-rated-movies" element={<TopRatedMovies addToWatchlist={addToWatchlist}/>} />
      <Route path="/browse-movies-by-genre" element={<BrowseMoviesByGenre/>} />
      <Route path="/top-box-office" element={<TopBoxOffice addToWatchlist={addToWatchlist}/>} />
      <Route path="/movie-news" element={<MovieNews/>} />
      <Route path="/indian-movie-spotlight" element={<IndianMovieSpotlight/>} />
      <Route path="/most-popular-movies" element={<MostPopularMovies/>} />
      <Route path="/most-popular-celebs" element={<PopularCelebrities/>} />
      <Route path="/celebrity-news" element={<CelebsNews/>} />
      <Route path="/tv-show-news" element={<TVNews/>} />
      <Route path="/most-popular-tv-shows" element={<MostPopularTvShows/>} />
      <Route path="/top-rated-tv-shows" element={<BrowseTvShowbyGenre/>} />
      <Route
        path="/favourite-list"
        element={
          <FavouriteList
          />
        }
      />
      <Route
        path="/poll-list"
        element={
          <PollList
        />
        }
    />
    </Routes>
  </Router>
  </UserProvider>
);
}
export default App;

