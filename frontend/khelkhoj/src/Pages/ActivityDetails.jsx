import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BookingModal from "../Components/BookingModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarDay,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faClock,
  faFireFlameCurved,
  faFlag,
  faHourglassEnd,
  faIdCard,
  faIndianRupeeSign,
  faMapLocationDot,
  faMoneyBill,
  faPeopleGroup,
  faPersonRunning,
  faTicketSimple,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import defaultGroundPic from "../assets/defaultGround.webp";
import "../Styles/GroundDetails.css";

function ActivityDetails() {
  const [ground, setGround] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState(1);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [userId, setUserId] = useState("");
  const [slotError, setSlotError] = useState("");
  const [showModal, setShowmodal] = useState(false);
  const MAX_DURATION = 2;
  let { activityId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/activities/${activityId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          setGround(res.data.activity);
        }
      });
  }, [activityId]);

  useEffect(() => {
    axios.get("http://localhost:3001/user/").then((res) => {
      if (res.data.status === "Success") {
        setUserId(res.data.user_id);
      }
    });
  }, [userId]);

  const nextPhoto = () => {
    setCurrentPhotoIndex(
      (prevIndex) => (prevIndex + 1) % (ground.photo1 ? 4 : 1)
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? (ground.photo1 ? 3 : 0) : prevIndex - 1
    );
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  function formatTime(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourInt = parseInt(hour);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  }
  if (!ground) {
    return <div>Loading...</div>;
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
      <div className="mainGroundDetails">
        <div className="leftGroundDetContainer">
          <h1>{ground.club_name}</h1>
          <div className="photoContainer">
            <FontAwesomeIcon
              icon={faChevronLeft}
              onClick={prevPhoto}
              className="arrow leftArrow"
            />
            <div className="indicatorContainer">
              <img
                src={
                  ground[`photo${currentPhotoIndex + 1}`] || defaultGroundPic
                }
                alt="Ground"
                className="groundImage"
              />
              <div className="photoIndicators">
                {[...Array(ground.photo1 ? 4 : 1)].map((_, index) => (
                  <div
                    key={index}
                    className={`photoIndicator ${
                      index === currentPhotoIndex ? "active" : ""
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            <FontAwesomeIcon
              icon={faChevronRight}
              onClick={nextPhoto}
              className="arrow rightArrow"
            />
          </div>
          <div className="detailsContainer">
            <h3>
              <FontAwesomeIcon icon={faFireFlameCurved} /> Activity :{" "}
            </h3>
            <p className="groundDetDesc"> {ground.activity_name}</p>
            <h3>
              <FontAwesomeIcon icon={faFlag} /> Sport :
            </h3>
            <p className="groundDetDesc">{ground.category}</p>
            <h3>
              <FontAwesomeIcon icon={faCircleInfo} /> Details :{" "}
            </h3>
            <p className="groundDetDesc">{ground.activity_description}</p>

            <h3>
              <FontAwesomeIcon icon={faPeopleGroup} /> Age-group :{" "}
            </h3>
            <p className="groundDetDesc">{ground.age_group}</p>

            <h3>
              <FontAwesomeIcon icon={faMoneyBill} /> Price:{" "}
            </h3>
            <p className="groundDetDesc">
              <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
              {Math.floor(ground.price)}/hour
            </p>

            <p className="groundDetPrice"></p>
            <p className="groundDetDesc">{ground.description}</p>
            <h3>
              <FontAwesomeIcon icon={faUsers} /> About {ground.club_name}:
            </h3>
            <p className="groundDetDesc">{ground.club_description}</p>
          </div>
        </div>
        <div className="rightGroundDetContainer">
          <div className="rightTiming">
            <h3 className="groundDetPrice">
              <FontAwesomeIcon icon={faCalendar} /> From :{" "}
              {formatDate(ground.start_date)} to {formatDate(ground.end_date)}
            </h3>
            <h3 className="groundDetPrice">
              <FontAwesomeIcon icon={faClock} /> Timings :{" "}
              {formatTime(ground.start_time)} to {formatTime(ground.end_time)}
            </h3>
            <h3>
              {" "}
              <FontAwesomeIcon icon={faMapLocationDot} /> Address:
            </h3>
            <a
              className="groundAddress"
              href={ground.address}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps
            </a>
          </div>
          <div className="bookNowContainer">
            <p style={{ fontSize: "20px" }}>
              <FontAwesomeIcon icon={faTicketSimple} /> Entries:{" "}
              {ground.capacity}
            </p>
            <p style={{ fontSize: "20px" }}>
              <FontAwesomeIcon icon={faPersonRunning} /> Instructor info:{" "}
              {ground.instructor_info}
            </p>
            <p style={{ fontSize: "20px" }}>
              <FontAwesomeIcon icon={faIdCard} /> Contact info:{" "}
              {ground.contact_information}
            </p>
            <div className="bookNowButton">
              <p>Enquire now</p>
            </div>

            <div className="errorContainer slotErrorContainer">
              {slotError && <p className="error">{slotError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;
