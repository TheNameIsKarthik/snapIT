import PropTypes from "prop-types";

const ImagePreview = ({ src }) => {
  return (
    <div className='mt-4 flex justify-center'>
      <img src={src} alt='Image Preview' className='w-full max-w-md object-cover border border-gray-300 rounded-lg shadow-lg' />
    </div>
  );
};

// PropTypes validation
ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
};

export default ImagePreview;
