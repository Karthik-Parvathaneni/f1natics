import React, { useState, useEffect } from 'react';

const HomeCards = () => {
  const [nextRace, setNextRace] = useState(null);
  const [lastRaceResults, setLastRaceResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const getTrackImageUrl = (locality, country) => {
    const trackName = locality ? locality : country;
    const formattedTrackName = trackName.replace(/\s+/g, "%20");
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

    const fetchLastRaceResults = async () => {
      try {
        const response = await fetch('https://ergast.com/api/f1/current/last/results.json');
        const data = await response.json();
        const results = data.MRData.RaceTable.Races[0].Results.slice(0, 3);
        setLastRaceResults(results);
      } catch (error) {
        console.error("Error fetching race results:", error);
      }
    };

    fetchNextRace();
    fetchLastRaceResults();
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
          minutes: Math.floor((difference % (1000 * 60)) / (1000 * 60)),
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

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Countdown Timer and Track Image */}
          {nextRace && (
            <div className="w-full md:w-1/2 px-6 flex items-center justify-center">
              <div className="flex flex-col items-center bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg border border-gray-800 space-y-4">
                {/* Track Image */}
                {trackImageUrl && (
                  <div className="w-full h-32 bg-black/40 rounded-lg overflow-hidden mb-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:opacity-90">
                    <img
                      src={trackImageUrl}
                      alt={`${nextRace.raceName} Track`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}

                {/* Race Title and Countdown */}
                <div className="text-lg font-bold text-center mb-2">{nextRace.raceName}</div>
                <div className="flex justify-center items-center gap-4">
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
          )}

          {/* Last Race Results */}
          {lastRaceResults.length > 0 && (
            <div className="w-full md:w-1/2 px-6 flex flex-col items-center bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg border border-gray-800 space-y-4">
              <h2 className="text-3xl font-bold mb-4">Live Race</h2>
              {lastRaceResults.map((driver, index) => (
                <div
                  key={index}
                  className="w-full p-4 bg-black/30 rounded-md hover:bg-gray-800 transition-all duration-300 ease-in-out flex justify-between items-center"
                >
                  <span>{driver.Driver.givenName} {driver.Driver.familyName}</span>
                  <span className="text-sm text-gray-400">{driver.Constructor.name}</span>
                </div>
              ))}
              <a
                href={`/Results`}
                rel="noopener noreferrer"
                className="mt-4 inline-block text-lg text-blue-500 hover:underline hover:text-blue-700 transition-all duration-300 ease-in-out"
              >
                Full Race Results
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
