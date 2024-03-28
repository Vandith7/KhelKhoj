import React, { useEffect, useState, useCallback } from "react";
import "../Styles/WelcomeUser.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import defaultDp from "../assets/user.jpg";
import defaultGroundPic from "../assets/defaultGround.webp";
import notFound from "../assets/not-found.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import {
  faCalendarDays,
  faLocationDot,
  faCalendarDay,
  faRightFromBracket,
  faClock,
  faFlag,
  faHourglassStart,
  faHourglassEnd,
  faIndianRupeeSign,
  faHourglassHalf,
  faFireFlameCurved,
  faPeopleGroup,
  faTicketAlt,
  faCalendarXmark,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Greeting from "../Components/Greetings";
import UserLogin from "./UserLogin";

function WelcomeUser() {
  const [auth, setAuth] = useState(false);
  const [grounds, setGrounds] = useState([]);
  const [activities, setActivities] = useState([]);
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [latitude, setLatitude] = useState(null); // State to store latitude
  const [longitude, setLongitude] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to store longitude
  const [bookings, setBookings] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const navigate = useHistory();

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
    const dLon = ((lon2 - lon1) * Math.PI) / 180; // Convert degrees to radians
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  function formatDate(dateString) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  // Define the extractLatLongFromURL function
  function extractLatLongFromURL(url) {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const latLongMatch = url.match(regex);
    if (latLongMatch) {
      const lat = parseFloat(latLongMatch[1]);
      const long = parseFloat(latLongMatch[2]);
      return { lat, long };
    } else {
      return null;
    }
  }
  const fetchWalletBalance = () => {
    axios
      .get("http://localhost:3001/user/wallet/balance")
      .then((res) => {
        if (res.data.status === "Success") {
          setWalletBalance(res.data.balance);
        } else {
          console.error("Error fetching wallet balance:", res.data.error);
        }
      })
      .catch((err) => {
        console.error("Error fetching wallet balance:", err);
      });
  };
  // Define the getDistanceBetweenLocations function
  const getDistanceBetweenLocations = useCallback(
    (groundUrl, userLat, userLong) => {
      const groundLatLong = extractLatLongFromURL(groundUrl);
      if (groundLatLong) {
        const distance = calculateDistance(
          groundLatLong.lat,
          groundLatLong.long,
          userLat,
          userLong
        );
        return distance.toFixed(2);
      } else {
        return null;
      }
    },
    []
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterResults = (items) => {
    if (!searchQuery.trim()) {
      return items;
    }

    const options = {
      keys: ["club_name", "type", "activity_name", "category"],
      threshold: 0.5, // Adjust threshold as per your preference
      includeScore: true,
      findAllMatches: true,
    };

    const fuse = new Fuse(items, options);

    const result = fuse.search(searchQuery);

    return result.map((item) => item.item);
  };
  const handleLogout = () => {
    axios
      .get("http://localhost:3001/user/logout")
      .then((res) => {
        if (res.data.status === "Success") {
          navigate.push("/");
        }
      })
      .catch((err) => console.log(err));
  };
  console.log(activities);

  useEffect(() => {
    fetchWalletBalance();
    function sortGroundsByDistance(grounds) {
      if (latitude !== null && longitude !== null) {
        grounds.sort((a, b) => {
          const distanceA = getDistanceBetweenLocations(
            a.address,
            latitude,
            longitude
          );
          const distanceB = getDistanceBetweenLocations(
            b.address,
            latitude,
            longitude
          );
          if (distanceA === null) return 1;
          if (distanceB === null) return -1;
          return distanceA - distanceB;
        });
      }
      return grounds;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    axios.get(`http://localhost:3001/user/grounds`).then((res) => {
      if (res.data.status === "Success") {
        const sortedGrounds = sortGroundsByDistance(res.data.grounds);
        setGrounds(sortedGrounds);
      }
    });
    axios.get(`http://localhost:3001/user/activities`).then((res) => {
      if (res.data.status === "Success") {
        const sortedActivities = sortGroundsByDistance(res.data.activities);
        setActivities(sortedActivities);
      }
    });
    axios
      .get("http://localhost:3001/user/")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuth(true);
          if (!hasName) {
            setName(res.data.name);
            setHasName(true);
          }
          if (res.data.profile_photo) {
            setProfilePhoto(res.data.profile_photo);
          }
          navigate.push("/welcomeUser");
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    axios.get(`http://localhost:3001/user/getBookings/`).then((res) => {
      if (res.data.status === "Success") {
        setBookings(res.data.bookings);
      }
    });
  }, [
    latitude,
    longitude,
    hasName,
    navigate,
    auth,
    getDistanceBetweenLocations,
  ]);
  function convertTo12HourFormat(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourInt = parseInt(hour);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  }
  return !auth ? (
    <UserLogin />
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
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search for grounds and activities of your favourite club "
              className="searchBox"
              value={searchQuery}
              onChange={handleSearchChange}
            ></input>
          </div>
          <ul className="ulLink">
            <motion.li
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="wallet"
            >
              <Link to="/wallet" className="walletLink">
                <FontAwesomeIcon style={{ fontSize: 18 }} icon={faWallet} />
                <span className="walletBalance">
                  <FontAwesomeIcon
                    style={{ fontSize: 18, marginRight: "5px", color: "black" }}
                    icon={faIndianRupeeSign}
                  />{" "}
                  <div style={{ fontWeight: "600" }}>{walletBalance}</div>
                </span>
              </Link>
            </motion.li>
            <li>
              <Link to="/updateUser" className="links">
                <img
                  className="userProfile"
                  src={profilePhoto || defaultDp}
                  alt="Khel-Khoj"
                />
              </Link>
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
          <h2 style={{ color: "#000", fontWeight: "600" }}>
            <FontAwesomeIcon
              style={{ fontSize: 24, marginRight: "5%", color: "#000" }}
              icon={faCalendarDays}
            />
            Upcoming bookings
          </h2>
          <ul className="leftCardContainer">
            {bookings ? (
              bookings
                .filter(
                  (booking) =>
                    booking.status === "confirmed" && // Filter out canceled bookings
                    new Date(`${booking.date}T${booking.booking_end_time}`) >
                      new Date()
                ) // Filter out bookings whose end time has passed
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
                bookings
                  .filter(
                    (booking) =>
                      booking.status === "confirmed" && // Filter out canceled bookings
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
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="cardsLeft"
                      key={booking.booking_id}
                    >
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={`/bookingDetails/${booking.booking_id}`}
                      >
                        <h2 className="venueLeft">
                          <FontAwesomeIcon
                            style={{ fontSize: 18, marginRight: "2%" }}
                            icon={faLocationDot}
                          />
                          {booking.club_name}
                        </h2>
                        <p className="activityLeft">
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faFlag}
                          />
                          {booking.ground_type}
                        </p>
                        <p className="dayLeft">
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faCalendarDay}
                          />
                          {formatDate(booking.date)}
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
                    </motion.div>
                  ))
              ) : (
                <div className="noBookings">
                  <FontAwesomeIcon
                    style={{ fontSize: 55, marginRight: "2%" }}
                    icon={faCalendarXmark}
                  />
                  <h3>No upcoming bookings</h3>
                </div>
              )
            ) : (
              <div>Loading...</div>
            )}
            <Link to="/allBookings" className="seeAll">
              See all
            </Link>
          </ul>
        </motion.div>
        <div className="rightBar">
          {" "}
          <motion.div
            className="greetContainer"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "tween", stiffness: 120 }}
          >
            <Greeting name={name} />
          </motion.div>
          <div className="venueContainer">
            <h2 className="groundActivityHeading">Grounds</h2>
            <div className="groundVenueContainer">
              {filterResults(grounds).length === 0 ? (
                <div
                  className="emptyResults"
                  style={{
                    backgroundImage: `url(${notFound})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                >
                  <p style={{ marginTop: "320px" }}>No grounds available</p>
                </div>
              ) : (
                filterResults(grounds).map((ground) => (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="venueCard"
                    key={ground.ground_id}
                  >
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/groundDetails/${ground.ground_id}`}
                      className="venueLink"
                    >
                      {ground.photo1 ? (
                        <img
                          className="venuePic"
                          src={ground.photo1}
                          alt="Ground"
                        />
                      ) : (
                        <img
                          className="venuePic"
                          src={defaultGroundPic}
                          alt="Default Ground"
                        />
                      )}
                      <h3 style={{ marginLeft: "2%", color: "#F99810" }}>
                        <FontAwesomeIcon
                          style={{ fontSize: 15, marginRight: "2%" }}
                          icon={faLocationDot}
                        />
                        {ground.club_name}{" "}
                        {ground.address.startsWith("https://") &&
                          ground.address.includes("maps") &&
                          latitude &&
                          longitude &&
                          `(~ ${Math.ceil(
                            parseFloat(
                              getDistanceBetweenLocations(
                                ground.address,
                                latitude,
                                longitude
                              )
                            ) * 1.5
                          )} km)`}
                      </h3>

                      <p>
                        <FontAwesomeIcon
                          style={{ fontSize: 15, marginRight: "2%" }}
                          icon={faFlag}
                        />
                        Ground Type: {ground.type}
                      </p>
                      <p>
                        <FontAwesomeIcon
                          style={{ fontSize: 15, marginRight: "2%" }}
                          icon={faHourglassStart}
                        />
                        Opens at {convertTo12HourFormat(ground.start_time)}
                      </p>
                      <p>
                        <FontAwesomeIcon
                          style={{ fontSize: 15, marginRight: "2%" }}
                          icon={faHourglassEnd}
                        />
                        Closes at {convertTo12HourFormat(ground.end_time)}
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
                ))
              )}
            </div>

            <h2 className="groundActivityHeading">Activities</h2>
            <div className="groundVenueContainer">
              {filterResults(activities).length === 0 ? (
                <div
                  className="emptyResults"
                  style={{
                    backgroundImage: `url(${notFound})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                >
                  <p style={{ marginTop: "320px" }}>No activities available</p>
                </div>
              ) : (
                filterResults(activities)
                  .filter(
                    (activity) => new Date(activity.end_date) > new Date()
                  ) // Filter out activities whose end date is in the future
                  .map((activity) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="activityCard"
                      key={activity.activity_id}
                    >
                      <Link
                        to={`/activityDetails/${activity.activity_id}`}
                        className="venueLink"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        {activity.photo1 ? (
                          <img
                            className="groundClubPic"
                            src={activity.photo1}
                            alt="Activity"
                          />
                        ) : (
                          <img
                            className="venuePic"
                            src={defaultGroundPic}
                            alt="Default Activity"
                          />
                        )}
                        <h3 style={{ marginLeft: "2%", color: "#F99810" }}>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faFireFlameCurved}
                          />
                          {activity.activity_name}
                        </h3>
                        <h4 style={{ marginLeft: "2%" }}>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faLocationDot}
                          />
                          {activity.club_name}{" "}
                          {activity.address &&
                            latitude &&
                            longitude &&
                            `(~ ${Math.ceil(
                              parseFloat(
                                getDistanceBetweenLocations(
                                  activity.address,
                                  latitude,
                                  longitude
                                )
                              ) * 1.5
                            )} km)`}
                        </h4>
                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faCalendarDays}
                          />
                          From {activity.start_date} to {activity.end_date}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faHourglassHalf}
                          />
                          Timings: {convertTo12HourFormat(activity.start_time)}{" "}
                          - {convertTo12HourFormat(activity.end_time)}
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
                            icon={faTicketAlt}
                          />
                          Entries: {activity.capacity}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            style={{ fontSize: 15, marginRight: "2%" }}
                            icon={faIndianRupeeSign}
                          />
                          Price: {Math.floor(activity.price)}/person
                        </p>
                      </Link>
                    </motion.div>
                  ))
              )}
            </div>
            <div className="blank"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeUser;
