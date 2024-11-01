import Card from "./Card"
import carsImage from "../assets/cars.avif";

const HomeCards = () => {
  return (
    <>
      <div className="w-full h-screen">
        <Card 
          imageUrl={carsImage}
          title="Welcome to F1natics"
          description="The Pitstop for all the formula fans!"
        />
      </div>
    </>
  )
}

export default HomeCards