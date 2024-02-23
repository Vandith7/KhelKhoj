import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

function FileImageUploader(props) {
  const [imageBlob, setImageBlob] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    event.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBlob(reader.result);
        // Pass the image blob data to the parent component via callback
        props.onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {imageBlob ? (
        <div className="profileContainer">
          <img
            src={imageBlob}
            alt="Selected"
            style={{
              marginBottom: "5%",
              backgroundSize: "contain",
              width: "80px",
              height: "80px",
              borderRadius: "50px",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="profilePic"
            onClick={() => {
              document.getElementById("fileInput").click();
            }}
          >
            Choose another
          </div>
        </div>
      ) : (
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

export default FileImageUploader;
