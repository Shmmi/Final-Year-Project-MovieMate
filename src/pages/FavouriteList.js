import React, { useState, useEffect } from 'react'; 
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import styles  from '../CSS/favouritelist.module.css';
function FavouriteList() {
  const [movieLists, setMovieLists] = useState([]);
  const apiKey = '499d99db6ce23991d21afde0deede0f1';
  
useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const updatedMovieLists = [...movieLists];
        for (let i = 0; i < updatedMovieLists.length; i++) {
          const movies = updatedMovieLists[i].movies;
          const movieIds = movies.split(',');
          const movieDetails = [];
          for (let j = 0; j < movieIds.length; j++) {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieIds[j]}?api_key=${apiKey}`);
            const data = await response.json();

            movieDetails.push(data);
          }
          updatedMovieLists[i].movies = movieDetails;
        }
        setMovieLists(updatedMovieLists);
      } catch (error) {
        console.log(error);
      }
    }
    if (movieLists.length > 0) {
      fetchMovieDetails();
    }
  }, [movieLists]); 
return (
  <>
  <Header />
    <div className={styles.container}>
      <h1 className={styles.title}>Your FavouriteList</h1>
      <ul>
        {movieLists.map((movieList) => (
          <li key={movieList.id}>
            <h2>{movieList.name}</h2>
            <p>{movieList.description}</p>
            <ul>
            {movieList.movies && movieList.movies.map((movie) => (
                <li key={movie.id}>
                  <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
    < Footer />
    </>
  );
}
export default FavouriteList;
