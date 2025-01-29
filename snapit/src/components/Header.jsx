import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className='bg-gradient-to-r from-indigo-600 to-purple-600 py-8 sm:py-12 text-center text-white shadow-md'>
      <h1 className='text-3xl sm:text-5xl font-extrabold tracking-wide transform transition-all duration-300 ease-in-out hover:scale-105'>
        <Link to='/' className='hover:text-yellow-300'>
          SnapIT!
        </Link>
      </h1>
      <p className='text-lg sm:text-xl mt-4 italic opacity-80'>Know your products just with a snap!</p>
    </header>
  );
};

export default Header;
