import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BookingModal from "../Components/BookingModal";
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
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import defaultGroundPic from "../assets/defaultGround.webp";
import "../Styles/GroundDetails.css";

function GroundDetails() {
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
  let { groundId } = useParams();
  const [values, setValues] = useState({
    groundId: groundId,
    userId: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  useEffect(() => {
    if (selectedDate && ground) {
      axios
        .get(`http://localhost:3001/user/grounds/${groundId}/bookings`, {
          params: {
            date: selectedDate,
          },
        })
        .then((res) => {
          if (res.data.status === "Success") {
            const bookedSlots = res.data.bookings.map((booking) => ({
              startTime: booking.booking_start_time,
              endTime: booking.booking_end_time,
            }));

            const allTimeSlots = generateTimeOptions().map((time) => ({
              startTime: time,
              endTime: addHours(time, duration),
            }));

            const availableSlots = allTimeSlots.filter(
              (slot) =>
                !bookedSlots.some((bookedSlot) =>
                  isOverlap(
                    slot.startTime,
                    slot.endTime,
                    bookedSlot.startTime,
                    bookedSlot.endTime
                  )
                )
            );

            setAvailableTimeSlots(availableSlots);
          }
        });
    }
  }, [selectedDate, ground, duration, groundId]);

  const addHours = (time, hours) => {
    const [hour, minute] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(hour);
    d.setMinutes(minute);
    d.setHours(d.getHours() + hours);
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const isOverlap = (start1, end1, start2, end2) => {
    const parseTime = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    };

    const s1 = parseTime(start1);
    const e1 = parseTime(end1);
    const s2 = parseTime(start2);
    const e2 = parseTime(end2);

    return !(e1 <= s2 || e2 <= s1);
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

  useEffect(() => {
    axios.get("http://localhost:3001/user/").then((res) => {
      if (res.data.status === "Success") {
        setUserId(res.data.user_id);
      }
    });
  }, [userId]);

  const generateTimeOptions = () => {
    const options = [];
    const currentTime = new Date();

    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();

    let startTime = parseInt(ground.start_time.split(":")[0]);
    let endTime = parseInt(ground.end_time.split(":")[0]);

    if (endTime < startTime) {
      endTime += 24;
    }

    // Adjust start time if current time is beyond it or if the selected date is today
    if (
      selectedDate === today.toISOString().split("T")[0] &&
      (currentHour > startTime ||
        (currentHour === startTime && currentMinute >= 0))
    ) {
      startTime = currentHour + 1; // Move to the next hour
      if (startTime >= 24) {
        startTime -= 24; // Ensure the start time wraps around if it exceeds 24 hours
      }
    }

    // Adjust end time if it's before the start time
    if (endTime < startTime) {
      endTime += 24;
    }

    while (startTime < endTime) {
      let displayHour = startTime;
      if (displayHour >= 24) {
        displayHour -= 24; // Handle the transition to the next day
      }
      options.push(`${displayHour.toString().padStart(2, "0")}:00`);
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
  console.log(values);
  const handleBookNow = () => {
    // Check if date and startTime are selected
    if (selectedDate && values.startTime) {
      setButtonClicked(true);

      setShowmodal(true);
    } else {
      setSlotError("Please select date and time.");
    }
  };

  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    setSlotError("");
    setValues((prevValues) => ({
      ...prevValues,
      startTime: startTime,
      endTime: addHours(startTime, duration),
    }));
  };
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSlotError("");
    setSelectedDate(date);
    setValues((prevValues) => ({
      ...prevValues,
      date: date,
      userId: userId,
    }));
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
          <ul className="ulLink">
            <Link to="/welcomeUser" className="links">
              Home
            </Link>
          </ul>
        </div>
      </div>
      <div className="mainGroundDetails">
        {showModal && (
          <BookingModal
            onClose={() => setShowmodal(false)}
            userId={userId}
            bookingDetails={{
              values: values,
              ground: ground,
              duration: duration,
            }}
          />
        )}
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
            <h3>
              <FontAwesomeIcon icon={faUsers} /> About {ground.club_name}:
            </h3>
            <p className="groundDetDesc">{ground.club_description}</p>
          </div>
        </div>
        <div className="rightGroundDetContainer">
          <div className="rightTiming">
            <h3>
              <FontAwesomeIcon icon={faClock} /> Timings:
            </h3>{" "}
            <p className="groundTiming">
              {ground.start_time} to {ground.end_time}
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
            <div className="timeContainerGround">
              <p>
                <FontAwesomeIcon icon={faClock} /> Start time:
              </p>
              <select
                id="startTime"
                name="startTime"
                className="durationGroundBook"
                onChange={handleStartTimeChange}
              >
                <option value="">Select Time</option>
                {availableTimeSlots.map((slot) => (
                  <option
                    key={`${slot.startTime}-${slot.endTime}`}
                    value={slot.startTime}
                  >
                    {slot.startTime} - {slot.endTime}
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
            <div className="bookNowButton" onClick={handleBookNow}>
              <p>Book Now</p>
            </div>
            {buttonClicked && (!selectedDate || !values.startTime) && (
              <div className="errorContainer slotErrorContainer">
                <p className="error">Please select date and time.</p>
              </div>
            )}
            <div className="errorContainer slotErrorContainer">
              {slotError && <p className="error">{slotError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroundDetails;
