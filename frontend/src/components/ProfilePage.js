import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/profilePage.css";
import axios from "axios";
import Navbar from "./navbar";

const ProfilePage = () => {
  const [hovered, setHovered] = useState(false);
  const [image, setImageFile] = useState(null);
  const [profilePic, setProfilePic] = useState("/logo512.png"); // Default profile pic URL
  const [firstname, setfirstName] = useState(""); // State variables for user information
  const [middlename, setmiddleName] = useState("");
  const [lastname, setlastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setPhone] = useState("");
  //   const [address, setAddress] = useState("");
  const [healthId, setHealthId] = useState("");
  const [healthIdNumber, setHealthIdNumber] = useState("");
  const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
  const token = JSON.parse(localStorage.getItem("loggedInUser")).access_token;
  const fileInputRef = useRef(null); // Create a ref for the file input
  const navigate = useNavigate();

  //   const updateProfilePic = (imageUrl) => {
  //     setProfilePic(imageUrl);
  //   };

  useEffect(() => {
    console.log("fetch profile data useffect");
    fetchProfileData();
    // if (image !== null) {
    //     console.log("handle upload data useffect");
    //   handleUpload();
    // }
  }, []); // Fetch profile data on component mount[]

  const fetchProfileData = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
      // Fetch profile picture
      console.log("user id " + userId);
      const imageUrlResponse = await axios.get(
        `http://localhost:8081/api/v1/users/getProfilePicture?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfilePic(imageUrlResponse.data);

      // Fetch user information
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }

    try {
      const userInfoResponse = await axios.get(
        `http://localhost:8081/api/v1/users/getUser?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(userInfoResponse);
      const userData = userInfoResponse.data;
      setfirstName(userData.firstname);
      setmiddleName(userData.middlename);
      setlastName(userData.lastname);
      setGender(userData.gender);
      setDob(userData.dob);
      setPhone(userData.mobile);
      // setAddress(userData.address);
      setHealthId(userData.healthId);
      setHealthIdNumber(userData.healthIdNumber);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected File:", selectedFile);
    if (selectedFile) {
      setImageFile(selectedFile);
      handleUpload(selectedFile);
    } else {
      console.error("No file selected.");
    }
  };

  const handleUpload = async (selectedFile) => {
    try {
      console.log("User Id: ", userId);
      console.log("image : ", selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);

      // Make POST request to upload image
      const response = await axios.post(
        "http://localhost:8081/api/v1/users/uploadProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the upload was successful
      if (response.status === 200) {
        console.log("Profile picture uploaded successfully.");

        // Fetch updated profile picture URL
        const imageUrlResponse = await axios.get(
          `http://localhost:8081/api/v1/users/getProfilePicture?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(imageUrlResponse.data);
        // Update profile picture URL based on the response of the GET request
        if (imageUrlResponse.status === 200) {
          setProfilePic(imageUrlResponse.data);
          console.log("Profile picture URL updated successfully.");
        } else {
          console.error("Failed to fetch updated profile picture URL.");
        }
      } else {
        console.error("Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleChangePassword = () => {
    navigate("/ChangePasswordPage");
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="info1-container">
          <div
            className="profile-pic"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hovered && (
              <button
                className="upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                Upload Profile Picture
              </button>
            )}
            <img src={profilePic} className="image" alt="Profile Pic" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
          </div>
          <div className="info">
            <div className="name">
              <h3>
                Name : {firstname} {middlename} {lastname}
              </h3>
            </div>
            <div className="gender-dob">
              <div className="gender">
                <h3>Gender : {gender}</h3>
              </div>
              <div className="dob">
                <h4>DOB : {(new Date(dob)).toLocaleDateString('en-GB')}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="info2-container">
          <h4>Phone : {mobile}</h4>

          <h4>Health ID : {healthId}</h4>
          <h4>Health ID No. : {healthIdNumber}</h4>
        </div>
        <div className="button-container">
          <button className="download-button">Download ABHA Card</button>
          <button className="change-password-button" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
