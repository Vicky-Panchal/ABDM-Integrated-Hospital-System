
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../Styles/profilePage.css";
// import axios from "axios";
// import Navbar from "./navbar";

// const ProfilePage = () => {
//   const [hovered, setHovered] = useState(false);
//   const [image, setImageFile] = useState(null);
//   const [profilePic, setProfilePic] = useState("/logo512.png"); // Default profile pic URL
//   const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
//   const token = JSON.parse(localStorage.getItem("loggedInUser")).access_token;
//   const fileInputRef = useRef(null); // Create a ref for the file input

//   const updateProfilePic = (imageUrl) => {
//     setProfilePic(imageUrl);
//   };

//   useEffect(() => {
//     if (image !== null) {
//       handleUpload();
//     }
//   }, [image]); // Call handleUpload when image state changes

//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     try {
//       console.log("User Id: ", userId);
//       console.log("image : ", image);
//       const formData = new FormData();
//       formData.append("file", image);
//       formData.append("userId", userId);
  
//       // Make POST request to upload image
//       const response = await axios.post(
//         "http://localhost:8081/api/v1/users/uploadProfile",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       // Check if the upload was successful
//       if (response.status === 200) {
//         console.log("Profile picture uploaded successfully.");
  
//         // Fetch updated profile picture URL
//         const imageUrlResponse = await axios.get(
//           `http://localhost:8081/api/v1/users/getProfilePicture?userId=${userId}`
//         );
        
//         console.log(imageUrlResponse.data);
//         // Update profile picture URL based on the response of the GET request
//         if (imageUrlResponse.status === 200) {
//           setProfilePic(imageUrlResponse.data);
//           console.log("Profile picture URL updated successfully.");
//         } else {
//           console.error("Failed to fetch updated profile picture URL.");
//         }
//       } else {
//         console.error("Failed to upload profile picture.");
//       }
//     } catch (error) {
//       console.error("Error uploading profile picture:", error);
//     }
//   };
  

//   return (
//     <div>
//       <Navbar updateProfilePic={updateProfilePic}/>
//       <div className="profile-container">
//         <div className="info1-container">
//           <div
//             className="profile-pic"
//             onMouseEnter={() => setHovered(true)}
//             onMouseLeave={() => setHovered(false)}
//           >
//             {hovered && (
//               <button className="upload-button" onClick={() => fileInputRef.current.click()}> {/* Use ref to trigger file input */}
//                 Upload Profile Picture
//               </button>
//             )}
//             <img
//               src={profilePic}
//               className="image"
//               alt="Profile Pic"
//             ></img>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               style={{ display: "none" }}
//               ref={fileInputRef} 
//             />
//           </div>
//           <div className="info">
//             {/* Remaining profile info */}
//             <div className="name">
//                 <h1>Name : Parag Dutt Sharma</h1>
//             </div>
//             <div className="gender-dob">
//                 <div className="gender"><h3>Gender : Male</h3></div>
//                 <div className="dob"><h3>DOB : 01-01-2000</h3></div>
//             </div>
//           </div>
//         </div>
//         {/* Remaining profile info */}
//         <div className="info2-container">
//             <h3>Email : asdfg@gmail.com</h3>
//             <h3>Phone : 9898989898</h3>
//             <h3>Address : IIITB , 26/C, Hosur Rd, Electronics City Phase 1, Electronic City, Bengaluru, Karnataka 560100</h3>
//             <h3>Health ID : 12345</h3>
//             <h3>Health ID No. : 12345</h3>
//         </div>
//         <div className="button-container">
//             <button className="download-button">Download ABHA Card</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [healthId, setHealthId] = useState("");
  const [healthIdNumber, setHealthIdNumber] = useState("");
  const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
  const token = JSON.parse(localStorage.getItem("loggedInUser")).access_token;
  const fileInputRef = useRef(null); // Create a ref for the file input

//   const updateProfilePic = (imageUrl) => {
//     setProfilePic(imageUrl);
//   };

  useEffect(() => {
    fetchProfileData();
    
  }, []); // Fetch profile data on component mount

  useEffect(() => {
    if (image !== null) {
      handleUpload();
    }
  }, [image]);

  const fetchProfileData = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("loggedInUser")).user_id;
      // Fetch profile picture
      const imageUrlResponse = await axios.get(
        `http://localhost:8081/api/v1/users/getProfilePicture?userId=${userId}`
      );
      if (imageUrlResponse.status === 200) {
        setProfilePic(imageUrlResponse.data);
      }
      // Fetch user information
      const userInfoResponse = await axios.get(
        `http://localhost:8081/api/v1/users/getUser?userId=${userId}`
      );
        
        const userData = userInfoResponse.data;
        setfirstName(userData.firstname);
        setmiddleName(userData.middlename);
        setlastName(userData.lastnamename);
        setGender(userData.gender);
        setDob(userData.dob);
        setPhone(userData.phone);
        setAddress(userData.address);
        setHealthId(userData.healthId);
        setHealthIdNumber(userData.healthIdNumber);
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
        console.log("User Id: ", userId);
        console.log("image : ", image);
        const formData = new FormData();
        formData.append("file", image);
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
            `http://localhost:8081/api/v1/users/getProfilePicture?userId=${userId}`
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
              <h1>Name : {firstname}{middlename}{lastname}</h1>
              
            </div>
            <div className="gender-dob">
              <div className="gender">
                <h3>Gender : {gender}</h3>
              </div>
              <div className="dob">
                <h3>DOB : {dob}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="info2-container">
         
          <h3>Phone : {phone}</h3>
          <h3>Address : {address}</h3>
          <h3>Health ID : {healthId}</h3>
          <h3>Health ID No. : {healthIdNumber}</h3>
        </div>
        <div className="button-container">
          <button className="download-button">Download ABHA Card</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
