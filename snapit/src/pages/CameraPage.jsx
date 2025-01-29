import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import Header from "../components/Header";
import RatingResult from "../components/RatingResult";

const backendUrl = "https://snapit-ia9t.onrender.com";
const CameraPage = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        setErrorMessage("Error accessing camera.");
        console.error("Error accessing camera:", error);
      }
    };

    if (isCameraActive) {
      startCamera();
    }

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      setImage(imageData);
      setImagePreview(imageData);
      setIsCameraActive(false);
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };

  const handleRetake = () => {
    setImage(null);
    setImagePreview(null);
    setErrorMessage("");
    setResult(null);
    setIsCameraActive(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      setErrorMessage("Please capture an image to analyze.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    const byteCharacters = atob(image.split(",")[1]);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: "image/jpeg" });
    formData.append("image", blob, "captured-image.jpeg");

    try {
      const response = await axios.post(`${backendUrl}/api/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setErrorMessage(response.data.response || "An error occurred during the analysis.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred during the analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className='container mx-auto p-6'>
        <h1 className='text-4xl font-extrabold mb-6 text-center text-indigo-600'>Capture Image with Camera</h1>

        <div className='flex justify-center space-x-6'>
          {isCameraActive && (
            <div className='relative w-full max-w-md h-72 bg-gray-200 rounded-lg overflow-hidden shadow-lg'>
              <video ref={videoRef} autoPlay muted className='w-full h-full object-cover rounded-lg'></video>
              <canvas ref={canvasRef} width='640' height='480' className='hidden'></canvas>
            </div>
          )}
        </div>

        {isCameraActive && (
          <div className='flex justify-center mt-4 space-x-4'>
            <button
              onClick={handleCapture}
              className='bg-blue-500 cursor-pointer text-white py-3 px-6 rounded-md hover:bg-blue-400 focus:outline-none transition duration-200'
            >
              Capture
            </button>
          </div>
        )}

        {imagePreview && (
          <div className='mt-6 text-center'>
            <h2 className='text-xl font-bold text-indigo-600'>Captured Image</h2>
            <img src={imagePreview} alt='Captured' className='mx-auto mt-4 max-w-xs rounded-md shadow-lg' />
          </div>
        )}

        {imagePreview && !loading && (
          <div className='flex justify-center mt-4 space-x-4'>
            <button
              onClick={handleRetake}
              className='bg-gray-500 text-white py-3 px-6 cursor-pointer rounded-md hover:bg-gray-400 focus:outline-none transition duration-200'
            >
              Retake
            </button>
          </div>
        )}

        {imagePreview && (
          <div className='flex justify-center mt-4 space-x-4'>
            <button
              type='submit'
              onClick={handleSubmit}
              className={`bg-blue-500 text-white py-3 cursor-pointer px-6 rounded-md w-full sm:w-1/2 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? <FaSpinner className='animate-spin mx-auto text-white' /> : "Analyze"}
            </button>
          </div>
        )}

        {result && <RatingResult result={result} />}

        {errorMessage && <div className='mt-4 text-red-500 text-center'>{errorMessage}</div>}
      </div>
    </>
  );
};

export default CameraPage;
