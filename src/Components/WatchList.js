// Importing necessary modules
import React from 'react';
import moviesListStyles from '../CSS/movieslist.module.css';


// Defining the Watchlist component
function Watchlist({ watchlist, removeFromWatchlist }) {
  // Rendering the list of movies in the user's watchlist
  return (
    <div>
      <h2>Watchlist</h2>
      <div className={moviesListStyles['movies-list']}>
      <div className={moviesListStyles['movies-container']}>
        {watchlist.map((movie) => (
          <div key={movie.id} className={moviesListStyles['movie-card']}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ height: '300px' }}
            />
              <h3 style={{ height: '40px', zIndex: 1 }}>{movie.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => removeFromWatchlist(movie)}>
                  Remove from Watchlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Exporting the Watchlist component as the default export
export default Watchlist;
