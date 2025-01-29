import { Link } from "react-router-dom";
import { FaCamera, FaUpload } from "react-icons/fa";
import Header from "../components/Header";

const HomePage = () => {
  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4'>
        <div className='text-center mt-15'>
          <h1 className='text-4xl font-bold text-indigo-600'>Welcome to SnapIT!</h1>
          <p className='mt-2 text-lg text-gray-600'>
            Know your products just with a snap! Upload an image or capture it with your camera to get insights.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row justify-center sm:space-x-6 mt-6 gap-6'>
          <Link to='/camera'>
            <button className='bg-blue-500 text-white py-3 px-6 rounded-md text-lg font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-400 focus:outline-none flex items-center justify-center space-x-2 hover:shadow-md w-full sm:w-auto'>
              <FaCamera className='text-xl sm:text-2xl' />
              <span>Capture with Camera</span>
            </button>
          </Link>
          <Link to='/upload'>
            <button className='bg-blue-500 text-white py-3 px-6 rounded-md text-lg font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-400 focus:outline-none flex items-center justify-center space-x-2 hover:shadow-md w-full sm:w-auto'>
              <FaUpload className='text-xl sm:text-2xl' />
              <span>Upload Image</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;
