Firebase Development Setup

If you see "Missing or insufficient permissions" errors in the browser console, update your Firestore rules in the Firebase Console or run the local Emulator Suite.

1) Apply provided rules
- Open Firebase Console → Firestore → Rules
- Replace the contents with the contents of `firestore.rules` in this repo and Publish.

2) Or run the Emulator locally
- Install the Firebase CLI: `npm install -g firebase-tools`
- Start the emulator: `firebase emulators:start --only firestore,auth`
- (Optional) To populate emulator with sample data, use the Admin SDK or import a saved export.

Recommended Rules (development)

The repository already includes a `firestore.rules` file with development-friendly rules. For clarity, here is the important `users` rule you should publish to allow authenticated users to read/write only their own user document and nested subcollections:

```
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /users/{userId} {
			allow read, write: if request.auth != null && request.auth.uid == userId;
			match /{subPath=**} {
				allow read, write: if request.auth != null && request.auth.uid == userId;
			}
		}
		// keep /products public read for development convenience
		match /products/{productId} {
			allow read: if true;
			allow write: if false;
		}
		match /orders/{orderId} {
			allow create: if request.auth != null;
			allow read: if request.auth != null && resource.data.userId == request.auth.uid;
			allow update, delete: if false;
		}
		match /{document=**} {
			allow read, write: if false;
		}
	}
}
```

Notes
- The rules above are intended for development and local testing. Restrict access further before deploying to production.
- You can publish rules from the Firebase Console (Firestore → Rules → Publish) or deploy from the CLI with `firebase deploy --only firestore:rules` (ensure `firebase-tools` and project config are set).
- If your app is pointing at a different Firebase project, update `src/config/firebaseConfig.js` with the correct keys or update `.firebaserc`.

Debugging tips
- Use the included DebugPanel in the Header to see which host you're on and the signed-in UID.
- Look at browser console for `FirebaseError: Missing or insufficient permissions` to identify which operation is blocked.
