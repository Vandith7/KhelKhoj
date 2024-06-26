import React, { useState } from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function MultipleImage(props) {
  const [imageBlobs, setImageBlobs] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    event.preventDefault();

    if (files) {
      const newImageBlobs = [...imageBlobs];
      if (newImageBlobs.length + files.length > 4) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You can only upload a maximum of 4 images.",
          confirmButtonColor: "#f19006", // Orange color
          confirmButtonClass: "swal-button-black",
        });
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const file = files[i];

        reader.onloadend = () => {
          newImageBlobs.push(reader.result);
          // Pass the image blob data to the parent component via callback
          props.onChange(newImageBlobs);
          setImageBlobs([...newImageBlobs]);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeleteImage = (index) => {
    const newImageBlobs = [...imageBlobs];
    newImageBlobs.splice(index, 1);
    setImageBlobs(newImageBlobs);
    props.onChange(newImageBlobs);
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept="image/png, image/jpeg, image/jpg,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple // Allow multiple file selection
      />

      <div className="groundClubImageContainer">
        {imageBlobs.map((imageBlob, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "relative",
              display: "inline-block",
              marginRight: 10,
            }}
          >
            <motion.img
              src={imageBlob}
              alt="Selected"
              style={{
                marginBottom: "5%",
                backgroundSize: "cover",
                objectFit: "cover",
                width: "150px",
                height: "120px",
                borderRadius: "10px",
              }}
              whileHover={{ scale: 1.04 }} // Scale up on hover
            />
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "5px",
                right: "5px",
                color: "black",
              }}
              onClick={() => handleDeleteImage(index)}
            />
          </motion.div>
        ))}
        {/* Conditional rendering of "Add more" button */}
        {imageBlobs.length >= 1 && imageBlobs.length < 4 && (
          <div
            className="profilePic"
            onClick={() => {
              document.getElementById("fileInput").click();
            }}
          >
            Add more
          </div>
        )}
      </div>
      {imageBlobs.length === 0 && (
        <div
          className="profilePic"
          onClick={() => {
            document.getElementById("fileInput").click();
          }}
        >
          {props.name}
          <br />
          <FontAwesomeIcon style={{ fontSize: 18 }} icon={faCamera} />
        </div>
      )}
    </div>
  );
}

export default MultipleImage;
