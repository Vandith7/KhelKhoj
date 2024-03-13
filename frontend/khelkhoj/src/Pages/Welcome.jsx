import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../Styles/Welcome.css";
import logo from "../assets/KhelKhojLogo.png";
import boy from "../assets/Boy.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faFutbol,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Welcome() {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef(null);
  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!animationTriggered && infoRef.current) {
        const top = infoRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight) {
          setShowInfo(true);
          setAnimationTriggered(true);
          window.removeEventListener("scroll", handleScroll);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animationTriggered]);

  const scrollToInfo = () => {
    infoRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      <motion.div
        className="header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <img className="logo" src={logo} alt="Khel-Khoj" />
        <p
          style={{
            color: "#F19006",
            fontFamily: "Quicksand",
            fontSize: "28px",
          }}
        >
          Khel-Khoj
        </p>
      </motion.div>
      <motion.div
        className="hero"
        style={{
          backgroundImage: `url(${boy})`,
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h1 style={{ fontSize: "50px", fontWeight: 800 }}>
          Welcome to{" "}
          <span
            style={{
              color: "#F19006",
              fontFamily: "Quicksand",
              fontSize: "50px",
            }}
          >
            Khel-Khoj
          </span>
        </h1>
        <p>
          Are you ready to elevate your sports and recreational experiences to
          new heights? Look no further than Khel-Khoj, your premier destination
          for discovering grounds and activities. Whether you're a dedicated
          athlete seeking the perfect venue or an avid enthusiast looking for
          your next adventure, Khel-khoj is here to empower your journey!
        </p>
      </motion.div>
      <motion.div
        className="next"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button className="nextButton" onClick={scrollToInfo}>
          See more{" "}
          <FontAwesomeIcon
            style={{ fontSize: 14, marginLeft: "5%" }}
            icon={faAnglesDown}
          />{" "}
        </button>
      </motion.div>
      <div ref={infoRef} className={`info ${showInfo ? "visible" : ""}`}>
        <motion.div
          className="users"
          initial={{ opacity: 0, y: 50 }}
          animate={showInfo ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <h2>Discover, Book, and Play</h2>
          <p>
            Embark on a journey of discovery with Khel-khoj. Our user-friendly
            platform empowers you to explore a diverse range of grounds and
            activities. Whether you're in search of a picturesque cricket pitch
            or a sprawling football fields, Khel-khoj simplifies the booking
            process, ensuring that your next adventure is just a few clicks
            away.
          </p>
          <Link to="/userLogin" className="Button" style={{ marginTop: "5%" }}>
            <span className="ButtonText">
              I'm a User{" "}
              <FontAwesomeIcon
                icon={faUser}
                style={{ marginLeft: "5%", fontSize: 15 }}
              />
            </span>
          </Link>
        </motion.div>
        <motion.div
          className="users"
          initial={{ opacity: 0, y: 50 }}
          animate={showInfo ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
        >
          <h2>Unleash Potential of Your Venue</h2>
          <p>
            Khel-khoj provides clubs with a powerful platform to showcase their
            grounds and activities to a vibrant community of sports enthusiasts.
            With our intuitive interface, clubs can effortlessly add their
            grounds, list activities, and attract eager participants. Khel-khoj
            is your partner in reaching a broader audience and maximizing your
            facility's potential.
          </p>
          <Link to="/clubLogin" className="Button">
            <span className="ButtonText">
              I'm a Club{" "}
              <FontAwesomeIcon
                icon={faFutbol}
                style={{ marginLeft: "5%", fontSize: 15 }}
              />
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Welcome;
