import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Historique = () => {
  const { userId } = useParams();
  const [filesData, setFilesData] = useState({ files: [], images: [] });
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null); // Nouvel état pour l'aperçu de l'image
  const [newImage, setNewImage] = useState(null); // Nouvel état pour stocker l'image sélectionnée

  useEffect(() => {
    const fetchFilesData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/${userId}/fichiers`);
        setFilesData({
          files: response.data.files || [],
          images: response.data.images || [],
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilesData();
  }, [userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Génère un URL temporaire pour prévisualisation
      setNewImage(file);
      setImagePreview(imageUrl);  // Stocke l'URL pour prévisualisation
    }
  };

  const handleSubmitImage = async (event) => {
    event.preventDefault();
    if (!newImage) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    // Exemple de traitement de l'image (ici, tu pourrais envoyer l'image vers ton serveur)
    const formData = new FormData();
    formData.append('image', newImage);

    try {
      const response = await axios.post(`http://localhost:3001/api/users/${userId}/uploadImage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200) {
        alert("Image téléchargée avec succès !");
        // Réinitialise les états après le téléchargement
        setNewImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      alert("Une erreur s'est produite lors du téléchargement de l'image.");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Historique des fichiers et images</h2>

      {/* PDF */}
      {filesData.files.length > 0 ? (
        <div>
          <h3>Fichiers PDF</h3>
          <ul>
            {filesData.files.map((file, index) => (
              <li key={index}>
                <a href={file} target="_blank" rel="noopener noreferrer">
                  Voir PDF {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : <p>Aucun fichier PDF.</p>}

      {/* Images */}
      {filesData.images.length > 0 ? (
        <div>
          <h3>Images</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {filesData.images.map((image, index) => (
              <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: 200, margin: 10 }} />
            ))}
          </div>
        </div>
      ) : <p>Aucune image.</p>}

      {/* Formulaire pour ajouter une nouvelle image */}
      <div style={{ marginTop: '20px' }}>
        <h3>Ajouter une nouvelle image :</h3>
        <form onSubmit={handleSubmitImage}>
          <div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required 
            />
            <button type="submit" style={{ marginLeft: '10px' }}>Télécharger l'image</button>
          </div>
        </form>

        {imagePreview && (
          <div style={{ marginTop: '20px' }}>
            <h4>Aperçu de l'image sélectionnée :</h4>
            <img src={imagePreview} alt="Aperçu de l'image" style={{ width: 200, marginTop: '10px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;
