import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/consentRequestForm.css";
import axios from "axios";

const ConsentRequestForm = () => {
  const navigate = useNavigate();

  // State variables for form fields
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  //const [patientIdentifier, setPatientIdentifier] = useState("");
  //const [suffix, setSuffix] = useState("@sbx");
  const [purposeOfRequest, setPurposeOfRequest] = useState("");
  const [healthInfoFrom, setHealthInfoFrom] = useState("");
  const [healthInfoTo, setHealthInfoTo] = useState("");
  const [healthInfoType, setHealthInfoType] = useState([]);
  const [consentExpiry, setConsentExpiry] = useState("");
  const [error, setError] = useState("");
  const [requestThroughDhanvantari, setRequestThroughDhanvantari] = useState(false);
  
  // Fetch list of patients from the API
  useEffect(() => {
    const accessToken = JSON.parse(
      localStorage.getItem("loggedInUser")
    ).access_token; // Get access token from local storage

    axios
      .get("http://localhost:8081/api/v1/patient/getAllPatients", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass access token as bearer token in headers
        },
      })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    console.log(consentExpiry);
    const currentDate = new Date();
    const from = new Date(healthInfoFrom);
    const to = new Date(healthInfoTo);
    const expiry = new Date(consentExpiry);
    console.log(from);
    console.log(to);

    if (from > currentDate) {
      setError("Health Information From date cannot be in the future.");
      return;
    }

    if (to > currentDate) {
      setError("Health Information To date cannot be in the past.");
      return;
    }
    if (expiry < to) {
      setError("Health Information expiry date cannot be lass than to.");
      return;
    }
    if (from > to) {
      setError(
        "Health Information From date cannot be after Health Information To date."
      );
      return;
    }

    // Convert dates to UTC format
    const fromUTC = from.toISOString();
    const toUTC = to.toISOString();
    const expiryUTC = expiry.toISOString();

    // Process form data...

    // Create the request body
    try {
      const accessToken = JSON.parse(
        localStorage.getItem("loggedInUser")
      ).access_token;
      const doctorId = JSON.parse(localStorage.getItem("loggedInUser")).doctor_id;
      console.log(doctorId);

      const hiTypesString = healthInfoType.map(item => `"${item}"`).join(",");

      console.log(hiTypesString);
      const requestBody = {
        purpose: purposeOfRequest,
        dateFrom: fromUTC,
        dateTo: toUTC,
        dateEraseAt: expiryUTC,
        hiTypes: hiTypesString,
        patientId: selectedPatient,
        doctorId: doctorId, // Replace YOUR_DOCTOR_ID with the actual doctor ID
        visitId: 1, // Assuming visit ID is always 1, you may need to change this
        isLocal: requestThroughDhanvantari,
      };

      const response = await axios.post(
        "http://localhost:8081/api/v1/consent/create-consent-request",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      // console.log("Form submitted:", {
      //   patientIdentifier,
      //   suffix,
      //   purposeOfRequest,
      //   healthInfoFrom: fromUTC,
      //   healthInfoTo: toUTC,
      //   healthInfoType,
      //   consentExpiry: expiryUTC,
      // });
      navigate("/DoctorDashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRequestThroughDhanvantariChange = (e) => {
    setRequestThroughDhanvantari(e.target.checked);
  };

  const handleCheckboxChange = (value) => {
    setHealthInfoType((prevHealthInfoType) => {
      if (prevHealthInfoType.includes(value)) {
        return prevHealthInfoType.filter((item) => item !== value);
      } else {
        return [...prevHealthInfoType, value];
      }
    });
  };

  const checkboxes = [
    { value: "OPConsultation", label: "OPConsultation" },
    { value: "DiagnosticReport", label: "DiagnosticReports" },
    { value: "DischargeSummary", label: "DischargeSummary" },
    { value: "Prescription", label: "Prescription" },
    { value: "ImmunizationRecord", label: "ImmunizationRecord" },
    { value: "HealthDocumentRecord", label: "HealthDocumentRecord" },
    { value: "WellnessRecord", label: "WellnessRecord" },

    // Add more checkboxes here if needed
  ];

  const renderCheckboxes = () => {
    const rows = [];
    for (let i = 0; i < checkboxes.length; i += 2) {
      rows.push(
        <div className="checkbox-container">
          <div className="checkbox-row" key={i}>
            <div className="checkbox-item1">
              <label>
                <input
                  type="checkbox"
                  value={checkboxes[i].value}
                  checked={healthInfoType.includes(checkboxes[i].value)}
                  onChange={() => handleCheckboxChange(checkboxes[i].value)}
                />
                {checkboxes[i].label}
              </label>
            </div>
            {i + 1 < checkboxes.length && (
              <div className="checkbox-item2">
                <label>
                  <input
                    type="checkbox"
                    value={checkboxes[i + 1].value}
                    checked={healthInfoType.includes(checkboxes[i + 1].value)}
                    onChange={() =>
                      handleCheckboxChange(checkboxes[i + 1].value)
                    }
                  />
                  {checkboxes[i + 1].label}
                </label>
              </div>
            )}
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="request-container">
      <div className="head">
        <div className="heading">
          <h2>Consent Request Form</h2>
        </div>
        <div className="warn">
          <h5>All the fields are mandatory</h5>
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-info-grid">
            {/* Other form fields */}
            <div className="grid-item">
              <div className="title">
                <label>Patient Identifier : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Patient
                  </option>
                  {patients.map((patient) => (
                    <option key={patient.patientId} value={patient.patientId}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Other form fields */}
            <div className="grid-item">
              <div className="title">
                <label>Purpose of Request : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <input
                  type="text"
                  value={purposeOfRequest}
                  onChange={(e) => setPurposeOfRequest(e.target.value)}
                  placeholder="Enter Purpose"
                  required
                />
              </div>
            </div>

            <div className="grid-item">
              <div className="title">
                <label>Health Information From : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <input
                  type="date"
                  value={healthInfoFrom}
                  onChange={(e) => setHealthInfoFrom(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-item">
              <div className="title">
                <label>Health Information To : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <input
                  type="date"
                  value={healthInfoTo}
                  onChange={(e) => setHealthInfoTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-item">
              <div className="title">
                <label>Health Information Type : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">{renderCheckboxes()}</div>
            </div>
            <div className="grid-item">
              <div className="title">
                <label>Consent Expiry : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <input
                  type="date"
                  value={consentExpiry}
                  onChange={(e) => setConsentExpiry(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid-item">
              <div className="title">
                <label>Request Consent through Dhanvantari : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <input
                  type="checkbox"
                  checked={requestThroughDhanvantari}
                  onChange={handleRequestThroughDhanvantariChange}
                />
              </div>
            </div>
            {error && <div className="error">{error}</div>}
          </div>
          <div className="form-submit">
            <button type="submit">Request Consent</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsentRequestForm;

// ConsentRequestForm.js
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../../Styles/DoctorDashboard/consentRequestForm.css";
// // import Navbar from "../navbar";

// const ConsentRequestForm = () => {
//   const navigate = useNavigate();

//   // State variables for form fields
//   const [patientIdentifier, setPatientIdentifier] = useState("");
//   const [suffix, setSuffix] = useState("@sbx");
//   const [purposeOfRequest, setPurposeOfRequest] = useState("");
//   const [healthInfoFrom, setHealthInfoFrom] = useState("");
//   const [healthInfoTo, setHealthInfoTo] = useState("");
//   const [healthInfoType, setHealthInfoType] = useState([]);
//   const [consentExpiry, setConsentExpiry] = useState("");

//   const handleSuffixChange = (e) => {
//     setSuffix(e.target.value);
//   };

//   // Function to handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Process form data, e.g., send it to the server
//     console.log("Form submitted:", {
//       patientIdentifier,
//       suffix,
//       purposeOfRequest,
//       healthInfoFrom,
//       healthInfoTo,
//       healthInfoType,
//       consentExpiry,
//     });

//     navigate("/ConsentList");
//   };

//   const handleCheckboxChange = (value) => {
//     setHealthInfoType((prevHealthInfoType) => {
//       if (prevHealthInfoType.includes(value)) {
//         return prevHealthInfoType.filter((item) => item !== value);
//       } else {
//         return [...prevHealthInfoType, value];
//       }
//     });
//   };

//   const checkboxes = [
//     { value: "OP Consultation", label: "OP Consultation" },
//     { value: "Diagnostic Reports", label: "Diagnostic Reports" },
//     { value: "Discharge Summary", label: "Discharge Summary" },
//     { value: "Prescription", label: "Prescription" },
//     { value: "Immunization Record", label: "Immunization Record" },
//     { value: "Health Document Record", label: "Health Document Record" },
//     { value: "Wellness Record", label: "Wellness Record" },

//     // Add more checkboxes here if needed
//   ];

//   const renderCheckboxes = () => {
//     const rows = [];
//     for (let i = 0; i < checkboxes.length; i += 2) {
//       rows.push(
//         <div className="checkbox-container">
//           <div className="checkbox-row" key={i}>
//             <div className="checkbox-item1">
//               <label>
//                 <input
//                   type="checkbox"
//                   value={checkboxes[i].value}
//                   checked={healthInfoType.includes(checkboxes[i].value)}
//                   onChange={() => handleCheckboxChange(checkboxes[i].value)}
//                 />
//                 {checkboxes[i].label}
//               </label>
//             </div>
//             {i + 1 < checkboxes.length && (
//               <div className="checkbox-item2">
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={checkboxes[i + 1].value}
//                     checked={healthInfoType.includes(checkboxes[i + 1].value)}
//                     onChange={() =>
//                       handleCheckboxChange(checkboxes[i + 1].value)
//                     }
//                   />
//                   {checkboxes[i + 1].label}
//                 </label>
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     }
//     return rows;
//   };

//   return (
//     <div className="request-container">
//       <div className="head">
//         <div className="heading">
//           <h2>Consent Request Form</h2>
//         </div>
//         <div className="warn">
//           <h5>All the fields are mandatory</h5>
//         </div>
//       </div>
//       <hr />
//       <form onSubmit={handleSubmit}>
//         <div className="form-container">
//           <div className="form-info-grid">
//             <div className="grid-item">
//               <div className="title">
//                 <label>Patient Identifier : </label>
//               </div>
//             </div>
//             <div className="grid-item">
//               <div className="fields">
//                 <input
//                   type="text"
//                   value={patientIdentifier}
//                   onChange={(e) => setPatientIdentifier(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid-item">
//               <div className="title">
//                 <label>Purpose of Request : </label>
//               </div>
//             </div>
//             <div className="grid-item">
//               <div className="fields">
//                 <select
//                   value={purposeOfRequest}
//                   onChange={(e) => setPurposeOfRequest(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select Purpose
//                   </option>
//                   <option value="Care Management">Care Management</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid-item">
//               <div className="title">
//                 <label>Health Information From : </label>
//               </div>
//             </div>
//             <div className="grid-item">
//               <div className="fields">
//                 <input
//                   type="date"
//                   value={healthInfoFrom}
//                   onChange={(e) => setHealthInfoFrom(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid-item">
//               <div className="title">
//                 <label>Health Information To : </label>
//               </div>
//             </div>
//             <div className="grid-item">
//               <div className="fields">
//                 <input
//                   type="date"
//                   value={healthInfoTo}
//                   onChange={(e) => setHealthInfoTo(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid-item">
//               <div className="title">
//                 <label>Health Information Type : </label>
//               </div>
//             </div>
//             <div className="grid-item">
//               <div className="fields">{renderCheckboxes()}</div>
//             </div>

//             <div className="grid-item">
//               <div className="title">
//                 <label>Consent Expiry : </label>
//               </div>
//             </div>
//             <div className="grid-item">
//               <div className="fields">
//                 <input
//                   type="date"
//                   value={consentExpiry}
//                   onChange={(e) => setConsentExpiry(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="form-submit">
//             <button type="submit">Request Consent</button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ConsentRequestForm;
