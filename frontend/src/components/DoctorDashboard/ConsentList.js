// ConsentList.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/consentList.css";
import Navbar from "../navbar";
import axios from "axios";

const ConsentList = () => {
  const navigate = useNavigate();

  // State to store the list of consents
  const [consents, setConsents] = useState([]);

  // Dummy data for consents
  // const dummyConsents = [
  //   {
  //     id: 1,
  //     name: "Parag Dutt Sharma",
  //     abhaId: "ABHA123",
  //     requestStatus: "Pending",
  //     creationDate: "2022-02-01",
  //     grantingDate: "2022-02-10",
  //     expirationDate: "2022-03-01",
  //   },
  //   {
  //     id: 2,
  //     name: "Adarsh Tripathi",
  //     abhaId: "ABHA456",
  //     requestStatus: "Approved",
  //     creationDate: "2022-02-05",
  //     grantingDate: "2022-02-15",
  //     expirationDate: "2022-03-05",
  //   },
  // ];


  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    const fetchConsents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/v1/consent/getConsentRequests",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setConsents(response.data); // Assuming response.data is an array of consents
      } catch (error) {
        console.error("Error fetching consents:", error);
      }
    };

    if (accessToken) {
      fetchConsents();
    }
  }, []);

  return (
    <div className="consentlist-container">
      <button className="request-button" onClick={() => {navigate("/ConsentRequestForm");}}>Create Consent Request</button>
      <div className="consent-list">
        <h2>Consent List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>ABHA ID</th>
              <th>Request Status</th>
              <th>Creation Date</th>
              <th>Grant Date</th>
              <th>Expiration Date</th>
            </tr>
          </thead>
          <tbody>
            {consents.map((consent) => (
              <tr key={consent.consentId}>
                <td>{consent.consentId}</td>
                <td>{consent.patientName}</td>
                <td>{consent.abhaId}</td>
                <td>{consent.consentStatus}</td>
                <td>{consent.consentCreationDate.substring(0, 10)}</td>
                <td>{consent.consentGrantDate ? consent.consentGrantDate.substring(0, 10) : "-"}</td>
                <td>{consent.consentExpiryDate.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsentList;
