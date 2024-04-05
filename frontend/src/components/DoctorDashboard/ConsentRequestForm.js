// ConsentRequestForm.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/DoctorDashboard/consentRequestForm.css";
// import Navbar from "../navbar";

const ConsentRequestForm = () => {
  const navigate = useNavigate();

  // State variables for form fields
  const [patientIdentifier, setPatientIdentifier] = useState("");
  const [suffix, setSuffix] = useState("@sbx");
  const [purposeOfRequest, setPurposeOfRequest] = useState("");
  const [healthInfoFrom, setHealthInfoFrom] = useState("");
  const [healthInfoTo, setHealthInfoTo] = useState("");
  const [healthInfoType, setHealthInfoType] = useState([]);
  const [consentExpiry, setConsentExpiry] = useState("");

  const handleSuffixChange = (e) => {
    setSuffix(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data, e.g., send it to the server
    console.log("Form submitted:", {
      patientIdentifier, 
      suffix,
      purposeOfRequest,
      healthInfoFrom,
      healthInfoTo,
      healthInfoType,
      consentExpiry,
    });

    navigate("/ConsentList");
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
    { value: "OP Consultation", label: "OP Consultation" },
    { value: "Diagnostic Reports", label: "Diagnostic Reports" },
    { value: "Discharge Summary", label: "Discharge Summary" },
    { value: "Prescription", label: "Prescription" },
    { value: "Immunization Record", label: "Immunization Record" },
    { value: "Health Document Record", label: "Health Document Record" },
    { value: "Wellness Record", label: "Wellness Record" },

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
            <div className="grid-item">
              <div className="title">
                <label>Patient Identifier : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <input
                  type="text"
                  value={patientIdentifier}
                  onChange={(e) => setPatientIdentifier(e.target.value)}
                  required
                />
                <select value={suffix} onChange={handleSuffixChange}>
                  <option value="@sbx">@sbx</option>
                  <option value="@abdm">@abdm</option>
                </select>
              </div>
            </div>

            <div className="grid-item">
              <div className="title">
                <label>Purpose of Request : </label>
              </div>
            </div>
            <div className="grid-item">
              <div className="fields">
                <select
                  value={purposeOfRequest}
                  onChange={(e) => setPurposeOfRequest(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Purpose
                  </option>
                  <option value="Care Management">Care Management</option>
                </select>
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

//{
//     <div class="grid-container">
//   <div class="grid-item">Item 1</div>
//   <div class="grid-item">Item 2</div>
//   <div class="grid-item">Item 3</div>
//   <div class="grid-item">Item 4</div>
//   <div class="grid-item">Item 5</div>
//   <div class="grid-item">Item 6</div>
//   <div class="grid-item">Item 7</div>
//   <div class="grid-item">Item 8</div>
//   <div class="grid-item">Item 9</div>
//   <div class="grid-item">Item 10</div>
//   <div class="grid-item">Item 11</div>
//   <div class="grid-item">Item 12</div>
// </div>

// <div className="form-container">
//   <h2>Consent Request Form</h2>

//   <div className="divisions">

//   <div className="form-labels">
//     <div className="title"><label>Patient Identifier : </label></div>
//     <div className="title"><label>Purpose of Request : </label></div>
//     <div className="title"><label>Health Information From : </label></div>
//     <div className="title"><label>Health Information To : </label></div>
//     <div className="title"><label>Health Information Type : </label></div>
//     <div className="title"><label>Consent Expiry : </label></div>
//   </div>

//   <div className="form-fields">
//     <form onSubmit={handleSubmit}>
//       <div className="form-row">
//         <input
//           type="text"
//           value={patientIdentifier}
//           onChange={(e) => setPatientIdentifier(e.target.value)}
//           required
//         />
//         <select
//           value={patientIdentifier}
//           onChange={(e) => setPatientIdentifier(e.target.value)}
//         >
//           <option value="@sbx">@sbx</option>
//           <option value="@abdm">@abdm</option>
//         </select>
//       </div>
//       <div className="form-row">
//         <select
//           value={purposeOfRequest}
//           onChange={(e) => setPurposeOfRequest(e.target.value)}
//           required
//         >
//           <option value="" disabled>
//             Select Purpose
//           </option>
//           <option value="Care Management">Care Management</option>
//         </select>
//       </div>
//       <div className="form-row">
//         <input
//           type="date"
//           value={healthInfoFrom}
//           onChange={(e) => setHealthInfoFrom(e.target.value)}
//           required
//         />
//       </div>
//       <div className="form-row">
//         <input
//           type="date"
//           value={healthInfoTo}
//           onChange={(e) => setHealthInfoTo(e.target.value)}
//           required
//         />
//       </div>
//       <div className="form-row">
//         <div>{renderCheckboxes()}</div>
//       </div>
//       <div className="form-row">
//         <input
//           type="date"
//           value={consentExpiry}
//           onChange={(e) => setConsentExpiry(e.target.value)}
//           required
//         />
//       </div>
//       <div className="form-row">
//         <button type="submit">Request Consent</button>
//       </div>
//     </form>
//   </div>
//   </div>
// </div>
//}

//{
/* <div className="form-container">
      <h2>Consent Request Form</h2>
      <div className="form-scrollable">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Patient Identifier : </label>
            <input
              type="text"
              value={patientIdentifier}
              onChange={(e) => setPatientIdentifier(e.target.value)}
              required
            />
            <select
              value={patientIdentifier}
              onChange={(e) => setPatientIdentifier(e.target.value)}
            >
              <option value="@sbx">@sbx</option>
              <option value="@abdm">@abdm</option>
            </select>
          </div>
          <div className="form-row">
            <label>Purpose of Request : </label>
            <select
              value={purposeOfRequest}
              onChange={(e) => setPurposeOfRequest(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Purpose
              </option>
              <option value="Care Management">Care Management</option>
            </select>
          </div>
          <div className="form-row">
            <label>Health Information From : </label>
            <input
              type="date"
              value={healthInfoFrom}
              onChange={(e) => setHealthInfoFrom(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Health Information To : </label>
            <input
              type="date"
              value={healthInfoTo}
              onChange={(e) => setHealthInfoTo(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Health Information Type : </label>
            <div>{renderCheckboxes()}</div>
          </div>
          <div className="form-row">
            <label>Consent Expiry : </label>
            <input
              type="date"
              value={consentExpiry}
              onChange={(e) => setConsentExpiry(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <button type="submit">Request Consent</button>
          </div>
        </form>
      </div>
    </div> */
//}
