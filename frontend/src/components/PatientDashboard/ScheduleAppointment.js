//ScheduleAppointment.js
import React, { useEffect, useState } from "react";
import "../../Styles/PatientDashboard/scheduleAppointment.css";
import Navbar from "../navbar";
import axios from "axios";

const AddSlotPopup = ({ onCloseAdd, setDoctorOptions, doctorOptions, fetchAppointments}) => {
  console.log("this is inside addslotpopup");
  console.log(doctorOptions);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  // const [currentStep, setCurrentStep] = useState(1);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [currentSlide, setCurrentSlide] = useState(1);

  const handleNext = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const handlePrevious = () => {
    setCurrentSlide(currentSlide - 1);
  };

  // const [doctorValue, setDoctorValue] = useState("");
  // const handleDoctorChange = (event) => {
  //   setDoctorValue(event.target.value);
  // };

  // const [dateValue, setDateValue] = useState("");
  // const handleDateChange = (event) => {
  //   setDateValue(event.target.value);
  // };
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // setDateValue(today);
  }, []);

  // const handleDoctorSubmit = async (e) => {
  //   e.preventDefault();
  // };

  const [slotValue, setSlotValue] = useState([]);
  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };
  // const handleSlotSubmit = async (e) => {
  //   e.preventDefault();
  // };

  const [purposeValue, setPurposeValue] = useState([]);
  const handlePurposeChange = (event) => {
    setSelectedPurpose(event.target.value);
  };
  // const handlePurposeSubmit = async (e) => {
  //   e.preventDefault();
  // };

  const handleSlotSubmit = async (doctorOptions) => {
    try {
      const token = loggedInUser.access_token;
      const user_id = doctorOptions[0].userId;
      console.log(user_id);
      const response = await axios.get(
        `http://localhost:8081/api/v1/appointment/getSlotsByDoctorId?userId=${user_id}&date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      // Assuming data is an array of slot objects with 'startTime' and 'endTime' properties
      // You may need to adjust this based on the actual response structure
      // Check if the response data is an array
    if (Array.isArray(data)) {
      // Map over the array and format the slot data
      const formattedData = data.map((slot) => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));
      
      // Set the formatted data as the slotValue
      console.log(formattedData)
      setSlotValue(formattedData);
    } else {
      console.error("Error: Response data is not an array");
    }
  } catch (error) {
    console.error("Error fetching slots:", error);
  }
  };

  const handlePurposeSubmit = async () => {
    try {
      const token = loggedInUser.access_token;
      const response = await axios.post(
        "http://localhost:8081/api/v1/appointment/bookAppointment",
        {
          slotId: selectedSlot,
          purpose: selectedPurpose,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      // Assuming successful response contains a message indicating appointment booked successfully
      //alert(data.message);
      onCloseAdd();
      fetchAppointments(); 
    } catch (error) {
      console.error("Error booking appointment:", error);
      // Handle error
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // setDateValue(today);
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSlotSubmit(doctorOptions);
                }}
              >
                <div className="form-group">
                  <label className="form-label">Select Doctor :</label>
                  <select
                    className="dropdown-select"
                    value={
                      doctorOptions.length > 0
                        ? doctorOptions[0].doctorName
                        : ""
                    }
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                  >
                    {doctorOptions &&
                      doctorOptions.map((doctor) => (
                        <option
                          key={`${doctor.doctorId}-${doctor.doctorName}`}
                          value={doctor.firstName}
                        >
                          {doctor.firstName}
                        </option>
                      ))}
                  </select>
                  <label className="form-label">Select Date :</label>
                  <input
                    className="filter-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    Select from available slots :
                  </label>
                  <select
                    className="dropdown-select"
                    value={selectedSlot}
                    onChange={handleSlotChange}
                    required
                  >
                    {slotValue &&
                      slotValue.map((slot) => (
                        <option key={slot.id} value={slot.id}>
          {slot.startTime} - {slot.endTime}
        </option>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePurposeSubmit();
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    Enter purpose of appointment :
                  </label>
                  <input
                    type="text"
                    className="purpose-input"
                    value={selectedPurpose}
                    onChange={handlePurposeChange}
                    placeholder="Enter purpose"
                    required
                  />
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
  const [showDeleteSlotPopup, setShowDeleteSlotPopup] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filterappointment, setfilterAppointment] = useState([]);
  const [originalAppointments, setOriginalAppointments] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);

  const handleDoctorSubmit = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const token = loggedInUser.access_token;
      const response = await axios.get(
        `http://localhost:8081/api/v1/doctor/searchDoctor?name=${""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log("this is before setting doctor options");
      console.log(data);
      setDoctorOptions(data);
      console.log("this is after setting doctor options");
      console.log(doctorOptions);
    } catch (error) {
      console.error("Error fetching doctor options:", error);
    }
  };

  // Define fetchAppointments function
  const fetchAppointments = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      //const userId = loggedInUser.user_id;
      const token = loggedInUser.access_token;
      const response = await axios.get(
        "http://localhost:8081/api/v1/appointment/getPatientAppointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
      console.log(data);
      setAppointments(data);
      setfilterAppointment(data);
      setOriginalAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    // Call fetchAppointments inside useEffect
    fetchAppointments();
  }, []);
  const handleCancelSlot = (id) => {
    setShowDeleteSlotPopup(true);
  };

  const [showAddSlotPopup, setShowAddSlotPopup] = useState(false);

  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFilterSearch = () => {
    let filteredAppointments = [];

    switch (filterValue) {
      case "completed":
        filteredAppointments = originalAppointments.filter(
          (appointment) => appointment.status === "Completed"
        );
        break;
      case "canceled":
        filteredAppointments = originalAppointments.filter(
          (appointment) => appointment.status === "Canceled"
        );
        break;
      default:
        filteredAppointments = originalAppointments;
    }

    setfilterAppointment(filteredAppointments);
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
          {Array.isArray(appointments) && appointments.length > 0 ? (
            appointments.map((item) => (
              <div key={item.appointmentId} className="scheduled-item">
                {!showDetails[item.appointmentId] && (
                  <div className="short-list-item">
                    <div className="slot-col">
                      <div className="slot-info">
                        <p>
                          <strong>Status : </strong>
                          {item.status}
                        </p>
                        <p>
                          <strong>Date : </strong>
                          {item.appointmentDate}
                        </p>
                      </div>
                      <div className="slot-time">
                        <p>
                          <strong>From : </strong>
                          {item.appointmentStartTime}
                        </p>
                        <p>
                          <strong>To : </strong>
                          {item.appointmentEndTime}
                        </p>
                      </div>
                    </div>
                    <div className="delete-slot">
                      <button
                        onClick={() => handleCancelSlot(item.appointmentId)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {showDetails[item.appointmentId] && (
                  <div className="detail-list-item">
                    <div className="doctor-info">
                      <div className="image">
                        <img alt="ProfilePic" src={item.profileUrl}></img>
                      </div>
                      <div className="info>">
                        <p>
                          <strong>Doctor Name : </strong>
                          {item.doctorName}
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
                        {item.appointmentDate}
                      </p>
                    </div>
                    <div className="slot-time">
                      <p>
                        <strong>From : </strong>
                        {item.appointmentStartTime}
                      </p>
                      <p>
                        <strong>To : </strong>
                        {item.appointmentEndTime}
                      </p>
                    </div>
                    <div className="delete-slot">
                      <button
                        onClick={() => handleCancelSlot(item.appointmentId)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <p
                  className="show-hide"
                  onClick={() => toggleDetails(item.appointmentId)}
                >
                  {showDetails[item.appointmentId]
                    ? "Hide Details"
                    : "Show More"}
                </p>
              </div>
            ))
          ) : (
            <p>No upcoming appointments</p>
          )}
          <div>
            <button
              className="sch-app-btn"
              onClick={() => {
                setShowAddSlotPopup(true);
                handleDoctorSubmit();
              }}
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
          {filterappointment.length > 0 ? (
            filterappointment.map((item) => (
              <div key={item.appointmentId} className="slot-item">
                {!showDetails[item.appointmentId] && (
                  <div className="short-list-item">
                    <div className="slot-col">
                      <div className="slot-info">
                        <p>
                          <strong>Status : </strong>
                          {item.status}
                        </p>
                        <p>
                          <strong>Date : </strong>
                          {item.appointmentDate}
                        </p>
                      </div>
                      <div className="slot-time">
                        <p>
                          <strong>From : </strong>
                          {item.appointmentStartTime}
                        </p>
                        <p>
                          <strong>To : </strong>
                          {item.appointmentEndTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {showDetails[item.appointmentId] && (
                  <div className="detail-list-item">
                    <div className="doctor-info">
                      <div className="image">
                        <img alt="ProfilePic" src={item.profileUrl}></img>
                      </div>
                      <div className="info>">
                        <p>
                          <strong>Doctor Name : </strong>
                          {item.doctorName}
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
                        {item.appointmentDate}
                      </p>
                    </div>
                    <div className="slot-time">
                      <p>
                        <strong>From : </strong>
                        {item.appointmentStartTime}
                      </p>
                      <p>
                        <strong>To : </strong>
                        {item.appointmentEndTime}
                      </p>
                    </div>
                  </div>
                )}

                <p
                  className="show-hide"
                  onClick={() => toggleDetails(item.appointmentId)}
                >
                  {showDetails[item.appointmentId]
                    ? "Hide Details"
                    : "Show More"}
                </p>
              </div>
            ))
          ) : (
            <p>No appointments available</p>
          )}
        </div>

        {showDeleteSlotPopup && (
          <DeleteSlotPopup onClose={() => setShowDeleteSlotPopup(false)} />
        )}
        {showAddSlotPopup && (
          <AddSlotPopup
            onCloseAdd={() => setShowAddSlotPopup(false)}
            setDoctorOptions={setDoctorOptions}
            doctorOptions={doctorOptions}
            fetchAppointments={fetchAppointments}
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleAppointment;
