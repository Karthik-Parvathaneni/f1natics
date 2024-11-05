import { useState, useEffect } from "react";
import axios from "axios";
import DriverModal from "../components/DriverModal";

const Drivers = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const ergastResponse = await axios.get(`https://ergast.com/api/f1/${year}/drivers.json`);
        const driverData = ergastResponse.data.MRData.DriverTable.Drivers;

        // Map drivers with Formula 1 photo URLs
        const driversWithPhotos = driverData.map((driver) => {
          const lastName = driver.familyName.toLowerCase();
          const photoUrl = `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/${year}Drivers/${lastName}`;

          return { ...driver, photo: photoUrl };
        });

        setDrivers(driversWithPhotos);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    };

    fetchDrivers();
  }, [year]);

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
  };

  const closeModal = () => {
    setSelectedDriver(null);
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
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-100`}
                onClick={() => handleDriverClick(driver)}
              >
                <td className="p-4 border-b">
                  <img
                    src={driver.photo}
                    alt={`${driver.givenName} ${driver.familyName}`}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                </td>
                <td className="p-4 border-b">{driver.givenName} {driver.familyName}</td>
                <td className="p-4 border-b">{driver.nationality}</td>
                <td className="p-4 border-b">{driver.dateOfBirth}</td>
                <td className="p-4 border-b">{driver.code}</td>
                <td className="p-4 border-b">{driver.permanentNumber || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDriver && <DriverModal driver={selectedDriver} onClose={closeModal} />}
    </div>
  );
};

export default Drivers;
