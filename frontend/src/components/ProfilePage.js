import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import "../Styles/profilePage.css";
import axios from "axios";
import Navbar from "./navbar";

const ProfilePage = () => {

    return(
        <div>
            <Navbar />
        <div className="profile-container">
            <div className="info1-container">
                <div className="profile-pic">
                    <img src="/logo512.png" className="image" alt="Profile Pic"></img>
                </div>
                <div className="info">
                    <div className="name">
                        <h1>Name : Parag Dutt Sharma</h1>
                    </div>
                    <div className="gender-dob">
                        <div className="gender"><h3>Gender : Male</h3></div>
                        <div className="dob"><h3>DOB : 01-01-2000</h3></div>
                    </div>
                </div>
            </div>
            <div className="info2-container">
                <h3>Email : asdfg@gmail.com</h3>
                <h3>Phone : 9898989898</h3>
                <h3>Address : IIITB , 26/C, Hosur Rd, Electronics City Phase 1, Electronic City, Bengaluru, Karnataka 560100</h3>
                <h3>Health ID : 12345</h3>
                <h3>Health ID No. : 12345</h3>
            </div>
            <div className="button-container">
                <button className="download-button">Download ABHA Card</button>
            </div>
        </div>
        </div>
    );

};

export default ProfilePage;