import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "../Styles/BookingModal.css";
import "../Styles/ActivityModal.css";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

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

  const handleConfirmation = (event) => {
    event.preventDefault();

    axios
      .post(
        `http://localhost:3001/user/activities/${props.activityId}/enquiry`,
        value
      )
      .then((response) => {
        if (response.data.status === "Success") {
          Swal.fire({
            title: "Enquiry Submitted!",
            confirmButtonText: "Home",
            confirmButtonColor: "#f19006",
            text: `${props.club_name} will contact with you soon!`,
            icon: "success",
          }).then(() => {
            navigate.push("/welcomeUser");
          });
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
        </div>
        <div className="bookConButtonsContainer">
          <div className="bookConButtonCan" onClick={props.onClose}>
            Cancel
          </div>
          <div className="bookConButton" onClick={handleConfirmation}>
            Send
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ActivityModal;
