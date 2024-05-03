// ViewAllPatients.js
import React, { useState } from "react";
import "../../Styles/AdminDashboard/viewAllPatients.css";

const ViewAllPatients = () => {
  const DummySlotList = [
    {
      patientId: 1,
      firstName: "PARAG",
      middleName: "DUTT",
      lastName: "SHARMA",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      email: "parag0501@gmail.com",
      profile: "logo192.png",
    },
    {
      patientId: 2,
      firstName: "VICKY",
      middleName: "",
      lastName: "PANCHAL",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      email: "vicky3000@gmail.com",
      profile: "logo192.png",
    },
    {
        patientId: 3,
        firstName: "PARAG",
        middleName: "DUTT",
        lastName: "SHARMA",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "parag0501@gmail.com",
        profile: "logo192.png",
      },
      {
        patientId: 4,
        firstName: "VICKY",
        middleName: "",
        lastName: "PANCHAL",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "vicky3000@gmail.com",
        profile: "logo192.png",
      },
      {
        patientId: 5,
        firstName: "PARAG",
        middleName: "DUTT",
        lastName: "SHARMA",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "parag0501@gmail.com",
        profile: "logo192.png",
      },
      {
        patientId: 6,
        firstName: "VICKY",
        middleName: "",
        lastName: "PANCHAL",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "vicky3000@gmail.com",
        profile: "logo192.png",
      },
      {
        patientId: 7,
        firstName: "PARAG",
        middleName: "DUTT",
        lastName: "SHARMA",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "parag0501@gmail.com",
        profile: "logo192.png",
      },
      {
        patientId: 8,
        firstName: "VICKY",
        middleName: "",
        lastName: "PANCHAL",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "vicky3000@gmail.com",
        profile: "logo192.png",
      },
      {
        patientId: 9,
        firstName: "PARAG",
        middleName: "DUTT",
        lastName: "SHARMA",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "parag0501@gmail.com",
        profile: "logo192.png",
      },
      {
        patientId: 10,
        firstName: "VICKY",
        middleName: "",
        lastName: "PANCHAL",
        gender: "Male",
        dob: "2023-12-12T00:00:00.000+00:00",
        email: "vicky3000@gmail.com",
        profile: "logo192.png",
      },
  ];

  const formattedDate = (date) => {
    date = new Date(date);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const [showDetails, setShowDetails] = useState({});

  const toggleDetails = (patientId) => {
    setShowDetails((prevState) => ({
      //   ...prevState,
      //   [patientId]: !prevState[patientId],
      ...Object.fromEntries(
        DummySlotList.map((item) => [
          item.patientId,
          item.patientId === patientId ? !prevState[patientId] : false,
        ])
      ),
    }));
  };

  return (
      <div className="patient-list">
        {DummySlotList.map((item) => (
          <div key={item.patientId} className={`patient-item ${showDetails[item.patientId] ? 'detail-shown' : 'detail-hidden'}`}>
            {!showDetails[item.patientId] && (
              <div className="short-patient-item">
                <div className="patient-info">
                  <p>
                    {item.firstName} {item.middleName} {item.lastName}
                  </p>
                </div>
                <div className="patient-mail">
                  <p>{item.email}</p>
                </div>
                <div>
                  <p
                    className="patient-show-hide"
                    onClick={() => toggleDetails(item.patientId)}
                  >
                    {showDetails[item.patientId] ? "Hide Details" : "Show More"}
                  </p>
                </div>
              </div>
            )}

            {showDetails[item.patientId] && (
              <div className="detail-patient-item">
                <div className="patient-detail-info">
                  <div className="patient-image">
                    <img alt="ProfilePic" src={item.profile}></img>
                  </div>
                  <div className="name-mail-info">
                    <p>
                      <strong>Patient Name : </strong>
                      {item.firstName} {item.middleName} {item.lastName}
                    </p>
                    <p>
                      <strong>Email ID : </strong>
                      {item.email}
                    </p>
                  </div>
                </div>
                <div className="patient-gender-dob">
                  <p>
                    <strong>Gender : </strong>
                    {item.gender}
                  </p>
                  <p>
                    <strong>DOB : </strong>
                    {formattedDate(item.dob)}
                  </p>
                </div>
                <p
                  className="patient-show-hide"
                  onClick={() => toggleDetails(item.patientId)}
                >
                  {showDetails[item.patientId] ? "Hide Details" : "Show More"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
  );
};

export default ViewAllPatients;
