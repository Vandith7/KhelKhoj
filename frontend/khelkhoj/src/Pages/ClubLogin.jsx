import React, { useState, useEffect } from "react";
import "../Styles/Login.css";
import logo from "../assets/KhelKhojLogo.png";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import WelcomeClub from "./WelcomeClub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function ClubLogin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useHistory();
  axios.defaults.withCredentials = true;
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:3001/club/")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuth(true);
          navigate.push("/welcomeClub");
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/club/login", values)
      .then((res) => {
        if (res.data.status === "Success") {
          navigate.push("/welcomeClub");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;
          if (errorMessage.includes("exists")) {
            setEmailError(errorMessage);
          } else if (errorMessage.includes("matched")) {
            setPassError(errorMessage);
          } else {
            console.error("Error:", errorMessage);
          }
        } else {
          console.error("Unexpected error occurred:", err);
        }
      });
  };

  const handlePassChange = (e) => {
    setValues({ ...values, password: e.target.value });
    setPassError(""); // Reset name error when name changes
  };

  const handleEmailChange = (e) => {
    setValues({ ...values, email: e.target.value });
    setEmailError(""); // Reset email error when email changes
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return auth ? (
    <WelcomeClub />
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
          <ul>
            <li>
              <Link to="/" className="links">
                Home
              </Link>
            </li>
            <li>
              <Link to="/clubRegister" className="links">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="formContainer">
        <div className="form" onSubmit={handleSubmit}>
          <div>
            <img src={logo} className="formLogo" alt="Khel-Khoj" />{" "}
          </div>
          <form className="login">
            <h1 className="loginText">Club Login</h1>
            <label htmlFor="email" className="labels">
              Email :
            </label>
            <input
              onChange={handleEmailChange}
              type="email"
              id="email"
              autoFocus
              placeholder="Enter email address"
              required
              className="inputField"
            ></input>
            <label htmlFor="password" className="labels">
              Password :
            </label>
            <div className="passwordInputContainer">
              <input
                onChange={handlePassChange}
                type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                id="password"
                placeholder="Enter password"
                required
                className="inputFieldPass"
              />
              <FontAwesomeIcon
                style={{ marginBottom: "4px", marginLeft: "2%" }}
                icon={showPassword ? faEyeSlash : faEye}
                className="eyeIcon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="errorContainer">
              {passError && <p className="error">{passError}</p>}
              {emailError && <p className="error">{emailError}</p>}
            </div>
            <button className="loginButton">Log In</button>
            <Link to="/clubPass" className="forgotPassLink">
              <>Forgot Password?</>
            </Link>
          </form>
          <div className="orDiv">
            <p>or</p>
            <Link to="/clubRegister" className="regButton">
              <>Create an account</>
            </Link>
            <div className="notUserContainer">
              <p>
                A General User?{" "}
                <Link to="/userLogin" className="notUserLink">
                  Click here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubLogin;
