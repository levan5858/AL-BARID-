# Al Barid Logistics Website

A full-stack logistics website for Al Barid Logistics, featuring shipment creation, tracking, customer reviews, and more.

## Features

- **Homepage**: Hero section with tracking input and live news ticker
- **About Us**: Company history timeline, values, and trust sections
- **Services**: Comprehensive list of logistics services offered
- **Create Shipment**: Multi-step form with rate calculator
- **Track Shipment**: Real-time tracking with status timeline
- **Customer Reviews**: Display and submit customer testimonials
- **Contact Us**: Contact form, office locations, and customer service information

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router) with API Routes, TypeScript, Tailwind CSS
- **Database**: Firebase Firestore (NoSQL database)
- **External APIs**: NewsAPI.org for live news ticker
- **Deployment**: Railway (recommended) or Vercel/any Node.js hosting platform

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Firebase service account JSON file
- NewsAPI.org API key (optional, for news ticker)
- Google Maps API key (optional, for map on contact page)

### Installation

1. **Clone the repository**
   ```bash
   cd "AL BARID "
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   a. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   
   b. Enable Firestore Database:
      - Go to "Build" → "Firestore Database"
      - Click "Create database"
      - Choose "Start in production mode" (we'll update security rules)
      - Select a region close to your users
   
   c. Get Service Account credentials:
      - Go to Project Settings → "Service accounts" tab
      - Click "Generate new private key"
      - Download the JSON file
   
   d. Set initial Firestore security rules (for development):
      ```javascript
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            allow read, write: if true;
          }
        }
      }
      ```

4. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Service Account (Required)
   # Copy the ENTIRE JSON content from your service account file
   # IMPORTANT: The entire JSON must be on ONE line with proper escaping
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"al-barid-logistics","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}

   # Firebase Client Config (Optional, for future client-side features)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA3GxTWveOkFL3AilEx0XxJ7pNqHabdPwA
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=al-barid-logistics.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=al-barid-logistics
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=al-barid-logistics.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=525777580034
   NEXT_PUBLIC_FIREBASE_APP_ID=1:525777580034:web:98ed9ecdf9ca854e64b71b

   # External APIs (Optional)
   NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key_here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
   ```
   
   **Important**: To get the `FIREBASE_SERVICE_ACCOUNT` value:
   - Open your downloaded service account JSON file
   - Copy the entire JSON content
   - Paste it as a single line in `.env.local` (make sure quotes are properly escaped)
   - Example: `FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}`

5. **Start the development server**
   
   ```bash
   npm run dev
   ```
   
   This will start the Next.js development server on port 3000. The API routes are included in the same server.

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
al-barid-logistics/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage
│   ├── about/                   # About Us page
│   ├── services/                # Services page
│   ├── create-shipment/         # Create Shipment page
│   ├── track/                   # Track Shipment page
│   ├── reviews/                 # Customer Reviews page
│   ├── contact/                 # Contact Us page
│   ├── layout.tsx               # Root layout
│   └── api/                     # Next.js API routes
│       ├── shipments/
│       │   ├── create/route.ts
│       │   └── [trackingNumber]/route.ts
│       ├── tracking/
│       │   └── [trackingNumber]/route.ts
│       ├── rates/
│       │   └── calculate/route.ts
│       ├── reviews/route.ts
│       ├── contact/route.ts
│       └── health/route.ts
├── components/                   # Reusable React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── TrackingInput.tsx
│   ├── NewsTicker.tsx
│   ├── ShipmentForm.tsx
│   ├── RateCalculator.tsx
│   ├── TrackingResult.tsx
│   ├── ReviewCard.tsx
│   ├── ContactForm.tsx
│   └── Map.tsx
├── lib/                          # Utility functions and Firebase
│   ├── api.ts                   # API client functions
│   ├── db/
│   │   └── connect.ts           # Database connection utility
│   ├── firebase/
│   │   ├── admin.ts             # Firebase Admin SDK setup
│   │   ├── config.ts            # Firebase client config
│   │   └── collections.ts       # Firestore collection helpers
│   └── utils.ts                 # Helper functions
├── styles/                       # Global styles
│   └── globals.css
├── public/                       # Static assets
├── railway.json                  # Railway deployment configuration
├── next.config.js
├── package.json
└── README.md
```

## API Endpoints

### Shipments
- `POST /api/shipments/create` - Create a new shipment
- `GET /api/shipments/:trackingNumber` - Get shipment details

### Tracking
- `GET /api/tracking/:trackingNumber` - Get tracking information

### Rates
- `POST /api/rates/calculate` - Calculate shipping rate

### Reviews
- `GET /api/reviews` - Get all approved reviews
- `POST /api/reviews` - Create a new review

### Contact
- `POST /api/contact` - Submit contact form

### Health Check
- `GET /api/health` - Check API and Firestore connection status

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (entire JSON as one line) | Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client API key | No |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | No |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | No |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | No |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | No |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | No |
| `NEXT_PUBLIC_NEWS_API_KEY` | NewsAPI.org API key (for news ticker) | No |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (for contact page map) | No |

Note: `PORT` is automatically set by Railway, no manual configuration needed.

## Railway Deployment

### Prerequisites
- Railway account (free or paid)
- GitHub repository with your code
- Firebase project with Firestore enabled

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Migrated to Firebase Firestore"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect Next.js

3. **Configure Environment Variables**
   - In Railway dashboard, go to your project → "Variables" tab
   - Add `FIREBASE_SERVICE_ACCOUNT`:
     - Open your Firebase service account JSON file
     - Copy the ENTIRE JSON content
     - Paste it as a single line in Railway
     - Make sure all quotes are properly escaped
   - Add optional variables if needed:
     - `NEXT_PUBLIC_NEWS_API_KEY`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

4. **Deploy**
   - Railway will automatically build and deploy your application
   - The build command is: `npm install && npm run build`
   - The start command is: `npm start`
   - Railway will provide you with a public URL

5. **Custom Domain (Optional)**
   - In Railway dashboard, go to Settings → Domains
   - Add your custom domain
   - Configure DNS as instructed by Railway

### Post-Deployment Verification

1. Check health endpoint: `https://your-app.railway.app/api/health`
   - Should show: `{"status":"OK","database":"connected","databaseType":"Firestore"}`
2. Test creating a shipment
3. Test tracking functionality
4. Verify all pages load correctly
5. Check Railway logs for any errors

## Firebase Firestore Setup

### Collections

The application uses three Firestore collections:

1. **shipments** - Stores shipment information
   - Document ID: `trackingNumber` (e.g., `AB1234567890`)
   - Fields: sender, receiver, packageDetails, deliveryOptions, status, etc.

2. **trackings** - Stores tracking history
   - Auto-generated document IDs
   - Fields: trackingNumber, status, location, timestamp, description
   - Queries: Filtered by `trackingNumber`, sorted by `timestamp`

3. **reviews** - Stores customer reviews
   - Auto-generated document IDs
   - Fields: customerName, rating, reviewText, location, approved
   - Queries: Filtered by `approved == true`, sorted by `createdAt`

### Security Rules

For development (initial setup):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Important**: The above rules allow unrestricted access. For production, update security rules to restrict access appropriately.

Example production rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Shipments: Read-only for users, write only from API
    match /shipments/{trackingNumber} {
      allow read: if true;
      allow write: if false; // Only server-side writes
    }
    
    // Trackings: Read-only for users
    match /trackings/{trackingId} {
      allow read: if true;
      allow write: if false; // Only server-side writes
    }
    
    // Reviews: Read approved reviews, write new reviews
    match /reviews/{reviewId} {
      allow read: if resource.data.approved == true;
      allow create: if true;
      allow update, delete: if false; // Only server-side updates
    }
  }
}
```

## Features in Detail

### Homepage
- Hero section with tracking input
- Company introduction
- Key features highlights
- Live news ticker (NewsAPI.org integration)

### Create Shipment
- Multi-step form (Sender → Receiver → Package → Options)
- Real-time rate calculator
- Form validation
- Tracking number generation

### Track Shipment
- Single or multiple tracking numbers support
- Status timeline visualization
- Current location and estimated delivery
- Tracking history

### Customer Reviews
- Display customer testimonials with ratings
- Submit new reviews
- Review moderation system (approved field)

### Contact Us
- Contact form with validation
- Office locations map (Google Maps)
- Customer service information
- Business hours

## Styling

The website uses Tailwind CSS with a custom color scheme:
- Primary Blue: #1E3A8A, #3B82F6, #60A5FA
- Accent: Gold/Yellow (#FBBF24)
- Professional Middle Eastern aesthetic

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Notes

- All images use placeholder services (Unsplash/Pexels) with proper attribution
- NewsAPI requires free API key registration for news ticker
- Google Maps API requires API key for map functionality (alternatively uses placeholder)
- Form validations are implemented on both frontend and backend
- Error handling and loading states are included throughout
- SEO meta tags are configured for all pages
- API routes are integrated into Next.js - no separate backend server needed
- Firestore automatically handles indexing for query performance

## Troubleshooting

### Firebase Connection Issues

**Error: "FIREBASE_SERVICE_ACCOUNT must be a valid JSON string"**
- Make sure the entire JSON is on one line in `.env.local`
- Ensure all quotes are properly escaped
- Verify there are no line breaks in the JSON string

**Error: "Failed to fetch reviews" or database errors**
- Verify Firestore Database is enabled in Firebase Console
- Check Firestore security rules allow read/write access
- Verify `FIREBASE_SERVICE_ACCOUNT` is correctly set

**Error: "Permission denied" in Firestore**
- Update Firestore security rules to allow access
- Check service account has proper permissions in Firebase Console

### Railway Deployment Issues

**Build fails**
- Check Railway build logs
- Verify all dependencies are in `package.json`
- Ensure Firebase dependencies are installed

**Database connection fails on Railway**
- Verify `FIREBASE_SERVICE_ACCOUNT` is set correctly in Railway
- Check the JSON is properly formatted (one line, escaped quotes)
- Test connection string locally first

## License

This project is proprietary and confidential.

## Support

For support, email info@albarid.com or contact customer service at 800-ALBARID.