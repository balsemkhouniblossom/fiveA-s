import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ImageUpload.css';

const ImageUpload = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [steps, setSteps] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) {
      setSteps(["⚠️ Veuillez remplir tous les champs."]);
      return;
    }

    const formData = new FormData();
    formData.append("images", image);
    formData.append("title", title);

    const url = `http://localhost:3001/api/patients/${patientId}/images`;

    setSteps(["📦 Préparation de l'image..."]);

    try {
      const res = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur");

      const updatedPatient = await res.json();
      const latestDiag = updatedPatient.diagnostics?.slice(-1)[0]?.result;

      setSteps([
        "✅ Image envoyée avec succès !",
        `🧠 Diagnostic IA : ${latestDiag || "Non disponible"}`
      ]);

      alert("Image ajoutée !");
      setTitle("");
      setImage(null);
      setImagePreview(null);
    } catch {
      setSteps(prev => [...prev, "❌ Échec de l'envoi"]);
    }
  };

  return (
    <div className="upload-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>
      <div className="upload-card">
        <h2>📤 Ajouter une image</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            placeholder="Titre de l'image"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-text"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-file"
            required
          />
          <button type="submit" className="btn-submit">Envoyer</button>
        </form>

        {imagePreview && (
          <div className="preview">
            <h3>Aperçu</h3>
            <img src={imagePreview} alt="preview" />
          </div>
        )}

        {steps.length > 0 && (
          <div className="steps">
            <ul>
              {steps.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
