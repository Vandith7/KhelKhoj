import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../Styles/BookingModal.css";
import "../Styles/ActivityModal.css";
import { motion } from "framer-motion";
import axios from "axios";

function ActivityModal(props) {
  const modalRef = useRef();
  const navigate = useHistory();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      props.onClose();
    }
  };

  const [value, setValue] = useState({
    inquiry_message: "",
    contact_info: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [successEnquiry, setSuccessEnquiry] = useState("");
  const [countdown, setCountdown] = useState(5); // Initialize countdown timer
  const [showCountdown, setShowCountdown] = useState(false); // Track if countdown should be shown

  const handleConfirmation = (event) => {
    event.preventDefault();

    axios
      .post(
        `http://localhost:3001/user/activities/${props.activityId}/enquiry`,
        value
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setSuccessEnquiry(response.data.message);
          setShowCountdown(true); // Show countdown after successful submission

          let currentCountdown = 5; // Define a variable to store the countdown value

          const countdownInterval = setInterval(() => {
            currentCountdown -= 1; // Decrement the countdown value
            setCountdown(currentCountdown); // Update the countdown state

            // Clear interval when countdown reaches 0
            if (currentCountdown === 0) {
              clearInterval(countdownInterval);
              navigate.push("/welcomeUser"); // Redirect to /welcomeUser
            }
          }, 1000);

          return () => {
            clearInterval(countdownInterval); // Cleanup interval on unmount
          };
        }
      })
      .catch((error) => {
        console.error(
          "Encountering a problem while attempting to make an inquiry with the club.",
          error
        );
        const errorMessage = error.response.data.error;
        if (errorMessage.includes("required")) {
          setPasswordError(errorMessage);
        }
      });
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="modalContainer">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "just", duration: 0.2 }}
        className="modalBoxActivity"
      >
        <h1>Enquire about activity</h1>
        <h2 style={{ fontWeight: "500" }}>
          Kindly provide your contact information, the club will reach out to
          you shortly.
        </h2>

        <div className="passwordInputContainerActivity">
          <input
            autoFocus
            onChange={(e) =>
              setValue({
                ...value,
                contact_info: e.target.value,
              })
            }
            type="text"
            id="conPass"
            placeholder="Enter your contact info"
            required
            className="inputFieldPassBookConfirm"
          ></input>
          <input
            onChange={(e) =>
              setValue({
                ...value,
                inquiry_message: e.target.value,
              })
            }
            type="text"
            id="conPass"
            placeholder="Enter your question"
            required
            className="inputFieldPassBookConfirm"
          ></input>
        </div>
        <div className="errorContainer confirmationError">
          <p className="passwordError">{passwordError}</p>
          {showCountdown && (
            <p className="successEnquiry">
              {successEnquiry}, Redirecting to home in {countdown} seconds
            </p>
          )}
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

export default ActivityModal;
