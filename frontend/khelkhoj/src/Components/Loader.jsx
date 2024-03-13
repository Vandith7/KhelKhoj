import React, { useState, useEffect } from "react";
import logo from "../assets/KhelKhojLogo.png";
import { Link } from "react-router-dom";
import "../Styles/Loader.css"; // Import your CSS file for styling
import notFound from "../assets/not-found.webp";

const Loader = (props) => {
  const destination = props.type === "club" ? "/welcomeClub" : "/welcomeUser";
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  if (loadingTimeout) {
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
              <Link to={destination} className="links">
                Home
              </Link>
            </ul>
          </div>
        </div>
        <div
          className="emptyResults"
          style={{
            backgroundImage: `url(${notFound})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            marginTop: "80px",
          }}
        >
          <p style={{ marginTop: "320px" }}>
            There seems to be a problem. Please try again later.
          </p>
        </div>{" "}
      </div>
    );
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
            <Link to={destination} className="links">
              Home
            </Link>
          </ul>
        </div>
      </div>
      <div className="loader-container">
        <div className="loader">
          <div className="ball"></div>
          <div className="ball"></div>
          <div className="ball"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
