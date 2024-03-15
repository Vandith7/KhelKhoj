import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "../Styles/BookingModal.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

function BookingModal(props) {
  const modalRef = useRef();
  const { userId } = props;
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      props.onClose();
    }
  };
  const [value, setValue] = useState({
    password: "",
    userId: userId,
  });
  const navigate = useHistory();
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  function convertTo12HourFormat(timeString) {
    const [hour, minute] = timeString.split(":");
    const hourInt = parseInt(hour);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  }

  function formatDate(dateString) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  const { values, ground } = props.bookingDetails;

  const handleConfirmation = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/user/checkCredentials", value)
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post(
              `http://localhost:3001/user/grounds/${values.groundId}/book`,
              values
            )
            .then((response) => {
              if (response.data.status === "Success") {
                Swal.fire({
                  title: "Ground Booked!",
                  confirmButtonText: "Home",
                  confirmButtonColor: "#f19006",
                  text: `Gear up for some ${ground.type} action at ${
                    ground.club_name
                  } from ${convertTo12HourFormat(
                    values.startTime
                  )} to ${convertTo12HourFormat(
                    values.endTime
                  )} on ${formatDate(values.date)}!`,
                  icon: "success",
                }).then(() => {
                  navigate.push("/welcomeUser");
                });
              }
            })
            .catch((error) => {
              console.error("Error booking ground:", error);
              const errorMessage = error.response.data.error;
              if (errorMessage.includes("slots")) {
                setPasswordError(errorMessage);
              }
            });
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;
          if (errorMessage.includes("matched")) {
            setPasswordError(errorMessage);
          } else {
            console.error("Error:", errorMessage);
          }
        } else {
          console.error("Unexpected error occurred:", err);
        }
      });
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="modalContainer">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "just", duration: 0.2 }}
        className="modalBox"
      >
        <h1>Confirm booking</h1>
        <h2 style={{ fontWeight: "500" }}>
          Please enter your password to confirm booking
        </h2>
        <p style={{ color: "#f00", marginTop: "-10px" }}>
          Please note that you can cancel your booking up to 12 hours before the
          scheduled time. However, cancellations made after this period will not
          be accepted.
        </p>
        <div className="passwordInputContainer">
          <input
            autoFocus
            onChange={(e) =>
              setValue({
                ...value,
                password: e.target.value,
                userId: props.userId,
              })
            }
            type={showPassword ? "text" : "password"}
            id="conPass"
            placeholder="Enter your password"
            required
            className="inputFieldPassBookConfirm"
          ></input>
          <FontAwesomeIcon
            style={{ marginBottom: "4px", marginLeft: "2%" }}
            icon={showPassword ? faEyeSlash : faEye}
            className="eyeIconBook"
            onClick={togglePasswordVisibility}
          />
        </div>
        <div className="errorContainer confirmationError">
          <p className="passwordError">{passwordError}</p>
        </div>
        <div className="bookConButtonsContainer">
          <div className="bookConButtonCan" onClick={props.onClose}>
            Cancel
          </div>
          <div className="bookConButton" onClick={handleConfirmation}>
            Confirm
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BookingModal;
