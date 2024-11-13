import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Standings = () => {
  const [standings, setStandings] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState("driverStandings");
  const [error, setError] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

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

  // Color map for constructors
  const constructorColors = {
    mercedes: "#00D2BE",
    red_bull: "#0600EF",
    ferrari: "#DC0000",
    mclaren: "#FF8700",
    alpine: "#0090FF",
    alphatauri: "#2B4562",
    aston_martin: "#006F62",
    williams: "#005AFF",
    alfa: "#900000",
    haas: "#FFFFFF"
  };

  // Prepare data for the horizontal bar chart (accumulated points)
  const accumulatePoints = () => {
    const accumulatedData = [];
    const labels = [];
    const colors = [];

    standings.forEach((entry) => {
      let accumulatedPoints = 0;
      let teamColor = "#000000"; // Default color if constructor is not found

      // If type is driver standings, accumulate driver points
      if (type === "driverStandings") {
        accumulatedPoints = entry?.points || 0;
        // Get the constructor team color for the driver
        const constructorId = entry?.Constructors[0]?.name.toLowerCase().replace(/\s+/g, '_');
        teamColor = constructorColors[constructorId] || "#000000"; // Default color if no match
      } else if (type === "constructorStandings") {
        accumulatedPoints = entry?.points || 0;
        // Use the constructor color for constructor standings
        const constructorId = entry?.Constructor?.name.toLowerCase().replace(/\s+/g, '_');
        teamColor = constructorColors[constructorId] || "#000000"; // Default color if no match
      }

      // Add accumulated points for this driver or constructor
      accumulatedData.push(accumulatedPoints);
      labels.push(
        type === "driverStandings"
          ? `${entry?.Driver?.givenName || ""} ${entry?.Driver?.familyName || ""}`
          : entry?.Constructor?.name || "Unknown"
      );
      colors.push(teamColor); // Store the color for each bar
    });

    return { accumulatedData, labels, colors };
  };

  const { accumulatedData, labels, colors } = accumulatePoints();

  const chartData = {
    labels: labels, // Names of the drivers or constructors
    datasets: [
      {
        label: "Accumulated Points",
        data: accumulatedData,
        backgroundColor: colors, // Use dynamic colors for the bars
        borderColor: colors, // Border color same as the background color
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-4">
        Formula 1 Standings - Accumulated Points
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

          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
          >
            {showGraph ? "Show Table" : "Show Graph"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {showGraph ? (
          <div className="mb-6">
            <Bar
              data={chartData}
              options={{
                indexAxis: 'y', // This makes the bars horizontal
                responsive: true,
                scales: {
                  x: {
                    beginAtZero: true, // Start the x-axis from 0
                  },
                },
              }}
            />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Standings;
