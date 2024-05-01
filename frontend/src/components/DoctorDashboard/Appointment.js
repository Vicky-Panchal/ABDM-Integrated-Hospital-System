import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/appointment.css";
import Navbar from "../navbar";
import axios from "axios";

// const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
// const token = JSON.parse(localStorage.getItem("loggedInUser")).access_token;

const DeleteSlotPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Confirmation</h2>
        <p>Are you sure you want to cancel this slot?</p>
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

const AddSlotPopup = ({ onClose }) => {
  const [addDate, setAddDate] = useState([""]); // Initialize as an array with an empty string
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null); // State to hold error message
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setAddDate([today]);

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2,"0");
    setStartTime(`${hours}:${minutes}:${second}`);
    setEndTime(`${hours}:${minutes}:${second}`);
  }, []);



  const handleAddSlot = async () => {
    setLoading(true); // Set loading to true before making the request
    setError(null); // Clear any previous errors
    try {
      const access_token = JSON.parse(localStorage.getItem("loggedInUser")).access_token;
      const formattedDates = addDate.map(date => new Date(date).toISOString().split('T')[0]); // Format dates as strings in ISO format
      const body = {
        date: formattedDates,
        startTime,
        endTime,
      };
      console.log(body);
      console.log(access_token);
        const response = await axios.post(
          "http://localhost:8081/api/v1/appointment/addSlots",
          body,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const data = response.data;
        console.log(data); // Show response in console
       
      onClose(); // Close the popup after successful addition
    } catch (error) {
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false after request completion
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Add Slot</h2>
        {addDate.map((date, index) => (
          <div key={index} className="popup-date-time">
            <label>Date {index + 1}: </label>
            <input
              className="filter-date"
              type="date"
              value={date}
              onChange={(e) => {
                const updatedDates = [...addDate];
                updatedDates[index] = e.target.value;
                setAddDate(updatedDates);
              }}
              required
            />
          </div>
        ))}
        <div className="popup-date-time">
          <label htmlFor="startTimeInput">From : </label>
          <input
            type="time"
            id="startTimeInput"
            name="startTimeInput"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="popup-date-time">
          <label htmlFor="endTimeInput">To : </label>
          <input
            type="time"
            id="endTimeInput"
            name="endTimeInput"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button className="close-button" onClick={handleAddSlot}>
        {loading ? "Adding..." : "Add"}
        </button>
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
        {error && <p>Error: {error}</p>}
      </div>
    </div>
  );
};

const Appointment = () => {
  const navigate = useNavigate();

  const [showDeleteSlotPopup, setShowDeleteSlotPopup] = useState(false);
  const [showAddSlotPopup, setShowAddSlotPopup] = useState(false);
  const [slots, setSlots] = useState([]);
  const [filterValue, setFilterValue] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [error, setError] = useState(null); // State to hold error message
  const [loading, setLoading] = useState(false); // State to indicate loading state

  useEffect(() => {
    // Fetch data from API and set it to slots state
    const fetchData = async () => {
      setLoading(true); // Set loading to true before making the request
      setError(null); // Clear any previous errors
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
          // Redirect user to login if not logged in
          navigate("/login");
          return;
        }

        const userId = loggedInUser.user_id;
        const token = loggedInUser.access_token;
        const today = new Date().toISOString().split("T")[0];
         // Set filterDate to today's date
        const response = await axios.get(
          `http://localhost:8081/api/v1/appointment/getSlotsByDoctorId?userId=${userId}&date=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.data;
        console.log(data);
        setSlots(data);
      } catch (error) {
        setError(error.message);
      }
      finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCancelSlot = (id) => {
    setShowDeleteSlotPopup(true);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFilterSearch = (event) => {
    // Handle filter search logic here
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
          <div>
            <button
              className="add-slot-btn"
              onClick={() => setShowAddSlotPopup(true)}
            >
              Add Slot
            </button>
          </div>
        </div>

        <div className="slot-list">
        {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
          {Array.isArray(slots) && slots.length > 0 ? (
            slots.map((item) => (
              <div key={item.id} className="slot-item">
                {/* Render slot item details */}
                {!showDetails[item.id] && (
              <div className="short-list-item">
                <div className="slot-col">
                  <div className="slot-info">
                    <p>
                      <strong>Status : </strong>
                      {item.availabilityStatus}
                    </p>
                    <p>
                      <strong>Date : </strong>
                      {item.date}
                    </p>
                  </div>
                  <div className="slot-time">
                    <p>
                      <strong>From : </strong>
                      {item.startTime}
                    </p>
                    <p>
                      <strong>To : </strong>
                      {item.endTime}
                    </p>
                  </div>
                </div>
                {(item.availabilityStatus === "SCHEDULED" || item.availabilityStatus === "AVAILABLE") && (
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
                    <img alt="ProfilePic" src={item.profileUrl}></img>
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
                    {item.availabilityStatus}
                  </p>
                  <p>
                    <strong>Date : </strong>
                    {item.date}
                  </p>
                </div>
                <div className="slot-time">
                  <p>
                    <strong>From : </strong>
                    {item.startTime}
                  </p>
                  <p>
                    <strong>To : </strong>
                    {item.endTime}
                  </p>
                </div>
                {(item.availabilityStatus === "SCHEDULED" || item.availabilityStatus === "AVAILABLE") && (
                  <div className="delete-slot">
                    <button onClick={() => handleCancelSlot(item.id)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {item.patientName !== null && (
            <p className="show-hide" onClick={() => toggleDetails(item.id)}>
              {showDetails[item.id] ? "Hide Details" : "Show More"}
            </p>
            )}
            
          </div>
        ))
             
          ) : (
            <p>No slots available</p>
          )}
          </>
          )}
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
