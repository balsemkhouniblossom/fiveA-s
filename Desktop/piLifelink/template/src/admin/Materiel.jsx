import React, { useState, useEffect } from 'react';
import './Materiel.css'; // Assurez-vous que le fichier CSS amélioré est bien importé

const MaterielManager = () => {
  const [materials, setMaterials] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingMaterialId, setEditingMaterialId] = useState(null);

  // Exemple : simuler le chargement initial des données
  useEffect(() => {
    // Remplace par une requête réelle à une API si besoin
    const initialData = [
      { _id: '1', name: 'Projecteur', quantity: 5 },
      { _id: '2', name: 'Ordinateur', quantity: 10 }
    ];
    setMaterials(initialData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingMaterialId) {
      // Modifier un matériel existant
      const updatedMaterials = materials.map((mat) =>
        mat._id === editingMaterialId ? { ...mat, name, quantity } : mat
      );
      setMaterials(updatedMaterials);
      setEditingMaterialId(null);
    } else {
      // Ajouter un nouveau matériel
      const newMaterial = {
        _id: Date.now().toString(),
        name,
        quantity
      };
      setMaterials([...materials, newMaterial]);
    }

    // Réinitialiser le formulaire
    setName('');
    setQuantity('');
  };

  const handleDelete = (id) => {
    const updated = materials.filter((mat) => mat._id !== id);
    setMaterials(updated);
  };

  const handleEdit = (material) => {
    setName(material.name);
    setQuantity(material.quantity);
    setEditingMaterialId(material._id);
  };

  return (
    <div className="materiel-container">
      <h2 className="materiel-section-title">Gestion du Matériel</h2>

      <form className="materiel-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="materiel-input"
          placeholder="Nom du matériel"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          className="materiel-input"
          placeholder="Quantité"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit" className="materiel-submit-button">
          {editingMaterialId ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </form>

      <div className="materiel-row">
        {materials.map((material) => (
          <div key={material._id} className="materiel-card">
            <h4>{material.name}</h4>
            <p>Quantité: <strong>{material.quantity}</strong></p>
            <div className="materiel-card-actions">
              <button className="materiel-edit-button" onClick={() => handleEdit(material)}>
                Éditer
              </button>
              <button className="materiel-delete-button" onClick={() => handleDelete(material._id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterielManager;
