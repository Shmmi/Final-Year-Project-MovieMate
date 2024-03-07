// Importing necessary modules and components
import React, { useContext} from 'react';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';
import UserContext from '../Components/UserContext';
import MoviesList from '../Components/MoviesList';
import Footer from '../Components/Footer';


// Defining the Home component
function Home({ addToWatchlist}) {
  const {user} = useContext(UserContext);
  // Rendering the home page with a header, hero section, and lists of movies
  return (
    <div>
      <div
        className="content-wrapper"
        style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}
      >
        <Header  />
        <HeroSection addToWatchlist={addToWatchlist} />
        {user ? (
          <>
            <h2>Recommendations</h2>
            <MoviesList category="Recommended" addToWatchlist={addToWatchlist} />
          </>
        ) : (
          <>
            <h2>Recommendations</h2>
            <p  style={{
              textAlign: 'center',
              fontSize: '24px',
              color: 'white',
            }} 
            >Please sign in to view your recommendations.</p>
          </>
        )}
        <h2>Hollywood</h2>
        <MoviesList category="Hollywood" addToWatchlist={addToWatchlist} />
        <h2>Bollywood</h2>
        <MoviesList category="Bollywood" addToWatchlist={addToWatchlist} />
        <h2>Lollywood</h2>
        <MoviesList category="Lollywood" addToWatchlist={addToWatchlist}  />
      </div>
      <Footer />
    </div>
  );
}

// Exporting the Home component as the default export
export default Home;
