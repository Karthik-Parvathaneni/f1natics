import React from "react";

const DriverModal = ({ driver, onClose }) => {
  if (!driver) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <div className="flex flex-col items-center">
          <img
            src={driver.photo}
            alt={`${driver.givenName} ${driver.familyName}`}
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{driver.givenName} {driver.familyName}</h2>
          <p className="text-gray-600 mb-2">{driver.nationality}</p>
          <p className="text-gray-600 mb-2">Team: {driver.teamName}</p>
          <p className="text-gray-600 mb-4">Points: {driver.points}</p>
          <p className="text-gray-600 text-center mb-4">
            {`${driver.givenName} ${driver.familyName} is a ${driver.nationality} Formula 1 driver 
            currently racing for ${driver.teamName}. Born on ${driver.dateOfBirth}, they are recognized 
            for their skill on the track and have accumulated ${driver.points} points this season.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverModal;
