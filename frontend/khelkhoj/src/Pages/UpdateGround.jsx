import React, { useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/KhelKhojLogo.png";
import MultipleImage from "../Components/MultipleImage";
import Swal from "sweetalert2";

function UpdateGround() {
  const { groundId } = useParams();
  const [values, setValues] = useState({
    description: "",
    start_time: "",
    end_time: "",
    price: "",
    visibility: "",
    photos: null,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create FormData object to send files along with other form data
    const formData = new FormData();
    formData.append("description", values.description);
    formData.append("ground_id", groundId);
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
      .post("http://localhost:3001/club/updateGround", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important to set the correct content type
        },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          Swal.fire({
            title: "Ground Updated!",
            confirmButtonText: "Home",
            confirmButtonColor: "#f19006",

            icon: "success",
          }).then(() => {
            navigate.push("/welcomeClub");
          });
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
            <h1 className="loginText">Update ground</h1>
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
              placeholder="Kindly provide the hourly rate (₹)."
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
                Please select visibility
              </option>
              <option value="1">Visible</option>
              <option value="0">Hidden</option>
            </select>
            <label htmlFor="typeOfGround" className="labels">
              Photos of ground :
            </label>
            <MultipleImage
              id="groundPhotos"
              onChange={handleImageChange}
              name="Add ground photos"
            />
            <button className="loginButton">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateGround;
