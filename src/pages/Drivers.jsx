import { useState, useEffect } from "react";
import axios from "axios";
import DriverModal from "../components/DriverModal";
import RaceStatsModal from "../components/RaceStatsModal";

const Drivers = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [card, setCard] = useState(null);
  const [raceData, setRaceData] = useState([]); // State to store race data for the driver

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const ergastResponse = await axios.get(`https://ergast.com/api/f1/${year}/driverStandings.json`);
        const driverData = ergastResponse.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const driversWithDetails = driverData.map((standing) => {
          const { Driver: driver, Constructors: [team] } = standing;
          const lastName = driver.familyName.toLowerCase();
          const photoUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/${year}Drivers/${lastName}`;
          
          return {
            ...driver,
            photo: photoUrl,
            teamName: team.name,
            points: standing.points,
          };
        });

        setDrivers(driversWithDetails);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    };

    fetchDrivers();
  }, [year]);

  const handleDriverClick = (driver, model) => {
    setSelectedDriver(driver);
    setCard(model);
    if (model === "statistics") {
      fetchRaceData(driver.driverId); // Fetch race data when "View Race Stats" is clicked
    }
  };

  const fetchRaceData = async (driverId) => {
    try {
      const response = await axios.get(`https://ergast.com/api/f1/${year}/drivers/${driverId}/results.json`);
      const races = response.data.MRData.RaceTable.Races;
      const racePositions = races.map((race) => ({
        raceName: race.raceName,
        position: race.Results[0]?.position || "N/A",
      }));
      setRaceData(racePositions);
    } catch (err) {
      console.error("Failed to fetch race data:", err);
    }
  };

  const closeModal = () => {
    setSelectedDriver(null);
    setCard(null);
    setRaceData([]); // Clear race data when modal is closed
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-4">
        Formula 1 {year} - Drivers
      </h1>

      <div className="flex justify-center mb-6">
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
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">Photo</th>
              <th className="p-4 text-left font-semibold">Driver</th>
              <th className="p-4 text-left font-semibold">Nationality</th>
              <th className="p-4 text-left font-semibold">Date of Birth</th>
              <th className="p-4 text-left font-semibold">Code</th>
              <th className="p-4 text-left font-semibold">Number</th>
              <th className="p-4 text-left font-semibold">Team</th>
              <th className="p-4 text-left font-semibold">Points</th>
              <th className="p-4 text-left font-semibold">Statistics</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-100`}
              >
                <td className="p-4 border-b">
                  <img
                    src={driver.photo}
                    alt={`${driver.givenName} ${driver.familyName}`}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={() => handleDriverClick(driver, "model")}
                  />
                </td>
                <td className="p-4 border-b cursor-pointer">
                  <button onClick={() => handleDriverClick(driver, "model")}>
                    {driver.givenName} {driver.familyName}
                  </button>
                </td>
                <td className="p-4 border-b">{driver.nationality}</td>
                <td className="p-4 border-b">{driver.dateOfBirth}</td>
                <td className="p-4 border-b">{driver.code}</td>
                <td className="p-4 border-b">{driver.permanentNumber || "N/A"}</td>
                <td className="p-4 border-b">{driver.teamName}</td>
                <td className="p-4 border-b">{driver.points}</td>
                <td className="p-4 border-b">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => handleDriverClick(driver, "statistics")}
                  >
                    View Race Stats
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDriver && card === "model" && (
        <DriverModal driver={selectedDriver} onClose={closeModal} />
      )}
      {selectedDriver && card === "statistics" && raceData.length > 0 && (
        <RaceStatsModal raceData={raceData} onClose={closeModal} />
      )}
    </div>
  );
};

export default Drivers;
