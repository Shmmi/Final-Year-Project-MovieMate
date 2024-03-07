
import React, { useState, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../Components/UserContext';
import loginStyles from '../CSS/login.module.css';


function Signup() {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user); // Use setUser to update the user context
      setSuccessMessage('Sign up successful! Redirecting to home page...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      const data = await response.json();
      setErrorMessage(data.error || 'An error occurred. Please try again.');
    }
  };
/*
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (response.ok) {
    const data = await response.json();

    setLoggedInUser(data.user);
      setSuccessMessage('Sign up successful! Redirecting to home page...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      const data = await response.json();
      setErrorMessage(data.error || 'An error occurred. Please try again.');
    }
  };
*/
  const handleFacebookSignupClick = () => {
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('User signed up successfully!');
        FB.api('/me', { fields: 'name,email' }, function(response) {
          fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: response.name,
              email: response.email,
              password: '',
            }),
          });

          navigate('/');
        });
      } else {
        console.error('User cancelled signup or did not fully authorize.');
      }
    });
  };

return (
  <div className={loginStyles['login-container']}>
      <div className={loginStyles['login-form']}>
        <h1>Sign Up to MovieMate</h1>
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
          <label htmlFor="username">Username:</label>
          <input
          className={loginStyles['form-input']}
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <br />
          <button className={loginStyles['form-button']} type="submit">Sign Up</button>
        </form>
        <button className={loginStyles['form-button']} onClick={handleFacebookSignupClick}>Sign up with Facebook</button>
      </div>
    </div>
);
}
export default Signup;
