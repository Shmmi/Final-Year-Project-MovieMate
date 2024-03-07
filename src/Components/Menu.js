import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import styles from '../CSS/menu.module.css'; 

Modal.setAppElement('#root');

function Menu({ isOpen, onRequestClose }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    
      <button className={styles.menubutton} onClick={onRequestClose}>Close</button>
      <div className={styles.container}>
      <div className={styles.column}>
          <h2>Movies</h2>
          <Link to="/release-calendar">Release Calendar</Link>
          
          <Link to="/top-rated-movies">Top Rated Movies</Link>
          <Link to="/browse-movies-by-genre">Browse Movies by Genre</Link>
          <Link to="/top-box-office">Top Box Office</Link>
          <Link to="/movie-news">Movie News</Link>
          <Link to="/most-popular-movies">Most Popular Movies</Link>
          <Link to="/indian-movie-spotlight">All Movie Spotlight</Link>
        </div>
        <div className={styles.column}>
          <h2>Celebs</h2>
          <Link to="/celebrity-news">Celebs News</Link>
          <Link to="/most-popular-celebs">Popular Celebrity</Link>
          <Link to="/born-today">Born Today</Link>
        </div>
        <div className={styles.column}>
          <h2>Tv Shows</h2>
          <Link to="/top-rated-tv-shows">BrowseTvShowbyGenre</Link>
          <Link to="/most-popular-tv-shows">Most Popular TV Shows</Link>
          <Link to="/tv-show-news">TV Show News</Link>
        </div>
      </div>
    </Modal>
  );
}

export default Menu;
