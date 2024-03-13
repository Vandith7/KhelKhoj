import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/KhelKhojLogo.png";
import MultipleImage from "../Components/MultipleImage";

function UpdateActivity() {
  const { activityId } = useParams();
  const [minEndDate, setMinEndDate] = useState("");
  const [values, setValues] = useState({
    club_id: "",
    description: "",
    age_group: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    instructor_info: "",
    capacity: "",
    price: "",
    photos: null,
    visibility: "",
    contact_information: "",
  });
  const navigate = useHistory();
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
  console.log(values);
  console.log(activityId);
  useEffect(() => {
    const today = new Date();
    const minStartDate = today.toISOString().split("T")[0]; // Get today's date in "yyyy-mm-dd" format
    setMinEndDate(minStartDate); // Set the minimum end date initially to today's date
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create FormData object to send files along with other form data
    const formData = new FormData();
    formData.append("description", values.description);
    formData.append("contact_information", values.contact_information);
    formData.append("age_group", values.age_group);
    formData.append("start_date", values.start_date);
    formData.append("end_date", values.end_date);
    formData.append("activity_id", activityId);
    formData.append("start_time", values.start_time);
    formData.append("end_time", values.end_time);
    formData.append("price", values.price);
    formData.append("visibility", values.visibility);

    // Append each file to the FormData object
    if (values.photos) {
      values.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });
    }

    axios
      .post("http://localhost:3001/club/updateActivity", formData, {
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
              <Link to="/welcomeClub" className="links">
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="formContainer" style={{ marginTop: "2%" }}>
        <div className="form">
          <form className="login" onSubmit={handleSubmit}>
            <h1 className="loginText">Update Activity</h1>
            <label htmlFor="desc" className="labels">
              Description :
            </label>
            <input
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              type="text"
              id="desc"
              autoFocus
              placeholder="Enter new description"
              className="inputField"
            ></input>{" "}
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
              className="inputField"
            />
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
              className="inputField"
            />
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
              className="inputField"
            />
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
              placeholder="Enter pricing/rate (₹)."
              className="inputField"
            ></input>
            <label htmlFor="visibility" className="labels">
              Visible :
            </label>
            <select
              className="inputField"
              id="visibility"
              onChange={(e) =>
                setValues({ ...values, visibility: e.target.value })
              }
            >
              <option value="" disabled selected>
                Change visibility
              </option>
              <option value="1">Visible</option>
              <option value="0">Hidden</option>
            </select>
            <label htmlFor="typeOfGround" className="labels">
              Photos of activity :
            </label>
            <MultipleImage
              id="groundPhotos"
              onChange={handleImageChange}
              name="Update Activity photos"
            />
            <button className="loginButton">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateActivity;
