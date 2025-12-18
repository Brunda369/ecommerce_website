// src/components/Profile/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { createAddress, updateAddress, deleteAddress } from '../../services/addressService';
import { useNavigate } from "react-router-dom";
import { useToast } from '../../contexts/toastCore';
import PaymentMethods from './PaymentMethods';
import { GEOCODE_PROVIDER, GEOCODE_KEY } from '../../config/geocodeConfig';

export default function ProfilePage() {
  const { currentUser, logout, updateProfileData, changePassword } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const [editMode, setEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('orders');
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordInputs, setPasswordInputs] = useState({ current: '', newPass: '', confirm: '' });
  const [addressesMode, setAddressesMode] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({ id: null, label: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', location: null });
  const [addrErrors, setAddrErrors] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return setLoading(false);
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const orderList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || "");
      setPhoto(currentUser.photoURL || "");
    }
  }, [currentUser]);

  const handleChangePassword = async () => {
    if (!passwordInputs.newPass || passwordInputs.newPass !== passwordInputs.confirm) {
      return toast.error('Passwords do not match');
    }
    try {
      await changePassword(passwordInputs.newPass);
      toast.success('Password changed');
      setPasswordInputs({ current: '', newPass: '', confirm: '' });
      setShowChangePassword(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to change password. You may need to re-login before changing password.');
    }
  };

  useEffect(() => {
    // fetch addresses when addressesMode enabled
    const fetchAddresses = async () => {
      if (!currentUser) return;
      setAddrLoading(true);
      try {
        const aref = collection(db, 'users', currentUser.uid, 'addresses');
        const snap = await getDocs(query(aref, orderBy('createdAt', 'desc')));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAddresses(list);
      } catch (err) {
        console.error('Error loading addresses', err);
      } finally {
        setAddrLoading(false);
      }
    };

    if (addressesMode) fetchAddresses();
  }, [addressesMode, currentUser]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h2 className="text-2xl font-semibold mb-2">You are not logged in</h2>
        <p className="text-gray-500 mb-4">Please log in or continue as a guest to view your profile.</p>
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const userName = currentUser.displayName || "Guest User";
  const userEmail = currentUser.email || "Guest (No email)";
  const userPhoto =
    currentUser.photoURL ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const handleLogout = async () => {
  await logout();
  navigate("/home");
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  const fmt = (v) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Profile Card */}
        <aside className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center text-center">
            <img src={userPhoto} alt="Profile" className="w-28 h-28 rounded-full border p-1 object-cover" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">{userName}</h3>
            <p className="text-sm text-gray-500">{userEmail}</p>

            <div className="mt-4 w-full">
              <button onClick={handleLogout} className="w-full bg-primary text-white py-2 rounded hover:bg-primary-600">Logout</button>

              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="w-full mt-3 border border-gray-200 py-2 rounded">Edit profile</button>
              ) : (
                <div className="w-full mt-3 space-y-2">
                  <div>
                    <label className="text-xs text-gray-600">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Photo URL</label>
                    <input value={photo} onChange={(e) => setPhoto(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await updateProfileData({ displayName: name || null, photoURL: photo || null });
                          setEditMode(false);
                          // small feedback
                          toast.success('Profile updated');
                        } catch (err) {
                          console.error(err);
                          toast.error('Failed to update profile');
                        }
                      }}
                      className="flex-1 bg-primary text-white py-2 rounded"
                    >
                      Save
                    </button>

                    <button onClick={() => { setEditMode(false); setName(currentUser.displayName || ""); setPhoto(currentUser.photoURL || ""); }} className="flex-1 border py-2 rounded">Cancel</button>
                  </div>
                </div>
              )}
              <div className="mt-3">
                {!showChangePassword ? (
                  <button onClick={() => setShowChangePassword(true)} className="w-full mt-2 border border-gray-200 py-2 rounded">Change password</button>
                ) : (
                  <div className="space-y-2 mt-2">
                    <input type="password" placeholder="New password" value={passwordInputs.newPass} onChange={e=>setPasswordInputs(p=>({...p, newPass: e.target.value}))} className="w-full border rounded px-3 py-2" />
                    <input type="password" placeholder="Confirm new password" value={passwordInputs.confirm} onChange={e=>setPasswordInputs(p=>({...p, confirm: e.target.value}))} className="w-full border rounded px-3 py-2" />
                    <div className="flex gap-2">
                      <button onClick={handleChangePassword} className="flex-1 bg-primary text-white py-2 rounded">Save password</button>
                      <button onClick={() => { setShowChangePassword(false); setPasswordInputs({ current: '', newPass: '', confirm: '' }); }} className="flex-1 border py-2 rounded">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Orders</span>
              <span className="font-semibold text-gray-800">{totalOrders}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Total spent</span>
              <span className="font-semibold text-gray-800">{fmt(totalSpent)}</span>
            </div>
          </div>
        </aside>

        {/* Right: Orders and Account */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-gray-600 mt-2">Manage your account information, view recent orders and download invoices.</p>
            <div className="mt-4 flex flex-wrap gap-3">
                {/* Helper to create animated tab buttons */}
                {(() => {
                  const btn = (key, label, onClick) => {
                    const active = selectedTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setSelectedTab(key); onClick && onClick(); }}
                        aria-pressed={active}
                        className={`px-4 py-2 rounded transition transform duration-150 ease-out ${active ? 'bg-primary text-white shadow-lg scale-105' : 'border bg-white text-gray-700 hover:shadow-sm'}`}
                      >
                        {label}
                      </button>
                    );
                  };

                  return (
                    <>
                      {btn('orders', 'Order history', () => navigate('/orders'))}
                      {btn('addresses', 'Addresses', () => { setAddressesMode(true); setEditMode(false); })}
                      {btn('profile', 'Profile settings', () => { setEditMode(true); setAddressesMode(false); })}
                      {btn('overview', 'Account overview', () => navigate('/profile'))}
                      {btn('payments', 'Payment methods', () => { setSelectedTab('payments'); setAddressesMode(false); })}
                    </>
                  );
                })()}
            </div>
          </div>

          {/* Show orders only when addressesMode is not active */}
          {!addressesMode && selectedTab !== 'payments' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Order History</h3>
                <div className="text-sm text-gray-500">Showing recent orders</div>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 p-4 rounded" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No orders found.</div>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-500">{order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : (order.createdAt ? new Date(order.createdAt).toLocaleString() : '')}</div>
                          <div className="font-medium text-gray-800">Order • {order.id.slice(0,8)}</div>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">{order.items?.length || 0} items • <span className="font-semibold text-gray-800">{fmt(order.total || 0)}</span></div>
                      </div>

                      <div className="mt-3 md:mt-0 flex items-center gap-3">
                        <button onClick={() => navigate(`/order/${order.id}`)} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600">View details</button>
                        <button onClick={() => toast.info('Download invoice - implement later')} className="px-4 py-2 border rounded">Invoice</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Payment methods */}
          {selectedTab === 'payments' && (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <PaymentMethods />
            </div>
          )}

          {/* Addresses subview */}
          {addressesMode && (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h4 className="text-lg font-medium mb-3">Your addresses</h4>
                {addrLoading ? (
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-gray-500 mb-4">No saved addresses yet.</div>
                ) : (
                  <ul className="space-y-3 mb-4">
                    {addresses.map(a => (
                      <li key={a.id} className="border rounded p-3 flex items-start justify-between">
                        <div>
                          <div className="font-medium">{a.label}</div>
                          <div className="text-sm text-gray-600">{a.line1}{a.line2 ? ', ' + a.line2 : ''}, {a.city} - {a.pincode}</div>
                          <div className="text-sm text-gray-600">{a.state} • {a.phone}</div>
                          {a.location?.lat && (
                            <div className="text-xs text-gray-500 mt-1">Lat: {a.location.lat.toFixed ? a.location.lat.toFixed(5) : a.location.lat}, Lng: {a.location.lng.toFixed ? a.location.lng.toFixed(5) : a.location.lng}</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <button onClick={() => {
                              // populate form for editing
                              setNewAddress({ id: a.id, label: a.label || '', line1: a.line1 || '', line2: a.line2 || '', city: a.city || '', state: a.state || '', pincode: a.pincode || '', phone: a.phone || '', location: a.location || null });
                              // ensure addresses panel visible
                              setAddressesMode(true);
                            }} className="px-3 py-1 border rounded text-sm">Edit</button>

                            <button onClick={async () => {
                              try {
                                await deleteAddress(currentUser.uid, a.id);
                                setAddresses(prev => prev.filter(x => x.id !== a.id));
                              } catch (err) { console.error(err); toast.error('Failed to delete'); }
                            }} className="px-3 py-1 border rounded text-sm">Delete</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="border-t pt-4">
                  <h5 className="text-sm font-semibold mb-2">Add new address</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <input placeholder="Label (Home, Work)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} className={`w-full rounded px-3 py-2 ${addrErrors.label ? 'border border-red-400' : 'border'}`} />
                      {addrErrors.label && <div className="text-xs text-red-600 mt-1">{addrErrors.label}</div>}
                    </div>
                    <div>
                      <input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className={`w-full rounded px-3 py-2 ${addrErrors.phone ? 'border border-red-400' : 'border'}`} />
                      {addrErrors.phone && <div className="text-xs text-red-600 mt-1">{addrErrors.phone}</div>}
                    </div>
                    <div className="md:col-span-2">
                      <input placeholder="Address line 1" value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1: e.target.value})} className={`w-full rounded px-3 py-2 ${addrErrors.line1 ? 'border border-red-400' : 'border'}`} />
                      {addrErrors.line1 && <div className="text-xs text-red-600 mt-1">{addrErrors.line1}</div>}
                    </div>
                    <div className="md:col-span-2">
                      <input placeholder="Address line 2" value={newAddress.line2} onChange={e => setNewAddress({...newAddress, line2: e.target.value})} className="w-full rounded px-3 py-2 border" />
                    </div>
                    <div>
                      <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className={`w-full rounded px-3 py-2 ${addrErrors.city ? 'border border-red-400' : 'border'}`} />
                      {addrErrors.city && <div className="text-xs text-red-600 mt-1">{addrErrors.city}</div>}
                    </div>
                    <div>
                      <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full rounded px-3 py-2 border" />
                    </div>
                    <div>
                      <input placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className={`w-full rounded px-3 py-2 ${addrErrors.pincode ? 'border border-red-400' : 'border'}`} />
                      {addrErrors.pincode && <div className="text-xs text-red-600 mt-1">{addrErrors.pincode}</div>}
                    </div>
                  </div>
                    <div className="mt-2 text-sm text-red-600">
                      {addrErrors.required && <div>{addrErrors.required}</div>}
                    </div>
                  <div className="mt-3 flex gap-2 items-center">
                    <button onClick={async () => {
                      // client-side validation with per-field errors
                      const errors = {};
                      if (!newAddress.label?.trim()) errors.label = 'Label is required';
                      if (!newAddress.line1?.trim()) errors.line1 = 'Address line 1 is required';
                      if (!newAddress.city?.trim()) errors.city = 'City is required';
                      if (!newAddress.phone?.trim()) errors.phone = 'Phone is required';
                      if (!newAddress.pincode?.trim()) errors.pincode = 'Pincode is required';

                      // basic format checks (India-focused): phone 10 digits, pincode 6 digits
                      const phoneDigits = (newAddress.phone || '').replace(/\D/g, '');
                      if (newAddress.phone && !/^\d{10}$/.test(phoneDigits)) errors.phone = 'Enter a valid 10 digit phone number';
                      if (newAddress.pincode && !/^\d{6}$/.test(newAddress.pincode.trim())) errors.pincode = 'Enter a valid 6 digit pincode';

                      if (Object.keys(errors).length > 0) {
                        setAddrErrors(errors);
                        return;
                      }

                      setAddrErrors({});
                      try {
                        const payload = { label: newAddress.label || '', line1: newAddress.line1 || '', line2: newAddress.line2 || '', city: newAddress.city || '', state: newAddress.state || '', pincode: newAddress.pincode || '', phone: newAddress.phone || '', location: newAddress.location || null };

                        if (newAddress.id) {
                          // update existing
                          await updateAddress(currentUser.uid, newAddress.id, payload);
                          setAddresses(prev => prev.map(a => a.id === newAddress.id ? { ...a, ...payload } : a));
                          toast.success('Address updated');
                        } else {
                          // create new
                          const created = await createAddress(currentUser.uid, payload);
                          setAddresses(prev => [{ id: created.id, ...payload }, ...prev]);
                          toast.success('Address saved');
                        }

                        setNewAddress({ id: null, label: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', location: null });
                      } catch (err) {
                        console.error(err);
                        toast.error('Failed to save address');
                      }
                    }} className="btn-primary">{newAddress.id ? 'Update address' : 'Save address'}</button>

                    <button onClick={async () => {
                      // Try to get live location from browser and reverse-geocode to fill fields
                      if (!navigator.geolocation) return toast.error('Geolocation not supported by your browser');
                      try {
                        navigator.geolocation.getCurrentPosition(async (pos) => {
                          const lat = pos.coords.latitude;
                          const lng = pos.coords.longitude;
                          // optimistic set
                          setNewAddress(prev => ({ ...prev, location: { lat, lng }, line1: `Live location (${lat.toFixed(5)}, ${lng.toFixed(5)})` }));
                          // Reverse geocode using configured provider (OpenCage if configured) or fallback to Nominatim
                          try {
                            if (GEOCODE_PROVIDER === 'OPENCAGE' && GEOCODE_KEY) {
                              const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(lat+','+lng)}&key=${encodeURIComponent(GEOCODE_KEY)}&no_annotations=1&language=en`;
                              const res = await fetch(url);
                              if (!res.ok) throw new Error('Reverse geocode failed');
                              const json = await res.json();
                              const comp = json.results && json.results[0] ? json.results[0].components : null;
                              if (comp) {
                                const city = comp.city || comp.town || comp.village || comp.county || '';
                                const state = comp.state || '';
                                const postcode = comp.postcode || '';
                                const area = comp.suburb || comp.neighbourhood || '';
                                setNewAddress(prev => ({ ...prev, location: { lat, lng }, line1: prev.line1, city, state, pincode: postcode, line2: area }));
                                toast.success('Location captured and address fields filled. Please verify before saving.');
                              } else {
                                toast.info('Location captured but address details not available.');
                              }
                            } else {
                              const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
                              const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
                              if (!res.ok) throw new Error('Reverse geocode failed');
                              const json = await res.json();
                              const addr = json.address || {};
                              const city = addr.city || addr.town || addr.village || addr.hamlet || addr.county || '';
                              const state = addr.state || addr.region || '';
                              const postcode = addr.postcode || '';
                              const area = addr.suburb || addr.neighbourhood || addr.city_district || '';
                              setNewAddress(prev => ({ ...prev, location: { lat, lng }, line1: json.display_name || prev.line1, city, state, pincode: postcode, line2: area }));
                              toast.success('Location captured and address fields filled. Please verify before saving.');
                            }
                          } catch (err) {
                            console.error('reverse geocode error', err);
                            toast.info('Location captured but failed to resolve address fields. You can save coordinates or fill fields manually.');
                          }
                        }, (err) => {
                          console.error('geo error', err);
                          toast.error('Failed to get location: ' + (err.message || err.code));
                        }, { enableHighAccuracy: true, timeout: 10000 });
                      } catch (err) {
                        console.error(err);
                        toast.error('Failed to get location');
                      }
                    }} className="border px-4 py-2 rounded">Use my location</button>

                    <button onClick={() => setNewAddress({ id: null, label: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', location: null })} className="border px-4 py-2 rounded">Reset</button>

                    <button onClick={() => setAddressesMode(false)} className="ml-auto text-sm text-gray-500">Close</button>
                  </div>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
