// /* eslint-disable no-unused-vars */
import {Route,createBrowserRouter,createRoutesFromElements,RouterProvider } from 'react-router-dom'

import HomePage from './pages/HomePage'
import MainLayout from './layout/MainLayout'
import Drivers from './pages/Drivers'
import Constructors from './pages/Constructors'
import Standings from './pages/Standings'
import Results from './pages/Results'
import Calendar from './pages/Calendar'

const App = () => {

  const router=createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HomePage/>}/>
      <Route path='/Drivers' element={<Drivers/>}/>
      <Route path='/Constructors' element={<Constructors/>}/>
      <Route path='/Results' element={<Results/>}/>
      <Route path='/Standings' element={<Standings/>}/>
      <Route path='/Calendar' element={<Calendar/>}/>
    </Route>
  ))


  return <RouterProvider router={router}/>
}

export default App