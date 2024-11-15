
import React, { useState, useEffect } from 'react';

const HomeCards = () => {
  const [nextRace, setNextRace] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  // Function to format the track image URL dynamically
  const getTrackImageUrl = (locality, country) => {
    const trackName = locality ? locality : country;
    const formattedTrackName = trackName.replace(/\s+/g, "%20"); // Replace spaces with '%20'
    return `https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/${formattedTrackName}%20carbon`;
  };

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const response = await fetch('https://ergast.com/api/f1/current/next.json');
        const data = await response.json();
        const race = data.MRData.RaceTable.Races[0];
        setNextRace(race);
      } catch (error) {
        console.error("Error fetching race data:", error);
      }
    };
    fetchNextRace();
  }, []);

  useEffect(() => {
    if (!nextRace) return;

    const calculateTimeLeft = () => {
      const raceDateTime = new Date(`${nextRace.date}T${nextRace.time}`).getTime();
      const difference = raceDateTime - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [nextRace]);

  const trackImageUrl = nextRace
    ? getTrackImageUrl(nextRace.Circuit.Location.locality, nextRace.Circuit.Location.country)
    : null;

  return (
    <div className="w-full h-screen relative">
      {/* Background Image with Dark Overlay */}
      <img
        src="https://media.formula1.com/image/upload/t_16by9South/f_auto/q_auto/v1709392049/trackside-images/2024/F1_Grand_Prix_of_Bahrain/2053149561.jpg"
        alt="F1 Track"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Welcome Message */}
        <div className="text-center text-white mb-8">
          <h1 className="text-5xl font-bold mb-4">Welcome to F1natics</h1>
          <p className="text-xl">The pitstop for all F1 fans!</p>
        </div>

        {/* Countdown Timer and Track Image */}
        {nextRace && (
          <div className="w-full max-w-96 px-6 flex items-center justify-center">
            <div className="flex flex-row items-center bg-black/60 backdrop-blur-sm text-white p-6 rounded-lg border border-gray-800">
              {/* Track Image on the left of the countdown */}
              {trackImageUrl && (
                <div className="w-32 h-32 flex-shrink-0 bg-black/60 rounded-lg overflow-hidden mr-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:opacity-90">
                  <img
                    src={trackImageUrl}
                    alt={`${nextRace.raceName} Track`}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}

              {/* Race Title and Countdown */}
              <div className="flex flex-col items-center justify-center space-y-3 w-full">
                <div className="text-lg font-bold text-center mb-2">{nextRace.raceName}</div>
                <div className="flex justify-center items-center gap-4">
                  {/* Countdown timer with hover effect */}
                  <div className="text-center w-12 hover:bg-gray-700 hover:scale-110 transition-all duration-300 ease-in-out p-2 rounded-md">
                    <div className="text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-300">DAYS</div>
                  </div>
                  <div className="text-center w-12 hover:bg-gray-700 hover:scale-110 transition-all duration-300 ease-in-out p-2 rounded-md">
                    <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-300">HRS</div>
                  </div>
                  <div className="text-center w-12 hover:bg-gray-700 hover:scale-110 transition-all duration-300 ease-in-out p-2 rounded-md">
                    <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-300">MINS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeCards;
