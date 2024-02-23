import React, { useEffect, useRef, useState } from "react";
import "../Styles/Welcome.css";
import logo from "../assets/KhelKhojLogo.png";
import boy from "../assets/Boy.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faFutbol,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import WelcomeUser from "./WelcomeUser";
import axios from "axios";

function Welcome() {
  const infoRef = useRef(null);
  const [auth, setAuth] = useState(false);
  //   const [name, setName] = useState("");
  const navigate = useHistory();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3001/user/")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuth(true);
          //   setName(res.data.name);
          navigate.push("/welcomeUser");
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
  const scrollToInfo = () => {
    infoRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return auth ? (
    <WelcomeUser />
  ) : (
    <div className="container">
      <div className="header">
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
      </div>
      <div
        className="hero"
        style={{
          backgroundImage: `url(${boy})`,
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
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
      </div>
      <div className="next">
        <button className="nextButton" onClick={scrollToInfo}>
          See more{" "}
          <FontAwesomeIcon
            style={{ fontSize: 14, marginLeft: "5%" }}
            icon={faAnglesDown}
          />{" "}
        </button>
      </div>
      <div ref={infoRef} className="info">
        <div className="users">
          <h1>Discover, Book, and Play</h1>
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
        </div>
        <div className="users">
          <h1>Unleash Potential of Your Venue</h1>
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
        </div>
      </div>
    </div>
  );
}

export default Welcome;
