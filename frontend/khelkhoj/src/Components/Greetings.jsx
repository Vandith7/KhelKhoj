import React, { useEffect, useState } from "react";

const Greeting = ({ name }) => {
  const [displayedGreeting, setDisplayedGreeting] = useState("");

  useEffect(() => {
    const morningGreetings = [
      `Good morning, ${name}! Rise and shine, let's find your perfect sports activity today!`,
      `Wake up, ${name}! Let's score some sports fun as the sun rises.`,
      `Good morning, ${name}! Let's start the day with some sports discovery!`,
      `Rise and shine, ${name}! Mornings are made for sports exploration!`,
      `Good morning, ${name}! Let's make today a slam dunk with sports!`,
      `Good morning, ${name}! Time to rise, shine, and tackle the day like a champ!`,
      `Wakey wakey, ${name}! Let's kick off today with some sports magic!`,
      `Rise and shine, ${name}! Today's playbook is filled with endless possibilities!`,
      `Good morning, ${name}! Let's make today legendary with some sports adventures!`,
      `Morning, ${name}! Embrace the day like a champion athlete ready to conquer!`,
    ];

    const afternoonGreetings = [
      `Hey there, ${name}! Ready to kick off some sports action this afternoon?`,
      `Hey ${name}! Afternoon's perfect for hitting the sports ground!`,
      `Hello, ${name}! Afternoon's knocking, let's swing into sports action!`,
      `Hello, ${name}! Afternoon's here, perfect for hitting the sports grounds!`,
      `Hey ${name}! Afternoon's here, time to tackle some sports challenges!`,
      `Hey ${name}! Afternoon's here, time to turn up the heat on our sports game!`,
      `Hello, ${name}! Let's turn this afternoon into a sports spectacle to remember!`,
      `Hey there, ${name}! Afternoon vibes are perfect for sports triumphs and high-fives!`,
      `Afternoon, ${name}! Let's kick some sports goals and celebrate like champions!`,
      `Hey ${name}! Let's turn this afternoon into a highlight reel of epic sports moments!`,
    ];

    const eveningGreetings = [
      `Evening, ${name}! Time to hit the ground running and discover your next sports adventure!`,
      `Evening, ${name}! Ready to ace some sports activities under the stars?`,
      `Hi there, ${name}! Evening's calling, and so are sports adventures!`,
      `Discover sports delights as the day winds down, ${name}! Unwind with some sports activities!`,
      `Unwind with some sports activities as the day fades, ${name}! Evening's here.`,
      `Evening, ${name}! Let's wrap up the day with some sports magic under the moonlight!`,
      `Evening, ${name}! Time to score some winning moments in the twilight with sports!`,
      `Hi there, ${name}! Let's turn this evening into a grand slam of sports excitement!`,
      `Discover the magic of sports under the evening sky, ${name}! Let's make memories!`,
      `Unwind with sports adventures as the stars twinkle, ${name}! Evening's playground awaits!`,
    ];

    const nightGreetings = [
      `Good night, ${name}! Rest up for tomorrow's sports excitement. Sweet dreams!`,
      `Night time, ${name}! Dream of winning goals and sports victories!`,
      `Night, ${name}! Rest easy after a day packed with sports excitement!`,
      `Let sports dreams lead you to victory, ${name}! Good night!`,
      `Rest easy after a day filled with sports thrills, ${name}! Nightfall's here.`,
      `Good night, ${name}! Let sports dreams fuel your imagination for tomorrow's victories!`,
      `Night, ${name}! Rest easy knowing that tomorrow holds more sports adventures!`,
      `Dream big, ${name}! Sports dreams are the best lullabies for champions like you!`,
      `Let the night be a canvas for your sports dreams, ${name}! Tomorrow's a new game!`,
      `Rest easy under the night sky, ${name}! Sports dreams await in the realm of sleep!`,
    ];

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

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= randomGreeting.length) {
        setDisplayedGreeting(randomGreeting.substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 35); // Adjust typing speed as needed

    return () => clearInterval(typingInterval);
  }, [name]);

  return <h2 className="greetUser">{displayedGreeting}</h2>;
};

export default Greeting;
