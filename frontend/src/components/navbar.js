// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell , faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the server
    const fetchNotifications = async () => {
      const accessToken = localStorage.getItem("token")
      try {
        const response = await axios.get("http://localhost:8081/api/v1/notifications", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);


  const handleNotificationClick = async () => {
    if (!showNotifications) {
      // Fetch notifications from the server
      const accessToken = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8081/api/v1/notifications", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    } else {
      // Mark all notifications as read
      await markAllNotificationsAsRead();
      setNotifications(null);
    }

    // Toggle the showNotifications state
    setShowNotifications(!showNotifications);
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      await axios.post("http://localhost:8081/api/v1/notifications/markAllAsRead", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log("All notifications marked as read.");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };



  const handleProfileClick = () => {
    navigate("/ProfilePage");
  };

  // const notifications = [
  //   {
  //     id: 1,
  //     title: "Consent Request",
  //     message: "Doctor Adarsh requested for the document consent.",
  //     date: "2024-04-28T22:20:00",
  //     url: "google.com",
  //     isRead: "unread"
  //   },
  //   {
  //     id: 2,
  //     title: "Cancel Appointment",
  //     message: "Your tomorrow's appointment has been canceled with doctor Keshav.",
  //     date: "2024-04-15T18:45:00",
  //     url: "",
  //     isRead: "read"
  //   },
  //   {
  //     id: 3,
  //     title: "Document Sent",
  //     message: "Your health documents have been shared to Doctor Keshav.",
  //     date: "2024-03-01T12:00:00",
  //     url: "google.com",
  //     isRead: "unread"
  //   },
  //   {
  //     id: 4,
  //     title: "Consent Request",
  //     message: "Doctor Adarsh requested for the document consent.",
  //     date: "2024-01-28T09:30:00",
  //     url: "google.com",
  //     isRead: "unread"
  //   },
  //   {
  //     id: 5,
  //     title: "Cancel Appointment",
  //     message: "Your tomorrow's appointment has been canceled with doctor Keshav.",
  //     date: "2023-12-15T18:45:00",
  //     url: "",
  //     isRead: "read"
  //   },
  //   {
  //     id: 6,
  //     title: "Document Sent",
  //     message: "Your health documents have been shared to Doctor Keshav.",
  //     date: "2022-07-01T12:00:00",
  //     url: "google.com",
  //     isRead: "unread"
  //   }
  // ];

//   const markAllNotificationsAsRead = async () => {
//     try {
//         const accessToken = localStorage.getItem("token");
//         await axios.post("http://localhost:8081/api/v1/notifications/markAllAsRead", null, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`
//             }
//         });
//         // setNotifications(null);
//         console.log("All notifications marked as read.");
//     } catch (error) {
//         console.error("Error marking notifications as read:", error);
//     }
// };

  const getTimeAgo = (creationTime) => {
    const currentTime = new Date();
    const notificationTime = new Date(creationTime);

    const timeDifference = currentTime.getTime() - notificationTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(
      currentTime.getMonth() -
        notificationTime.getMonth() +
        12 * (currentTime.getFullYear() - notificationTime.getFullYear())
    );
    const years = Math.floor(
      currentTime.getFullYear() - notificationTime.getFullYear()
    );

    if (years > 0) {
      return `${years} year${years === 1 ? "" : "s"} ago`;
    } else if (months > 0) {
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else {
      return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
    }
  };

  const LogoutPopup = ({ onClose }) => {
    return (
      <div className="logout-popup-overlay">
        <div className="logout-popup">
          <h2>Confirmation</h2>
          <p>Are you sure you want to logout?</p>
          {/* Add Deny Consent confirmation message and buttons here */}
          <button className="confirmation-button" onClick={handleLogout}>
            Yes
          </button>
          <button className="close-button" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    );
  };

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleLogout = () => {
    // Clear user authentication details from local storage
    setShowLogoutPopup(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <div className="divisions">
        <div className="left">
          <img src="/hadlogo.png" alt="logo"></img>
        </div>

        <div className="right">

          <button onClick={handleNotificationClick} className="icon">
            <FontAwesomeIcon icon={faBell} />
          </button>

          <button onClick={handleProfileClick} className="icon">
            <FontAwesomeIcon icon={faUser} />
          </button>

          <button onClick={handleLogoutClick} className="icon">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>

          {showNotifications && (
            <div className="notification-container">
              <div className="notification-heading">
                <h3>Notifications</h3>
              </div>

              <hr/ >
              
              {notifications === null ? (
                <p>No more notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification ${notification.isRead ? "read" : "unread"}`}
                  >
                    <div className="notification-title-message">
                      <p><strong>{notification.title} : </strong>{notification.message}</p>
                    </div>
                    <div className="notification-time">
                      <p>{getTimeAgo(notification.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {showLogoutPopup && (
            <LogoutPopup onClose={() => setShowLogoutPopup(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
