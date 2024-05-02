// ConsentList.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/consentList.css";
import Navbar from "../navbar";

const ConsentList = () => {
  const navigate = useNavigate();

  // Dummy data for consents
  const dummyConsents = [
    {
      id: 1,
      name: "Parag Dutt Sharma",
      abhaId: "ABHA123",
      requestStatus: "Pending",
      creationDate: "2022-02-01",
      grantingDate: "2022-02-10",
      expirationDate: "2022-03-01",
    },
    {
      id: 2,
      name: "Adarsh Tripathi",
      abhaId: "ABHA456",
      requestStatus: "Approved",
      creationDate: "2022-02-05",
      grantingDate: "2022-02-15",
      expirationDate: "2022-03-05",
    },
  ];

  // State to store the list of consents
  const [consents, setConsents] = useState([]);

  // useEffect hook to set dummy data when the component mounts
  useEffect(() => {
    setConsents(dummyConsents);
  }, []);

  return (
    <div>
      <Navbar />
      <button className="request-button" onClick={() => {navigate("/ConsentRequestForm");}}>Create Consent Request</button>
      <div className="consentlist-container">
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
              <tr key={consent.id}>
                <td>{consent.id}</td>
                <td>{consent.name}</td>
                <td>{consent.abhaId}</td>
                <td>{consent.requestStatus}</td>
                <td>{consent.creationDate}</td>
                <td>{consent.grantingDate}</td>
                <td>{consent.expirationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsentList;
