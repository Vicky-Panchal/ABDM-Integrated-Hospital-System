import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/appointment.css";
import Navbar from "../navbar";
import axios from "axios";

const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
const token = JSON.parse(localStorage.getItem("loggedInUser")).access_token;

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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setAddDate([today]);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setStartTime(`${hours}:${minutes}`);
    setEndTime(`${hours}:${minutes}`);
  }, []);

  const handleAddSlot = async () => {
    try {
      for (let date of addDate) {
        const body = {
          date,
          startTime,
          endTime,
        };
        const response = await axios.post(
          "http://localhost:8081/api/v1/appointment/addSlots",
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log(data); // Show response in console
      }
      onClose(); // Close the popup after successful addition
    } catch (error) {
      console.error("Error adding slot:", error);
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
          Add
        </button>
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
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

  useEffect(() => {
    // Fetch data from API and set it to slots state
    const fetchData = async () => {
      try {
        

        const response = await fetch(
          `http://localhost:8081/api/v1/appointment/getSlotsByDoctorId?userId=${userId}&date=${filterDate}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchData();
  }, [filterDate]);

  const handleCancelSlot = (id) => {
    setShowDeleteSlotPopup(true);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFilterSearch = (event) => {
    // Handle filter search logic here
  };

  const toggleDetails = (id) => {
    // Toggle details logic here
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
          {slots.map((item) => (
            <div key={item.id} className="slot-item">
              {/* Render slot item details */}
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
