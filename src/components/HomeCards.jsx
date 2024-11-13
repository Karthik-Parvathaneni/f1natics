import Card from "./Card"

const HomeCards = () => {
  return (
    <>
      <div className="w-full h-screen">
        <Card 
          imageUrl="https://media.formula1.com/image/upload/t_16by9South/f_auto/q_auto/v1709392049/trackside-images/2024/F1_Grand_Prix_of_Bahrain/2053149561.jpg"
          title="Welcome to F1natics"
          description="The Pitstop for all the formula fans!"
        />
      </div>
    </>
  )
}

export default HomeCards
