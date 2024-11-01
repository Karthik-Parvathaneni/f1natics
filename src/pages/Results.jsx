import { useState, useEffect } from "react";
import axios from "axios";

const Results = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [round, setRound] = useState(null); 
  const [races, setRaces] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [raceName, setRaceName] = useState(""); 

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await axios.get(`https://ergast.com/api/f1/${year}.json`);
        const raceList = response.data.MRData.RaceTable.Races;

        if (raceList.length > 0) {
          const completedRaces = raceList.filter(
            (race) => new Date(race.date) <= new Date()
          );

          setRaces(completedRaces);

          const latestRace = completedRaces[completedRaces.length - 1];
          setRound(latestRace.round);
          setRaceName(latestRace.raceName);
        } else {
          setError("No races available for the selected year.");
        }
      } catch (err) {
        setError("Failed to fetch races. Please try again.");
      }
    };

    fetchRaces();
  }, [year]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!round) return;

      try {
        const response = await axios.get(`https://ergast.com/api/f1/${year}/${round}/results.json`);
        const raceResults = response.data.MRData.RaceTable.Races[0]?.Results || [];
        const raceTitle = response.data.MRData.RaceTable.Races[0]?.raceName || "Race";

        setResults(raceResults);
        setRaceName(raceTitle); 
        setError(null);
      } catch (err) {
        setError("Failed to fetch results. Please try again.");
      }
    };

    fetchResults();
  }, [year, round]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-4">
        Formula 1 {year} - {raceName} Results
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex justify-center mb-6 space-x-4">
        <label className="text-lg font-medium text-gray-700">
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter year"
          />
        </label>
        <label className="text-lg font-medium text-gray-700">
          Grand Prix:
          <select
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded-lg"
          >
            {races.map((race) => (
              <option key={race.round} value={race.round}>
                {race.raceName} {new Date(race.date) > new Date() ? "(Race not yet finished)" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">Position</th>
              <th className="p-4 text-left font-semibold">Driver</th>
              <th className="p-4 text-left font-semibold">Constructor</th>
              <th className="p-4 text-left font-semibold">Laps</th>
              <th className="p-4 text-left font-semibold">Grid</th>
              <th className="p-4 text-left font-semibold">Time</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Points</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((entry, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-100`}
                >
                  <td className="p-4 border-b">{entry.position}</td>
                  <td className="p-4 border-b">
                    {entry.Driver.givenName} {entry.Driver.familyName}
                  </td>
                  <td className="p-4 border-b">{entry.Constructor.name}</td>
                  <td className="p-4 border-b">{entry.laps}</td>
                  <td className="p-4 border-b">{entry.grid}</td>
                  <td className="p-4 border-b">{entry.Time?.time || "N/A"}</td>
                  <td className="p-4 border-b">{entry.status}</td>
                  <td className="p-4 border-b">{entry.points}</td>
                </tr>
              ))
            ) : (
              !error && (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    Loading Results...
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
