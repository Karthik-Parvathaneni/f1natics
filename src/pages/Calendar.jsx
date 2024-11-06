import { useState, useEffect } from "react";
import axios from "axios";

const Calendar = () => {
  const [races, setRaces] = useState([]);
  const today = new Date();

  useEffect(() => {
    const fetchRaceCalendar = async () => {
      try {
        const ergastResponse = await axios.get("http://ergast.com/api/f1/current.json");
        const raceData = ergastResponse.data.MRData.RaceTable.Races;

        const formattedRaces = raceData.map((race) => ({
          raceName: race.raceName,
          date: race.date ? new Date(race.date) : null, // Ensure date is parsed
          circuitName: race.Circuit.circuitName,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          round: race.round,
        }));

        setRaces(formattedRaces);
      } catch (err) {
        console.error("Failed to fetch race calendar:", err);
      }
    };

    fetchRaceCalendar();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">
        Formula 1 - 2024 Race Calendar
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {races.map((race, index) => {
          const isUpcoming = race.date && race.date > today;

          return (
            <div
              key={index}
              className={`shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-200
                ${isUpcoming ? 'bg-blue-50' : 'bg-gray-100'}`}
            >
              <div className={`${isUpcoming ? 'bg-blue-600' : 'bg-gray-500'} text-white rounded-md p-4 mb-4`}>
                <h2 className="text-lg font-semibold">{race.raceName}</h2>
                <p className="text-sm">{race.date ? race.date.toLocaleDateString() : "Date unavailable"}</p>
              </div>
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">Round:</span> {race.round}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Circuit:</span> {race.circuitName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Location:</span> {race.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
