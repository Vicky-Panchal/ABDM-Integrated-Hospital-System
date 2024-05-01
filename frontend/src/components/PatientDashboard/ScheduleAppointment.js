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

const AddSlotPopup = ({ onCloseAdd }) => {
  const dummyDoctor = [
    {
      id: 1,
      name: "Keshav",
      profilePic: "logo192.png",
    },
    {
      id: 2,
      name: "Chintu",
      profilePic: "logo192.png",
    },
  ];

  const dummyPurpose = [
    {
      id: 1,
      value: "Checkup",
    },
    {
      id: 2,
      value: "Lab Test",
    },
  ];

  const dummySlots = [
    {
      id: 1,
      value: "09:00 AM - 09:30 AM",
    },
    {
      id: 2,
      value: "10:00 AM - 10:30 AM",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(1);

  const handleNext = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const handlePrevious = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const [doctorValue, setDoctorValue] = useState("");
  const handleDoctorChange = (event) => {
    setDoctorValue(event.target.value);
  };

  const [dateValue, setDateValue] = useState("");
  const handleDateChange = (event) => {
    setDateValue(event.target.value);
  };
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateValue(today);
  }, []);

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
  };

  const [slotValue, setSlotValue] = useState("");
  const handleSlotChange = (event) => {
    setSlotValue(event.target.value);
  };
  const handleSlotSubmit = async (e) => {
    e.preventDefault();
  };

  const [purposeValue, setPurposeValue] = useState("");
  const handlePurposeChange = (event) => {
    setPurposeValue(event.target.value);
  };
  const handlePurposeSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateValue(today);
  }, []);

  return (
    <div className="schedule-popup-container-overlay">
      <div className="schedule-popup-container">
        <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
          <div className="divisions">
            <div className="description">
              <img src="/hadlogo.png" alt="logo" />
              <h1>Dhanvantri User</h1>
              <h3>Schedule your appointment with doctor.</h3>
            </div>
            <div className="form">
              <form onSubmit={handleDoctorSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Doctor :</label>
                  <select
                    className="dropdown-select"
                    value={doctorValue}
                    onChange={handleDoctorChange}
                    required
                  >
                    {dummyDoctor.map((item) => (
                      <option value={item.name}>{item.name}</option>
                    ))}
                  </select>
                  <label className="form-label">Select Date :</label>
                  <input
                    className="filter-date"
                    type="date"
                    value={dateValue}
                    onChange={handleDateChange}
                    required
                  />
                </div>

                <div className="buttons">
                  <button
                    type="submit"
                    className="abdm-button"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onCloseAdd}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
          <div className="divisions">
            <div className="description">
              <img src="/hadlogo.png" alt="logo" />
              <h1>Dhanvantri User</h1>
              <h3>Schedule your appointment with doctor.</h3>
            </div>
            <div className="form">
              <form onSubmit={handleSlotSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Select from available slots :
                  </label>
                  <select
                    className="dropdown-select"
                    value={slotValue}
                    onChange={handleSlotChange}
                    required
                  >
                    {dummySlots.map((item) => (
                      <option value={item.value}>{item.value}</option>
                    ))}
                  </select>
                </div>
                <div className="buttons">
                  <button
                    type="button"
                    className="abdm-button"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="abdm-button"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onCloseAdd}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={`slide ${currentSlide === 3 ? "active" : ""}`}>
          <div className="divisions">
            <div className="description">
              <img src="/hadlogo.png" alt="logo" />
              <h1>Dhanvantri User</h1>
              <h3>Schedule your appointment with doctor.</h3>
            </div>
            <div className="form">
              <form onSubmit={handlePurposeSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Select purpose of appointment :
                  </label>
                  <select
                    className="dropdown-select"
                    value={purposeValue}
                    onChange={handlePurposeChange}
                    required
                  >
                    {dummyPurpose.map((item) => (
                      <option value={item.value}>{item.value}</option>
                    ))}
                  </select>
                </div>
                <div className="buttons">
                  <button
                    type="button"
                    className="abdm-button"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="abdm-button"
                    onClick={handleNext}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onCloseAdd}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={`slide ${currentSlide === 4 ? "active" : ""}`}>
          <div className="divisions">
            <div className="description">
              <img src="/hadlogo.png" alt="logo" />
              <h1>Dhanvantri User</h1>
              <h3>Schedule your appointment with doctor.</h3>
            </div>
            <div className="form">
              <div className="form-group">
                <label className="form-label">
                  Your appointment has been booked.
                </label>
              </div>
              <button
                type="button"
                className="abdm-button"
                onClick={onCloseAdd}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
    <div>
      <Navbar />
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
              className="sch-app-btn"
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
              className="filter-app"
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
          <AddSlotPopup onCloseAdd={() => setShowAddSlotPopup(false)} />
        )}
      </div>
    </div>
  );
};

export default ScheduleAppointment;
