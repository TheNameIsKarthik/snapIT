const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

const GEMINI_API_KEY = "wQEI843bN03Q"; // Replace with your API key

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.get("/", async (req, res) => {
  try {
    const model = await genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Specify your model here
    });

    const prompt = "Explain how AI works";

    const result = await model.generateContent(prompt);

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
