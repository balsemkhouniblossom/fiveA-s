import React, { useEffect, useState } from "react";
import axios from "axios";

const Materiel = () => {
    const [materials, setMaterials] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingMaterialId, setEditingMaterialId] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await axios.get('http://localhost:3001/materials');
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingMaterialId) {
            await axios.put(`http://localhost:3001/materials/${editingMaterialId}`, { name, quantity });
        } else {
            await axios.post('http://localhost:3001/materials', { name, quantity });
        }
        setName('');
        setQuantity('');
        setEditingMaterialId(null);
        fetchMaterials();
    };

    const handleEdit = (material) => {
        setName(material.name);
        setQuantity(material.quantity);
        setEditingMaterialId(material._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:3001/materials/${id}`);
        fetchMaterials();
    };

    return (
        <div className="container">
            <div className="section-title text-center">
                <h2>Gestion du Matériel</h2>
            </div>
            <form className="material-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="material-input"
                    placeholder="Nom du matériel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    className="material-input"
                    placeholder="Quantité"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <button type="submit" className="submit-button">
                    {editingMaterialId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <br></br>
            <br></br>
            </form>
            
            <div className="row">
                {materials.map((material) => (
                    <div key={material._id} className="col-md-4">
                        <div className="material-card">
                            <h4>{material.name}</h4>
                            <p>Quantité: <strong>{material.quantity}</strong></p>
                            <div className="card-actions">
                                <button className="submit-button" onClick={() => handleEdit(material)}>Éditer</button>
                                <button className="delete-button" onClick={() => handleDelete(material._id)}><span className="material-icons">delete</span> {/* Icone Material */}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Materiel;