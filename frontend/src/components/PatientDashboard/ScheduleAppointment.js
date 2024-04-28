//ScheduleAppointment.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/PatientDashboard/scheduleAppointment.css";
import Navbar from "../navbar";

const DummySlotListScheduled = [
  //will contain all the scheduled appointments only
  {
    id: 1,
    status: "Scheduled",
    date: "20-05-2024",
    from: "09:30 AM",
    to: "10:00 AM",
    purpose: "Checkup",
    patientName: "Parag",
    patientPic: "logo192.png",
  },
  {
    id: 3,
    status: "Scheduled",
    date: "22-05-2024",
    from: "09:30 AM",
    to: "10:00 AM",
    purpose: "Checkup",
    patientName: "Adarsh",
    patientPic: "logo192.png",
  },
];

const DummySlotList = [
  //will contain all the appointments except scheduled (i.e. Completed or Canceled)
  {
    id: 2,
    status: "Canceled",
    date: "21-05-2024",
    from: "09:30 AM",
    to: "10:00 AM",
    purpose: "Checkup",
    patientName: "Vicky",
    patientPic: "logo192.png",
  },
  {
    id: 4,
    status: "Completed",
    date: "22-05-2024",
    from: "09:30 AM",
    to: "10:00 AM",
    purpose: "Checkup",
    patientName: "Vicky",
    patientPic: "logo192.png",
  },
  // Add more containers as needed
];

const AddSlotPopup = ({ onClose }) => {
  const [addDate, setAddDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setAddDate(today);
  }, []);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setCurrentTime(`${hours}:${minutes}`);
  }, []);

  const [doctorValue, setDoctorValue] = useState("");

  const handleDoctorChange = (event) => {
    setDoctorValue(event.target.value);
  };

  const dummyDoctorName = [
    {
      id: 1,
      name: "Keshav",
      profilePic: "logo192.png",
    },
    {
      id: 2,
      name: "Chintu",
      profilePic: "logo192.png",
    }
  ];

  const [purpose, setPurpose] = useState("");

  const handlePurposeChange = (event) => {
    setPurpose(event.target.value);
  };

  const dummyPurpose = [
    {
      id: 1,
      value: "Checkup"
    },
    {
      id: 2,
      value: "Lab Test"
    }
  ];

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Schedule Appointment</h2>
        <div className="popup-date-time">
          <label>Doctor Name : </label>
          <select
            className="dropdown-select"
            value={doctorValue}
            onChange={handleDoctorChange}
          >
            {dummyDoctorName.map((doctor) => (
              <option value={doctor.name}>{doctor.name}</option>
            ))}
          </select>
        </div>
        <div className="popup-date-time">
          <label>Purpose : </label>
          <select
            className="dropdown-select"
            value={purpose}
            onChange={handlePurposeChange}
          >
            {dummyPurpose.map((purpose) => (
              <option value={purpose.value}>{purpose.value}</option>
            ))}
          </select>
        </div>
        <div className="popup-date-time">
          <label>Date : </label>
          <input
            className="filter-date"
            type="date"
            value={addDate}
            onChange={(e) => setAddDate(e.target.value)}
            required
          />
        </div>
        <div className="popup-date-time">
          <label for="timeInput">From : </label>
          <input
            type="time"
            id="timeInput"
            name="timeInput"
            defaultValue={currentTime}
            required
          />
        </div>
        <div className="popup-date-time">
          <label for="timeInput">To : </label>
          <input
            type="time"
            id="timeInput"
            name="timeInput"
            defaultValue={currentTime}
            required
          />
        </div>

        <button className="close-button" onClick={onClose}>
          Schedule
        </button>
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const DeleteSlotPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Confirmation</h2>
        <p>Are you sure you want to cancel this slot?</p>
        {/* Add Deny Consent confirmation message and buttons here */}
        <button className="close-button" onClick={onClose}>
          Yes
        </button>
        <button className="close-button" onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
};

const ScheduleAppointment = () => {
  const navigate = useNavigate();

  const [showDeleteSlotPopup, setShowDeleteSlotPopup] = useState(false);

  const handleCancelSlot = (id) => {
    setShowDeleteSlotPopup(true);
  };

  const [showAddSlotPopup, setShowAddSlotPopup] = useState(false);

  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFilterSearch = (event) => {
    // Call API and get the detail for corresponding appointments and slots.
  };

  const [showDetails, setShowDetails] = useState({});

  const toggleDetails = (id) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="appointment-container">
      <div className="scheduled-container">
        {DummySlotListScheduled.map((item) => (
          <div key={item.id} className="scheduled-item">
            {!showDetails[item.id] && (
              <div className="short-list-item">
                <div className="slot-col">
                  <div className="slot-info">
                    <p>
                      <strong>Status : </strong>
                      {item.status}
                    </p>
                    <p>
                      <strong>Date : </strong>
                      {item.date}
                    </p>
                  </div>
                  <div className="slot-time">
                    <p>
                      <strong>From : </strong>
                      {item.from}
                    </p>
                    <p>
                      <strong>To : </strong>
                      {item.to}
                    </p>
                  </div>
                </div>
                <div className="delete-slot">
                  <button onClick={() => handleCancelSlot(item.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showDetails[item.id] && (
              <div className="detail-list-item">
                <div className="doctor-info">
                  <div className="image">
                    <img alt="ProfilePic" src={item.patientPic}></img>
                  </div>
                  <div className="info>">
                    <p>
                      <strong>Doctor Name : </strong>
                      {item.patientName}
                    </p>
                    <p>
                      <strong>Purpose of Appointment : </strong>
                      {item.purpose}
                    </p>
                  </div>
                </div>
                <div className="slot-info">
                  <p>
                    <strong>Status : </strong>
                    {item.status}
                  </p>
                  <p>
                    <strong>Date : </strong>
                    {item.date}
                  </p>
                </div>
                <div className="slot-time">
                  <p>
                    <strong>From : </strong>
                    {item.from}
                  </p>
                  <p>
                    <strong>To : </strong>
                    {item.to}
                  </p>
                </div>
                <div className="delete-slot">
                  <button onClick={() => handleCancelSlot(item.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <p className="show-hide" onClick={() => toggleDetails(item.id)}>
              {showDetails[item.id] ? "Hide Details" : "Show More"}
            </p>
          </div>
        ))}
        <div>
          <button
            className="add-slot-btn"
            onClick={() => setShowAddSlotPopup(true)}
          >
            Schedule Appointment
          </button>
        </div>
      </div>

      <hr />

      <div className="filter-slots">
        <div className="dropdown-container">
          <label>Filter : </label>
          <select
            className="dropdown-select"
            value={filterValue}
            onChange={handleFilterChange}
          >
            <option value="all">Completed or Canceled appointments</option>
            <option value="completed">Completed appointments</option>
            <option value="canceled">Canceled appointments</option>
          </select>
        </div>
        <div className="filter-button">
          <button
            type="submit"
            className="filter-search"
            onClick={handleFilterSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="slot-list">
        {DummySlotList.map((item) => (
          <div key={item.id} className="slot-item">
            {!showDetails[item.id] && (
              <div className="short-list-item">
                <div className="slot-col">
                  <div className="slot-info">
                    <p>
                      <strong>Status : </strong>
                      {item.status}
                    </p>
                    <p>
                      <strong>Date : </strong>
                      {item.date}
                    </p>
                  </div>
                  <div className="slot-time">
                    <p>
                      <strong>From : </strong>
                      {item.from}
                    </p>
                    <p>
                      <strong>To : </strong>
                      {item.to}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {showDetails[item.id] && (
              <div className="detail-list-item">
                <div className="doctor-info">
                  <div className="image">
                    <img alt="ProfilePic" src={item.patientPic}></img>
                  </div>
                  <div className="info>">
                    <p>
                      <strong>Doctor Name : </strong>
                      {item.patientName}
                    </p>
                    <p>
                      <strong>Purpose of Appointment : </strong>
                      {item.purpose}
                    </p>
                  </div>
                </div>
                <div className="slot-info">
                  <p>
                    <strong>Status : </strong>
                    {item.status}
                  </p>
                  <p>
                    <strong>Date : </strong>
                    {item.date}
                  </p>
                </div>
                <div className="slot-time">
                  <p>
                    <strong>From : </strong>
                    {item.from}
                  </p>
                  <p>
                    <strong>To : </strong>
                    {item.to}
                  </p>
                </div>
              </div>
            )}

            <p className="show-hide" onClick={() => toggleDetails(item.id)}>
              {showDetails[item.id] ? "Hide Details" : "Show More"}
            </p>
          </div>
        ))}
      </div>

      {showDeleteSlotPopup && (
        <DeleteSlotPopup onClose={() => setShowDeleteSlotPopup(false)} />
      )}
      {showAddSlotPopup && (
        <AddSlotPopup onClose={() => setShowAddSlotPopup(false)} />
      )}
    </div>
  );
};

export default ScheduleAppointment;
