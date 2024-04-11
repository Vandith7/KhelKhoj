import React, { useState } from "react";
import logo from "../assets/KhelKhojLogo.png";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";

function ClubPasswordReset() {
  // Changed function name to start with uppercase
  const [values, setValues] = useState({
    email: "",
    password: "",
    conPassword: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOTPError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
  const handlePasswordBlur = () => {
    setIsPasswordBlurred(true);
    validatePassword(values.password);
  };
  const handleSendOTP = () => {
    if (!values.email) {
      setEmailError("Email is required");
      return;
    }

    axios
      .post("http://localhost:3001/club/forgot-password", {
        email: values.email,
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
  const handleEmailChange = (e) => {
    setValues({ ...values, email: e.target.value });
    setEmailError(""); // Reset email error when email changes
  };
  const handleOTPChange = (e) => {
    setValues({ ...values, otp: e.target.value });
    setOTPError(""); // Reset email error when email changes
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
        .post("http://localhost:3001/club/reset-password", values)
        .then((res) => {
          if (res.data.status === "Success") {
            Swal.fire({
              title: "Password reset successful!",
              confirmButtonText: "Home",
              confirmButtonColor: "#f19006",
              text: `Your password for ${values.email} has been changed successfully!`,
              icon: "success",
            }).then(() => {
              navigate.push("/clubLogin");
            });
          }
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.error) {
            const errorMessage = err.response.data.error;
            if (errorMessage.includes("OTP")) {
              setOTPError(errorMessage);
            } else {
              console.error("Error:", errorMessage);
            }
          } else {
            console.error("Unexpected error occurred:", err);
          }
        });
    }
  };
  console.log(values);

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
              <Link to="/clubRegister" className="links">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="formContainer resetForm">
        <div className="form">
          <div>
            <img src={logo} className="formLogo" alt="Khel-Khoj" />{" "}
          </div>
          <form className="login" onSubmit={handleSubmit}>
            <h1 className="loginText">Reset your password</h1>

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
                  {emailError && <p className="error">{emailError}</p>}
                  {otpError && <p className="error">{otpError}</p>}
                  {isPasswordBlurred && passwordError && (
                    <p className="passwordError">{passwordError}</p>
                  )}
                </div>
                <button className="loginButton">Reset Password</button>
              </>
            ) : (
              <>
                <label htmlFor="email" className="labels">
                  Email :
                </label>
                <input
                  autoFocus
                  type="email"
                  onChange={handleEmailChange}
                  id="email"
                  placeholder="Enter your email"
                  required
                  className="inputField"
                ></input>
                <div className="errorContainer">
                  {emailError && <p className="error">{emailError}</p>}
                  {otpError && <p className="error">{otpError}</p>}
                  {isPasswordBlurred && passwordError && (
                    <p className="passwordError">{passwordError}</p>
                  )}
                </div>
                <button
                  type="button"
                  className="loginButton"
                  onClick={handleSendOTP}
                >
                  Send OTP
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClubPasswordReset;
