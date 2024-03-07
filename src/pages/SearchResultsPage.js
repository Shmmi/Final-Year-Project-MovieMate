// Importing necessary modules and components
import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFaceSmileWink} from '@fortawesome/free-solid-svg-icons';
import Header from '../Components/Header';
import SearchResults from '../Components/SearchResults';
import Footer from '../Components/Footer';
import UserContext from '../Components/UserContext';
import searchPageStyles from '../CSS/searchPage.module.css';
import moviesListStyles from '../CSS/movieslist.module.css';

// Defining the SearchResultsPage component
function SearchResultsPage({ loggedInUser, addToWatchlist, fetchUserData }) {
  // Setting up state for the search query and results
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Defining a function to handle changes to the search input
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Defining a function to handle key presses in the search input
  const handleSearchInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchSearchResults();
    }
  };

  // Defining a function to fetch search results from the API
const fetchSearchResults = async () => {
  const apiKey = '499d99db6ce23991d21afde0deede0f1';
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`
  );
  const data = await response.json();
  setSearchResults(data.results);

  // Store search interaction in database
  const interactionResponse = await fetch('/api/storeInteraction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id, // Assuming loggedInUser object contains the user's ID
      movieId: searchQuery,
      interactionType: 'search',
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
// Rendering the search input and search results
return (
  <>
    <Header fetchUserData={fetchUserData} />
    <input
      className={searchPageStyles['search-input']}
      type="text"
      onChange={handleSearchInputChange}
      onKeyPress={handleSearchInputKeyPress}
      value={searchQuery}
    />
    <div   style={{
          minHeight: 'calc(100vh - 200px)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >{searchResults.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            fontSize: '24px',
            color: 'white',
          }}
        >
          Do some search <FontAwesomeIcon style={{color: 'yellow',}} icon={faFaceSmileWink} />
        </p>
      )  : (
          <div className={moviesListStyles['search-results-grid']}>
          <h2>Search Results</h2>
          <SearchResults searchResults={searchResults} addToWatchlist={addToWatchlist} isGrid={true} />
        </div>
      )}
    </div>
    <Footer />
  </>
);
}

// Exporting the SearchResultsPage component as the default export
export default SearchResultsPage;

