import React, { useEffect, useState } from "react";
import "../Styles/WelcomeUser.css";
import { Link } from "react-router-dom";
import logo from "../assets/KhelKhojLogo.png";
import venue from "../assets/act.webp";
import defaultDp from "../assets/user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faFutbol,
  faCalendarDay,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

function Activities() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    greetUser();
  });
  let user = "Tony";
  const morningGreetings = [
    `Good morning, ${user}! Rise and shine, let's find your perfect sports activity today!`,
    `Wake up, ${user}! Let's score some sports fun as the sun rises.`,
    `Good morning, ${user}! Let's start the day with some sports discovery!`,
    `Rise and shine, ${user}! Mornings are made for sports exploration!`,
    `Good morning, ${user}! Let's make today a slam dunk with sports!`,
    `Good morning, ${user}! Time to rise, shine, and tackle the day like a champ!`,
    `Wakey wakey, ${user}! Let's kick off today with some sports magic!`,
    `Rise and shine, ${user}! Today's playbook is filled with endless possibilities!`,
    `Good morning, ${user}! Let's make today legendary with some sports adventures!`,
    `Morning, ${user}! Embrace the day like a champion athlete ready to conquer!`,
  ];

  const afternoonGreetings = [
    `Hey there, ${user}! Ready to kick off some sports action this afternoon?`,
    `Hey ${user}! Afternoon's perfect for hitting the sports ground!`,
    `Hello, ${user}! Afternoon's knocking, let's swing into sports action!`,
    `Hello, ${user}! Afternoon's here, perfect for hitting the sports grounds!`,
    `Hey ${user}! Afternoon's here, time to tackle some sports challenges!`,
    `Hey ${user}! Afternoon's here, time to turn up the heat on our sports game!`,
    `Hello, ${user}! Let's turn this afternoon into a sports spectacle to remember!`,
    `Hey there, ${user}! Afternoon vibes are perfect for sports triumphs and high-fives!`,
    `Afternoon, ${user}! Let's kick some sports goals and celebrate like champions!`,
    `Hey ${user}! Let's turn this afternoon into a highlight reel of epic sports moments!`,
  ];

  const eveningGreetings = [
    `Evening, ${user}! Time to hit the ground running and discover your next sports adventure!`,
    `Evening, ${user}! Ready to ace some sports activities under the stars?`,
    `Hi there, ${user}! Evening's calling, and so are sports adventures!`,
    `Discover sports delights as the day winds down, ${user}! Unwind with some sports activities!`,
    `Unwind with some sports activities as the day fades, ${user}! Evening's here.`,
    `Evening, ${user}! Let's wrap up the day with some sports magic under the moonlight!`,
    `Evening, ${user}! Time to score some winning moments in the twilight with sports!`,
    `Hi there, ${user}! Let's turn this evening into a grand slam of sports excitement!`,
    `Discover the magic of sports under the evening sky, ${user}! Let's make memories!`,
    `Unwind with sports adventures as the stars twinkle, ${user}! Evening's playground awaits!`,
  ];

  const nightGreetings = [
    `Good night, ${user}! Rest up for tomorrow's sports excitement. Sweet dreams!`,
    `Night time, ${user}! Dream of winning goals and sports victories!`,
    `Night, ${user}! Rest easy after a day packed with sports excitement!`,
    `Let sports dreams lead you to victory, ${user}! Good night!`,
    `Rest easy after a day filled with sports thrills, ${user}! Nightfall's here.`,
    `Good night, ${user}! Let sports dreams fuel your imagination for tomorrow's victories!`,
    `Night, ${user}! Rest easy knowing that tomorrow holds more sports adventures!`,
    `Dream big, ${user}! Sports dreams are the best lullabies for champions like you!`,
    `Let the night be a canvas for your sports dreams, ${user}! Tomorrow's a new game!`,
    `Rest easy under the night sky, ${user}! Sports dreams await in the realm of sleep!`,
  ];

  function greetUser() {
    const now = new Date();
    const hour = now.getHours();
    let greetings;

    if (hour >= 5 && hour < 12) {
      greetings = morningGreetings;
    } else if (hour >= 12 && hour < 18) {
      greetings = afternoonGreetings;
    } else if (hour >= 18 && hour < 22) {
      greetings = eveningGreetings;
    } else if (hour >= 22 || hour >= 0) {
      greetings = nightGreetings;
    }

    const randomIndex = Math.floor(Math.random() * greetings.length);
    const randomGreeting = greetings[randomIndex];

    setGreeting(randomGreeting);
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
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search for grounds and activities"
              className="searchBox"
            ></input>
          </div>
          <ul className="ulLink">
            <li>
              <Link to="/welcomeUser" className="links">
                Grounds
              </Link>
            </li>
            <li>
              <Link to="/" className="links">
                <img className="userProfile" src={defaultDp} alt="Khel-Khoj" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="main">
        <div className="leftBar">
          <h2>
            <FontAwesomeIcon
              style={{ fontSize: 24, marginRight: "5%" }}
              icon={faCalendarDays}
            />
            Upcoming activities
          </h2>
          <ul className="leftCardContainer">
            <div className="cardsLeft">
              <h2 className="venueLeft">
                <FontAwesomeIcon
                  style={{ fontSize: 18, marginRight: "2%" }}
                  icon={faLocationDot}
                />
                Venue{" "}
              </h2>
              <p className="activityLeft">
                {" "}
                <FontAwesomeIcon
                  style={{ fontSize: 15, marginRight: "2%" }}
                  icon={faFutbol}
                />
                Activity
              </p>
              <p className="dayLeft">
                <FontAwesomeIcon
                  style={{ fontSize: 15, marginRight: "2%" }}
                  icon={faCalendarDay}
                />
                Today
              </p>
              <p className="slotLeft">
                <FontAwesomeIcon
                  style={{ fontSize: 15, marginRight: "2%" }}
                  icon={faClock}
                />
                00:00 to 00:00
              </p>
            </div>
            <div className="cardsLeft"></div>
            <div className="cardsLeft"></div>
            <div className="cardsLeft"></div>
          </ul>
        </div>
        <div className="rightBar">
          <h1 className="greetUser">{greeting}</h1>
          <div className="venueContainer">
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>

            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>
            <div className="venueCard">
              <div
                className="venuePic"
                style={{
                  backgroundImage: `url(${venue})`,
                }}
              ></div>
              <h2 className="venueName">Venue</h2>
              <p className="picLocation">Location</p>
              <p className="venueRating">Rating</p>
            </div>

            <h1>‎</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activities;
