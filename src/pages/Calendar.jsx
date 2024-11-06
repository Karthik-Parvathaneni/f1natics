import { useState, useEffect } from "react";
import axios from "axios";

const Calendar = () => {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [fallbackImage, setFallbackImage] = useState(false); // Track if fallback URL is needed
  const today = new Date();

  useEffect(() => {
    const fetchRaceCalendar = async () => {
      try {
        const ergastResponse = await axios.get("http://ergast.com/api/f1/current.json");
        const raceData = ergastResponse.data.MRData.RaceTable.Races;

        const formattedRaces = raceData.map((race) => ({
          raceName: race.raceName,
          date: race.date ? new Date(race.date) : null,
          circuitName: race.Circuit.circuitName,
          locality: race.Circuit.Location.locality,
          country: race.Circuit.Location.country,
          location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
          round: race.round,
        }));

        setRaces(formattedRaces.reverse()); // Reverse the order here
      } catch (err) {
        console.error("Failed to fetch race calendar:", err);
      }
    };

    fetchRaceCalendar();
  }, []);

  const handleRaceClick = (race) => {
    setSelectedRace(race);
    setFallbackImage(false); // Reset fallback state on new selection
  };

  const getTrackImageUrl = (locality, country) => {
    const formattedLocality = locality.replace(/\s+/g, "_") + "_Circuit";
    const formattedCountry = country.replace(/\s+/g, "_") + "_Circuit";
    return fallbackImage
      ? `https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${formattedCountry}`
      : `https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${formattedLocality}`;
  };

  const closePopup = () => {
    setSelectedRace(null);
  };

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
              onClick={() => handleRaceClick(race)}
              className={`shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-200 cursor-pointer
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

      {/* Modal Popup */}
      {selectedRace && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closePopup}
        >
          <div
            className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-center mb-4">{selectedRace.circuitName}</h2>
            <img
              src={getTrackImageUrl(selectedRace.locality, selectedRace.country)}
              alt={`${selectedRace.locality} track`}
              className="w-full h-auto rounded-lg"
              onError={() => setFallbackImage(true)} // Set fallback if image fails to load
            />
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2 hover:bg-red-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
