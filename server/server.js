const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const tmp = require("tmp");
require("dotenv").config();

const app = express();
const port = process.env.port || 3001;

app.use(cors());
app.use(express.json());
const corsOptions = {
  origin: "https://snap-it-xi.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

app.get("/api/analyze", async (req, res) => {
  res.send("Api is available!");
});

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const imageBuffer = req.file.buffer;

    const tempFilePath = await saveBufferToTempFile(imageBuffer);

    const fileUri = await uploadImageToFileManager(tempFilePath);

    const geminiResponse = await getGeminiAnalysis(fileUri);

    res.json(geminiResponse);

    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

async function saveBufferToTempFile(buffer) {
  return new Promise((resolve, reject) => {
    tmp.file({ mode: 0o644, prefix: "image-", postfix: ".jpeg" }, (err, tempFilePath, fd, cleanupCallback) => {
      if (err) {
        reject(err);
      } else {
        fs.writeFileSync(tempFilePath, buffer);
        resolve(tempFilePath);
      }
    });
  });
}

async function uploadImageToFileManager(tempFilePath) {
  const uploadResult = await fileManager.uploadFile(tempFilePath, {
    mimeType: "image/jpeg",
    displayName: "Uploaded Image",
  });

  console.log(`Uploaded file: ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

  return uploadResult.file.uri;
}

const prompt = `
Analyze the image provided and check if it contains a list of ingredients for an edible product. If it does:
- Rate the product on a scale of 0-5(can be 0,0.5,1.1.5,2...upto 5, 0 means it's not at all good for avg. humans and 5 is 100% healthy) based on its suitability for an average Indian diet.
- Mention any harmful ingredients, explaining why they are harmful.
- Suggest healthier alternatives available in the Indian market with brand names (if applicable).
- If the expiry date is visible, include it. If not, return "Not specified."
  
If no list of ingredients is detected:
- Rating is sent as a string "Not applicable" and reason should be in Array with the following
- Provide a description of what the image contains.
- State that an image with a list of ingredients is required to proceed.
Return your response in the following format:

{
  "success": true,                            // True if the analysis was successful
  "rating": X,                                // Rating (1-10) or "Not applicable" if no food ingredients
  "reason": ["Ingredient 1: reason, Ingredient 2: reason"],   // Reasons for harmful ingredients
  "expiry": "Expiry date or 'Not specified'",  // Expiry date or 'Not specified' if not available
  "alternatives": ["List of healthier alternatives (if applicable)"] // Healthier alternatives if relevant
}

For non-food images, respond as follows:
{
  "success": true,
  "rating": "Not applicable",                   // Not applicable since it's not a food product
  "reason": "[This image does not contain a list of ingredients for an edible product. It appears to be a photo of something unrelated to food, such as a general object, label, or non-food item.]"  // Reason for non-food image
}
`;

async function getGeminiAnalysis(fileUri) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    prompt,
    {
      fileData: {
        fileUri: fileUri,
        mimeType: "image/jpeg",
      },
    },
  ]);

  let responseText = result.response.text();
  responseText = responseText.slice(7, -4).trim();

  try {
    const responseJson = JSON.parse(responseText);

    if (responseJson && responseJson.rating !== undefined) {
      const rating = responseJson.rating;
      const reason = responseJson.reason;
      const expiry = responseJson.expiry;
      const alternatives = responseJson.alternatives || "Not Applicable";

      return { success: true, rating, reason, expiry, alternatives };
    }

    return { success: false, response: "No ingredients list found in the image." };
  } catch (err) {
    console.error("Error parsing JSON response:", err);
    return { success: false, response: responseText };
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
