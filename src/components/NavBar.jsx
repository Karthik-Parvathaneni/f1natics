import {NavLink} from 'react-router-dom'
import logo from '../assets/logo.png';

const Navbar = () => {
  const linkClass=({isActive})=>isActive?'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2':'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
  return (
    <>
    <nav className="bg-red-600 border-b border-black-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        {/*  */}
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img
                className="h-10 w-auto"
                src={logo}
                alt="Formula 1"
              />
              <span className="hidden md:block text-white text-2xl font-bold ml-2"
                >F1natics
              </span>
          </NavLink>
            <div className="md:ml-auto">
              {/*  */}
              <div className="flex space-x-2">
                <NavLink
                  to="/"
                  className={linkClass}
                  >Home
                </NavLink>
                <NavLink
                  to="/Drivers"
                  className={linkClass}
                  >Drivers
                  </NavLink>
                <NavLink
                  to="/Constructors"
                  className={linkClass}
                  >Constructors</NavLink>
                <NavLink
                  to="/Results"
                  className={linkClass}
                  >Results</NavLink>
                <NavLink
                  to="/Standings"
                  className={linkClass}
                  >Standings</NavLink>
                <NavLink
                  to="/Calendar"
                  className={linkClass}
                  >Calendar</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar