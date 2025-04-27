import React from "react";
import { useNavigate } from "react-router-dom";
import './specialite.css'; // Ton fichier de style

const specialites = [
  { nom: "Cardiologie", image: "/images/cardiologie.jpg" },
  { nom: "Neurologie", image: "/images/neurologie.jpg" },
  { nom: "Pédiatrie", image: "/images/pediatrie.jpg" },
  { nom: "Gynécologie-obstétrique", image: "/images/genico.jpg" },
  { nom: "Traumatologie", image: "/images/traumalogie.jpg" },
  { nom: "Pneumologie", image: "/images/pneumologie.jpg" },
  { nom: "Néphrologie", image: "/images/nephrologie.jpg" },
  { nom: "Gastro-entérologie", image: "/images/gastro.jpg" },
  { nom: "Oncologie", image: "/images/oncologie.jpg" },
  { nom: "Psychiatrie", image: "/images/psy.jpg" },
  { nom: "Radiologie", image: "/images/radiologie.jpg" },
  { nom: "Anesthésie-réanimation", image: "/images/anesthesie.jpg" },
  { nom: "Dermatologie", image: "/images/dermato.jpg" }
];

const SpecialiteCard = ({ nom, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/medecins/${nom}`); // Passer le nom en paramètre dans l'URL
  };

  return (
    <div className="card">
      <img
        src={image}
        alt={nom}
        className="card-img"
      />
      <div className="card-content">
        <div className="specialite">{nom}</div>
        <div className="card-footer">
          <button className="btn" onClick={handleClick}>Voir la spécialité</button>
        </div>
      </div>
    </div>
  );
};

export const ListeSpecialites = () => {
  return (
    <div className="liste-container">
      <h1 style={{ textAlign: "center", fontSize: "2rem", margin: "30px 0" }}>
        Nos Spécialités Médicales
      </h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {specialites.map((spec, index) => (
          <SpecialiteCard key={index} nom={spec.nom} image={spec.image} />
        ))}
      </div>
    </div>
  );
};
