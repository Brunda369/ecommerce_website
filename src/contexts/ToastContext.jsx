import React, { useMemo, useState, useCallback } from 'react';
import ToastList from '../components/UI/ToastList';
import ToastContext from './toastCore';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback(({ type = 'info', message = '', title = '' }) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 9);
    const t = { id, type, message, title };
    setToasts((s) => [t, ...s]);
    // auto-remove
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4500);
    return id;
  }, []);

  const remove = useCallback((id) => setToasts((s) => s.filter((x) => x.id !== id)), []);

  const api = useMemo(() => ({
    add,
    remove,
    success: (msg, title) => add({ type: 'success', message: msg, title }),
    error: (msg, title) => add({ type: 'error', message: msg, title }),
    info: (msg, title) => add({ type: 'info', message: msg, title }),
  }), [add, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastList toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

export default ToastProvider;
