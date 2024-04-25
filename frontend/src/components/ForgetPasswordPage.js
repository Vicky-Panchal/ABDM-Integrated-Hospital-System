import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const sliderRef = React.createRef();

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false,
        arrows: false,
        draggable: false,
        accessibility: false,
        afterChange: (current) => setStep(current + 1),
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8081/api/v1/users/forgot-password",
                { email }
            );
            setStep(2);
        } catch (error) {
            console.error("Error sending reset password email:", error);
            setError("Error sending reset password email");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8081/api/v1/users/reset-password",
                { email, otp, newPassword, confirmNewPassword }
            );
            setStep(3);
        } catch (error) {
            console.error("Error resetting password:", error);
            setError("Error resetting password");
        }
    };

    return (
        <div>
            <h1>Forget Password</h1>
            <Slider {...settings} ref={sliderRef} initialSlide={step - 1}>
                <div>
                    <form onSubmit={handleEmailSubmit}>
                        <label>Email:</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                    {error && <div>{error}</div>}
                </div>
                {step >= 2 && (
                    <div>
                        <form onSubmit={handleResetPassword}>
                            <label>OTP:</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <label>New Password:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                        {error && <div>{error}</div>}
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h2>Password Reset Successful</h2>
                        <p>Your password has been successfully reset.</p>
                    </div>
                )}
            </Slider>
        </div>
    );
};

export default ForgetPasswordPage;
