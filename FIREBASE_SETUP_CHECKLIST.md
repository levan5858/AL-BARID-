# Firebase Setup Checklist ✅

## Pre-Deployment Checklist

### Firebase Setup
- [x] Firebase project created: `al-barid-logistics`
- [x] Firestore Database enabled
- [x] Service account JSON file obtained
- [x] Initial security rules set (permissive for now)

### Code Migration
- [x] Firebase Admin SDK configured
- [x] All models converted to Firestore
- [x] All API routes updated
- [x] Dependencies updated (firebase-admin, firebase added)
- [x] MongoDB/Mongoose removed
- [x] No linting errors

### Files Status
- [x] `lib/firebase/admin.ts` - Firebase Admin setup
- [x] `lib/firebase/collections.ts` - Firestore collections
- [x] `lib/firebase/config.ts` - Client config
- [x] `app/api/*/route.ts` - All routes use Firestore
- [x] `package.json` - Firebase dependencies added
- [x] `railway.json` - Railway config ready

## Required Firestore Indexes

These indexes will be created automatically when queries first run, but here's what's needed:

### 1. Reviews Collection Index
**Collection:** `reviews`
**Fields:**
- `approved` (Ascending)
- `createdAt` (Descending)

**When needed:** When accessing `/api/reviews` GET endpoint

### 2. Trackings Collection Index  
**Collection:** `trackings`
**Fields:**
- `trackingNumber` (Ascending)
- `timestamp` (Descending)

**When needed:** When tracking a shipment with history

**How to create:**
1. When query runs, Firestore will show an error with a link
2. Click the link → Firebase Console opens
3. Click "Create Index"
4. Wait 1-2 minutes for index to build
5. Retry the operation

## Environment Variables Needed

### For Railway Deployment:

**Required:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```
(Entire JSON on one line)

**Optional (but recommended):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA3GxTWveOkFL3AilEx0XxJ7pNqHabdPwA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=al-barid-logistics.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=al-barid-logistics
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=al-barid-logistics.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=525777580034
NEXT_PUBLIC_FIREBASE_APP_ID=1:525777580034:web:98ed9ecdf9ca854e64b71b
```

## Quick Commands

```bash
# Install dependencies
npm install

# Test locally
npm run dev

# Build for production
npm run build

# Test production build
npm start
```

## Testing Endpoints

After deployment, test these endpoints:

1. **Health:** `GET /api/health`
   - Should return: `{"status":"OK","database":"connected","databaseType":"Firestore"}`

2. **Create Shipment:** `POST /api/shipments/create`
   - Use the Create Shipment form on the website

3. **Track Shipment:** `GET /api/tracking/{trackingNumber}`
   - Use a tracking number from a created shipment

4. **Get Reviews:** `GET /api/reviews`
   - Should return approved reviews

5. **Submit Review:** `POST /api/reviews`
   - Use the Reviews page form

## All Done! ✅

Everything is ready. Just:
1. Create `.env.local` (or run `./setup-env.sh`)
2. Push to GitHub
3. Deploy on Railway
4. Set `FIREBASE_SERVICE_ACCOUNT` in Railway
5. Test and enjoy! 🚀