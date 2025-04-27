import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

export const Homepage = () => {
  const navigate = useNavigate();

  const images = [
    require('../login/loginhost.jpg'),
    require('../login/acceuil.jpg'),
    require('../login/intro-bg.jpg'),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Récupération de l'id utilisateur connecté
  const userId = localStorage.getItem('userId');

  const handleButtonClick = () => {
    if (userId) {
      navigate(`/options/${userId}`);
    } else {
      alert("Utilisateur non connecté");
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div
      className="background-container"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <div className="overlay">
        <h1 className="slogan">
          Lifelink Because Every Second Matters
        </h1>

        <div className="navigation-buttons">
          <button className="arrow left" onClick={goToPrev}>
            &#10094;
          </button>

          <button className="action-button" onClick={handleButtonClick}>
            Accéder aux options
          </button>

          <button className="arrow right" onClick={goToNext}>
            &#10095;
          </button>
        </div>

        <div className="dots-container">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
            ></span>
          ))}
        </div>

        <h1 className="sub-slogan">
          Connecter les vies, sauver des instants précieux. 
          Découvrez nos services adaptés à vos besoins.
        </h1>
      </div>
    </div>
  );
};
