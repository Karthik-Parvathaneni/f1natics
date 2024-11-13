import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Results = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [round, setRound] = useState(null);
  const [races, setRaces] = useState([]);
  const [results, setResults] = useState([]);
  const [lapData, setLapData] = useState({});
  const [showLapChart, setShowLapChart] = useState(false);
  const [error, setError] = useState(null);
  const [raceName, setRaceName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRaces = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://ergast.com/api/f1/${year}.json`);
        const data = await response.json();
        const raceList = data.MRData.RaceTable.Races;

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
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [year]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!round) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://ergast.com/api/f1/${year}/${round}/results.json`
        );
        const data = await response.json();
        const raceResults = data.MRData.RaceTable.Races[0]?.Results || [];
        const raceTitle = data.MRData.RaceTable.Races[0]?.raceName || "Race";

        setResults(raceResults);
        setRaceName(raceTitle);
        setError(null);
      } catch (err) {
        setError("Failed to fetch results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [year, round]);

  const fetchLapData = async () => {

    if (!round) return;

    setLoading(true);
    try {
      const lapPositions = {};
      const totalLaps = 51; // Adjust based on race data
      
      for (let lap = 1; lap <= totalLaps; lap++) {
        const response = await fetch(
          `https://ergast.com/api/f1/${year}/${round}/laps/${lap}.json`
        );
        const data = await response.json();
        const lapData = data.MRData.RaceTable.Races[0]?.Laps[0];

        if (lapData) {
          lapData.Timings.forEach((timing) => {
            if (!lapPositions[timing.driverId]) {
              lapPositions[timing.driverId] = { positions: [], color: "" };
            }
            lapPositions[timing.driverId].positions.push({
              lap: lap,
              position: parseInt(timing.position, 10),
            });
          });
        }
      }

      // F1 Constructor Colors
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

      results.forEach((result) => {
        const driverId = result.Driver.driverId;
        const constructorId = result.Constructor.constructorId;
        if (lapPositions[driverId]) {
          lapPositions[driverId].color = constructorColors[constructorId] || "#666666";
        }
      });

      setLapData(lapPositions);
      setShowLapChart(true);
      setError(null);
    } catch (err) {
      setError("Failed to fetch lap data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: Array.from({ length: 51 }, (_, i) => i + 1),
    datasets: Object.entries(lapData).map(([driverId, data]) => ({
      label: results.find(r => r.Driver.driverId === driverId)?.Driver.familyName || driverId,
      data: data.positions.map((pos) => pos.position),
      borderColor: data.color,
      backgroundColor: data.color,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Lap",
          color: "#ffffff"
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        ticks: {
          color: "#ffffff"
        }
      },
      y: {
        reverse: true,
        title: {
          display: true,
          text: "Position",
          color: "#ffffff"
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        ticks: {
          color: "#ffffff",
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#ffffff",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1
      }
    }
  };

  return (
    <div className="p-6 bg-white-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-black mb-6">
        Formula 1 {year} - {raceName}
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex flex-wrap justify-center gap-4 mb-6">
  <label className="text-lg font-medium text-black">
    Year:
    <input
      type="number"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      className="ml-2 p-2 bg-white-800 text-black border border-white-700 rounded-lg"
      placeholder="Enter year"
    />
  </label>

  <label className="text-lg font-medium text-black">
    Grand Prix:
    <select
      value={round || ""}
      onChange={(e) => setRound(e.target.value)}
      className="ml-2 p-2 bg-white-800 text-black border border-white-700 rounded-lg"
    >
      {races.map((race) => (
        <option key={race.round} value={race.round}>
          {race.raceName}
        </option>
      ))}
    </select>
  </label>

  <div className="flex items-center"> {/* This wrapper centers the button next to the select box */}
    <button
      onClick={fetchLapData}
      disabled={loading}
      className="bg-blue-600 text-black px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Loading..." : "Show Lap-wise Positions"}
    </button>
  </div>
  </div>

      {results.length > 0 && (
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left bg-white-800 text-black rounded-lg overflow-hidden">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Constructor</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.position} className="border-b border-white-700 hover:bg-white-600">
                  <td className="px-4 py-3">{result.position}</td>
                  <td className="px-4 py-3">
                    {result.Driver.givenName} {result.Driver.familyName}
                  </td>
                  <td className="px-4 py-3">{result.Constructor.name}</td>
                  <td className="px-4 py-3">{result.Time?.time || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showLapChart && (
        <div className="mt-8 p-6 bg-black rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-4">Lap-wise Positions Chart</h2>
          <div style={{ height: "600px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;