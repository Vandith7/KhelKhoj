import React, { useEffect, useState } from "react";
import "../Styles/WelcomeUser.css";
import "../Styles/AddGround.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import defaultDp from "../assets/user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MultipleImage from "../Components/MultipleImage";

function AddGround() {
  const [values, setValues] = useState({
    club_id: "",
    type: "",
    description: "",
    start_time: "00:00",
    end_time: "23:59",
    price: "",
    photos: null,
  });

  const [clubId, setClubId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = (i < 10 ? "0" : "") + i;
    hours.push(
      <option key={hour} value={`${hour}:00`}>
        {`${hour}:00`}
      </option>
    );
  }

  const handleImageChange = (imageBlob) => {
    setValues({ ...values, photos: imageBlob });
  };

  const navigate = useHistory();

  const handleLogout = () => {
    axios
      .get("http://localhost:3001/club/logout")
      .then((res) => {
        if (res.data.status === "Success") {
          navigate.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/club/")
      .then((res) => {
        if (res.data.status === "Success") {
          if (res.data.profile_photo) {
            setProfilePhoto(res.data.profile_photo);
          }
          if (res.data.club_id) {
            setClubId(res.data.club_id);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create FormData object to send files along with other form data
    const formData = new FormData();
    formData.append("club_id", values.club_id);
    formData.append("type", values.type);
    formData.append("description", values.description);
    formData.append("start_time", values.start_time);
    formData.append("end_time", values.end_time);
    formData.append("price", values.price);

    // Append each file to the FormData object
    if (values.photos) {
      values.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });
    }

    axios
      .post("http://localhost:3001/club/addGround", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important to set the correct content type
        },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          navigate.push("/welcomeClub");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          console.error("Unexpected error occurred:", err);
        }
      });
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
          <ul className="ulLink">
            <li>
              <Link to="/" className="links">
                <img
                  className="userProfile"
                  src={profilePhoto || defaultDp}
                  alt="Khel-Khoj"
                />
              </Link>
            </li>
            <li
              className="logoutButton"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={handleLogout}
            >
              <FontAwesomeIcon
                style={{ fontSize: 20, marginLeft: "20px" }}
                icon={faRightFromBracket}
              />
              {showTooltip && <div className="tooltip">Logout</div>}
            </li>
          </ul>
        </div>
      </div>
      <div className="formContainer">
        <div className="form">
          <form className="login" onSubmit={handleSubmit}>
            <h1 className="loginText">Add your ground</h1>
            <label htmlFor="typeOfGround" className="labels">
              Type of Ground :
            </label>
            <input
              onChange={(e) => setValues({ ...values, type: e.target.value })}
              type="text"
              id="typeOfGround"
              autoFocus
              placeholder="e.g Football field, cricket pitch, etc."
              required
              className="inputField"
            ></input>

            <label htmlFor="descOfGround" className="labels">
              Description of Ground :
            </label>
            <textarea
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              type="text"
              maxLength={100}
              style={{ resize: "none" }}
              rows={2}
              id="descOfGround"
              placeholder="Please specify ground dimensions and any associated rules."
              required
              className="inputField"
            ></textarea>

            <div className="timeContainer">
              <div className="timeField">
                <label htmlFor="startTime" className="labels">
                  Start Time:
                </label>
                <select
                  className="inputField"
                  id="startTime"
                  onChange={(e) =>
                    setValues({
                      ...values,
                      club_id: clubId,
                      start_time: e.target.value,
                    })
                  }
                >
                  <option defaultChecked>
                    Please make sure you have selected
                  </option>
                  {hours}
                </select>
              </div>
              <div className="timeField">
                <label htmlFor="endTime" className="labels">
                  End Time:
                </label>
                <select
                  className="inputField"
                  id="endTime"
                  onChange={(e) =>
                    setValues({ ...values, end_time: e.target.value })
                  }
                >
                  <option defaultChecked>
                    Please make sure you have selected
                  </option>
                  {hours}
                </select>
              </div>
            </div>

            <label htmlFor="groundPrice" className="labels">
              Pricing / Rate :
            </label>
            <input
              onChange={(e) => setValues({ ...values, price: e.target.value })}
              type="text"
              id="groundPrice"
              placeholder="Kindly provide the hourly rate (₹)."
              required
              className="inputField"
            ></input>
            <label htmlFor="typeOfGround" className="labels">
              Photos of ground :
            </label>
            <MultipleImage
              id="groundPhotos"
              onChange={handleImageChange}
              name="Add ground photos"
            />
            <div className="errorContainer"></div>
            <button className="loginButton">Add Ground</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddGround;
