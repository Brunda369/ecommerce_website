import React from 'react';
import { auth } from '../../config/firebaseConfig';

export default function DebugPanel() {
  const user = auth.currentUser;
  const projectId = (typeof window !== 'undefined' && window?.location?.hostname) ? window.location.hostname : 'localhost';

  return (
    <div className="fixed bottom-2 right-2 z-50 bg-white/90 text-xs text-gray-800 p-2 rounded shadow-lg border">
      <div><strong>Firebase Project:</strong> {projectId}</div>
      <div><strong>Signed In UID:</strong> {user?.uid ?? 'not signed in'}</div>
    </div>
  );
}
