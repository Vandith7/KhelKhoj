import React, { useEffect, useState } from "react";
import "../Styles/WelcomeUser.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import venue from "../assets/venue.webp";
import defaultDp from "../assets/user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faFutbol,
  faCalendarDay,
  faRightFromBracket,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Welcome from "./Welcome";
import Greeting from "../Components/Greetings";

function WelcomeUser() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false); // State to manage tooltip visibility
  const navigate = useHistory();
  console.log("name" + name);
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
  useEffect(() => {
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
  }, [auth, navigate, hasName]);

  return !auth ? (
    <Welcome />
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
              placeholder="Search for grounds and activities"
              className="searchBox"
            ></input>
          </div>
          <ul className="ulLink">
            <li>
              <Link to="/activities" className="links">
                Activities
              </Link>
            </li>
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
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            {/* Other venue cards */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeUser;
