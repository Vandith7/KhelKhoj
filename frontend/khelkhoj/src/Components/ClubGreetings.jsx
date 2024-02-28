import React, { useEffect, useState } from "react";

const ClubGreetings = ({ name }) => {
  const [displayedGreeting, setDisplayedGreeting] = useState("");

  useEffect(() => {
    const morningGreetings = [
      `Good morning, ${name}! Let's awaken the grounds to a new day of sporting triumphs!`,
      `Rise and shine, ${name}! Let's infuse the morning air with the promise of sporting adventures!`,
      `Morning, esteemed ${name}! Let's ignite the day with the passion of sporting pursuits!`,
      `Wakey wakey, ${name}! Let's embark on a morning journey of grounds and sporting marvels!`,
      `Greetings, early risers! Let's welcome the morning sun as it illuminates our sporting ambitions!`,
    ];

    const afternoonGreetings = [
      `Hey ${name}, afternoon's here! Let's harness the sun's energy for an afternoon of sporting wonders!`,
      `Hello, ${name}! Let's turn the afternoon heat into fuel for our sporting endeavors!`,
      `Afternoon greetings, esteemed ${name}! Let's dive into the day's warmth with sports aplomb!`,
      `Hey there, ${name}! Let's make the most of the afternoon glow with sporting camaraderie!`,
      `Hello, ${name}! Let's bask in the afternoon light as we cultivate our sporting oasis!`,
    ];

    const eveningGreetings = [
      `Evening, esteemed ${name}! Let's paint the dusk with the colors of our sporting passions!`,
      `Greetings, ${name}! Let's turn the evening into a canvas for our sporting dreams!`,
      `Hi there, ${name}! Let's embrace the twilight hours with sporting fervor and delight!`,
      `Evening salutations, esteemed ${name}! Let's illuminate the night with the radiance of our sporting spirit!`,
      `Hello, fellow ${name}! Let's bid the day farewell by embracing the magic of sporting twilight!`,
    ];

    const nightGreetings = [
      `Good night, ${name}! Let's let our dreams soar with the promise of tomorrow's sporting adventures!`,
      `Nightfall, ${name}! Let's rest easy, knowing our grounds await new sporting tales!`,
      `Rest well, ${name}! Let the night be a sanctuary for our sporting aspirations!`,
      `Good night, ${name}! Let's drift into slumber with visions of future sporting triumphs!`,
      `Night, esteemed ${name}! Let's let the silence of the night inspire our sporting ambitions for the days ahead!`,
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

  return <h1 className="greetUser">{displayedGreeting}</h1>;
};

export default ClubGreetings;
