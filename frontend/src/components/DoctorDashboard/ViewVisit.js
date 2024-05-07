// ViewVisit.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/viewVisit.css";
import axios from "axios";

const ViewVisit = () => {
  const navigate = useNavigate();

  const getTimeAgo = (creationTime) => {
    const currentTime = new Date();
    const notificationTime = new Date(creationTime);

    const timeDifference = currentTime.getTime() - notificationTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(
      currentTime.getMonth() -
        notificationTime.getMonth() +
        12 * (currentTime.getFullYear() - notificationTime.getFullYear())
    );
    const years = Math.floor(
      currentTime.getFullYear() - notificationTime.getFullYear()
    );

    if (years > 0) {
      return `${years} year${years === 1 ? "" : "s"} ago`;
    } else if (months > 0) {
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else {
      return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const dummyVisits = [
    {
      id: 1,
      patientName: "Vicky Panchal",
      priscription:
        "Avoid exposure to allergens, Use a saline nasal spray as needed for nasal congestion relief, Drink plenty of fluids, Follow up in 2 weeks for re-evaluation if symptoms persist.",
      dosage:
        "Antibiotic: Amoxicillin 500mg Take 1 capsule by mouth every 8 hours for 10 days. Decongestant: Pseudoephedrine 30mg Take 1 tablet by mouth every 6 hours as needed for nasal congestion.",
      diagnosis: "Acute Sinusitis",
      date: "05-04-2024",
      documentLink: "https://www.example.com/document1",
    },
    {
      id: 2,
      patientName: "Sara Johnson",
      priscription:
        "Rest, Apply ice packs to reduce swelling, Take over-the-counter pain relievers as needed.",
      dosage:
        "Acetaminophen 500mg: Take 1 tablet by mouth every 6 hours as needed for pain relief.",
      diagnosis: "Sprained Ankle",
      date: "06-15-2024",
      documentLink: "https://www.example.com/document2",
    },
    {
      id: 3,
      patientName: "Michael Smith",
      priscription:
        "Keep the wound clean and dry, Change dressings as needed, Avoid strenuous activities.",
      dosage: "None",
      diagnosis: "Minor Cut",
      date: "07-02-2024",
      documentLink: "https://www.example.com/document3",
    }
  ];

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFilterDate(today);
  });

  const handleFilterSearch = async () => {
    //code here.
  };

  return (
    <div className="view-visit-container">
      <div className="view-visit-filter-slots">
        <label>Date : </label>
        <input
          className="view-visit-filter-date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          required
        />
        <div className="view-visit-filter-button">
          <button
            type="submit"
            className="view-visit-filter-search"
            onClick={handleFilterSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="view-visit-list">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            {Array.isArray(dummyVisits) && dummyVisits.length > 0 ? (
              dummyVisits.map((item) => (
                <div key={item.id} className="view-visit-grid">
                  <div className="view-visit-item">
                    <p>
                      <strong>Patient Name : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{item.patientName}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Prescription : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{item.priscription}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Dosage Instruction : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{item.dosage}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Diagnosis : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{item.diagnosis}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <strong>Date : </strong>
                    </p>
                  </div>

                  <div className="view-visit-item">
                    <p>{item.date}</p>
                  </div>

                  <div className="view-visit-item">
                    <p>
                      <a
                        href={item.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No visits available for this date.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewVisit;
