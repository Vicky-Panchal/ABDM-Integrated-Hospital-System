import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styles/DoctorDashboard/viewVisit.css";

const ViewVisit = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true);
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const token = loggedInUser.access_token;
        const response = await axios.get(
          "http://localhost:8081/api/v1/visit/get-visits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setVisits(response.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchVisits();
  }, []);

  return (
    <div className="view-visit-container">
      <div className="view-visit-list">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            {visits.length > 0 ? (
              visits.map((visit) => (
                <div key={visit.visitId} className="view-visit-grid">
                  <div className="view-visit-item">
                    <p>
                      <strong>Patient Name : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{visit.patientName}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Prescription : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{visit.prescription}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Dosage Instruction : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{visit.dosageInstruction}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Diagnosis : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{visit.diagnosis}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Date : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{visit.visitDate}</p>
                  </div>

                  {visits.healthRecord && ( // Render only if healthRecord is not null
                    <div className="view-visit-item">
                      <p>
                        <a
                          href={visit.healthRecord}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No visits available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewVisit;
