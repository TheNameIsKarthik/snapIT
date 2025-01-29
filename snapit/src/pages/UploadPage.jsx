import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import ImagePreview from "../components/ImagePreview";
import RatingResult from "../components/RatingResult";
import Header from "../components/Header";

const backendUrl = "https://snapit-ia9t.onrender.com";
function UploadPage() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (file) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Only JPG, PNG, JPEG formats are allowed.");
        return;
      }
      setImage(file);
      setErrorMessage("");
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setErrorMessage("");
    setResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      setErrorMessage("Please select an image to analyze.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(`${backendUrl}/api/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred during the analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  return (
    <>
      <Header />
      <div className='container mx-auto p-6'>
        <h1 className='text-4xl font-extrabold mb-6 cursor-pointer text-center text-indigo-600' onClick={() => window.location.reload()}>
          Upload Image
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl mx-auto cursor-pointer'>
          <div
            className='relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center'
            style={{ minHeight: "200px" }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type='file'
              className='absolute inset-0 opacity-0 cursor-pointer'
              onChange={(e) => handleImageChange(e.target.files[0])}
              accept='image/*'
              id='file-upload'
            />
            <label htmlFor='file-upload' className='absolute inset-0 flex flex-col justify-center items-center space-y-2 cursor-pointer'>
              <span className='text-lg font-medium text-gray-500'>
                {image ? image.name : "Click to select a file or drag and drop an image here"}
              </span>
              <p className='text-sm text-gray-400'>JPG, PNG, JPEG formats only</p>
            </label>
          </div>

          {errorMessage && <div className='mt-4 text-red-500 font-semibold text-center'>{errorMessage}</div>}

          {imagePreview && <ImagePreview src={imagePreview} />}

          <div className='flex justify-center space-x-4 mt-4'>
            <button
              type='submit'
              className={`bg-blue-500 hover:bg-blue-400 text-white cursor-pointer font-bold py-3 px-6 rounded-md w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? <FaSpinner className='animate-spin mx-auto text-white' /> : "Analyze"}
            </button>

            {image && (
              <button
                type='button'
                onClick={handleRemoveImage}
                className={`bg-red-500 hover:bg-red-400 text-white cursor-pointer font-bold py-3 px-6 rounded-md w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? <FaSpinner className='animate-spin mx-auto text-white' /> : "Remove Image"}
              </button>
            )}
          </div>
        </form>

        {result && <RatingResult result={result} />}
      </div>
    </>
  );
}

export default UploadPage;
