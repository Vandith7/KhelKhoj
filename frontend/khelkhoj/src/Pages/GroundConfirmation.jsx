import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../Styles/GroundConfirmation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/KhelKhojLogo.png";
import {
  faArrowLeftLong,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

function GroundConfirmation() {
  const location = useLocation();
  const { values } = location.state;

  // Function to convert 24-hour format to 12-hour format
  function convertTo12HourFormat(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourInt = parseInt(hour);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  }

  function formatDate(dateString) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  return (
    <div className="containerConfirm">
      <div className="header">
        <img className="logo" src={logo} alt="Khel-Khoj" />
        <Link style={{ textDecoration: "none" }} to="/">
          <p
            style={{
              color: "#F19006",
              fontFamily: "Quicksand",
              fontSize: "28px",
            }}
          >
            Khel-Khoj
          </p>
        </Link>
        <div className="nav-links">
          <ul className="ulLink">
            <Link to="/welcomeUser" className="links">
              Home
            </Link>
          </ul>
        </div>
      </div>
      <div className="confirmationContainer">
        <div className="backButtonContainer">
          <Link to="/welcomeUser">
            <FontAwesomeIcon
              style={{ height: "24px" }}
              icon={faArrowLeftLong}
              className="backHomeCon"
            />
          </Link>
          <h3 className="headingCon"> Booking confirmation</h3>
        </div>
        <h1 className="conMessage">Your booking is confirmed!</h1>
        <h3 style={{ fontWeight: "500" }}>{values.ground_type}</h3>
        <h3 style={{ fontWeight: "500" }}> {formatDate(values.date)}</h3>
        <h3 style={{ fontWeight: "500" }}>
          <FontAwesomeIcon
            style={{ height: "14px", fontWeight: "400" }}
            icon={faIndianRupeeSign}
          />{" "}
          {values.price * values.duration}
        </h3>
        <h3 style={{ fontWeight: "500" }}>
          Gear up for some sports action at {values.club_name} from{" "}
          {convertTo12HourFormat(values.startTime)} to{" "}
          {convertTo12HourFormat(values.endTime)} on {formatDate(values.date)}!
        </h3>
        <div className="backConfirmContainer">
          <Link to="/welcomeUser" className="backConfirm">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GroundConfirmation;
