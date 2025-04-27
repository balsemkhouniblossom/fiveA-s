import React, { useState } from "react";
import { useParams } from "react-router-dom";
import './ImageUpload.css'; // Utilisation du même fichier CSS

const Files = () => {
  const { patientId } = useParams();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [formDetails, setFormDetails] = useState([]);
  const [fetchUrl, setFetchUrl] = useState("");

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      // Afficher le nom du fichier
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
      files: [filePreview] // On envoie le nom du fichier ou un lien vers le fichier
    };

    const details = [
      { key: "patientId", value: patientId },
      { key: "title", value: title },
      { key: "fileName", value: filePreview }
    ];
    setFormDetails(details);

    const url = `http://localhost:3001/api/patients/${patientId}/files`;
    setFetchUrl(url);

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

      const result = await response.json();
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
    <div className="image-upload-container"> {/* Utilisation des mêmes classes CSS */}
      <h2>Ajouter un nouveau fichier</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Titre du fichier :</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre du fichier"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file" className="form-label">Sélectionnez un fichier :</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf" // Accepte uniquement les fichiers PDF
            required
            className="form-input file-input"
          />
        </div>

        <button type="submit" className="submit-btn">Ajouter le fichier</button>
      </form>

      {filePreview && (
        <div className="file-preview">
          <h3>Aperçu du fichier :</h3>
          <p>{filePreview}</p> {/* Affiche le nom du fichier */}
        </div>
      )}

      

      
    </div>
  );
};

export default Files;
