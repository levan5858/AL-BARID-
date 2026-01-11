# Deployment Guide - Railway + Firebase

## ✅ Migration Complete!

Your application has been successfully migrated to Firebase Firestore and is ready for deployment on Railway.

## Quick Start Checklist

- [x] Firebase project created
- [x] Firestore Database enabled
- [x] Service account JSON file obtained
- [x] Code migrated to Firebase
- [ ] `.env.local` file created (local testing)
- [ ] Dependencies installed
- [ ] Local testing completed
- [ ] Code pushed to GitHub
- [ ] Railway deployment configured
- [ ] Environment variables set in Railway

## Step 1: Local Setup (Before GitHub Push)

### 1.1 Create `.env.local` File

You have two options:

**Option A: Use the setup script (Recommended)**
```bash
cd "/Users/work1/Desktop/AL BARID "
./setup-env.sh
```

**Option B: Manual creation**

Create `.env.local` in the project root and add:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com","universe_domain":"googleapis.com"}

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important**: The `FIREBASE_SERVICE_ACCOUNT` must be the ENTIRE JSON on ONE line. You can copy it from your downloaded JSON file and minify it.

### 1.2 Install Dependencies

```bash
npm install
```

### 1.3 Test Locally

```bash
npm run dev
```

Then test:
- Visit: http://localhost:3000
- Health check: http://localhost:3000/api/health (should show Firestore connected)
- Test creating a shipment
- Test tracking functionality

## Step 2: Push to GitHub

### 2.1 Verify .gitignore

Make sure `.env.local` is in `.gitignore` (it should be already).

### 2.2 Commit and Push

```bash
git add .
git commit -m "Migrated to Firebase Firestore - Ready for Railway deployment"
git push origin main
```

## Step 3: Deploy on Railway

### 3.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub (if needed)
5. Select your repository: `AL BARID` (or your repo name)
6. Railway will auto-detect Next.js and start building

### 3.2 Set Environment Variables

In Railway dashboard → Your Project → Variables tab:

**Required Variable:**

```
FIREBASE_SERVICE_ACCOUNT
```

Value: Copy the ENTIRE JSON content from your downloaded service account file. Example format (replace with your actual values):
```json
{"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

**Important**: Replace all placeholder values with your actual Firebase service account credentials from your downloaded JSON file.
```

**Optional Variables** (if you have them):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 3.3 Monitor Deployment

1. Go to Railway dashboard → Deployments tab
2. Watch the build logs
3. Wait for "Build Successful" and "Deploy Successful"
4. Note your Railway URL (e.g., `https://your-app.up.railway.app`)

### 3.4 Verify Deployment

1. **Health Check**: Visit `https://your-app.railway.app/api/health`
   - Should return: `{"status":"OK","database":"connected","databaseType":"Firestore"}`

2. **Test Website**: Visit `https://your-app.railway.app`
   - All pages should load
   - Test creating a shipment
   - Test tracking functionality

## Step 4: Firebase Firestore Indexes

When you first run certain queries, Firestore may require indexes. If you see an error about missing indexes:

1. **Copy the index URL** from the error message
2. **Open it in your browser** - Firebase Console will open
3. **Click "Create Index"**
4. **Wait for index to build** (usually < 1 minute)
5. **Retry the operation**

Common indexes needed:
- `reviews`: `approved` (ascending) + `createdAt` (descending)
- `trackings`: `trackingNumber` (ascending) + `timestamp` (descending)

## Troubleshooting

### Build Fails on Railway

- Check build logs in Railway dashboard
- Verify `package.json` has all dependencies
- Ensure Node.js version is compatible (18+)

### Database Connection Fails

- Verify `FIREBASE_SERVICE_ACCOUNT` is set correctly in Railway
- Check JSON is on one line with proper escaping
- Verify Firestore Database is enabled in Firebase Console

### API Returns 500 Errors

- Check Railway logs for detailed error messages
- Verify Firestore security rules allow access
- Test health endpoint first: `/api/health`

### Missing Index Error

- Firestore will provide a link to create the index
- Click the link and create the index in Firebase Console
- Wait for index to build, then retry

## What's Changed

- ✅ MongoDB → Firebase Firestore
- ✅ Mongoose → Firebase Admin SDK
- ✅ All API routes updated
- ✅ All models converted
- ✅ Environment variables updated
- ✅ Ready for Railway deployment

## Files Modified/Created

**New Files:**
- `lib/firebase/admin.ts` - Firebase Admin SDK setup
- `lib/firebase/config.ts` - Firebase client config
- `lib/firebase/collections.ts` - Firestore collection helpers
- `DEPLOYMENT_GUIDE.md` - This file
- `FIREBASE_MIGRATION.md` - Migration details
- `setup-env.sh` - Environment setup script

**Modified Files:**
- `lib/db/connect.ts` - Now uses Firestore
- `package.json` - Firebase dependencies
- `app/api/*/route.ts` - All API routes use Firestore
- `README.md` - Updated documentation

**Removed Files:**
- `lib/models/*.ts` - Mongoose models (replaced with Firestore)

## Success Indicators

You'll know everything is working when:

1. ✅ Health endpoint returns `"database": "connected"`
2. ✅ Can create shipments successfully
3. ✅ Can track shipments with tracking numbers
4. ✅ Can submit and view reviews
5. ✅ All pages load without errors
6. ✅ No errors in Railway logs

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Check Firebase Console → Firestore → Usage tab
3. Verify environment variables are set correctly
4. Test health endpoint first

Good luck with your deployment! 🚀