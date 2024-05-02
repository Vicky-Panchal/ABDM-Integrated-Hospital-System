// ViewAllDoctors.js

import React, { useState } from "react";
import "../../Styles/AdminDashboard/viewAllDoctors.css";

const ViewAllDoctors = () => {
  const DummySlotList = [
    {
      doctorId: "1",
      firstName: "Adarsh",
      middleName: "Ramesh",
      lastName: "Tripathi",
      profile: "logo192.png",
      email: "adarsh@gmail.com",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      specialization: "Orthopedics",
      qualification: "MBBS, MS",
      hospitalName: "City Hospital, 123 Main Street, Kolkata, West Bengal, 700001",
    },
    {
      doctorId: "2",
      firstName: "Swarnim",
      middleName: "Ramesh",
      lastName: "Kukreti",
      profile: "logo192.png",
      email: "swarnim@gmail.com",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      specialization: "Cardiology",
      qualification: "MD",
      hospitalName: "Sunrise Hospital, 456 Park Avenue, Mumbai, Maharashtra, 400001",
    },
    {
      doctorId: "3",
      firstName: "Vicky",
      middleName: "Dutt",
      lastName: "Panchal",
      profile: "logo192.png",
      email: "vmp@gmail.com",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      specialization: "Pediatrics",
      qualification: "MBBS, DCH",
      hospitalName: "Rainbow Clinic, 789 MG Road, Bangalore, Karnataka, 560001",
    },
    {
      doctorId: "4",
      firstName: "Keshav",
      middleName: "Dutt",
      lastName: "Agarwal",
      profile: "logo192.png",
      email: "keshav@gmail.com",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      specialization: "Dermatology",
      qualification: "MD, DDVL",
      hospitalName: "Global Medical Center, 321 Gandhi Nagar, New Delhi, Delhi, 110001",
    },
    {
      doctorId: "5",
      firstName: "Parag",
      middleName: "Dutt",
      lastName: "Sharma",
      profile: "logo192.png",
      email: "parag@gmail.com",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      specialization: "Neurology",
      qualification: "DM",
      hospitalName: "Evergreen Hospital, 654 Rajaji Street, Chennai, Tamil Nadu, 600001",
    },
    {
      doctorId: "6",
      firstName: "Parag",
      middleName: "Dutt",
      lastName: "Sharma",
      profile: "logo192.png",
      email: "paragdutt@gmail.com",
      gender: "Male",
      dob: "2023-12-12T00:00:00.000+00:00",
      specialization: "Gynecology",
      qualification: "MBBS, DGO",
      hospitalName: "Lotus Medical Center, 987 MG Road, Hyderabad, Telangana, 500001",
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

  const toggleDetails = (doctorId) => {
    setShowDetails((prevState) => ({
      //   ...prevState,
      //   [patientId]: !prevState[patientId],
      ...Object.fromEntries(
        DummySlotList.map((item) => [
          item.doctorId,
          item.doctorId === doctorId ? !prevState[doctorId] : false,
        ])
      ),
    }));
  };

  return (
    <div className="doctor-list">
      {DummySlotList.map((item) => (
        <div
          key={item.doctorId}
          className={`doctor-item ${
            showDetails[item.doctorId] ? "detail-shown" : "detail-hidden"
          }`}
        >
          {!showDetails[item.doctorId] && (
            <div className="short-doctor-item">
              <div className="doctor-info">
                <p>
                  {item.firstName} {item.middleName} {item.lastName}
                </p>
              </div>
              <div className="doctor-mail">
                <p>{item.email}</p>
              </div>
              <div>
                <p
                  className="doctor-show-hide"
                  onClick={() => toggleDetails(item.doctorId)}
                >
                  {showDetails[item.doctorId] ? "Hide Details" : "Show More"}
                </p>
              </div>
            </div>
          )}

          {showDetails[item.doctorId] && (
            <div className="detail-doctor-item">
              <div className="doctor-detail-info">
                <div className="doctor-image">
                  <img alt="ProfilePic" src={item.profile}></img>
                </div>
                <div className="main-info">
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
              <div className="doctor-content">
                <p>
                  <strong>Gender : </strong>
                  {item.gender}
                </p>
                <p>
                  <strong>DOB : </strong>
                  {formattedDate(item.dob)}
                </p>
              </div>

              <div className="doctor-content">
                <p>
                  <strong>Qualification : </strong>
                  {item.qualification}
                </p>
                <p>
                  <strong>Specialization : </strong>
                  {item.specialization}
                </p>
              </div>

              <div className="doctor-content">
                <p>
                  <strong>Hospital : </strong>
                  {item.hospitalName}
                </p>
              </div>

              <p
                className="doctor-show-hide"
                onClick={() => toggleDetails(item.doctorId)}
              >
                {showDetails[item.doctorId] ? "Hide Details" : "Show More"}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewAllDoctors;
