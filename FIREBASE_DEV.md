Firebase Development Setup

If you see "Missing or insufficient permissions" errors in the browser console, update your Firestore rules in the Firebase Console or run the local Emulator Suite.

1) Apply provided rules
- Open Firebase Console → Firestore → Rules
- Replace the contents with the contents of `firestore.rules` in this repo and Publish.

2) Or run the Emulator locally
- Install the Firebase CLI: `npm install -g firebase-tools`
- Start the emulator: `firebase emulators:start --only firestore,auth`
- (Optional) To populate emulator with sample data, use the Admin SDK or import a saved export.

Notes
- The included `firestore.rules` grants public read access to `/products` and allows signed-in users to read/write their own `/users/{uid}` subcollections. Intended for development only — tighten rules before deploying to production.
- If your app is pointing at a different Firebase project, update `src/config/firebaseConfig.js` with the correct keys or update `.firebaserc`.

Debugging tips
- Use the included DebugPanel in the Header to see which host you're on and the signed-in UID.
- Look at browser console for `FirebaseError: Missing or insufficient permissions` to identify which operation is blocked.
