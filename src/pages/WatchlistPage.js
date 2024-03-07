// Importing necessary modules and components
import React from 'react';
import Header from '../Components/Header';
import WatchList from '../Components/WatchList';
import Footer from '../Components/Footer';

// Defining the WatchlistPage component
function WatchlistPage({ loggedInUser,watchlist, removeFromWatchlist , fetchUserData}) {
  // Rendering the user's watchlist or a message if it's empty
  return (
    <>
      <Header loggedInUser={loggedInUser} fetchUserData={fetchUserData} />
      <div
        style={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {watchlist.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              fontSize: '24px',
              color: 'white',
            }}
          >
            Your watchlist is empty 😔
          </p>
        ) : (
          <WatchList watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />
        )}
      </div>
      <Footer />
    </>
  );
}

// Exporting the WatchlistPage component as the default export
export default WatchlistPage;
