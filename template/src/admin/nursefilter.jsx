import axios from "axios";
import React, { useEffect, useState } from "react";

export const FilterNurse = () => {
  const [nurses,setNurses]=useState([])
  const [loading,setLoading]= useState(false);

  useEffect(()=>{
    fetchNurses();
  },[]);

  const fetchNurses = async ()=>{
    try {
      const Nurses = await axios.get('http://localhost:3001/api/nurses')
      setNurses(Nurses.data)
      
    } catch (err) {
      console.log("Erreur lors du chargement :",err);
    }
    setLoading(false);
  }
 

  return (
    <div className="container">
    <div className="section-title text-center">
      <h2>liste Nurses</h2>
    </div>
    <div className="row">
    {nurses && nurses.length > 0 ? (
        nurses.map((nurse, i) => (
          <div key={`${nurse.name}-${i}`} className="col-md-4">
            <div className="testimonial">
              <div className="testimonial-image">
              <img src="/images/infirmiere.png" alt={nurse.name} />
              </div>
              <div className="testimonial-content">
                <h4>{nurse.name} {nurse.lastName}</h4>
                <p>Bloc: <strong>{nurse.bloc}</strong></p>
                <p>Email: {nurse.email}</p>
                <p>Téléphone: {nurse.phone}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">Aucun médecin trouvé.</p>
      )}
    </div>
  </div>
  );
};
