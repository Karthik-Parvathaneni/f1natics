// eslint-disable-next-line react/prop-types
const Card = ({ imageUrl, title, description }) => {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover" // Full-page background image
        />
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
        <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h2 className="text-4xl font-bold mb-4">{title}</h2> {/* Increased font size */}
          <p className="text-lg">{description}</p>
        </div>
      </div>
    );
  };
  
  export default Card;
  