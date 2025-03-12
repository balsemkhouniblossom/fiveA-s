import React, { useEffect, useState } from "react";
import "./user.css"; 

export const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users");
        if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erreur de récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour du rôle");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json(); // 📌 Récupérer la réponse JSON

      if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert(result.message); // ✅ Afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert(`Erreur : ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center">Liste des Utilisateurs</h2>
      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="user-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <h3>{user.name} {user.lastName}</h3>
              <p className="user-info">Email: {user.email}</p>
              <p className="user-info">Âge: {user.age}</p>
              <p className="user-info">Genre: {user.gender}</p>
              <p className="user-info">Téléphone: {user.phone}</p>
              <p className="user-info">Rôle Actuel : {user.role}</p>

              <div className="role-selection">
                <label>Rôle</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="role-select"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="PATIENT">Patient</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>

              <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>
                <span className="material-icons">delete</span> {/* Material Icon */}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
