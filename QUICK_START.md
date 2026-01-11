# Quick Start Guide - Firebase + Railway Deployment

## ✅ Everything is Ready!

Your codebase has been fully migrated to Firebase Firestore and is ready for deployment.

## Before You Push to GitHub

### 1. Create `.env.local` File

**Option 1: Use the setup script**
```bash
./setup-env.sh
```

**Option 2: Manual setup**

Create `.env.local` in project root with your Firebase service account JSON. Copy the entire JSON from:
`/Users/work1/Downloads/al-barid-logistics-firebase-adminsdk-fbsvc-6f7953d92c.json`

Paste it as a single line:
```env
FIREBASE_SERVICE_ACCOUNT={paste entire JSON here on one line}
```

### 2. Test Locally (Optional but Recommended)

```bash
npm install
npm run dev
```

Visit http://localhost:3000/api/health - should show Firestore connected.

## Push to GitHub

```bash
git add .
git commit -m "Migrated to Firebase Firestore - Ready for Railway"
git push origin main
```

## Deploy on Railway

### Step 1: Connect Repository
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository

### Step 2: Set Environment Variable
In Railway → Variables → Add:

**Variable Name:** `FIREBASE_SERVICE_ACCOUNT`

**Variable Value:** Copy the ENTIRE JSON from your service account file:
```json
{"type":"service_account","project_id":"al-barid-logistics",...}
```

(Everything on one line, properly escaped)

### Step 3: Wait for Deployment
Railway will automatically build and deploy. Watch the logs.

### Step 4: Test
Visit your Railway URL → `/api/health` - should show connected.

## Important Notes

- ✅ The `backend/` directory still exists but is NOT used anymore (kept for reference)
- ✅ All API routes are in `app/api/` and use Firestore
- ✅ `.env.local` is in `.gitignore` - won't be pushed to GitHub
- ⚠️ Firestore indexes will be created automatically when you first use queries

## Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Status

✅ Code migration complete
✅ Firebase configured
✅ API routes updated
✅ Ready for Railway deployment