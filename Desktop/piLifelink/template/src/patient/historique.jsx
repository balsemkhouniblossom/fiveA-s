import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import './historique.css'; 

const UserFiles = () => {
  const { userId } = useParams();
  const [userFiles, setUserFiles] = useState({ files: [], images: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/fichiers`);
        if (!response.ok) throw new Error('Impossible de récupérer les fichiers');
        const data = await response.json();
        setUserFiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFiles();
  }, [userId]);

  if (loading) return <div className="user-files-container">Chargement des fichiers...</div>;
  if (error) return <div className="user-files-container">Erreur : {error}</div>;

  return (
    <div className="user-files-container">
       {/* Back button at the top-right */}
  <div className="top-bar">
    <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>
  </div>
      <h2 className="user-files-title">Fichiers de l'utilisateur {userId}</h2>

      <div className="files-section">
        <h3 className="section-title">Fichiers PDF :</h3>
        {userFiles.files.length === 0 ? (
          <p className="no-data">Aucun fichier PDF disponible.</p>
        ) : (
          userFiles.files.map((file, index) => (
            <a
              key={index}
              className="file-link"
              href={`http://localhost:3001/files/${file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file}
            </a>
          ))
        )}
      </div>

      <div className="images-section">
        <h3 className="section-title">Images :</h3>
        {userFiles.images.length === 0 ? (
          <p className="no-data">Aucune image disponible.</p>
        ) : (
          <div className="image-grid">
            {userFiles.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:3001/images/${image}`}
                alt={`Image ${index}`}
                className="image-preview"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFiles;
