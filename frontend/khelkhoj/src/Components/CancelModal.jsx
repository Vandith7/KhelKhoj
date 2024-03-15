import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "../Styles/BookingModal.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Swal from "sweetalert2";

function CancelModal(props) {
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      props.onClose();
    }
  };
  const [value, setValue] = useState({
    password: "",
    userId: props.userId,
  });
  console.log(value);
  const navigate = useHistory();
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmation = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/user/checkCredentials", value)
      .then((res) => {
        if (res.data.status === "Success") {
          axios
            .post(
              `http://localhost:3001/user/bookings/${props.bookingId}/cancel`
            )
            .then((res) => {
              if (res.data.status === "Success") {
                // navigate.push("/welcomeUser");
                Swal.fire({
                  title: "Ground Booking Cancelled!",
                  confirmButtonText: "Home",
                  confirmButtonColor: "#f19006",
                  // text: `Gear up for some ${ground.type} action at ${
                  //   ground.club_name
                  // } from ${convertTo12HourFormat(
                  //   values.startTime
                  // )} to ${convertTo12HourFormat(
                  //   values.endTime
                  // )} on ${formatDate(values.date)}!`,
                  icon: "success",
                }).then(() => {
                  navigate.push("/welcomeUser");
                });
              }
            })
            .catch((err) => {
              console.error(err);
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
      <div className="modalBox">
        <h1>Confirm cancellation</h1>
        <h2 style={{ fontWeight: "500" }}>
          Please enter your password to cancel your booking
        </h2>
        <div className="passwordInputContainer">
          <input
            autoFocus
            onChange={(e) =>
              setValue({
                ...value,
                password: e.target.value,
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
            No thanks
          </div>
          <div className="bookCanButtonCan" onClick={handleConfirmation}>
            Confirm
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;
