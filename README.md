# 📸 SnapIt – AI-Powered Food Ingredient Analyzer

SnapIt is a lightweight, web-based application that uses modern AI to help users make informed food choices by analyzing product ingredient lists. Designed for health-conscious consumers, dietitians, and regulatory bodies, SnapIt provides real-time insights into food content through a simple photo or upload of a product's ingredient label.

---

## 🚀 Features

- 🔍 **Ingredient Text Recognition**: Upload or capture images of ingredient lists for automatic text extraction.
- 🧠 **AI-Powered Analysis**: Uses Google Gemini API to analyze extracted ingredients.
- ✅ **Health Rating**: Evaluates the overall healthiness of the product.
- ⚠️ **Harmful Ingredient Detection**: Identifies potentially harmful ingredients and explains why.
- 🌿 **Healthier Alternatives**: Recommends better substitutes for questionable ingredients.
- 💡 **No Database Required**: Lightweight, real-time processing without persistent storage.
- 🌐 **Responsive UI**: Built with React.js and Tailwind CSS for a seamless user experience.

---

## 🛠️ Tech Stack

| Technology         | Description                             |
|--------------------|-----------------------------------------|
| **Frontend**       | React.js, Tailwind CSS, JavaScript      |
| **Backend**        | Node.js, Express.js                     |
| **AI Integration** | Google Gemini API                       |
| **Image Input**    | HTML5 Image Capture / Upload API        |

---

## 📸 How It Works

1. **Upload or Take a Picture**: Users submit an image of a food product’s ingredient list.
2. **Backend Processing**: The image is sent to a Node.js/Express backend.
3. **AI Analysis**: Google Gemini API extracts and analyzes ingredients.
4. **Frontend Display**: Health ratings, harmful ingredients, and healthier alternatives are shown.

---

## 🧪 Installation & Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Google Gemini API Key

### Backend Setup

```bash
cd backend
npm install
npm start
```
## 📄 License  
This project is licensed under the MIT License.

## 📷 Live Preview & Demo  
🔗 Live App: [Deployment](https://snap-it-xi.vercel.app/)

## 🖼️ Screenshots:  
![Home Page](client/src/assets/home.png)
![Upload Page](client/src/assets/upload.png)
![Result Page](client/src/assets/result.png)
