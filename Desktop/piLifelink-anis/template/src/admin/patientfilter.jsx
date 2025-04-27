import axios from "axios"
import { useEffect, useState } from "react"

export const Patinetfilter =  ()=>{
    const [patients,setPatients]=useState()
    const [loading,setLoading]=useState(false)

    useEffect(()=>{
        fetchPatients();
    },[])

    const fetchPatients= async ()=>{
        try {
            const Patients = await axios.get('http://localhost:3001/api/patients')
            setPatients(Patients.data)
            
        } catch (err) {
            console.log(err)
        }
    }
    return(
      <>
        <div className="container">
        <div className="section-title text-center">
          <h2>liste Patients</h2>
        </div>
        <div className="row">
        {patients && patients.length > 0 ? (
            patients.map((patient, i) => (
              <div key={`${patient.name}-${i}`} className="col-md-4">
                <div className="testimonial">
                  <div className="testimonial-image">
                  <img src="/images/patient.png" alt={patient.name} />
                  </div>
                  <div className="testimonial-content">
                    <h4>{patient.name} {patient.lastName}</h4>
                    <p>Email: {patient.email}</p>
                    <p>TestResults: <strong>{patient.testResults}</strong></p>
                    <p>MedicalHistory: <strong>{patient.medicalHistory}</strong></p>
                    <p>Téléphone: {patient.phone}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Aucun médecin trouvé.</p>
          )}
        </div>
      </div>
      </>
    )
}