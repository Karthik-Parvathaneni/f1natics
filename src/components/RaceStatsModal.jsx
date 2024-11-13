/* eslint-disable react/prop-types */

import RacePositionTrendChart from "./RacePositionTrendChart";

const RaceStatsModal = ({ raceData, onClose }) => {
  if (!raceData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-gray-900 p-6 rounded-lg shadow-2xl max-w-3xl w-full relative text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center mb-4">Race Stats</h2>
        <p className="text-center text-gray-300 mb-6">
          Track the race position trends of the driver over the season.
        </p>

        <div className="flex justify-center">
          <RacePositionTrendChart raceData={raceData} />
        </div>
      </div>
    </div>
  );
};

export default RaceStatsModal;
