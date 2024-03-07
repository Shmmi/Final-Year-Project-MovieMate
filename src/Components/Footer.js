// Importing necessary modules
import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookSquare,
  faYoutube,
  faInstagram,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';

import footerStyles from '../CSS/footer.module.css';


// Defining the Footer component
function Footer() {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform actions such as validating the input values, sending them to a server, or displaying a confirmation message
    console.log({ name, email, project, attachments });
  };
  
return (
    <div className={footerStyles.footer}>
      <div className={footerStyles['inside-footer']}>
        <div className={footerStyles['footer-container']}>
          {/* Removing the logo part */}
          {/* <div className={footerStyles.logopart}>
            <h1>MovieMate</h1>
          </div> */}
          {/* Moving the subscribe form to the first line */}
          <div className={footerStyles.subscribe}>
            <h1>Subscribe</h1>
            <p>Sign up to hear from us about specials, sales, and events.</p>
            <form onSubmit={handleSubmit}>
              <div className={footerStyles.inputrow}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleEmailChange}
                />
                <button type="submit">Sign up</button>
              </div>
            </form>
          </div>
          {/* Moving the socials and copy right to the second line */}
          <div className={footerStyles.socials}>
            <a
              href="https://www.facebook.com/MovieMate"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Movie Mate on Facebook"
            >
              <FontAwesomeIcon icon={faFacebookSquare} style={{color:'tomato'}} />
            </a>
            <a
              href="https://www.youtube.com/MovieMate"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Movie Mate on YouTube"
            >
              <FontAwesomeIcon icon={faYoutube} style={{color:'tomato'}}/>
            </a>
            <a
              href="https://www.instagram.com/MovieMate"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Movie Mate on Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} style={{color:'tomato'}} />
            </a>
            <a
              href="https://www.pinterest.com/MovieMate"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Movie Mate on Pinterest"
            >
              <FontAwesomeIcon icon={faPinterest} style={{color:'tomato'}} />
            </a>
          </div>
          <div className={footerStyles.copyright}>
            <p>
              © Shmmi. All Rights Reserved. 2021.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

