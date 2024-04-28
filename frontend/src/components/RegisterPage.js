import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Importing useNavigate
import axios from "axios"; // Import axios for making API requests
import "../Styles/registerPage.css"; // Import the CSS file

const RegisterPage = () => {
  const { option } = useParams();
  const navigate = useNavigate(); // Initializing navigate

  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    dob: "",
    password: "",
    role: option.toUpperCase(), // Convert to uppercase
    mobile: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the error message when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate first name
    if (formData.firstname.trim() === "") {
      newErrors.firstname = "First name is required";
      isValid = false;
    }

    // Validate last name
    if (formData.lastname.trim() === "") {
      newErrors.lastname = "Last name is required";
      isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Validate date of birth
    const today = new Date();
    const dob = new Date(formData.dob);
    if (dob >= today) {
      newErrors.dob = "Date of birth should be before today";
      isValid = false;
    }

    // Validate mobile number
    const mobilePattern = /^\+\d{1,3}-\d{10}$/;
    if (!mobilePattern.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number (Format: +CC-XXXXXXXXXX)";
      isValid = false;
    }

    // Validate gender
    // if (!["male", "female", "others"].includes(formData.gender)) {
    //   newErrors.gender = "Please select a valid gender";
    //   isValid = false;
    // }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be more than 8 characters and contain both numbers and letters/special characters";
      isValid = false;
    }

    // Validate confirm password
    if (formData.password !== formData["confirm-password"]) {
      newErrors["confirm-password"] = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!validateForm()) {
      return;
    }

    try {
      //console.log("I am in API");
      //console.log(option);
      // Make API call to register user
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8081/api/v1/auth/register",
        formData
      );
      console.log("Registration successful!", response.data);
      // Redirect to login page after successful registration using navigate
      navigate("/Login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="heading">
        <img src="/hadlogo.png" alt="logo"></img>
        <h1 className="register-heading">Register as {option}</h1>
      </div>
      <form onSubmit={handleRegister}>
        <div className="form-fields">
          <div className="personal-info">
            <label className="form-label">First Name : </label>
            <input
              type="text"
              name="firstname"
              className="form-input"
              value={formData.firstname}
              onChange={handleFormChange}
              required
            />
            {errors.firstname && (
              <p className="error-message">{errors.firstname}</p>
            )}

            <label className="form-label">Middle Name : </label>
            <input
              type="text"
              name="middlename"
              className="form-input"
              value={formData.middlename}
              onChange={handleFormChange}
            />

            <label className="form-label">Last Name : </label>
            <input
              type="text"
              name="lastname"
              className="form-input"
              value={formData.lastname}
              onChange={handleFormChange}
              required
            />
            {errors.lastname && (
              <p className="error-message">{errors.lastname}</p>
            )}

            <label className="form-label">Date of Birth : </label>
            <input
              type="date"
              name="dob"
              className="form-input"
              value={formData.dob}
              onChange={handleFormChange}
              required
            />
            {errors.dob && <p className="error-message">{errors.dob}</p>}
          </div>

          <div className="account-info">
            <label className="form-label">Phone Number : </label>
            <input
              type="tel"
              name="mobile"
              className="form-input"
              value={formData.mobile}
              onChange={handleFormChange}
              required
            />
            {errors.mobile && <p className="error-message">{errors.mobile}</p>}

            <label className="form-label">Email : </label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            {/* <label className="form-label">Role : </label>
            <input
              type="text"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleFormChange}
              required
            /> */}

            <label className="form-label">Password : </label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleFormChange}
              required
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            <label className="form-label">Confirm Password : </label>
            <input
              type="password"
              name="confirm-password"
              className="form-input"
              value={formData["confirm-password"]}
              onChange={handleFormChange}
              required
            />
            {errors["confirm-password"] && (
              <p className="error-message">{errors["confirm-password"]}</p>
            )}
          </div>
        </div>

        <div className="gender-info">
          <div>
            <label className="form-label">Gender : </label>
          </div>
          <div className="gender-checkbox">
            <label>
              <input
                type="radio"
                name="gender"
                className="gender-input"
                value="Male"
                onChange={handleFormChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                className="gender-input"
                value="Female"
                onChange={handleFormChange}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                className="gender-input"
                value="Other"
                onChange={handleFormChange}
              />
              Others
            </label>
            {errors.gender && <p className="error-message">{errors.gender}</p>}
          </div>
        </div>
        <div className="submit-button-div">
          <button type="submit" className="register-button">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
