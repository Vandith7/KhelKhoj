import React, { useEffect, useState } from "react";
import logo from "../assets/KhelKhojLogo.png";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/UserStats.css";

function ClubStats() {
  const [clubStats, setClubStats] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1month");
  useEffect(() => {
    axios
      .get(`http://localhost:3001/club/stats?timePeriod=${timePeriod}`)
      .then((res) => {
        if (res.data.status === "Success") {
          setClubStats(res.data.statistics);
          console.log(res.data.statistics);
        } else {
          console.error("Error fetching user stats:", res.data.error);
        }
      })
      .catch((err) => {
        console.error("Error fetching user stats:", err);
      });
  }, [timePeriod]);

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
            <Link to="/welcomeClub" className="links">
              Home
            </Link>
          </ul>
        </div>
      </div>

      <div className="statsContainer">
        <h1 style={{ marginLeft: "3%", marginTop: "2%" }}>Club Statistics</h1>
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

        {clubStats ? (
          <div className="userStatsDetails">
            <div className="userStat">
              <p>Ground bookings confirmed:</p>
              <p className="statVal">{clubStats.totalConfirmedBookings || 0}</p>
            </div>

            <div className="userStat">
              <p>Ground bookings canceled:</p>
              <p className="statVal">{clubStats.totalCancelledBookings || 0}</p>
            </div>
            <div className="userStat">
              <p>Most frequent user:</p>
              <p className="statVal">
                {" "}
                {clubStats.mostBookedUser ? clubStats.mostBookedUser.name : "-"}
              </p>
            </div>
            <div className="userStat">
              <p>Favorite ground type:</p>
              <p className="statVal">{clubStats.mostBookedGroundType || "-"}</p>
            </div>

            <div className="userStat">
              <p>Timeslots reserved:</p>
              <p className="statVal"> {clubStats.totalSlotsSpent || 0} hours</p>
            </div>

            <div className="userStat">
              <p>Preferred playtime:</p>
              <p className="statVal">
                {clubStats.mostBookedTimeSlot
                  ? convertTo12HourFormat(clubStats.mostBookedTimeSlot)
                  : "-"}
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

export default ClubStats;
