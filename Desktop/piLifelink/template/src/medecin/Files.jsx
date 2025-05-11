import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ImageUpload.css'; // Réutilisation du CSS

const Files = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFilePreview(uploadedFile.name); // Affiche le nom du fichier
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !filePreview) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const payload = {
      files: [filePreview]
    };

    const url = `http://localhost:3001/api/patients/${patientId}/files`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du fichier");
      }

      alert("Fichier ajouté avec succès !");
      setTitle("");
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error("Erreur :", err);
      alert("Une erreur s'est produite lors de l'ajout du fichier.");
    }
  };

  return (
    <div className="upload-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>
      <div className="upload-card">
        <h2>Ajouter un nouveau fichier</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            placeholder="Titre du fichier"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-text"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="input-file"
            required
          />
          <button type="submit" className="btn-submit">Ajouter le fichier</button>
        </form>

        {filePreview && (
          <div className="preview">
            <h3>Aperçu du fichier :</h3>
            <p>{filePreview}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
