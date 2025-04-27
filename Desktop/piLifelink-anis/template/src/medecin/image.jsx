import React, { useState } from "react";
import { useParams } from "react-router-dom";
import './ImageUpload.css';

const ImageUpload = () => {
  const { patientId } = useParams();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formDetails, setFormDetails] = useState([]);
  const [fetchUrl, setFetchUrl] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Génère un URL temporaire pour prévisualisation
      setImage(file);
      setImagePreview(imageUrl);  // Stocke l'URL pour prévisualisation
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !imagePreview) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const payload = {
      images: [imagePreview] // On envoie l'URL de l'image en tant que tableau
    };

    const details = [
      { key: "patientId", value: patientId },
      { key: "title", value: title },
      { key: "imageURL", value: imagePreview }
    ];
    setFormDetails(details);

    const url = `http://localhost:3001/api/patients/${patientId}/images`;
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
        throw new Error("Erreur lors de l'ajout de l'image");
      }

      const result = await response.json();
      alert("Image ajoutée avec succès !");
      setTitle("");
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Erreur :", err);
      alert("Une erreur s'est produite lors de l'ajout de l'image.");
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Ajouter une nouvelle image</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Titre de l'image :</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre de l'image"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">Sélectionnez une image :</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="form-input file-input"
          />
        </div>

        <button type="submit" className="submit-btn">Ajouter l'image</button>
      </form>

      {imagePreview && (
        <div className="image-preview">
          <h3>Aperçu de l'image :</h3>
          <img src={imagePreview} alt="Aperçu" className="image-preview-img" />
        </div>
      )}

     

     
    </div>
  );
};

export default ImageUpload;
