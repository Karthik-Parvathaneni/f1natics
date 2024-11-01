import { useState, useEffect } from "react";
import axios from "axios";

const Standings = () => {
  const [standings, setStandings] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState("driverStandings");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get(
          `https://ergast.com/api/f1/${year}/${type}.json`
        );

        const standingsList = response.data.MRData.StandingsTable.StandingsLists;
        if (standingsList.length === 0) {
          setError("No standings data available for the selected year and type.");
          setStandings([]);
          return;
        }

        const data =
          type === "driverStandings"
            ? standingsList[0].DriverStandings
            : standingsList[0].ConstructorStandings;

        setStandings(data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch standings. Please try again.");
      }
    };

    fetchStandings();
  }, [year, type]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-4">
        Formula 1 Standings
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
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
            Standings Type:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="ml-2 p-2 border border-gray-300 rounded-lg"
            >
              <option value="driverStandings">Driver Standings</option>
              <option value="constructorStandings">Constructor Standings</option>
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">Position</th>
              <th className="p-4 text-left font-semibold">
                {type === "driverStandings" ? "Driver" : "Constructor"}
              </th>
              <th className="p-4 text-left font-semibold">Points</th>
              <th className="p-4 text-left font-semibold">Wins</th>
            </tr>
          </thead>
          <tbody>
            {standings.length > 0 ? (
              standings.map((entry, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-100`}
                >
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">
                    {type === "driverStandings"
                      ? `${entry?.Driver?.givenName || ""} ${
                          entry?.Driver?.familyName || ""
                        }`
                      : entry?.Constructor?.name || "Unknown"}
                  </td>
                  <td className="p-4 border-b">{entry?.points || 0}</td>
                  <td className="p-4 border-b">{entry?.wins || 0}</td>
                </tr>
              ))
            ) : (
              !error && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Loading standings...
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

export default Standings;
