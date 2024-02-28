import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faClock,
  faFlag,
  faHourglassEnd,
  faIndianRupeeSign,
  faMapLocationDot,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import "../Styles/GroundDetails.css";

function GroundDetails() {
  const [ground, setGround] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState(1);
  const MAX_DURATION = 2;
  let { groundId } = useParams();

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
  };
  const handleIncrementDuration = () => {
    if (duration < MAX_DURATION) {
      setDuration((prevDuration) => prevDuration + 1);
    }
  };

  const handleDecrementDuration = () => {
    if (duration > 1) {
      setDuration((prevDuration) => prevDuration - 1);
    }
  };
  useEffect(() => {
    axios.get(`http://localhost:3001/user/grounds/${groundId}`).then((res) => {
      if (res.data.status === "Success") {
        setGround(res.data.ground);
      }
    });
  }, [groundId]);

  const generateTimeOptions = () => {
    const options = [];

    let startTime = parseInt(ground.start_time.split(":")[0]);
    let endTime = parseInt(ground.end_time.split(":")[0]);

    if (endTime < startTime) {
      endTime += 24;
    }

    while (startTime < endTime) {
      options.push(`${startTime.toString().padStart(2, "0")}:00`);
      startTime++;
    }
    return options;
  };
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
          <ul className="ulLink"></ul>
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
                src={ground[`photo${currentPhotoIndex + 1}`]}
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
              <FontAwesomeIcon icon={faFlag} /> Sport:
            </h3>
            <p className="groundDetPrice">{ground.type}</p>
            <h3>
              <FontAwesomeIcon icon={faMoneyBill} /> Price:
            </h3>
            <p className="groundDetPrice">
              <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
              {Math.floor(ground.price)}/hour
            </p>
            <h3>
              <FontAwesomeIcon icon={faCircleInfo} /> About Ground:
            </h3>
            <p className="groundDetDesc">{ground.description}</p>
          </div>
        </div>
        <div className="rightGroundDetContainer">
          <div className="rightTiming">
            <h3>
              <FontAwesomeIcon icon={faClock} /> Timings:
            </h3>{" "}
            <p className="groundTiming">
              {ground.start_time} : {ground.end_time}
            </p>
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
            <div className="dateContainer">
              <p>
                {" "}
                <FontAwesomeIcon icon={faCalendarDay} /> Date:
              </p>{" "}
              <input
                onChange={handleDateChange}
                type="date"
                id="startDate"
                min={today.toISOString().split("T")[0]}
                max={maxDate.toISOString().split("T")[0]}
                required
                className="dateGroundBook"
              />
            </div>
            <div className="timeContainer">
              <p>
                <FontAwesomeIcon icon={faClock} /> Start time:
              </p>
              <select className="durationGroundBook">
                {generateTimeOptions().map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="durationContainer">
              <p>
                <FontAwesomeIcon icon={faHourglassEnd} /> Duration:
              </p>
              <div className="durationControl">
                <button
                  className="durationButtons"
                  onClick={handleDecrementDuration}
                >
                  -
                </button>
                <input
                  className="durationText"
                  type="text"
                  value={duration}
                  readOnly
                />
                <button
                  className="durationButtons"
                  onClick={handleIncrementDuration}
                >
                  +
                </button>
              </div>
            </div>
            <div className="bookNowButton">
              <p>Book Now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroundDetails;
