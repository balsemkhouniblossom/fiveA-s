import React, { useState, useEffect } from "react";
import axios from "axios";

export const DoctorFilter = (props) => {
  

  const [doctors,setDoctor]=useState([])
  const [loading,setLoading]=useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    fetchDoctors();
  },[]);

  const fetchDoctors = async () =>{
      setLoading(true);
      try{
        const medecins = await axios.get('http://localhost:3001/api/doctors')
        setDoctor(medecins.data)
      }
      catch(err){
      setError("Erreur lors du chargement des médecins");
      console.error("Erreur lors du chargement :", err);


      }
      setLoading(false);
      
  }

  return (
      <div className="container">
        <div className="section-title text-center">
          <h2>list des  Médecins</h2>
        </div>
        <div className="row">
        {doctors && doctors.length > 0 ? (
            doctors.map((doctor, i) => (
              <div key={`${doctor.name}-${i}`} className="col-md-4">
                <div className="testimonial">
                  <div className="testimonial-image">
                  <img src="/images/doctor.png" alt={doctor.name} />
                  </div>
                  <div className="testimonial-content">
                    <h4>{doctor.name} {doctor.lastName}</h4>
                    <p>Spécialité: <strong>{doctor.specialty}</strong></p>
                    <p>Email: {doctor.email}</p>
                    <p>Téléphone: {doctor.phone}</p>
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
}

