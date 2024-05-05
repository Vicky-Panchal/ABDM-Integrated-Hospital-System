// PatientDashboard.js
import React , {useEffect , useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import ConsentRequests from "./ConsentRequests";
import ScheduleAppointment from "./ScheduleAppointment";
import "../../Styles/PatientDashboard/patientDashboard.css";
import Navbar from "../navbar";

const PatientDashboard = () => {
  
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    setSelectedButton("consentRequests");
  }, []);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  return (

    <div>
      <div>
        <Navbar />
      </div>

      <div className="patient-dashboard-container">
      <div className="functionalities">
          <div>
            <button
              className={selectedButton === "abdmRegistraion" ? "active" : ""}
              onClick={() => {navigate("/ABDMRegistration")}}
            >
              ABDM Registration
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "consentRequests" ? "active" : ""}
              onClick={() => handleButtonClick("consentRequests")}
            >
              Consent Requests
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "scheduleAppointment" ? "active" : ""}
              onClick={() => handleButtonClick("scheduleAppointment")}
            >
              Schedule Appointment
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "documents" ? "active" : ""}
              onClick={() => handleButtonClick("documents")}
            >
              View Documents
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "uploadDocuments" ? "active" : ""}
              onClick={() => handleButtonClick("uploadDocuments")}
            >
              Upload Documents
            </button>
          </div>
          <div>
            <button
              className={selectedButton === "labTests" ? "active" : ""}
              onClick={() => handleButtonClick("labTests")}
            >
              Lab Tests
            </button>
          </div>
        </div>
        <div className="content">
          {selectedButton === "consentRequests" && <ConsentRequests />}
          {selectedButton === "scheduleAppointment" && <ScheduleAppointment />}
        </div>
      </div>
    </div>

    // <div>
    //   <Navbar />
    //   <div className="dashboard-container">
    //     <div className="row1">
    //       <button className="component" onClick={() => {navigate("/ABDMRegistration");}}>ABDM Registration</button>
    //       <button className="component" onClick={() => {navigate("/ConsentRequests");}}>Consent Requests</button>
    //       <button className="component" onClick={() => {navigate("/ScheduleAppointment");}}>Schedule Appointment</button>
          
    //     </div>
    //     <div className="row2">
    //       <button className="component">View Documents</button>
    //       <button className="component">Upload Documents</button>
    //       <button className="component">Lab Tests</button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default PatientDashboard;
