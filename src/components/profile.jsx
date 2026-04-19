import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import API from '../api/axios';
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Check,
  AlertCircle,
  Zap,
  Tag,
  Clock,
  Trash2,
  Plus,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

// ============================================================================
// SVG ICONS (matching your ShopDetails style)
// ============================================================================

const I = {
  Salon: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/><path d="M14.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      <path d="M4 22V12a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v10"/><path d="M9 22v-4a3 3 0 0 1 6 0v4"/>
    </svg>
  ),
  Tag: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Rupee: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M6 8h12M15 21 6 13h3a4 4 0 0 0 0-8"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Cal: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
  ),
  X: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Check: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ============================================================================
// STYLES
// ============================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  body, html {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: #f9fafb;
  }
  
  .profile-wrap {
    min-height: 100vh;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    padding: 32px 20px 72px;
  }
  
  .profile-container {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 600;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 9px;
    cursor: pointer;
    margin-bottom: 24px;
    transition: all 0.15s;
    color: #6b7280;
  }
  
  .back-btn:hover {
    border-color: #9ca3af;
    color: #374151;
  }
  
  .section {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    margin-bottom: 20px;
    overflow: hidden;
    animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  
  .section-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fafafa;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 700;
    color: #111827;
  }
  
  .section-icon {
    width: 36px;
    height: 36px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
  }
  
  .edit-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 600;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .edit-btn:hover {
    background: #1f2937;
  }
  
  .section-body {
    padding: 24px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .info-label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .info-value {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }
  
  .info-value.sub {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }
  
  /* Edit Mode */
  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .lbl {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .inp, .sel {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #111827;
    outline: none;
    transition: all 0.15s;
  }
  
  .inp:focus, .sel:focus {
    border-color: #9ca3af;
    box-shadow: 0 0 0 3px #f3f4f6;
  }
  
  .inp::placeholder {
    color: #d1d5db;
  }
  
  .sel {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 32px;
  }
  
  .edit-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .edit-grid.full {
    grid-template-columns: 1fr;
  }
  
  .btn-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }
  
  .btn-save {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 24px;
    font-size: 14px;
    font-weight: 700;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .btn-save:hover {
    background: #1f2937;
  }
  
  .btn-save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .btn-cancel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 24px;
    font-size: 14px;
    font-weight: 700;
    background: #f3f4f6;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .btn-cancel:hover {
    background: #f9fafb;
    color: #374151;
  }
  
  /* Services List */
  .svc-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .svc-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    border-radius: 9px;
  }
  
  .svc-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }
  
  .svc-name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
  }
  
  .svc-meta {
    font-size: 11px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .svc-price {
    font-size: 12px;
    font-weight: 700;
    color: #374151;
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 6px;
  }
  
  .btn-rm {
    background: none;
    border: none;
    cursor: pointer;
    color: #d1d5db;
    padding: 5px;
    display: flex;
    align-items: center;
    transition: all 0.15s;
  }
  
  .btn-rm:hover {
    color: #ef4444;
    background: #fef2f2;
    border-radius: 6px;
  }
  
  /* Slots */
  .day-block {
    margin-bottom: 16px;
  }
  
  .day-name {
    font-size: 11px;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .chip {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #f3f4f6;
    color: #374151;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .chip-rm {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.12s;
  }
  
  .chip-rm:hover {
    color: #ef4444;
  }
  
  .empty {
    text-align: center;
    padding: 24px;
    color: #d1d5db;
    font-size: 13px;
    font-weight: 500;
  }
  
  .empty svg {
    margin: 0 auto 8px;
    display: block;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #9ca3af;
  }
  
  .loading svg {
    animation: spin 0.75s linear infinite;
  }
  
  .success-msg {
    padding: 12px 14px;
    background: #ecfdf5;
    border: 1px solid #d1fae5;
    border-radius: 8px;
    color: #065f46;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .error-msg {
    padding: 12px 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #991b1b;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 640px) {
    .info-grid, .edit-grid {
      grid-template-columns: 1fr;
    }
    .section-body {
      padding: 16px;
    }
  }
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIMES = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00",
               "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];

export default function Profile() {
  // Sections edit state
  const [editing, setEditing] = useState({
    basic: false,
    services: false,
    schedule: false,
  });

  // Data from backend
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    category: '',
    location: '',
    phone: '',
    email: '',
  });

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    dur: '',
  });

  const [schedule, setSchedule] = useState({});
  const [newSlot, setNewSlot] = useState({
    day: '',
    time: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const res = await API.get(`/profile/${uid}`);
        const { user: userData, shop: shopData } = res.data;

        setUser(userData);
        setShop(shopData);

        // Set form data
        if (shopData) {
          setFormData({
            shopName: shopData.shopName || '',
            ownerName: shopData.ownerName || '',
            category: shopData.category || '',
            location: shopData.location || '',
            phone: shopData.phone || '',
            email: shopData.email || '',
          });
          setServices(shopData.services || []);
          setSchedule(shopData.weeklySchedule || {});
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Save basic info
  const saveBasicInfo = async () => {
    try {
      setSaving(true);
      const uid = auth.currentUser?.uid;
      
      await API.put(`/profile/${uid}`, {
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        category: formData.category,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
      });

      setShop(prev => ({ ...prev, ...formData }));
      setEditing(prev => ({ ...prev, basic: false }));
      setMessage({ type: 'success', text: 'Shop information updated' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      setMessage({ type: 'error', text: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  // Add service
  const addService = async () => {
    if (!newService.name || !newService.price) return;

    try {
      setSaving(true);
      const uid = auth.currentUser?.uid;
      const updatedServices = [
        ...services,
        {
          name: newService.name,
          price: Number(newService.price),
          dur: newService.dur ? Number(newService.dur) : null,
        },
      ];

      await API.put(`/profile/${uid}`, {
        services: updatedServices,
      });

      setServices(updatedServices);
      setNewService({ name: '', price: '', dur: '' });
      setMessage({ type: 'success', text: 'Service added' });
      setTimeout(() => setMessage(null), 3000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add service' });
    } finally {
      setSaving(false);
    }
  };

  // Remove service
  const removeService = async (index) => {
    try {
      setSaving(true);
      const uid = auth.currentUser?.uid;
      const updatedServices = services.filter((_, i) => i !== index);

      await API.put(`/profile/${uid}`, {
        services: updatedServices,
      });

      setServices(updatedServices);
      setMessage({ type: 'success', text: 'Service removed' });
      setTimeout(() => setMessage(null), 3000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove service' });
    } finally {
      setSaving(false);
    }
  };

  // Add slot
  const addSlot = async () => {
    if (!newSlot.day || !newSlot.time) return;

    try {
      setSaving(true);
      const uid = auth.currentUser?.uid;
      const updatedSchedule = {
        ...schedule,
        [newSlot.day]: [...(schedule[newSlot.day] || []), newSlot.time].sort(),
      };

      await API.put(`/profile/${uid}`, {
        weeklySchedule: updatedSchedule,
      });

      setSchedule(updatedSchedule);
      setNewSlot({ day: '', time: '' });
      setMessage({ type: 'success', text: 'Slot added' });
      setTimeout(() => setMessage(null), 3000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add slot' });
    } finally {
      setSaving(false);
    }
  };

  // Remove slot
  const removeSlot = async (day, time) => {
    try {
      setSaving(true);
      const uid = auth.currentUser?.uid;
      const updatedSchedule = {
        ...schedule,
        [day]: schedule[day].filter(t => t !== time),
      };

      if (!updatedSchedule[day].length) {
        delete updatedSchedule[day];
      }

      await API.put(`/profile/${uid}`, {
        weeklySchedule: updatedSchedule,
      });

      setSchedule(updatedSchedule);
      setMessage({ type: 'success', text: 'Slot removed' });
      setTimeout(() => setMessage(null), 3000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove slot' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-wrap">
        <div className="profile-container">
          <div className="loading">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="profile-wrap">
        <div className="profile-container">
          {/* Back Button */}
          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          {/* Messages */}
          {message && (
            <div className={message.type === 'success' ? 'success-msg' : 'error-msg'}>
              {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          {/* BASIC INFO SECTION */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon"><Store size={18} /></div>
                Shop Information
              </div>
              {!editing.basic && (
                <button className="edit-btn" onClick={() => setEditing(prev => ({ ...prev, basic: true }))}>
                  <Edit2 size={13} />
                  Edit
                </button>
              )}
            </div>

            <div className="section-body">
              {!editing.basic ? (
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label"><Store size={14} />Shop Name</span>
                    <span className="info-value">{shop?.shopName || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><User size={14} />Owner Name</span>
                    <span className="info-value">{shop?.ownerName || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Tag size={14} />Business Type</span>
                    <span className="info-value" style={{ textTransform: 'capitalize' }}>{shop?.category || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><MapPin size={14} />Location</span>
                    <span className="info-value">{shop?.location || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Phone size={14} />Phone</span>
                    <span className="info-value">{shop?.phone || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Mail size={14} />Email</span>
                    <span className="info-value">{shop?.email || user?.email || '-'}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="edit-grid">
                    <div className="field">
                      <span className="lbl"><Store size={14} />Shop Name</span>
                      <input
                        className="inp"
                        value={formData.shopName}
                        onChange={e => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                        placeholder="Shop name"
                      />
                    </div>
                    <div className="field">
                      <span className="lbl"><User size={14} />Owner Name</span>
                      <input
                        className="inp"
                        value={formData.ownerName}
                        onChange={e => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                        placeholder="Owner name"
                      />
                    </div>
                    <div className="field full">
                      <span className="lbl"><MapPin size={14} />Location</span>
                      <input
                        className="inp"
                        value={formData.location}
                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Street, area, city"
                      />
                    </div>
                    <div className="field">
                      <span className="lbl"><Phone size={14} />Phone</span>
                      <input
                        className="inp"
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="field">
                      <span className="lbl"><Mail size={14} />Email</span>
                      <input
                        className="inp"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="shop@email.com"
                      />
                    </div>
                  </div>

                  <div className="btn-group">
                    <button
                      className="btn-save"
                      onClick={saveBasicInfo}
                      disabled={saving}
                    >
                      {saving ? <Zap size={16} style={{ animation: 'spin 0.75s linear infinite' }} /> : <Save size={16} />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditing(prev => ({ ...prev, basic: false }))}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SERVICES SECTION */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon"><Tag size={18} /></div>
                Services ({services.length})
              </div>
            </div>

            <div className="section-body">
              {editing.services ? (
                <div className="field full">
                  <span className="lbl"><Tag size={14} />Add New Service</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 96px', gap: '12px' }}>
                    <input
                      className="inp"
                      placeholder="Service name"
                      value={newService.name}
                      onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      className="inp"
                      placeholder="Price"
                      type="number"
                      min="0"
                      value={newService.price}
                      onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))}
                    />
                    <input
                      className="inp"
                      placeholder="Mins"
                      type="number"
                      min="1"
                      value={newService.dur}
                      onChange={e => setNewService(prev => ({ ...prev, dur: e.target.value }))}
                    />
                  </div>

                  <div className="btn-group">
                    <button
                      className="btn-save"
                      onClick={addService}
                      disabled={saving || !newService.name || !newService.price}
                    >
                      <Plus size={16} />
                      Add Service
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditing(prev => ({ ...prev, services: false }))}
                    >
                      <X size={16} />
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => setEditing(prev => ({ ...prev, services: true }))}
                  style={{ marginTop: 0 }}
                >
                  <Plus size={13} />
                  Add Service
                </button>
              )}

              {services.length === 0 ? (
                <div className="empty">
                  <I.Tag />
                  No services added
                </div>
              ) : (
                <div className="svc-list" style={{ marginTop: editing.services ? 16 : 0 }}>
                  {services.map((svc, idx) => (
                    <div key={idx} className="svc-item">
                      <div className="svc-left">
                        <span style={{ color: '#d1d5db' }}><I.Tag /></span>
                        <span className="svc-name">{svc.name}</span>
                        {svc.dur && <span className="svc-meta"><I.Clock />{svc.dur}m</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="svc-price">₹{svc.price}</span>
                        <button className="btn-rm" onClick={() => removeService(idx)}>
                          <I.Trash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SCHEDULE SECTION */}
          <div className="section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon"><Calendar size={18} /></div>
                Weekly Schedule
              </div>
            </div>

            <div className="section-body">
              {editing.schedule ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div className="field">
                      <span className="lbl"><I.Cal /> Day</span>
                      <select
                        className="sel"
                        value={newSlot.day}
                        onChange={e => setNewSlot(prev => ({ ...prev, day: e.target.value }))}
                      >
                        <option value="">Select day</option>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <span className="lbl"><I.Clock /> Time</span>
                      <select
                        className="sel"
                        value={newSlot.time}
                        onChange={e => setNewSlot(prev => ({ ...prev, time: e.target.value }))}
                      >
                        <option value="">Select time</option>
                        {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="btn-group">
                    <button
                      className="btn-save"
                      onClick={addSlot}
                      disabled={saving || !newSlot.day || !newSlot.time}
                    >
                      <Plus size={16} />
                      Add Slot
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditing(prev => ({ ...prev, schedule: false }))}
                    >
                      <X size={16} />
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => setEditing(prev => ({ ...prev, schedule: true }))}
                  style={{ marginTop: 0 }}
                >
                  <Plus size={13} />
                  Add Slot
                </button>
              )}

              {Object.keys(schedule).length === 0 ? (
                <div className="empty">
                  <I.Cal />
                  No schedule set
                </div>
              ) : (
                <div style={{ marginTop: editing.schedule ? 16 : 0 }}>
                  {DAYS.filter(d => schedule[d]?.length).map(day => (
                    <div key={day} className="day-block">
                      <div className="day-name">
                        <I.Cal />
                        {day} <span style={{ fontWeight: 500, color: '#9ca3af' }}>({schedule[day].length})</span>
                      </div>
                      <div className="chips">
                        {schedule[day].map(time => (
                          <div key={time} className="chip">
                            {time}
                            <button className="chip-rm" onClick={() => removeSlot(day, time)}>
                              <I.X />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}