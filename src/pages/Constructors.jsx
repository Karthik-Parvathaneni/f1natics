import { useState, useEffect } from "react";
import axios from "axios";

const Constructors = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [constructors, setConstructors] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState(null);

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        const ergastResponse = await axios.get(`https://ergast.com/api/f1/${year}/constructors.json`);
        const constructorData = ergastResponse.data.MRData.ConstructorTable.Constructors;

        // Fetch constructor standings to get points
        const standingsResponse = await axios.get(`https://ergast.com/api/f1/${year}/constructorStandings.json`);
        const standingsData = standingsResponse.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];

        // Map constructor points to the respective constructor in the list
        const constructorsWithDetails = constructorData.map((constructor) => {
          let teamName = constructor.name.toLowerCase().replace(/\s+/g, "-");
          let logoUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/${teamName}`;
          let carImageUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/teams/${year}/${teamName}.png`;
        
          // Specific logo and image URL adjustments for certain teams
          if (teamName === "red-bull") {
            logoUrl = "https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/red%20bull";
            carImageUrl = "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing.png";
          }

          if (teamName === "sauber") {
            logoUrl = "https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/kick%20sauber";
            carImageUrl = "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png";
          }

          if (teamName === "alpine-f1-team") {
            logoUrl = "https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/alpine";
            carImageUrl = "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine.png";
          }

          if (teamName === "rb-f1-team") {
            logoUrl = "https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/rb";
            carImageUrl = "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb.png";
          }

          if (teamName === "aston-martin") {
            logoUrl = "https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/aston%20martin%202024";
          }

          if (teamName === "haas-f1-team") {
            logoUrl = "https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/haas";
          }

          if (teamName === "alfa-romeo") {
            logoUrl = "https://banner2.cleanpng.com/20180723/ioi/9a1a71ddc01a0bbb456a2420bb6e7c73.webp";
            carImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sJOMc5mWTGSAmLZxEqMBC_G_v36RLfe7yQ&s";

          }

          // Find points for the constructor from standings data
          const points = standingsData.find((standing) => standing.Constructor.constructorId === constructor.constructorId)?.points || "N/A";

          return { ...constructor, logo: logoUrl, carImage: carImageUrl, points };
        });

        setConstructors(constructorsWithDetails);
      } catch (err) {
        console.error("Failed to fetch constructors:", err);
      }
    };

    fetchConstructors();
  }, [year]);

  const handleConstructorClick = async (constructor) => {
    try {
      const driversResponse = await axios.get(`https://ergast.com/api/f1/${year}/constructors/${constructor.constructorId}/drivers.json`);
      const driversData = driversResponse.data.MRData.DriverTable.Drivers;

      const driversWithPhotos = driversData.map((driver) => {
        const lastName = driver.familyName.toLowerCase();
        const photoUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/${year}Drivers/${lastName}`;
        return { ...driver, photo: photoUrl };
      });

      setSelectedConstructor({ ...constructor, drivers: driversWithPhotos });
    } catch (err) {
      console.error("Failed to fetch drivers for constructor:", err);
    }
  };

  const closeModal = () => {
    setSelectedConstructor(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
        Formula 1 {year} - Constructors
      </h1>

      <div className="flex justify-center mb-8">
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
              <th className="p-5 text-left font-semibold">Team Logo</th>
              <th className="p-5 text-left font-semibold">Team Name</th>
              <th className="p-5 text-left font-semibold">Car Image</th>
              <th className="p-5 text-left font-semibold">Nationality</th>
              <th className="p-5 text-left font-semibold">Points</th>
            </tr>
          </thead>
          <tbody>
            {constructors.map((constructor, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-100`}
                onClick={() => handleConstructorClick(constructor)}
              >
                <td className="p-5 border-b flex justify-center">
                  <img
                    src={constructor.logo}
                    alt={`${constructor.name} logo`}
                    className="w-24 h-24 object-contain"
                  />
                </td>
                <td className="p-5 border-b font-medium text-lg">{constructor.name}</td>
                <td className="p-5 border-b flex justify-center">
                  <img
                    src={constructor.carImage}
                    alt={`${constructor.name} car`}
                    className="w-32 h-20 object-contain"
                  />
                </td>
                <td className="p-5 border-b text-center">{constructor.nationality}</td>
                <td className="p-5 border-b text-center">{constructor.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedConstructor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

            <div className="text-center mb-4">
              <img src={selectedConstructor.logo} alt={`${selectedConstructor.name} logo`} className="w-24 h-24 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{selectedConstructor.name}</h2>
              <p className="text-gray-600 mb-4">Nationality: {selectedConstructor.nationality}</p>
              <p className="text-gray-600 mb-4">Points: {selectedConstructor.points}</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">Drivers</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedConstructor.drivers?.map((driver, index) => (
                <div key={index} className="text-center">
                  <img src={driver.photo} alt={`${driver.givenName} ${driver.familyName}`} className="w-16 h-16 rounded-full mb-2" />
                  <p className="font-medium">{driver.givenName} {driver.familyName}</p>
                  <p className="text-gray-600">{driver.nationality}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Constructors;
