import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ShowProfile.css';  // Importer le fichier CSS spécifique

export const ShowProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`);
      setFormData(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération du profil :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
    

      <div className="section-title text-center">
        <h2>Profile</h2>
      </div>
      <div className="profile-card">
        {loading ? (
          <p className="loading-text">Chargement...</p>
        ) : formData ? (
          <div className="profile-details">
            <div className={`profile-image ${loading ? 'hide' : ''}`}>
              <img src="/utilisateur.png" alt={formData.name} />
            </div>
            <div className="profile-info">
              <h4>{formData.name} {formData.lastName}</h4>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Age:</strong> {formData.age}</p>
              <p><strong>Gender:</strong> {formData.gender}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <button
                className="btn-update"
                onClick={() => navigate(`/updateProfile/${id}`)}
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          <p className="no-profile hide">Aucun profil trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ShowProfile;
