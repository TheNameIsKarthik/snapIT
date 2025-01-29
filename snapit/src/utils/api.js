import axios from "axios";

const api = {
  analyzeImage: (image) => {
    const formData = new FormData();
    formData.append("image", image);
    return axios.post("http://localhost:3001/api/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
