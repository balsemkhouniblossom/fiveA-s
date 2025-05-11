import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Send } from "lucide-react";
import "./complaint.css"; // Import the CSS file

const Complaint = () => {
  const { userId } = useParams();
  const [newComplaint, setNewComplaint] = useState({ description: "" });
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Utilisez useNavigate pour la navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Modify this object to match your backend schema
    const complaintData = {
      description: newComplaint.description,
      patientId: userId,  // This matches your backend API expectation
      date: new Date().toISOString(),
    };

    try {
      setSubmittingComplaint(true);
      setError(null);
      
      const response = await axios.post(
        "http://localhost:3001/api/complaints", 
        complaintData
      );
      
      console.log("Complaint submitted successfully:", response.data);
      setNewComplaint({ description: "" });
      setSuccessMessage("Complaint submitted successfully!");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      
      if (err.response) {
        setError(`Submission failed: ${err.response.data.error || err.response.data.message || "Server error"}`);
      } else if (err.request) {
        setError("Server not responding. Please try again later.");
      } else {
        setError("Error preparing request. Please try again.");
      }
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const handleBackClick = () => {
    navigate("/patient"); // Redirige vers la page de patient
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <div className="complaint-page">
        <div className="complaint-container">
          <div className="complaint-header">
            <h2>Submit a Complaint</h2>
            <p>If you have a problem, please let us know.</p>
          </div>

          {successMessage && (
            <div className="success-message">
              ✅ {successMessage}
            </div>
          )}
          {error && <div className="error-message">❌ {error}</div>}

          <form onSubmit={handleSubmit} className="complaint-form">
            <label htmlFor="description">Complaint Description</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              placeholder="Write your complaint here..."
              value={newComplaint.description}
              onChange={handleInputChange}
              required
              className={error ? "error-border" : ""}
            />

            <button 
              type="submit" 
              disabled={submittingComplaint || !newComplaint.description.trim()}
              className="submit-button"
            >
              {submittingComplaint ? "Submitting..." : "Submit Complaint"}
              <Send className="send-icon" size={18} />
            </button>
          </form>

          {successMessage && (
          <button className="back-to-patient-button" onClick={handleBackClick}>
          Back to Patient
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaint;
