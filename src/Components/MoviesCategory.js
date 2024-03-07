// Importing necessary modules and components
import React from 'react';
import MoviesList from '../Components/MoviesList';

// Defining the MovieCategories component
function MovieCategories({ addToWatchlist }) {
  // Rendering lists of movies from different categories
  return (
    <div>
      <MoviesList category="hollywood" addToWatchlist={addToWatchlist} />
      <MoviesList category="bollywood" addToWatchlist={addToWatchlist} />
      <MoviesList category="lollywood" addToWatchlist={addToWatchlist} />
    </div>
  );
}

// Exporting the MovieCategories component as the default export
export default MovieCategories;
