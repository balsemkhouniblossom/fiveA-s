import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigation } from "./navigation";

export const Complaint = (props) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/complaints/${userId}`);
        setComplaints(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("Failed to load complaints. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchComplaints();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({
      ...newComplaint,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post("http://localhost:3001/api/complaints", {
        description: newComplaint.description,
        patientId: userId,
        date: new Date(), // Automatically set the current date
      });

      setNewComplaint({ description: "" });
      setSuccessMessage("Complaint submitted successfully!");

      const response = await axios.get(`http://localhost:3001/api/complaints/${userId}`);
      setComplaints(response.data);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setError("Failed to submit complaint. Please try again.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation />
      <div id="complaints" style={{ paddingTop: "120px", paddingBottom: "80px", background: "#f6f6f6" }}>
        <div className="container">
          <div className="section-title text-center">
            <h2 style={{ color: "#5CA9FB", fontWeight: "700", marginBottom: "30px", paddingBottom: "15px", position: "relative" }}>
              Patient Complaints
            </h2>
            <p style={{ fontSize: "16px", marginBottom: "30px", color: "#666" }}>
              Submit a new complaint or review your previous submissions
            </p>
          </div>

          {successMessage && (
            <div className="alert alert-success" style={{ maxWidth: "800px", margin: "0 auto 20px", borderLeft: "5px solid #2ecc71" }} role="alert">
              <i className="fa fa-check-circle" style={{ marginRight: "10px" }}></i>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" style={{ maxWidth: "800px", margin: "0 auto 20px", borderLeft: "5px solid #e74c3c" }} role="alert">
              <i className="fa fa-exclamation-circle" style={{ marginRight: "10px" }}></i>
              {error}
            </div>
          )}

          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="card" style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "40px", background: "#fff" }}>
                <div className="card-header" style={{ background: "linear-gradient(to right, #5CA9FB 0%, #6372ff 100%)", color: "white", padding: "15px 20px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", fontWeight: "600" }}>
                  <h4 style={{ margin: "0" }}>Submit a New Complaint</h4>
                </div>
                <div className="card-body" style={{ padding: "25px" }}>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="description" style={{ fontWeight: "600", color: "#333" }}>Complaint Description:</label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        rows="6"
                        placeholder="Please provide details about your complaint"
                        value={newComplaint.description}
                        onChange={handleInputChange}
                        style={{ padding: "10px 15px", borderRadius: "4px", border: "1px solid #ddd", marginBottom: "15px", minHeight: "150px" }}
                        required
                      />
                    </div>
                    <button type="submit" className="btn" style={{ background: "linear-gradient(to right, #5CA9FB 0%, #6372ff 100%)", color: "white", padding: "12px 30px", borderRadius: "25px", border: "none", fontWeight: "600", letterSpacing: "0.5px", transition: "all 0.3s ease" }}>
                      Submit Complaint
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <div className="card" style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", background: "#fff" }}>
                <div className="card-header" style={{ background: "linear-gradient(to right, #5CA9FB 0%, #6372ff 100%)", color: "white", padding: "15px 20px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", fontWeight: "600" }}>
                  <h4 style={{ margin: "0" }}>Your Previous Complaints</h4>
                </div>
                <div className="card-body" style={{ padding: "20px" }}>
                  {loading && 
                    <div className="text-center" style={{ padding: "20px" }}>
                      <i className="fa fa-spinner fa-spin" style={{ fontSize: "24px", marginBottom: "10px", color: "#5CA9FB" }}></i>
                      <p>Loading your complaints...</p>
                    </div>
                  }
                  {!loading && complaints.length === 0 && (
                    <div className="text-center" style={{ padding: "30px" }}>
                      <i className="fa fa-info-circle" style={{ fontSize: "48px", color: "#5CA9FB", marginBottom: "15px" }}></i>
                      <p style={{ fontSize: "16px", color: "#666" }}>You haven't submitted any complaints yet.</p>
                    </div>
                  )}
                  {!loading && complaints.length > 0 && (
                    <div className="table-responsive">
                      <table className="table" style={{ marginBottom: "0" }}>
                        <thead>
                          <tr style={{ background: "#f8f9fa" }}>
                            <th style={{ padding: "15px", borderBottom: "2px solid #dee2e6" }}>Date</th>
                            <th style={{ padding: "15px", borderBottom: "2px solid #dee2e6" }}>Description</th>
                            <th style={{ padding: "15px", borderBottom: "2px solid #dee2e6" }}>Status</th>
                            <th style={{ padding: "15px", borderBottom: "2px solid #dee2e6" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.map((complaint) => (
                            <tr key={complaint._id} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: "15px", verticalAlign: "middle" }}>
                                {complaint.date ? new Date(complaint.date).toLocaleDateString("en-US", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : "No date available"}
                              </td>
                              <td style={{ padding: "15px", verticalAlign: "middle" }}>
                                {complaint.description}
                              </td>
                              <td style={{ padding: "15px", verticalAlign: "middle" }}>
                                <span style={{
                                  display: "inline-block",
                                  padding: "6px 12px",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  color: "white",
                                  background: complaint.status === "Resolved" ? "#2ecc71" : 
                                              complaint.status === "In Treatment" ? "#2ecc71" : "#3498db" // Blue for Pending
                                }}>
                                  {complaint.status === "Resolved" ? "In Treatment" : 
                                   complaint.status === "Pending" ? "Still Pending" : complaint.status}
                                </span>
                              </td>
                              <td style={{ padding: "15px", verticalAlign: "middle" }}>
                                <button 
                                  className="btn btn-sm"
                                  onClick={() => navigate(`/complaint-details/${complaint._id}`)}
                                  style={{
                                    background: "#5CA9FB",
                                    color: "white",
                                    padding: "8px 15px",
                                    borderRadius: "4px",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
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
