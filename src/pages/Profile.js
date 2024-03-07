import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const Profile = ({ loggedInUser, setLoggedInUser }) => {
  const [name, setName] = useState(loggedInUser.name);
  const [profilePicture, setProfilePicture] = useState(
    loggedInUser.profilePicture
  );
  const navigate = useNavigate();

  // Defining a function to handle file input change events
  const handleFileInputChange = (event) => {
    // Checking if a file was selected
    if (event.target.files && event.target.files[0]) {
      // Creating a FileReader object to read the selected file
      const reader = new FileReader();

      // Defining a function to handle load events on the FileReader object
      reader.onload = (event) => {
        // Updating the profilePicture state variable with the data URL of the selected image
        setProfilePicture(event.target.result);
      };

      // Reading the selected file as a data URL
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Defining a function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Updating the loggedInUser state variable with the updated user information
    setLoggedInUser({
      ...loggedInUser,
      name,
      profilePicture,
    });
  };

  // Defining a function to handle user logout
  const handleLogoutClick = () => {
    setLoggedInUser(null); // Updating the loggedInUser state variable to null
    localStorage.removeItem('loggedInUser'); // Removing the stored value from local storage
    navigate('/'); // Navigating to the home page
  };

  return (
    <div>
      <Header loggedInUser={loggedInUser} fetchUserData={fetchUserData} />
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br />
        <label htmlFor="profile-picture">Profile Picture:</label>
        <input
          type="file"
          id="profile-picture"
          accept="image/*"
          onChange={handleFileInputChange}
        />
        <br />
        {profilePicture && (
          <>
            <label>Preview:</label>
            <br />
            <img src={profilePicture} alt="Profile Picture" />
            <br />
          </>
        )}
        <button type="submit">Save Changes</button>
      </form>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default Profile;
