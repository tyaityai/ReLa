import { NavLink, Link } from 'react-router-dom';
import logoImage from '../assets/ReLa.svg';

function Header() {
    return (
        <header className="fixed flex top-4 z-50 w-[90%] items-center justify-between">
            
            {/* logo */}
            <div className="relative w-24 h-16 drop-shadow-lg/15">
                <Link to="/">
                    <div className="absolute"></div>
                    <img src={logoImage} alt="ReLa" className="relative w-full h-full" />
                </Link>
            </div>

            {/* menu */}
            <nav className="flex gap-6 font-bold text-black drop-shadow-lg/15">
                <NavLink 
                    to="/" 
                    end
                    className="group relative transition duration-300"
                >
                    {({ isActive }) => (
                        <>
                            <span className='text-sm lg:text-base'>Collection</span>
                            <span 
                                className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                                    isActive 
                                        ? 'right-0 bg-black'
                                        : 'right-full bg-transparent group-hover:right-0 group-hover:bg-black'
                                }`}
                            />
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/about"
                    className="group relative transition duration-300"
                >
                    {({ isActive }) => (
                        <>
                            <span className='text-sm lg:text-base'>About</span>
                            <span
                                className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                                    isActive
                                        ? 'right-0 bg-black'
                                        : 'right-full bg-transparent group-hover:right-0 group-hover:bg-black'
                                }`}
                            />
                        </>
                    )}
                </NavLink>
            </nav>
      </header>
    );
}
export default Header;