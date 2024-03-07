import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBookmark,
  faSearch,
  faUser,
  faHome,
  faSignOutAlt,
  faHeart,
  faPoll
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import UserContext from './UserContext'; // Import UserContext
import headerStyles from '../CSS/header.module.css';

function Header() {
  const { user, setUser, logout } = useContext(UserContext); 
  const [showMenu, setShowMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const handleSearchIconClick = () => {
    setShowSearchInput(!showSearchInput);
    navigate('/SearchResults');
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown); 
  };
  useEffect(() => {
    const closeDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };    
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
    }, []); 

  return (
    <>
      <header>
      <div className={headerStyles.logo}>
          <img src="../images/MovieMate-icon.png" alt="logo" />
          <h3>MovieMate</h3>
        </div>
        <div className={headerStyles.nav} id="small_menu">
          <ul>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li>
              <a onClick={handleMenuClick}>
                {' '}
                <FontAwesomeIcon icon={faBars} /> Menu
              </a>
            </li>
            <li>
              <Link to="/WatchList">
                {' '}
                <FontAwesomeIcon icon={faBookmark} /> Watchlist
              </Link>
            </li>
            <li>
              <Link to="/favourite-list">
                {' '}
                <FontAwesomeIcon icon={faHeart} /> Favourite List
              </Link>
            </li> 
            <li>
              <Link to="/poll-list">
                {' '}
                <FontAwesomeIcon icon={faPoll} /> Poll List
              </Link>
            </li>
          </ul>
        </div>
        <div className={headerStyles.user}>
          <div ><FontAwesomeIcon icon={faSearch} onClick={handleSearchIconClick} /> </div>
          {user ? ( 
          <>
            <div>{user.name}</div> 
            {user && <span>{user.username}</span>} 
            <div onClick={logout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
          </>
          ) : (
          <>
          <Link to="/login">
            <FontAwesomeIcon icon={faUser} />
          </Link>
          </>
        )}
        </div>
      </header>
      <Menu isOpen={showMenu} onRequestClose={() => setShowMenu(false)} />
    </>
  );
}

export default Header;
