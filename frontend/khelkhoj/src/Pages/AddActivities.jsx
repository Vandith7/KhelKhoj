import React, { useEffect, useState } from "react";
import "../Styles/WelcomeUser.css";
import "../Styles/AddActivities.css";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import defaultDp from "../assets/user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MultipleImage from "../Components/MultipleImage";

function AddActivities() {
  const [values, setValues] = useState({
    club_id: "",
    activity_name: "",
    category: "",
    description: "",
    age_group: "",
    start_date: "",
    end_date: "",
    start_time: "00:00",
    end_time: "23:59",
    instructor_info: "",
    capacity: "",
    price: "",
    photos: null,
    contact_information: "",
  });
  const [clubId, setClubId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dateError, setDateError] = useState("");
  const [minEndDate, setMinEndDate] = useState(""); // State to manage the minimum selectable end date

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

  useEffect(() => {
    const today = new Date();
    const minStartDate = today.toISOString().split("T")[0]; // Get today's date in "yyyy-mm-dd" format
    setMinEndDate(minStartDate); // Set the minimum end date initially to today's date
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("club_id", values.club_id);
    formData.append("activity_name", values.activity_name);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("age_group", values.age_group);
    formData.append("start_date", values.start_date);
    formData.append("end_date", values.end_date);
    formData.append("start_time", values.start_time);
    formData.append("end_time", values.end_time);
    formData.append("instructor_info", values.instructor_info);
    formData.append("capacity", values.capacity);
    formData.append("price", values.price);
    formData.append("contact_information", values.contact_information);

    if (values.photos) {
      values.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });
    }

    axios
      .post("http://localhost:3001/club/addActivity", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          navigate.push("/welcomeClub");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;
          if (errorMessage.includes("date")) {
            setDateError(errorMessage);
          }
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
            <h1 className="loginText">Add Activity</h1>
            {/* Activity Name */}
            <label htmlFor="activityName" className="labels">
              Activity Name:
            </label>
            <input
              onChange={(e) =>
                setValues({
                  ...values,
                  club_id: clubId,
                  activity_name: e.target.value,
                })
              }
              type="text"
              id="activityName"
              autoFocus
              placeholder="Enter the name of the activity"
              required
              className="inputField"
            />

            {/* Category */}
            <label htmlFor="category" className="labels">
              Category:
            </label>
            <input
              onChange={(e) =>
                setValues({ ...values, category: e.target.value })
              }
              type="text"
              id="category"
              placeholder="Enter the category of the activity"
              required
              className="inputField"
            />

            {/* Description */}
            <label htmlFor="description" className="labels">
              Description:
            </label>
            <textarea
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              type="text"
              id="description"
              maxLength={100}
              style={{ resize: "none" }}
              rows={3}
              placeholder="Enter a brief description of the activity"
              required
              className="inputField"
            ></textarea>

            {/* Age Group */}
            <label htmlFor="ageGroup" className="labels">
              Age Group:
            </label>
            <input
              onChange={(e) =>
                setValues({ ...values, age_group: e.target.value })
              }
              type="text"
              id="ageGroup"
              placeholder="Enter the targeted age group"
              required
              className="inputField"
            />

            {/* Start Date */}
            <label htmlFor="startDate" className="labels">
              Start Date:
            </label>
            <input
              onChange={(e) =>
                setValues({ ...values, start_date: e.target.value })
              }
              type="date"
              id="startDate"
              min={minEndDate} // Set the minimum selectable date to today
              required
              className="inputField"
            />

            {/* End Date */}
            <label htmlFor="endDate" className="labels">
              End Date:
            </label>
            <input
              onChange={(e) =>
                setValues({ ...values, end_date: e.target.value })
              }
              type="date"
              id="endDate"
              min={minEndDate} // Set the minimum selectable date dynamically based on the selected start date
              required
              className="inputField"
            />

            {/* Start Time */}
            <label htmlFor="startTime" className="labels">
              Start Time:
            </label>
            <select
              className="inputField"
              id="startTime"
              onChange={(e) =>
                setValues({ ...values, start_time: e.target.value })
              }
              required
            >
              {hours}
            </select>

            {/* End Time */}
            <label htmlFor="endTime" className="labels">
              End Time:
            </label>
            <select
              className="inputField"
              id="endTime"
              onChange={(e) =>
                setValues({ ...values, end_time: e.target.value })
              }
              required
            >
              {hours}
            </select>

            {/* Instructor Information */}
            <label htmlFor="instructorInfo" className="labels">
              Instructor Information:
            </label>
            <textarea
              onChange={(e) =>
                setValues({ ...values, instructor_info: e.target.value })
              }
              maxLength={100}
              style={{ resize: "none" }}
              rows={3}
              type="text"
              id="instructorInfo"
              placeholder="Enter information about the instructor"
              required
              className="inputField"
            />

            {/* Capacity */}
            <label htmlFor="capacity" className="labels">
              Capacity:
            </label>
            <input
              onChange={(e) =>
                setValues({ ...values, capacity: e.target.value })
              }
              type="number"
              min={2}
              id="capacity"
              placeholder="Enter the capacity of participants"
              required
              className="inputField"
            />

            {/* Pricing */}
            <label htmlFor="price" className="labels">
              Pricing / Rate:
            </label>
            <input
              onChange={(e) => setValues({ ...values, price: e.target.value })}
              type="text"
              id="price"
              placeholder="Enter the pricing / rate"
              required
              className="inputField"
            />

            {/* Contact Information */}
            <label htmlFor="contactInformation" className="labels">
              Contact Information:
            </label>
            <input
              onChange={(e) =>
                setValues({
                  ...values,
                  contact_information: e.target.value,
                })
              }
              type="text"
              id="contactInformation"
              placeholder="Enter contact information"
              required
              className="inputField"
            />

            {/* Photos */}
            <label htmlFor="activityPhotos" className="labels">
              Photos of the activity:
            </label>
            <MultipleImage
              id="activityPhotos"
              onChange={handleImageChange}
              name="Add activity photos"
            />

            <div className="errorContainer">
              {dateError && <p className="error">{dateError}</p>}
            </div>
            <button className="loginButton">Add Activity</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddActivities;
