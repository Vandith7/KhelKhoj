import React, { useEffect, useState } from "react";
import "../Styles/WelcomeUser.css";
import "../Styles/WelcomeClub.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import defaultDp from "../assets/user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
          <ul className="leftCardContainer"></ul>
        </div>
        <div className="rightBar">
          <div className="greetContainer">
            <ClubGreetings name={name} />
          </div>
          <div className="addGroundAndActivities">
            {grounds.length > 0 ? (
              <div className="groundsClubContainer">
                <h1 style={{ color: "#F99810" }}> Your Grounds </h1>
                <div>
                  {grounds.map((ground) => (
                    <li key={ground.ground_id} className="groundClubCard">
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
                    </li>
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
                    <li key={activity.activity_id} className="groundClubCard">
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
                        Timings: {activity.start_time} to {activity.end_time}
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
