import React, { useEffect, useState } from "react";
import "../Styles/WelcomeUser.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import defaultDp from "../assets/user.jpg";
import defaultGroundPic from "../assets/defaultGround.webp";
import notFound from "../assets/not-found.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faFutbol,
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

  // Define the getDistanceBetweenLocations function
  function getDistanceBetweenLocations(groundUrl, userLat, userLong) {
    const groundLatLong = extractLatLongFromURL(groundUrl);
    if (groundLatLong) {
      const distance = calculateDistance(
        groundLatLong.lat,
        groundLatLong.long,
        userLat,
        userLong
      );
      return distance.toFixed(2); // Round to 2 decimal places
    } else {
      return null;
    }
  }

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to filter grounds/activities based on search query
  const filterResults = (items) => {
    return items.filter((item) => {
      if (
        item.club_name &&
        item.club_name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
      if (
        item.type &&
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
      if (
        item.activity_name &&
        item.activity_name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
      if (
        item.category &&
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
      return false; // Return false if none of the conditions match
    });
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
  }, [latitude, longitude, hasName, navigate, auth]);

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
              placeholder="Search for grounds and activities of your favourite club"
              className="searchBox"
              value={searchQuery}
              onChange={handleSearchChange}
            ></input>
          </div>
          <ul className="ulLink">
            <li>
              <Link to="/" className="links">
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
        <div className="leftBar">
          <h2>
            <FontAwesomeIcon
              style={{ fontSize: 24, marginRight: "5%" }}
              icon={faCalendarDays}
            />
            Upcoming bookings
          </h2>
          <ul className="leftCardContainer">
            <div className="cardsLeft">
              <h2 className="venueLeft">
                <FontAwesomeIcon
                  style={{ fontSize: 18, marginRight: "2%" }}
                  icon={faLocationDot}
                />
                Venue{" "}
              </h2>
              <p className="activityLeft">
                {" "}
                <FontAwesomeIcon
                  style={{ fontSize: 15, marginRight: "2%" }}
                  icon={faFutbol}
                />
                Activity
              </p>
              <p className="dayLeft">
                <FontAwesomeIcon
                  style={{ fontSize: 15, marginRight: "2%" }}
                  icon={faCalendarDay}
                />
                Today
              </p>
              <p className="slotLeft">
                <FontAwesomeIcon
                  style={{ fontSize: 15, marginRight: "2%" }}
                  icon={faClock}
                />
                00:00 to 00:00
              </p>
            </div>
            <div className="cardsLeft"></div>
            <div className="cardsLeft"></div>
            <div className="cardsLeft"></div>
          </ul>
        </div>
        <div className="rightBar">
          <div className="greetContainer">
            <Greeting name={name} />
          </div>

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
                  <Link
                    to={`/groundDetails/${ground.ground_id}`}
                    key={ground.ground_id}
                    className="venueCard"
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
                      {ground.address &&
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
                filterResults(activities).map((activity) => (
                  <Link
                    to={`/activityDetails/${activity.activity_id}`}
                    key={activity.activity_id}
                    className="activityCard"
                  >
                    {activity.photo1 ? (
                      <img
                        className="venuePic"
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
                      Timings: {activity.start_time} - {activity.end_time}
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
