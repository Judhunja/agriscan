# AgriScan 🌿

A mobile-first Progressive Web App (PWA) that helps Kenyan farmers identify crop diseases instantly using on-device AI — even without an internet connection. Point your camera at a diseased leaf, get a diagnosis and actionable treatment steps in seconds, and save the result to a cloud-synced history log.

---

## ✨ Features

### 🔬 On-Device Disease Detection
- TensorFlow.js model (PlantVillage — **38 disease classes**) runs entirely in the browser — **no server round-trip required**
- Covers: Apple, Blueberry, Cherry, Corn/Maize, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato
- Confidence score with colour-coded bar (High / Medium / Low)

### 🤖 AI-Enhanced Treatment Plans
- Google Gemini 2.0 Flash enriches the treatment plan with 5 specific, actionable steps
- Full offline fallback: a rich local database covers all 38 classes in both **English** and **Swahili**

### 📋 Scan History
- Scan records saved to **Firebase Firestore** with offline-first persistence (IndexedDB)
- Compressed images (~150 KB) uploaded to **Firebase Storage** in the background after save
- Searchable, filterable, sortable history; bulk-select and delete

### 👍 Farmer Feedback
- After saving a scan, farmers can tap **"Helpful"** or **"Not helpful"**
- Feedback stored in Firestore (`feedback`, `feedbackAt` fields) for model improvement tracking
- Also accessible from the expanded view of each history card

### 📶 Offline / Low-Bandwidth
- **Service Worker** (`public/sw.js`) caches the TF.js model files and compiled assets for fully offline use
- **Offline image queue** (`src/utils/offlineQueue.js`): if the device is offline when a scan is saved, the compressed image is stored in `localStorage` and automatically uploaded when connectivity is restored
- Offline banner shows real pending-upload count and triggers auto-sync on reconnect
- Firebase Firestore's built-in IndexedDB persistence queues text writes automatically offline

### 🌍 Bilingual
- Full **English / Swahili** support across all screens, labels, and treatment text
- Language preference persisted in `localStorage`

### 🎨 Light Theme UI
- Forest-green palette, gradient buttons and headers, colour-coded scan cards
- Responsive mobile-first layout with bottom tab navigation
- PWA-ready: installable, theme-colour, viewport-fit

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Styling | Tailwind CSS 3, custom CSS utilities |
| Routing | React Router v6 |
| AI / ML | TensorFlow.js (`@tensorflow/tfjs`) — LayersModel / GraphModel |
| AI Enrichment | Google Gemini 2.0 Flash API |
| Backend | Firebase Firestore (database), Firebase Storage (images) |
| Offline | Service Worker + localStorage queue |
| Language | Lucide React icons, date-fns, uuid |

---

## 📁 Project Structure

```
agriscan/
├── public/
│   ├── sw.js                    # Service worker (offline + model caching)
│   ├── manifest.json            # PWA manifest
│   └── model/
│       └── model.json           # TF.js PlantVillage model (38 classes)
├── src/
│   ├── index.jsx                # Entry point — registers service worker
│   ├── App.jsx
│   ├── Routes.jsx               # / → History, /scanner-screen, /settings-screen
│   ├── components/
│   │   ├── AppIcon.jsx          # Lucide icon wrapper
│   │   ├── AppImage.jsx         # Image with fallback
│   │   └── ui/
│   │       ├── BottomTabNavigation.jsx
│   │       ├── LanguageToggle.jsx
│   │       └── OfflineStatusBanner.jsx  # Real pending count + auto-sync
│   ├── pages/
│   │   ├── scanner-screen/
│   │   │   ├── index.jsx        # Camera → predict → enrich → save
│   │   │   └── components/
│   │   │       ├── CameraCapture.jsx
│   │   │       ├── ImagePreview.jsx
│   │   │       └── AnalysisResults.jsx  # Results + feedback widget
│   │   ├── history-screen/
│   │   │   ├── index.jsx        # Firestore history + feedback handler
│   │   │   └── components/
│   │   │       ├── ScanCard.jsx         # Feedback in expanded view
│   │   │       ├── SearchFilterBar.jsx
│   │   │       ├── StatsBar.jsx
│   │   │       ├── BulkActionBar.jsx
│   │   │       └── EmptyState.jsx
│   │   └── settings-screen/
│   │       └── index.jsx
│   ├── services/
│   │   ├── tfjsService.js       # TF.js model wrapper + 38-class treatment DB
│   │   ├── firebaseService.js   # Firestore CRUD, Storage upload, feedback, sync
│   │   └── geminiService.js     # Gemini API enrichment (graceful null fallback)
│   ├── utils/
│   │   ├── offlineQueue.js      # localStorage image queue for offline uploads
│   │   └── cn.js
│   └── styles/
│       ├── tailwind.css         # CSS variables, theme, utility classes
│       └── index.css
├── firebase.json                # Firestore + Storage rules config
├── firestore.rules              # Public read/write on scans/
├── storage.rules                # Public read/write on scans/
├── cors.json                    # Firebase Storage CORS rules
├── scripts/
│   └── set_cors.mjs             # Applies CORS rules via GCS JSON API
├── tailwind.config.js
├── vite.config.mjs
└── .env                         # Firebase + Gemini API keys (not committed)
```

---

## ⚙️ Setup

### Prerequisites
- Node.js ≥ 18
- A Firebase project (Firestore + Storage enabled)
- Optional: Google Gemini API key

### 1. Clone & install

```bash
git clone https://github.com/Judhunja/agriscan.git
cd agriscan
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional — leave blank to use local treatment database
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3. Deploy Firebase rules

```bash
npx firebase-tools deploy --only firestore:rules,storage
```

### 4. Apply Storage CORS rules (one-time)

```bash
node scripts/set_cors.mjs
```

### 5. Start development server

```bash
npm start          # http://localhost:4028
```

### 6. Build for production

```bash
npm run build      # output in build/
```

---

## 🔄 How a Scan Works

```
User taps camera
    │
    ▼
CameraCapture → file input (capture="environment")
    │
    ▼
tfjsService.predict()          ← runs on-device, works offline
  │  resize to 224×224, normalize 0–1
  │  LayersModel inference → top class + confidence
  │  looks up SPECIFIC_TREATMENTS[classIndex][lang]
    │
    ▼
setResult() — disease name, treatment steps shown immediately
    │
    ▼ (background)
geminiService.getTreatmentFromGemini()   ← enriches if API key set
  returns null if unconfigured → keeps local treatment
    │
    ▼
User taps "Save Scan"
    │
    ├─ saveScanHistory() → Firestore doc created (fast, ~200ms)
    │   isSaved = true   → UI confirms immediately
    │
    └─ uploadImageToStorage() (background)
         online  → compress (1024px / 75% JPEG) → Firebase Storage
         offline → addPendingImage() → localStorage queue
                   auto-uploads via syncPendingImages() on reconnect
    │
    ▼
Feedback widget appears → "Was this diagnosis helpful?"
    │
    ▼
submitFeedback() → Firestore doc patched with feedback + feedbackAt
```

---

## 🌱 Supported Crops & Diseases (38 classes)

| Crop | Diseases |
|---|---|
| Apple | Scab, Black Rot, Cedar Apple Rust, Healthy |
| Blueberry | Healthy |
| Cherry | Powdery Mildew, Healthy |
| Corn / Maize | Cercospora / Grey Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| Grape | Black Rot, Esca (Black Measles), Leaf Blight, Healthy |
| Orange | Huanglongbing (Citrus Greening) |
| Peach | Bacterial Spot, Healthy |
| Pepper | Bacterial Spot, Healthy |
| Potato | Early Blight, Late Blight, Healthy |
| Raspberry | Healthy |
| Soybean | Healthy |
| Squash | Powdery Mildew |
| Strawberry | Leaf Scorch, Healthy |
| Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy |

---

## 🔒 Firebase Rules

**Firestore** (`firestore.rules`) — public read/write on the `scans` collection (suitable for field pilot; add auth for production).

**Storage** (`storage.rules`) — public read/write under `scans/` path.

---

## 📜 Scripts

| Script | Description |
|---|---|
| `npm start` | Vite dev server on port 4028 |
| `npm run build` | Production build with sourcemaps → `build/` |
| `npm run serve` | Preview production build locally |
| `node scripts/set_cors.mjs` | Apply CORS rules to Firebase Storage bucket |

---

## 🗺️ Roadmap

- [ ] User authentication (farmer accounts)
- [ ] Photo geolocation tagging
- [ ] Aggregate disease heatmap for extension officers
- [ ] Push notifications for weekly scan summaries
- [ ] Export scan history as CSV for extension services


## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
