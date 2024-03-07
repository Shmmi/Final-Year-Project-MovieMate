import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import dropdownMenuStyles from '../CSS/dropdownMenu.module.css';

const DropdownMenu = forwardRef(({ logout, showDropdown, onDropdownClick }, ref) => {

  return (
    <div className={dropdownMenuStyles.dropdown} ref={ref}>
      <FontAwesomeIcon icon={faCaretDown} onClick={onDropdownClick} /> 
      {showDropdown && ( 
        <ul className={`${dropdownMenuStyles['dropdown-menu']} ${showDropdown ? dropdownMenuStyles.show : ''}`}>
          <li className={dropdownMenuStyles['dropdown-item']}>
            <Link to="/about">About</Link>
          </li>
          <li className={dropdownMenuStyles['dropdown-item']}>
            <Link to="/subscribe">Subscribe</Link>
          </li>
          <li className={dropdownMenuStyles['dropdown-item']}>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
});

export default DropdownMenu;
