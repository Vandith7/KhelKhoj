import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCircleArrowLeft,
  faCircleInfo,
  faClock,
  faFlag,
  faIndianRupeeSign,
  faMapLocationDot,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import defaultGroundPic from "../assets/defaultGround.webp";
import "../Styles/GroundDetails.css";
import Loader from "../Components/Loader";

function ClubGroundDetails() {
  const [ground, setGround] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const navigate = useHistory();
  let { groundId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3001/user/grounds/${groundId}`).then((res) => {
      if (res.data.status === "Success") {
        setGround(res.data.ground);
      }
    });
  }, [groundId]);

  useEffect(() => {
    axios.get("http://localhost:3001/club/").then((res) => {
      if (res.data.status === "Success") {
        setUserId(res.data.club_id);
      }
    });
  }, [userId]);
  console.log(userId);

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

  const navigateToHome = () => {
    navigate.push("/welcomeClub");
  };

  if (!ground) {
    return <Loader type="club" />;
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
      <div className="mainGroundDetails">
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
              {ground.start_time} to {ground.end_time}
            </p>
            <h3>
              {" "}
              <FontAwesomeIcon icon={faMapLocationDot} /> Address:
            </h3>
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
          </div>
          <Link
            to={`/updateGround/${ground.ground_id}`}
            className="updateGroundNowButton"
          >
            <p>Update ground</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClubGroundDetails;
