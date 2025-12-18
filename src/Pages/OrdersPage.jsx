import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage(){
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetch = async ()=>{
      if(!currentUser) return setLoading(false);
      try{
        const q = query(collection(db, 'orders'), where('userId','==', currentUser.uid), orderBy('createdAt','desc'));
        const snap = await getDocs(q);
        setOrders(snap.docs.map(d=>({ id: d.id, ...d.data() })));
      }catch(err){
        console.error('fetch orders', err);
      }finally{ setLoading(false); }
    };
    fetch();
  },[currentUser]);

  if(!currentUser) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold">Please login to view your orders</h2>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Order History</h1>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i=> <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders yet.</div>
      ) : (
        <ul className="space-y-4">
          {orders.map(o => (
            <li key={o.id} className="p-4 border rounded flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{new Date(o.createdAt?.toDate ? o.createdAt.toDate() : (o.createdAt || 0)).toLocaleString()}</div>
                <div className="font-medium">Order • {o.id.slice(0,8)}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold">₹{o.total || 0}</div>
                <button onClick={()=>navigate(`/order/${o.id}`)} className="px-3 py-1 bg-primary text-white rounded">View</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
