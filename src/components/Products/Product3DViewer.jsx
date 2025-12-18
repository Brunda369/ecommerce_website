import React, { useEffect, useRef } from 'react';

export default function Product3DViewer({ modelUrl, poster }) {
  const ref = useRef(null);

  useEffect(() => {
    // load model-viewer web component if not present
    if (typeof window !== 'undefined' && !window.customElements.get('model-viewer')) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(s);
    }
  }, []);

  if (!modelUrl) {
    return (
      <div className="w-full h-72 bg-gray-100 rounded-md flex items-center justify-center">
        {poster ? <img src={poster} alt="product" className="w-full h-full object-cover rounded-md" /> : <div className="text-gray-500">No 3D model available</div>}
      </div>
    );
  }

  return (
    <div className="w-full rounded-md overflow-hidden">
      <model-viewer
        src={modelUrl}
        alt="3D product"
        ar
        auto-rotate
        camera-controls
        style={{ width: '100%', height: '420px', backgroundColor: 'transparent' }}
        poster={poster}
        ref={ref}
      />
    </div>
  );
}
