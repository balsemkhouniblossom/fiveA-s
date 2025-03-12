import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ShowProfile = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
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
    <div className="container">
      <div className="section-title text-center">
        <h2>Profile</h2>
      </div>
      <div className="row">
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : formData ? (
          <div className="col-md-4 mx-auto">
            <div className="testimonial">
              <div className="testimonial-image">
                <img src="/images/patient.png" alt={formData.name} />
              </div>
              <div className="testimonial-content">
                <h4>
                  {formData.name} {formData.lastName}
                </h4>
                <p>Email: {formData.email}</p>
                <p>Age: {formData.age}</p>
                <p>Gender: {formData.gender}</p>
                <p>Phone: {formData.phone}</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate(`/updateProfile/${id}`)}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Aucun profil trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ShowProfile;
