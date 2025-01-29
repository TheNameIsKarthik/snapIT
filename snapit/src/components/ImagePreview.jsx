import PropTypes from "prop-types"; // Import PropTypes for validation

const ImagePreview = ({ src }) => {
  return (
    <div className='mt-4 flex justify-center'>
      <img src={src} alt='Image Preview' className='w-full max-w-md object-cover border border-gray-300 rounded-lg shadow-lg' />
    </div>
  );
};

// PropTypes validation
ImagePreview.propTypes = {
  src: PropTypes.string.isRequired, // The src prop is required and should be a string
};

export default ImagePreview;
