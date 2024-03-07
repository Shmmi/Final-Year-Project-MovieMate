import React, { useState, useEffect } from 'react'; 
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import hero from '../CSS/polls.module.css';
const apiKey = '499d99db6ce23991d21afde0deede0f1';

function PollList() {
  const [polls, setPolls] = useState([]);
  const [movie, setMovie] = useState(null);
  const [votes, setVotes] = useState({ likes: 0, dislikes: 0 });
  
  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`
        );
        const data = await response.json();
        // Get the first movie from the results array
        const movie = data.results[0];
        setMovie(movie);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMovie();
  }, []);
  const handleClick = (type) => {
    // Check if the type is either "like" or "dislike"
    if (type === 'like' || type === 'dislike') {
      // Update the votes state by incrementing the corresponding value
      setVotes((prevVotes) => ({
        ...prevVotes,
        [type]: prevVotes[type] + 1,
      }));
    }
  };
  
  return (
    <>
      <Header />
      <div  className={hero.HeroSection}>
        <div className={hero.MovieContainer}>
        <ul>
          {polls.map((poll) => (
            <li key={poll.id}>{poll.question}</li>
          ))}
        </ul>
        {/* Check if the movie is fetched */}
        {movie && (
          <div  className={hero.MovieContainer}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className={hero['hero-img']}
            />
            <div className={hero.HeroContent}>
              <h5 className={hero.Heading}>{movie.title}</h5>
              <p className={hero.Subheading}>{movie.overview}</p>
              {/* Display the like and dislike buttons with icons */}
              <button className={hero.AddButton} onClick={() => handleClick('like')}>
                <AiFillLike /> Like ({votes.likes})
              </button>
              <button className={hero.AddButton} onClick={() => handleClick('dislike')}>
                <AiFillDislike /> Dislike ({votes.dislikes})
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
  
}
export default PollList;