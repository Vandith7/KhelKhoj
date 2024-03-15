import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import {
  faCalendar,
  faChevronLeft,
  faChevronRight,
  faCircleArrowLeft,
  faCircleInfo,
  faClock,
  faFireFlameCurved,
  faFlag,
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
import ActivityModal from "../Components/ActivityModal";
import Loader from "../Components/Loader";

function ActivityDetails() {
  const [ground, setGround] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [showModal, setShowmodal] = useState(false);
  const navigate = useHistory();
  let { activityId } = useParams();
  const handleEnquireNow = () => {
    setShowmodal(true);
  };
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
  const navigateToHome = () => {
    navigate.push("/welcomeUser");
  };
  function formatTime(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourInt = parseInt(hour);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  }

  if (!ground) {
    return <Loader type="user" />;
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mainGroundDetails"
      >
        <AnimatePresence>
          {showModal && (
            <ActivityModal
              onClose={() => setShowmodal(false)}
              activityId={activityId}
              club_name={ground.club_name}
            />
          )}
        </AnimatePresence>
        <div className="leftGroundDetContainer">
          <h1>
            {" "}
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="groundBackButton"
              onClick={navigateToHome}
            />{" "}
            {ground.club_name}
          </h1>
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
              {Math.floor(ground.price)}/person
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
              <span style={{ fontWeight: "600" }}>
                <FontAwesomeIcon icon={faCalendar} /> From :{" "}
              </span>
              {formatDate(ground.start_date)} to {formatDate(ground.end_date)}
            </h3>
            <h3 className="groundDetPrice">
              <span style={{ fontWeight: "600" }}>
                <FontAwesomeIcon icon={faClock} /> Timings :{" "}
              </span>
              {formatTime(ground.start_time)} to {formatTime(ground.end_time)}
            </h3>
            <h3>
              {" "}
              <FontAwesomeIcon icon={faMapLocationDot} /> Address :{" "}
              {ground.address ? (
                ground.address.startsWith("https://") &&
                ground.address.includes("maps") ? (
                  <a
                    className="groundAddress"
                    href={ground.address}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                ) : (
                  <p className="groundAddress2">{ground.address}</p>
                )
              ) : (
                <p className="groundAddress2">No address available</p>
              )}
            </h3>
          </div>
          <div className="bookNowContainer">
            <p style={{ fontSize: "20px" }}>
              <span style={{ fontWeight: "600" }}>
                <FontAwesomeIcon icon={faTicketSimple} /> Entries:{" "}
              </span>
              {ground.capacity}
            </p>
            <p style={{ fontSize: "20px" }}>
              <span style={{ fontWeight: "600" }}>
                <FontAwesomeIcon icon={faPersonRunning} /> Instructor info:{" "}
              </span>
              {ground.instructor_info}
            </p>
            <p style={{ fontSize: "20px" }}>
              <span style={{ fontWeight: "600" }}>
                <FontAwesomeIcon icon={faIdCard} /> Contact info:{" "}
              </span>
              {ground.contact_information}
            </p>
            <div className="bookNowButton">
              <p onClick={handleEnquireNow}>Enquire now</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ActivityDetails;
