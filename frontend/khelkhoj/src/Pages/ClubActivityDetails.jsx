import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import {
  faCalendar,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faCircleQuestion,
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

function ClubActivityDetails() {
  const [ground, setGround] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [inquiries, setInquiries] = useState(null);
  const [showModal, setShowmodal] = useState(false);
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

  useEffect(() => {
    axios
      .get(`http://localhost:3001/club/inquiries/${activityId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          setInquiries(res.data.inquiries);
        }
      })
      .catch((error) => {
        console.error("Error fetching inquiries:", error);
      });
  }, [activityId]);

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
  const sortInquiriesByStatus = (inquiries) => {
    // Define the order of statuses
    const statusOrder = ["pending", "not_answered", "answered"];

    // Sort inquiries by status, using the defined order
    inquiries.sort((a, b) => {
      const statusIndexA = statusOrder.indexOf(a.status);
      const statusIndexB = statusOrder.indexOf(b.status);

      // Compare the indexes of statuses in the statusOrder array
      if (statusIndexA < statusIndexB) {
        return -1;
      } else if (statusIndexA > statusIndexB) {
        return 1;
      } else {
        // If statuses are the same, maintain the original order
        return 0;
      }
    });

    return inquiries; // Return the sorted array
  };

  const handleStatusChange = (inquiryId, newStatus) => {
    // Send a POST request to update the status
    axios
      .post(`http://localhost:3001/club/updateInquiryStatus/${inquiryId}`, {
        status: newStatus,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .get(`http://localhost:3001/club/inquiries/${activityId}`)
            .then((res) => {
              if (res.data.status === "Success") {
                setInquiries(res.data.inquiries);
              }
            })
            .catch((error) => {
              console.error("Error fetching inquiries:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        // Handle error if status update fails
      });
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
            <Link to="/welcomeClub" className="links">
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
              bookingDetails={{}}
            />
          )}
        </AnimatePresence>
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
            <Link
              to={`/updateActivity/${ground.activity_id}`}
              className="updateActivityNowButton"
            >
              <p>Update activity</p>
            </Link>
          </div>
          <div className="EnquiryClubContainer">
            <h1 style={{ fontSize: "30px" }}>
              <span style={{ fontWeight: "600" }}>
                <FontAwesomeIcon icon={faCircleQuestion} /> Enquiries:{" "}
              </span>
            </h1>
            <div className="scrollableEnquiry">
              <div className="enquiriesClub">
                {inquiries && inquiries.length > 0 ? (
                  sortInquiriesByStatus(inquiries).map((inquiry) => (
                    <div key={inquiry.inquiry_id} className="inquiryItem">
                      <p>
                        <span style={{ fontWeight: "600" }}>Username:</span>{" "}
                        {inquiry.user_name}
                      </p>
                      <p>
                        <span style={{ fontWeight: "600" }}>Query:</span>{" "}
                        {inquiry.inquiry_message}
                      </p>
                      <p>
                        <span style={{ fontWeight: "600" }}>Contact Info:</span>{" "}
                        {inquiry.contact_info}
                      </p>
                      <p>
                        <span style={{ fontWeight: "600" }}>Status:</span>{" "}
                        {inquiry.status === "pending"
                          ? `Contact pending by ${ground.club_name}`
                          : inquiry.status === "not_answered"
                          ? `${inquiry.user_name} didn't respond`
                          : inquiry.status === "answered"
                          ? `${inquiry.user_name}'s enquiry answered`
                          : ""}
                      </p>
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          handleStatusChange(inquiry.inquiry_id, e.target.value)
                        }
                        className="enquiryStatusUpdate"
                      >
                        <option value="pending">Pending</option>
                        <option value="not_answered">Not Answered</option>
                        <option value="answered">Answered</option>
                      </select>
                    </div>
                  ))
                ) : (
                  <h2>No enquiries yet.</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ClubActivityDetails;
