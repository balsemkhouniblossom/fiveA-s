import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigation } from "./navigation";

const Complaint = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({ description: "" });
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Chargement des plaintes existantes
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoadingComplaints(true);
        const response = await axios.get(`http://localhost:3001/api/complaints/${userId}`);
        setComplaints(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Impossible de charger les plaintes. Veuillez réessayer.");
      } finally {
        setLoadingComplaints(false);
      }
    };

    if (userId) fetchComplaints();
  }, [userId]);

  // Gestion des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  // Soumission de la plainte
  const handleSubmit = async (e) => {
    e.preventDefault();

    const complaintData = {
      description: newComplaint.description,
      patientId: userId,
      date: new Date(),
    };

    console.log("Données envoyées :", complaintData);

    try {
      setSubmittingComplaint(true);
      const response = await axios.post(
        "http://localhost:3001/api/complaints",
        complaintData
      );
      setComplaints((prev) => [...prev, response.data]);
      setNewComplaint({ description: "" });
      setError("");
      setSuccessMessage("Complaint submitted successfully!");
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      setError("Échec de l’envoi de la réclamation.");
    } finally {
      setSubmittingComplaint(false);
    }
  };

  return (
    <div>
      <Navigation />
      <div id="complaints" style={{ paddingTop: "120px", paddingBottom: "80px", background: "#f6f6f6" }}>
        <div className="container">
          <div className="section-title text-center">
            <h2 style={{ color: "#5CA9FB", fontWeight: "700", marginBottom: "30px" }}>
              Patient Complaints
            </h2>
            <p style={{ fontSize: "16px", marginBottom: "30px", color: "#666" }}>
              Submit a new complaint or review your previous submissions
            </p>
          </div>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              <i className="fa fa-check-circle"></i> {successMessage}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fa fa-exclamation-circle"></i> {error}
            </div>
          )}

          {/* Formulaire */}
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="card">
                <div className="card-header" style={{ background: "#5CA9FB", color: "white", padding: "15px" }}>
                  <h4>Submit a New Complaint</h4>
                </div>
                <div className="card-body" style={{ padding: "25px" }}>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="description">Complaint Description:</label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        rows="6"
                        placeholder="Please provide details about your complaint"
                        value={newComplaint.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn"
                      disabled={submittingComplaint}
                      style={{
                        background: "#5CA9FB",
                        color: "white",
                        padding: "12px 30px",
                        borderRadius: "25px",
                        border: "none",
                        fontWeight: "600",
                        cursor: submittingComplaint ? "not-allowed" : "pointer",
                        opacity: submittingComplaint ? "0.7" : "1"
                      }}
                    >
                      {submittingComplaint ? "Submitting..." : "Submit Complaint"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des plaintes */}
          <div className="row" style={{ marginTop: "40px" }}>
            <div className="col-md-10 col-md-offset-1">
              <div className="card">
                <div className="card-header" style={{ background: "#5CA9FB", color: "white", padding: "15px" }}>
                  <h4>Your Previous Complaints</h4>
                </div>
                <div className="card-body">
                  {loadingComplaints ? (
                    <div className="text-center">
                      <i className="fa fa-spinner fa-spin" style={{ fontSize: "24px", color: "#5CA9FB" }}></i>
                      <p>Loading your complaints...</p>
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center">
                      <i className="fa fa-info-circle" style={{ fontSize: "48px", color: "#5CA9FB" }}></i>
                      <p>You haven't submitted any complaints yet.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr style={{ background: "#f8f9fa" }}>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.map((complaint) => (
                            <tr key={complaint._id}>
                              <td>
                                {new Date(complaint.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })}
                              </td>
                              <td>{complaint.description}</td>
                              <td>
                                <span style={{
                                  background: complaint.status === "Resolved" || complaint.status === "In Treatment"
                                    ? "#2ecc71"
                                    : "#3498db",
                                  color: "white",
                                  padding: "6px 12px",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  fontWeight: "600"
                                }}>
                                  {complaint.status === "Resolved" ? "In Treatment" :
                                   complaint.status === "Pending" ? "Still Pending" : complaint.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => navigate(`/complaint-details/${complaint._id}`)}
                                  style={{
                                    background: "#5CA9FB",
                                    color: "white",
                                    padding: "6px 15px",
                                    borderRadius: "4px",
                                    border: "none",
                                    cursor: "pointer"
                                  }}
                                >
                                  View Full Description
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
