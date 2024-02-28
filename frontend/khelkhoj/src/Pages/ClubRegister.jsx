import React, { useState } from "react";
import "../Styles/Register.css";
import logo from "../assets/KhelKhojLogo.png";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import FileImageUploader from "../Components/FileImageUploader";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ClubRegister() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    conPassword: "",
    address: "",
    description: "",
    profile_photo: null,
  });

  const [passwordError, setPasswordError] = useState("");
  const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  console.log(values);

  const handleImageChange = (imageBlob) => {
    setValues({ ...values, profile_photo: imageBlob });
  };

  const navigate = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validatePassword(values.password)) {
      if (values.password !== values.conPassword) {
        setPasswordError("Passwords do not match");
        return;
      }

      axios
        .post("http://localhost:3001/club/register", values)
        .then((res) => {
          if (res.data.status === "Success") {
            navigate.push("/clubLogin");
          }
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.error) {
            const errorMessage = err.response.data.error;
            if (errorMessage.includes("Email")) {
              setEmailError(errorMessage);
            } else if (errorMessage.includes("Club name")) {
              setNameError(errorMessage);
            } else {
              // Handle other errors
              console.error("Error:", errorMessage);
            }
          } else {
            // Handle other types of errors
            console.error("Unexpected error occurred:", err);
          }
        });
    }
  };

  const handlePasswordBlur = () => {
    setIsPasswordBlurred(true);
    validatePassword(values.password);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain uppercase and lowercase letters, numbers, and symbols"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleNameChange = (e) => {
    setValues({ ...values, name: e.target.value });
    setNameError(""); // Reset name error when name changes
  };

  const handleEmailChange = (e) => {
    setValues({ ...values, email: e.target.value });
    setEmailError(""); // Reset email error when email changes
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <ul>
            <li>
              <Link to="/" className="links">
                Home
              </Link>
            </li>
            <li>
              <Link to="/clubLogin" className="links">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="formContainer">
        <div className="form">
          <div>
            <img src={logo} className="formLogo" alt="Khel-Khoj" />{" "}
          </div>
          <form className="login" onSubmit={handleSubmit}>
            <h1 className="loginText">Club Register</h1>
            <label htmlFor="clubName" className="labels">
              Club Name :
            </label>
            <input
              onChange={handleNameChange}
              type="text"
              id="clubName"
              autoFocus
              placeholder="Enter club name"
              required
              className="inputField"
            ></input>
            <label htmlFor="email" className="labels">
              Email :
            </label>
            <input
              onChange={handleEmailChange}
              type="email"
              id="email"
              placeholder="Enter email address"
              required
              className="inputField"
            ></input>
            <label htmlFor="password" className="labels">
              Password :
            </label>
            <div className="passwordInputContainer">
              <input
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                onBlur={handlePasswordBlur}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                required
                className="inputFieldPass"
              ></input>
              <FontAwesomeIcon
                style={{ marginBottom: "4px", marginLeft: "2%" }}
                icon={showPassword ? faEyeSlash : faEye}
                className="eyeIcon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <label htmlFor="conPass" className="labels">
              Confirm password :
            </label>
            <div className="passwordInputContainer">
              <input
                onChange={(e) =>
                  setValues({ ...values, conPassword: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                id="conPass"
                placeholder="Confirm Password"
                required
                className="inputFieldPass"
              ></input>
              <FontAwesomeIcon
                style={{ marginBottom: "4px", marginLeft: "2%" }}
                icon={showPassword ? faEyeSlash : faEye}
                className="eyeIcon"
                onClick={togglePasswordVisibility}
              />
            </div>

            <label htmlFor="location" className="labels">
              Location :
            </label>
            <textarea
              onChange={(e) =>
                setValues({ ...values, address: e.target.value })
              }
              id="location"
              rows={4}
              maxLength={255}
              style={{ resize: "none", width: "53%" }}
              placeholder="Please provide the location of your club. You can visit Google Maps, copy the URL containing latitude and longitude, and share it here."
              required
              className="inputField"
            ></textarea>
            <label htmlFor="desc" className="labels">
              Description :
            </label>
            <textarea
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              rows={3}
              id="desc"
              maxLength={255}
              style={{ resize: "none", width: "53%" }}
              placeholder="Description of your club"
              required
              className="inputField"
            ></textarea>
            <div className="errorContainer">
              {nameError && <p className="error">{nameError}</p>}
              {emailError && <p className="error">{emailError}</p>}
              {isPasswordBlurred && passwordError && (
                <p className="passwordError">{passwordError}</p>
              )}
            </div>
            <FileImageUploader onChange={handleImageChange} name="Club logo" />
            <button className="loginButton">Register</button>
          </form>
          <div className="orDiv">
            <p>or</p>
            <Link to="/clubLogin" className="regButton">
              <>Log In to your account</>
            </Link>
            <div className="notUserContainer">
              <p>
                Join as a General User?{" "}
                <Link to="/userRegister" className="notUserLink">
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

export default ClubRegister;
