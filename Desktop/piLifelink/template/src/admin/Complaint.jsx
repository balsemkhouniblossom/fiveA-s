import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Complaint.css';

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/complaints');
      setComplaints(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (complaintId, newStatus, patientId) => {
    try {
      await axios.put(`http://localhost:3001/api/complaints/${complaintId}/status`, {
        status: newStatus,
        patientId: patientId // Pass patientId to notify the right user
      });
      
      setComplaints(complaints.map(complaint => 
        complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
      ));
      
      // Show success message
   
      
    } catch (err) {
      console.error('Error updating complaint status:', err);
     
    }
  };
  
  const filteredComplaints = selectedStatus === 'all' 
    ? complaints 
    : complaints.filter(complaint => complaint.status === selectedStatus);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#e74c3c';
      case 'In Treatment': return '#f39c12';
      case 'Resolved': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="complaints-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="complaints-header">
        <h2>Patient Complaints Management</h2>
        <button 
          className="refresh-button"
          onClick={fetchComplaints}
        >
          Refresh
        </button>
      </div>
      
      <div className="complaints-filters">
        <label>Filter by status:</label>
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Complaints</option>
          <option value="Pending">Pending</option>
          <option value="In Treatment">In Treatment</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
      
      {loading ? (
        <div className="loading">Loading complaints...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="no-complaints">No complaints found.</div>
      ) : (
        <div className="complaints-list">
          {filteredComplaints.map(complaint => (
            <div key={complaint._id} className="complaint-card">
              <div className="complaint-header">
                <h4>Complaint #{complaint._id.substring(0, 8)}</h4>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(complaint.status) }}
                >
                  {complaint.status}
                </div>
              </div>
              
              <div className="complaint-body">
                <p><strong>Date:</strong> {new Date(complaint.date).toLocaleString()}</p>
                <p><strong>Patient ID:</strong> {complaint.patientId}</p>
                <p><strong>Description:</strong></p>
                <div className="complaint-description">{complaint.description}</div>
              </div>
              
              <div className="complaint-actions">
                <label>Update Status:</label>
                <select 
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint._id, e.target.value, complaint.patientId)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Treatment">In Treatment</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaint;