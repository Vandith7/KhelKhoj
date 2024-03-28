import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import axios from "axios";
import {
  faLocationDot,
  faCalendarDay,
  faClock,
  faFlag,
  faCalendarXmark,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/KhelKhojLogo.png";
import "../Styles/WelcomeUser.css";
import "../Styles/AllBookings.css";

function AllBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/user/getBookings/`).then((res) => {
      if (res.data.status === "Success") {
        const sortedBookings = res.data.bookings.sort((a, b) => {
          const dateComparison =
            new Date(a.date + "T" + a.booking_start_time) -
            new Date(b.date + "T" + b.booking_start_time);
          return dateComparison;
        });

        const today = new Date();
        const upcoming = sortedBookings.filter((booking) => {
          const bookingDate = new Date(
            booking.date + "T" + booking.booking_start_time
          );
          return bookingDate >= today && booking.status !== "cancelled";
        });

        const past = sortedBookings.filter((booking) => {
          const bookingDate = new Date(
            booking.date + "T" + booking.booking_start_time
          );
          return bookingDate < today && booking.status !== "cancelled";
        });

        const cancelled = sortedBookings.filter(
          (booking) => booking.status === "cancelled"
        );

        setUpcomingBookings(upcoming);
        setPastBookings(past);
        setCancelledBookings(cancelled);
      }
    });
  }, []);

  function formatDate(dateString) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }

  function convertTo12HourFormat(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourInt = parseInt(hour);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  }

  return (
    <div className="container">
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
      <div className="allBookingContainer">
        <h1 style={{ marginLeft: "1%" }}>Upcoming bookings</h1>
        <div className="groundBookingContainer">
          {upcomingBookings && upcomingBookings.length > 0 ? (
            upcomingBookings.map((upcomingBooking) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="allBookingCards"
                key={upcomingBooking.booking_id}
              >
                <Link
                  style={{ color: "black", textDecoration: "none" }}
                  to={`/bookingDetails/${upcomingBooking.booking_id}`}
                >
                  <h2 className="allBookingName">
                    <FontAwesomeIcon
                      style={{ fontSize: 18, marginRight: "2%" }}
                      icon={faLocationDot}
                    />
                    {upcomingBooking.club_name}
                  </h2>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faFlag}
                    />
                    {upcomingBooking.ground_type}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faCalendarDay}
                    />
                    {formatDate(upcomingBooking.date)}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faClock}
                    />
                    {convertTo12HourFormat(
                      upcomingBooking.booking_start_time.slice(0, 5)
                    )}{" "}
                    to{" "}
                    {convertTo12HourFormat(
                      upcomingBooking.booking_end_time.slice(0, 5)
                    )}
                  </p>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="noAllBookings">
              <FontAwesomeIcon
                style={{ fontSize: 55, marginRight: "2%" }}
                icon={faCalendarXmark}
              />
              <h3>No upcoming bookings</h3>
            </div>
          )}
        </div>
        <h1 style={{ marginLeft: "1%" }}>Past bookings</h1>
        <div className="groundBookingContainer">
          {pastBookings && pastBookings.length > 0 ? (
            pastBookings.map((pastBooking) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="allBookingCards"
                key={pastBooking.booking_id}
              >
                <Link
                  style={{ color: "black", textDecoration: "none" }}
                  to={`/bookingDetails/${pastBooking.booking_id}`}
                >
                  <h2 className="allBookingName">
                    <FontAwesomeIcon
                      style={{ fontSize: 18, marginRight: "2%" }}
                      icon={faLocationDot}
                    />
                    {pastBooking.club_name}
                  </h2>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faFlag}
                    />
                    {pastBooking.ground_type}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faCalendarDay}
                    />
                    {formatDate(pastBooking.date)}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faClock}
                    />
                    {convertTo12HourFormat(
                      pastBooking.booking_start_time.slice(0, 5)
                    )}{" "}
                    to{" "}
                    {convertTo12HourFormat(
                      pastBooking.booking_end_time.slice(0, 5)
                    )}
                  </p>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="noAllBookings">
              <FontAwesomeIcon
                style={{ fontSize: 55, marginRight: "2%" }}
                icon={faCalendarXmark}
              />
              <h3>No past bookings</h3>
            </div>
          )}
        </div>
        <h1 style={{ marginLeft: "1%" }}>Cancelled bookings</h1>
        <div className="groundBookingContainer">
          {cancelledBookings && cancelledBookings.length > 0 ? (
            cancelledBookings.map((cancelledBooking) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="allBookingCards"
                key={cancelledBooking.booking_id}
              >
                <Link
                  style={{ color: "black", textDecoration: "none" }}
                  to={`/bookingDetails/${cancelledBooking.booking_id}`}
                >
                  <h2 className="allBookingName">
                    <FontAwesomeIcon
                      style={{ fontSize: 18, marginRight: "2%" }}
                      icon={faLocationDot}
                    />
                    {cancelledBooking.club_name}
                  </h2>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faFlag}
                    />
                    {cancelledBooking.ground_type}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faCalendarDay}
                    />
                    {formatDate(cancelledBooking.date)}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      style={{ fontSize: 15, marginRight: "2%" }}
                      icon={faClock}
                    />
                    {convertTo12HourFormat(
                      cancelledBooking.booking_start_time.slice(0, 5)
                    )}{" "}
                    to{" "}
                    {convertTo12HourFormat(
                      cancelledBooking.booking_end_time.slice(0, 5)
                    )}
                  </p>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="noAllBookings">
              <FontAwesomeIcon
                style={{ fontSize: 55, marginRight: "2%" }}
                icon={faCalendarXmark}
              />
              <h3>No cancelled bookings</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllBookings;
