/* eslint-disable react/prop-types */

const ConstructorModal = ({constructor, onClose}) => {
  return (
    <>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

            <div className="text-center mb-4">
              <img src={constructor.logo} alt={`${constructor.name} logo`} className="w-24 h-24 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{constructor.name}</h2>
              <p className="text-gray-600 mb-4">Nationality: {constructor.nationality}</p>
              <p className="text-gray-600 mb-4">Points: {constructor.points}</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">Drivers</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {constructor.drivers?.map((driver, index) => (
                <div key={index} className="text-center">
                  <img src={driver.photo} alt={`${driver.givenName} ${driver.familyName}`} className="w-16 h-16 rounded-full mb-2" />
                  <p className="font-medium">{driver.givenName} {driver.familyName}</p>
                  <p className="text-gray-600">{driver.nationality}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}

export default ConstructorModal