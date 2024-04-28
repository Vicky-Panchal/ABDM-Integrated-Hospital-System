// Appointment.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/appointment.css";
import Navbar from "../navbar";

const DummySlotList = [
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
    id: 3,
    status: "Scheduled",
    date: "22-05-2024",
    from: "09:30 AM",
    to: "10:00 AM",
    purpose: "Checkup",
    patientName: "Adarsh",
    patientPic: "logo192.png",
  },
  {
    id: 4,
    status: "Available",
    date: "22-05-2024",
    from: "09:30 AM",
    to: "10:00 AM",
    purpose: "N/A",
    patientName: "N/A",
    patientPic: "N/A",
  }
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

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Add Slot</h2>
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
          Add
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

const Appointment = () => {
  const navigate = useNavigate();

  const [showDeleteSlotPopup, setShowDeleteSlotPopup] = useState(false);

  const handleCancelSlot = (id) => {
    setShowDeleteSlotPopup(true);
  };

  const [showAddSlotPopup, setShowAddSlotPopup] = useState(false);

  // Dummy data for slots
  const dummySlots = [
    {
      id: 1,
      date: "2024-05-01",
      from: "08:00 AM",
      to: "01:00 PM",
    },
    {
      id: 2,
      date: "2024-05-01",
      from: "02:00 PM",
      to: "07:00 PM",
    },
  ];

  // State to store the list of consents
  const [slots, setSlots] = useState([]);

  // useEffect hook to set dummy data when the component mounts
  useEffect(() => {
    setSlots(dummySlots);
  }, []);

  const [filterValue, setFilterValue] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFilterDate(today);
  }, []);

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
    <div>
      <Navbar />
    <div className="appointment-container">
      <div className="slotlist-container">
        <div className="slot-list-heading">
          <div>
            <h2>Slots List</h2>
          </div>
          <div>
            <button
              className="add-slot-btn"
              onClick={() => setShowAddSlotPopup(true)}
            >
              Add Slot
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.from}</td>
                <td>{slot.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="filter-slots">
        <div className="dropdown-container">
          <label>Filter : </label>
          <select
            className="dropdown-select"
            value={filterValue}
            onChange={handleFilterChange}
          >
            <option value="all">All slots and appointments</option>
            <option value="scheduled">Scheduled appointments</option>
            <option value="completed">Completed appointments</option>
            <option value="canceled">Canceled appointments</option>
            <option value="available">Available slots</option>
          </select>
        </div>
        <div>
          <label>Date : </label>
          <input
            className="filter-date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            required
          />
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
                {(item.status === "Scheduled" || item.status === "Available") && (
                  <div className="delete-slot">
                    <button onClick={() => handleCancelSlot(item.id)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {showDetails[item.id] && (
              <div className="detail-list-item">
                <div className="patient-info">
                  <div className="image">
                    <img alt="ProfilePic" src={item.patientPic}></img>
                  </div>
                  <div className="info>">
                    <p>
                      <strong>Patient Name : </strong>
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
                {(item.status === "Scheduled" || item.status === "Available") && (
                  <div className="delete-slot">
                    <button onClick={() => handleCancelSlot(item.id)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {item.status !== "Available" && (
            <p className="show-hide" onClick={() => toggleDetails(item.id)}>
              {showDetails[item.id] ? "Hide Details" : "Show More"}
            </p>
            )}
            
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
    </div>
  );
};

export default Appointment;
