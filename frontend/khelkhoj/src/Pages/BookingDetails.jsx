import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/GroundConfirmation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CancelModal from "../Components/CancelModal";
import logo from "../assets/KhelKhojLogo.png";
import {
  faArrowLeftLong,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../Components/Loader";

function BookingDetails() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [showModal, setShowmodal] = useState(false);
  const [userId, setUserId] = useState("");
  const [values, setValues] = useState({
    amount: "",
    ground_id: "",
    booking_date: "",
    booking_start_time: "",
  });
  useEffect(() => {
    axios.get("http://localhost:3001/user/").then((res) => {
      if (res.data.status === "Success") {
        setUserId(res.data.user_id);
      }
    });
  }, [userId]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/bookings/${bookingId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          setBooking(res.data.booking);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [bookingId]);
  if (!booking) {
    return <Loader type="user" />;
  }

  // Format the date
  const formattedDate = new Date(booking.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };
  const bookingDateTime = new Date(
    `${formattedDate} ${booking.booking_start_time}`
  );
  const timeDifference = bookingDateTime - new Date();
  // Calculate duration in minutes
  const durationParts = booking.duration.split(" ");
  const hours = parseInt(durationParts[0]);
  const handleCancelBooking = () => {
    setShowmodal(true);
    setValues((values) => ({
      ...values,
      amount: booking.ground_price * hours,
      ground_id: booking.ground_id,
      booking_date: booking.date,
      booking_start_time: booking.booking_start_time,
    }));
  };
  console.log(timeDifference);
  function convertTo12HourFormat(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourInt = parseInt(hour);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
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
        {showModal && (
          <CancelModal
            onClose={() => setShowmodal(false)}
            bookingId={bookingId}
            userId={userId}
            bookingDetails={{
              values: values,
            }}
          />
        )}
        <div className="backButtonContainer">
          <Link to="/allBookings">
            <FontAwesomeIcon
              style={{ height: "24px" }}
              icon={faArrowLeftLong}
              className="backHomeCon"
            />
          </Link>
          <h3 className="headingCon" style={{ marginLeft: "28%" }}>
            {" "}
            Booking details
          </h3>
        </div>
        <h1 className="conMessage">Your booking is confirmed!</h1>
        <h3 style={{ fontWeight: "500" }}>{booking.ground_type}</h3>
        <h3 style={{ fontWeight: "500" }}>
          <FontAwesomeIcon
            style={{ height: "14px", fontWeight: "400" }}
            icon={faIndianRupeeSign}
          />{" "}
          {booking.ground_price * hours}{" "}
          {/* Multiply price by total duration in minutes */}
        </h3>
        <h3 style={{ fontWeight: "500" }}>
          Gear up for some sports action at {booking.club_name} from{" "}
          {convertTo12HourFormat(formatTime(booking.booking_start_time))} to{" "}
          {convertTo12HourFormat(formatTime(booking.booking_end_time))} on{" "}
          {formattedDate}!
        </h3>
        <a
          className="groundAddress"
          href={booking.club_address}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Google Maps
        </a>
        <div className="backConfirmContainer">
          <Link to="/welcomeUser" className="backConfirm">
            Home
          </Link>

          {timeDifference > 0 && (
            <Link className="cancelBooking" onClick={handleCancelBooking}>
              Cancel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
