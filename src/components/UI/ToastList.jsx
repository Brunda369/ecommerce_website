import React from 'react';

function ToastItem({ t, onRemove }) {
  const color = t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800';
  return (
    <div className={`max-w-sm w-full rounded shadow-lg text-white ${color} p-3 mb-2`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {t.title && <div className="font-semibold">{t.title}</div>}
          <div className="text-sm mt-1">{t.message}</div>
        </div>
        <button onClick={() => onRemove(t.id)} className="text-white opacity-80">✕</button>
      </div>
    </div>
  );
}

export default function ToastList({ toasts = [], onRemove = () => {} }) {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col-reverse items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
