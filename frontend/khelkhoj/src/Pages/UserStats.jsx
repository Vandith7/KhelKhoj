import React, { useEffect, useState } from "react";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/UserStats.css";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserStats() {
  const [userStats, setUserStats] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1month");
  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/stats?timePeriod=${timePeriod}`)
      .then((res) => {
        if (res.data.status === "Success") {
          setUserStats(res.data.statistics);
          console.log(res.data.statistics);
        } else {
          console.error("Error fetching user stats:", res.data.error);
        }
      })
      .catch((err) => {
        console.error("Error fetching user stats:", err);
      });
  }, [timePeriod]);

  // Handler function for changing the time period
  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };
  function convertTo12HourFormat(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = (hours % 12 || 12).toString();
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

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
            <Link to="/welcomeUser" className="links">
              Home
            </Link>
          </ul>
        </div>
      </div>

      <div className="statsContainer">
        <h1 style={{ marginLeft: "3%", marginTop: "2%" }}>User Statistics</h1>
        <div className="timeSelect">
          <select
            id="timePeriod"
            value={timePeriod}
            onChange={handleTimePeriodChange}
          >
            <option value="1week">1 week</option>
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
          </select>
        </div>

        {userStats ? (
          <div className="userStatsDetails">
            <div className="userStat">
              <p>Ground bookings confirmed:</p>
              <p className="statVal">{userStats.totalConfirmedBookings || 0}</p>
            </div>

            <div className="userStat">
              <p>Ground bookings canceled:</p>
              <p className="statVal">{userStats.totalCancelledBookings || 0}</p>
            </div>
            <div className="userStat">
              <p>Beloved club:</p>
              <p className="statVal"> {userStats.favouriteClub || "-"}</p>
            </div>
            <div className="userStat">
              <p>Favorite ground type:</p>
              <p className="statVal">{userStats.favouriteGroundType || "-"}</p>
            </div>

            <div className="userStat">
              <p>Timeslots reserved:</p>
              <p className="statVal"> {userStats.totalSlotsSpent || 0} hours</p>
            </div>

            <div className="userStat">
              <p>Preferred playtime:</p>
              <p className="statVal">
                {userStats.favouriteTimeSlot
                  ? convertTo12HourFormat(userStats.favouriteTimeSlot)
                  : "-"}
              </p>
            </div>
            <div className="userStat">
              <p>Total amount spent on bookings:</p>
              <p className="statVal">
                <FontAwesomeIcon
                  icon={faIndianRupeeSign}
                  style={{ marginRight: "2px", marginLeft: "8%" }}
                />
                {userStats.totalAmountSpent
                  ? userStats.totalAmountSpent.split(".")[0]
                  : 0}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default UserStats;
