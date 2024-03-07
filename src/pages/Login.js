import React, { useState, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import loginStyles from '../CSS/login.module.css';
import UserContext from '../Components/UserContext';

function Login() {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data.user); // Use setUser to update the user context
      setSuccessMessage('Login successful! Redirecting to home page...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      const data = await response.json();
      setErrorMessage(data.error || 'An error occurred. Please try again.');
    }
  };
  const handleFacebookLoginClick = () => {
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('User logged in successfully!');
        FB.api('/me', { fields: 'name,picture' }, function(response) {
          setLoggedInUser({
            name: response.name,
            profilePicture: response.picture.data.url,
          });
          navigate('/');
        });
      } else {
        console.error('User cancelled login or did not fully authorize.');
      }
    });
  };

return ( 
    <div className={loginStyles['login-container']}>
        <div className={loginStyles['login-form']}>
          <h1>Sign in to MovieMate</h1>
          {errorMessage && <p>{errorMessage}</p>}
          {successMessage && <p>{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
            className={loginStyles['form-input']}
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <br />
            <label htmlFor="password">Password:</label>
            <input
            className={loginStyles['form-input']}
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />
            <button className={loginStyles['form-button']} type="submit">Sign in</button>
          </form>
          <button className={loginStyles['form-button']} onClick={handleFacebookLoginClick}><i className="fab fa-facebook-square"></i> Sign in with Facebook </button>
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
  );
}
export default Login;
