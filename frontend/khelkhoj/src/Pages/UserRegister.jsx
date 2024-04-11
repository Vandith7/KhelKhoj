import React, { useState } from "react";
import "../Styles/Register.css";
import logo from "../assets/KhelKhojLogo.png";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import FileImageUploader from "../Components/FileImageUploader";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

function UserRegister() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    gender: "male",
    city: "",
    password: "",
    conPassword: "",
    profile_photo: null,
    otp: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [otpError, setOTPError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  console.log(values);

  const handleImageChange = (imageBlob) => {
    setValues({ ...values, profile_photo: imageBlob });
  };

  const handleSendOTP = () => {
    if (!values.email) {
      setEmailError("Email is required");
      return;
    }
    if (!values.name) {
      setNameError("Name is required");
      return;
    }

    axios
      .post("http://localhost:3001/user/send-otp", {
        email: values.email,
        name: values.name,
      })
      .then((res) => {
        setOtpSent(true);
        console.log("OTP sent successfully");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;
          if (errorMessage.includes("Email")) {
            setEmailError(errorMessage);
          } else if (errorMessage.includes("User name")) {
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
        .post("http://localhost:3001/user/register", values)
        .then((res) => {
          if (res.data.status === "Success") {
            Swal.fire({
              title: "User registered!",
              confirmButtonText: "Home",
              confirmButtonColor: "#f19006",
              text: `Congratulations ${values.name}! You have successfully registered with Khel-Khoj!`,
              icon: "success",
            }).then(() => {
              navigate.push("/userLogin");
            });
          }
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.error) {
            const errorMessage = err.response.data.error;
            if (errorMessage.includes("Email")) {
              setEmailError(errorMessage);
            } else if (errorMessage.includes("User name")) {
              setNameError(errorMessage);
            } else if (errorMessage.includes("OTP")) {
              setOTPError(errorMessage);
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

  const handleOTPChange = (e) => {
    setValues({ ...values, otp: e.target.value });
    setOTPError(""); // Reset email error when email changes
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
              <Link to="/userLogin" className="links">
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
            <h1 className="loginText">User Register</h1>
            <label htmlFor="userName" className="labels">
              User Name :
            </label>
            <input
              onChange={handleNameChange}
              autoFocus
              type="text"
              id="userName"
              placeholder="Enter username"
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

            <label htmlFor="gender" className="labels">
              Gender :
            </label>
            <select
              onClick={(e) => setValues({ ...values, gender: e.target.value })}
              id="gender"
              className="inputField"
              required
              style={{ width: "58%", color: "#9D7947" }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="private">Prefer not to say</option>
            </select>
            <label htmlFor="city" className="labels">
              City :
            </label>
            <input
              onChange={(e) => setValues({ ...values, city: e.target.value })}
              type="text"
              id="city"
              placeholder="Your city"
              required
              className="inputField"
            ></input>
            <label htmlFor="pass" className="labels">
              Password :
            </label>
            <div className="passwordInputContainer">
              <input
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                onBlur={handlePasswordBlur}
                type={showPassword ? "text" : "password"}
                id="pass"
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

            <div className="errorContainer">
              {nameError && <p className="error">{nameError}</p>}
              {emailError && <p className="error">{emailError}</p>}
              {otpError && <p className="error">{otpError}</p>}
              {isPasswordBlurred && passwordError && (
                <p className="passwordError">{passwordError}</p>
              )}
            </div>
            <FileImageUploader
              onChange={handleImageChange}
              name="Profile photo"
            />
            <label htmlFor="otp" className="labels">
              OTP :
            </label>
            {otpSent ? (
              <>
                <input
                  onChange={handleOTPChange}
                  type="text"
                  id="otp"
                  placeholder="Enter OTP"
                  maxLength={6}
                  required
                  className="inputField"
                ></input>
                <button className="loginButton">Register</button>
              </>
            ) : (
              <button
                type="button"
                className="loginButton"
                onClick={handleSendOTP}
              >
                Send OTP
              </button>
            )}
          </form>
          <div className="orDiv">
            <p>or</p>
            <Link to="/userLogin" className="regButton">
              <>Log In to your account</>
            </Link>
            <div className="notUserContainer">
              <p>
                Register as a Club?{" "}
                <Link to="/clubRegister" className="notUserLink">
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

export default UserRegister;
