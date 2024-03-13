import React, { useEffect, useState } from "react";
import "../Styles/WelcomeUser.css";
import "../Styles/WelcomeClub.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import defaultDp from "../assets/user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
  faCalendarDays,
  faRightFromBracket,
  faClock,
  faPlus,
  faHourglassStart,
  faHourglassEnd,
  faIndianRupeeSign,
  faFlag,
  faCircleInfo,
  faFireFlameCurved,
  faPeopleGroup,
  faCalendar,
  faTicketAlt,
  faIdCard,
  faCalendarDay,
  faCalendarXmark,
  faUser,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ClubGreetings from "../Components/ClubGreetings";
import ClubLogin from "./ClubLogin";

function WelcomeClub() {
  const [grounds, setGrounds] = useState([]);
  const [activities, setActivities] = useState([]);
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false); // State to manage tooltip visibility
  const [bookings, setBookings] = useState(null);
  const navigate = useHistory();

  const handleLogout = () => {
    axios
      .get("http://localhost:3001/club/logout")
      .then((res) => {
        if (res.data.status === "Success") {
          navigate.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/club/")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuth(true);

          if (!hasName) {
            setName(res.data.name);
            setHasName(true);
          }
          if (res.data.status === "Success") {
            const clubId = res.data.club_id;
            console.log(clubId + "clubid");
            axios
              .get(`http://localhost:3001/club/activities/${clubId}`)
              .then((res) => {
                if (res.data.status === "Success") {
                  setActivities(res.data.activities);
                }
              })
              .catch((err) => {
                console.error(err);
              });
            axios.get(`http://localhost:3001/club/bookings/`).then((res) => {
              if (res.data.status === "Success") {
                setBookings(res.data.bookings);
              }
            });
            axios
              .get(`http://localhost:3001/club/grounds/${clubId}`) // Update the endpoint to accept club_id
              .then((res) => {
                if (res.data.status === "Success") {
                  setGrounds(res.data.grounds); // Assuming your API response contains grounds data
                }
              });
          }
          if (res.data.profile_photo) {
            setProfilePhoto(res.data.profile_photo);
            console.log(res.data);
          }
          navigate.push("/welcomeClub");
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [auth, navigate, hasName]);
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
  return !auth ? (
    <ClubLogin />
  ) : (
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
            <li>
              <div className="links">
                <img
                  className="userProfile"
                  src={profilePhoto || defaultDp}
                  alt="Khel-Khoj"
                />
              </div>
            </li>
            <li
              className="logoutButton"
              onMouseEnter={() => setShowTooltip(true)} // Show tooltip on mouse enter
              onMouseLeave={() => setShowTooltip(false)} // Hide tooltip on mouse leave
              onClick={handleLogout}
            >
              <FontAwesomeIcon
                style={{ fontSize: 20, marginLeft: "20px" }}
                icon={faRightFromBracket}
              />
              {showTooltip && <div className="tooltip">Logout</div>}{" "}
              {/* Show tooltip if state is true */}
            </li>
          </ul>
        </div>
      </div>
      <div className="main">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="leftBar"
        >
          <h2 style={{ color: "black" }}>
            <FontAwesomeIcon
              style={{ fontSize: 24, marginRight: "5%" }}
              icon={faCalendarDays}
            />
            Upcoming bookings
          </h2>
          <ul className="leftCardContainer">
            {bookings ? (
              // Filter and sort the bookings to display only upcoming ones
              bookings
                .filter(
                  (booking) =>
                    new Date(`${booking.date}T${booking.booking_end_time}`) >
                    new Date()
                )
                .sort((a, b) => {
                  const dateComparison = new Date(a.date) - new Date(b.date);
                  if (dateComparison !== 0) {
                    return dateComparison;
                  } else {
                    return (
                      new Date(`1970-01-01T${a.booking_start_time}`) -
                      new Date(`1970-01-01T${b.booking_start_time}`)
                    );
                  }
                }).length > 0 ? (
                // If there are upcoming bookings, display them
                bookings
                  .filter(
                    (booking) =>
                      new Date(`${booking.date}T${booking.booking_end_time}`) >
                      new Date()
                  )
                  .sort((a, b) => {
                    const dateComparison = new Date(a.date) - new Date(b.date);
                    if (dateComparison !== 0) {
                      return dateComparison;
                    } else {
                      return (
                        new Date(`1970-01-01T${a.booking_start_time}`) -
                        new Date(`1970-01-01T${b.booking_start_time}`)
                      );
                    }
                  })
                  .map((booking) => (
                    <Link className="cardsLeft" key={booking.booking_id}>
                      <h2 className="venueLeft">
                        <FontAwesomeIcon
                          style={{ fontSize: 18, marginRight: "2%" }}
                          icon={faUser}
                        />
                        {booking.user_name}
                      </h2>
                      <p className="dayLeft">
                        <FontAwesomeIcon
                          style={{ fontSize: 15, marginRight: "2%" }}
                          icon={faCalendarDay}
                        />
                        {formatDate(booking.date)}
                      </p>
                      <p className="dayLeft">
                        <FontAwesomeIcon
                          style={{ fontSize: 15, marginRight: "2%" }}
                          icon={faFlag}
                        />
                        {booking.ground_type}
                      </p>
                      <p className="slotLeft">
                        <FontAwesomeIcon
                          style={{ fontSize: 15, marginRight: "2%" }}
                          icon={faClock}
                        />
                        {convertTo12HourFormat(
                          booking.booking_start_time.slice(0, 5)
                        )}{" "}
                        to{" "}
                        {convertTo12HourFormat(
                          booking.booking_end_time.slice(0, 5)
                        )}
                      </p>
                    </Link>
                  ))
              ) : (
                // If there are no upcoming bookings, display a message
                <div className="noBookings">
                  <FontAwesomeIcon
                    style={{ fontSize: 55, marginRight: "2%" }}
                    icon={faCalendarXmark}
                  />
                  <h3>No upcoming bookings</h3>
                </div>
              )
            ) : (
              // If bookings data is not available, display loading or placeholder
              <div>Loading...</div>
            )}
            <Link to="/clubAllBookings" className="seeAll">
              See all
            </Link>
          </ul>
        </motion.div>
        <div className="rightBar">
          <motion.div
            className="greetContainer"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "tween", stiffness: 120 }}
          >
            <ClubGreetings name={name} />
          </motion.div>
          <div className="addGroundAndActivities">
            {grounds.length > 0 ? (
              <div className="groundsClubContainer">
                <h1 style={{ color: "#F99810" }}> Your Grounds </h1>
                <div>
                  {grounds.map((ground) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="groundClubCard"
                      transition={{ duration: 0.5 }}
                    >
                      <Link
                        style={{ color: "black", textDecoration: "none" }}
                        to={`/clubGroundDetails/${ground.ground_id}`}
                        key={ground.ground_id}
                      >
                        {ground.photo1 && (
                          <img
                            className="groundClubPic"
                            src={ground.photo1}
                            alt="Ground"
                          />
                        )}
                        <h3 style={{ marginLeft: "2%", color: "#F99810" }}>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faFlag}
                          />
                          Ground Type: {ground.type}
                        </h3>
                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faEye}
                          />
                          Booking Availability:{" "}
                          {ground.visibility === 1
                            ? "(Open for booking)"
                            : "(Not available for booking)"}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faCircleInfo}
                          />
                          Details: {ground.description}
                        </p>

                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faHourglassStart}
                          />
                          Opens at {ground.start_time}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faHourglassEnd}
                          />
                          Closes at {ground.end_time}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faIndianRupeeSign}
                          />
                          Price: {ground.price}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <Link to="/addGround" className="addGroundSmall">
                    <p>
                      <FontAwesomeIcon style={{ fontSize: 28 }} icon={faPlus} />
                    </p>
                  </Link>
                </div>
                <h2> </h2>
              </div>
            ) : (
              <>
                <div className="AddClubGround">
                  {/* Render the "Add Ground" button */}
                  <Link to="/addGround" className="addGround">
                    <p>
                      <FontAwesomeIcon style={{ fontSize: 28 }} icon={faPlus} />
                    </p>
                    <h3>Add your Ground</h3>
                  </Link>
                </div>
              </>
            )}

            {activities.length > 0 ? (
              <div className="groundsClubContainer">
                <h1 style={{ color: "#F99810" }}> Your Activities </h1>
                <div>
                  {activities.map((activity) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {" "}
                      <Link
                        style={{ color: "black", textDecoration: "none" }}
                        to={`/clubActivityDetails/${activity.activity_id}`}
                        key={activity.activity_id}
                      >
                        <li
                          key={activity.activity_id}
                          className="groundClubCard"
                        >
                          {activity.photo1 && (
                            <img
                              className="groundClubPic"
                              src={activity.photo1}
                              alt="Ground"
                            />
                          )}

                          <h3 style={{ marginLeft: "2%", color: "#F99810" }}>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faFlag}
                            />
                            Name: {activity.activity_name}
                          </h3>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faEye}
                            />
                            Activty Availability:{" "}
                            {activity.visibility === 1
                              ? "(Open for enquiry)"
                              : "(Not visible to users)"}
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faFireFlameCurved}
                            />
                            Activity: {activity.category}
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faCircleInfo}
                            />
                            Details: {activity.description}
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faPeopleGroup}
                            />
                            Age group: {activity.age_group}
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faCalendar}
                            />
                            From {activity.start_date} to {activity.end_date}
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faClock}
                            />
                            Timings: {activity.start_time} to{" "}
                            {activity.end_time}
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faTicketAlt}
                            />
                            Entries: {activity.capacity}
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faIndianRupeeSign}
                            />
                            Price: {activity.price}/person
                          </p>
                          <p>
                            <FontAwesomeIcon
                              style={{ fontSize: 15, marginRight: "2%" }}
                              icon={faIdCard}
                            />
                            Contact details: {activity.contact_information}
                          </p>
                        </li>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <Link to="/addActivity" className="addGroundSmall">
                    <p>
                      <FontAwesomeIcon style={{ fontSize: 28 }} icon={faPlus} />
                    </p>
                  </Link>
                </div>
                <h2> </h2>
              </div>
            ) : (
              <>
                <div className="AddClubActivity">
                  <Link to="/addActivity" className="addActivity">
                    <p>
                      <FontAwesomeIcon style={{ fontSize: 28 }} icon={faPlus} />
                    </p>
                    <h3>Add Activities</h3>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeClub;
