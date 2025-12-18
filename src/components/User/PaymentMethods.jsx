import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/toastCore';
import { listPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../../services/paymentService';

function maskCardNumber(num) {
  const digits = (num || '').replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `**** **** **** ${last4}`;
}

export default function PaymentMethods() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ cardholder: '', number: '', expMonth: '', expYear: '', brand: '' });


  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const list = await listPaymentMethods(currentUser.uid);
        if (mounted) setMethods(list);
      } catch (err) {
        console.error('load payment methods', err);
        toast.error('Failed to load payment methods');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [currentUser, toast]);

  const detectBrand = (num) => {
    const n = (num || '').replace(/\D/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    return 'Card';
  };

  const handleAdd = async () => {
    // basic validation
    const digits = (form.number || '').replace(/\D/g, '');
    if (!form.cardholder?.trim() || digits.length < 12) return toast.error('Enter valid cardholder and card number');
    const payload = {
      cardholder: form.cardholder,
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      masked: maskCardNumber(digits),
      expMonth: form.expMonth || '',
      expYear: form.expYear || ''
    };

    try {
      const created = await addPaymentMethod(currentUser.uid, payload);
      setMethods(prev => [{ id: created.id, ...payload }, ...prev]);
      setForm({ cardholder: '', number: '', expMonth: '', expYear: '', brand: '' });
      toast.success('Payment method added (test-only)');
    } catch (err) {
      console.error('add payment method', err);
      toast.error('Failed to add payment method');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePaymentMethod(currentUser.uid, id);
      setMethods(prev => prev.filter(m => m.id !== id));
      toast.success('Payment method removed');
    } catch (err) {
      console.error('delete payment method', err);
      toast.error('Failed to remove');
    }
  };

  return (
    <div>
      <h4 className="text-lg font-medium mb-3">Saved payment methods</h4>
      {loading ? (
        <div className="space-y-2">
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : methods.length === 0 ? (
        <div className="text-gray-500 mb-4">No payment methods saved.</div>
      ) : (
        <ul className="space-y-3 mb-4">
          {methods.map(m => (
            <li key={m.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{m.brand} • {m.masked || (`**** **** **** ${m.last4 || '0000'}`)}</div>
                <div className="text-sm text-gray-600">{m.cardholder} • Exp {m.expMonth}/{m.expYear}</div>
              </div>
              <div>
                <button onClick={() => handleDelete(m.id)} className="px-3 py-1 border rounded text-sm">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t pt-4">
        <h5 className="text-sm font-semibold mb-2">Add test card</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input placeholder="Cardholder name" value={form.cardholder} onChange={e => setForm(f => ({ ...f, cardholder: e.target.value }))} className="w-full rounded px-3 py-2 border" />
          <input placeholder="Card number" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} className="w-full rounded px-3 py-2 border" />
          <input placeholder="Exp month (MM)" value={form.expMonth} onChange={e => setForm(f => ({ ...f, expMonth: e.target.value }))} className="w-full rounded px-3 py-2 border" />
          <input placeholder="Exp year (YYYY)" value={form.expYear} onChange={e => setForm(f => ({ ...f, expYear: e.target.value }))} className="w-full rounded px-3 py-2 border" />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={handleAdd} className="btn-primary">Add card (test)</button>
          <button onClick={() => setForm({ cardholder: '', number: '', expMonth: '', expYear: '' })} className="border px-4 py-2 rounded">Reset</button>
        </div>
        <div className="mt-2 text-xs text-gray-500">This demo saves only masked card info to Firestore for testing. Do not enter real card data here in production.</div>
      </div>
    </div>
  );
}
