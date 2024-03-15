import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import defaultDp from "../assets/user.jpg";
import FileImageUploader from "../Components/FileImageUploader";
import Swal from "sweetalert2";

function UpdateUser() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    profile_photo: profilePhoto,
  });
  const navigate = useHistory();
  useEffect(() => {
    axios
      .get("http://localhost:3001/user/")
      .then((res) => {
        if (res.data.status === "Success") {
          if (res.data.profile_photo) {
            setProfilePhoto(res.data.profile_photo);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const handleImageChange = (imageBlob) => {
    setValues({ ...values, profile_photo: imageBlob });
  };
  const handleNameChange = (e) => {
    setValues({ ...values, name: e.target.value });
    setNameError(""); // Reset name error when name changes
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3001/user/updateProfile", values)
      .then((res) => {
        if (res.data.status === "Success") {
          Swal.fire({
            title: "Profile Updated!",
            confirmButtonText: "Home",
            confirmButtonColor: "#f19006",

            icon: "success",
          }).then(() => {
            navigate.push("/welcomeUser");
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
  console.log(values);

  return (
    <div className="container" style={{ paddingBottom: "6%" }}>
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
            <li>
              <Link to="/welcomeUser" className="links">
                <img
                  className="userProfile"
                  src={profilePhoto || defaultDp}
                  alt="Khel-Khoj"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="formContainer" style={{ marginTop: "2%" }}>
        <div className="form">
          <div>
            <img src={profilePhoto} className="formLogo" alt="Khel-Khoj" />{" "}
          </div>
          <form className="login" onSubmit={handleSubmit}>
            <h1 className="loginText">Update profile</h1>
            <label htmlFor="email" className="labels">
              Email :
            </label>
            <input
              onChange={handleEmailChange}
              type="email"
              id="email"
              autoFocus
              placeholder="Enter new email address"
              className="inputField"
            ></input>{" "}
            <label htmlFor="name" className="labels">
              Name :
            </label>
            <input
              onChange={handleNameChange}
              type="text"
              id="name"
              placeholder="Enter new user name"
              className="inputField"
            ></input>{" "}
            <label htmlFor="profilePic" className="labels">
              Profile photo :
            </label>
            <FileImageUploader
              onChange={handleImageChange}
              name="Change profile photo"
            />
            <div className="errorContainer">
              {emailError && <p className="error">{emailError}</p>}
              {nameError && <p className="error">{nameError}</p>}
            </div>
            <div className="updateButtonsHolder">
              <button className="loginButton">Update</button>
              <Link to="/welcomeUser" className="noThanksUpdateButton">
                No thanks
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
