import React, { useState } from "react";
import "../Styles/Login.css";
import logo from "../assets/KhelKhojLogo.png";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

function UserLogin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const navigate = useHistory();
  axios.defaults.withCredentials = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/user/login", values)
      .then((res) => {
        if (res.data.status === "Success") {
          navigate.push("/welcomeUser");
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
              <Link to="/userRegister" className="links">
                Register
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
            <h1 className="loginText">User Login</h1>
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
            <input
              onChange={handlePassChange}
              type="password"
              id="password"
              placeholder="Enter password"
              required
              className="inputField"
            ></input>
            <div className="errorContainer">
              {passError && <p className="error">{passError}</p>}
              {emailError && <p className="error">{emailError}</p>}
            </div>

            <button className="loginButton">Log In</button>
          </form>
          <div className="orDiv">
            <p>or</p>
            <Link to="/userRegister" className="regButton">
              <>Create an account</>
            </Link>
            <div className="notUserContainer">
              <p>
                A Club User?{" "}
                <Link to="/clubLogin" className="notUserLink">
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

export default UserLogin;
