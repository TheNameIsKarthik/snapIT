import PropTypes from "prop-types";
import { renderStars } from "../utils/renderStars";

const RatingResult = ({ result }) => {
  const getRatingClass = (rating) => {
    if (rating === "Not applicable") return "text-black";
    if (rating <= 1) return "text-red-500";
    if (rating <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  if (!result || result.error) {
    return (
      <div className='text-center text-red-500'>
        <p>{result?.error || "Error analyzing the image."}</p>
      </div>
    );
  }

  return (
    <div className='mt-8 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto space-y-6'>
      <div className='mb-6'>
        <h2 className={`text-3xl font-bold ${getRatingClass(result.rating)} mb-4`}>
          Rating: {result.rating} ({renderStars(result.rating)})
        </h2>
        <h3 className='text-xl font-semibold text-gray-700 mb-2'>Reasons:</h3>
        <ul className='list-disc ml-5 text-gray-600 space-y-2'>
          {result.reason?.map((reason, index) => (
            <li key={index}>
              <span className='font-bold'>{reason.split(":")[0]}:</span> {reason.split(":")[1]}
            </li>
          ))}
        </ul>
      </div>

      {result.expiry && (
        <div className='mt-6'>
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>Expiry:</h3>
          <p className='text-gray-600'>{result.expiry}</p>
        </div>
      )}

      {result.alternatives && (
        <div className='mt-6'>
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>Healthier Alternatives:</h3>
          <ul className='list-disc ml-5 text-gray-600 space-y-2'>
            {result.alternatives?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

RatingResult.propTypes = {
  result: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    reason: PropTypes.arrayOf(PropTypes.string),
    expiry: PropTypes.string,
    alternatives: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.string,
  }).isRequired,
};

export default RatingResult;
