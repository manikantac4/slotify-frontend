import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { auth } from "../firebase";
import API from "../api/axios";
// ── SVG Icons ──────────────────────────────────────────────────────────────────
const I = {
  Salon: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/><path d="M14.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      <path d="M4 22V12a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v10"/><path d="M9 22v-4a3 3 0 0 1 6 0v4"/>
    </svg>
  ),
  Home: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
    </svg>
  ),
  Consult: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/><path d="M2 21a10 10 0 0 1 16.9-7.2"/>
      <circle cx="19" cy="19" r="3"/><path d="M19 16v3l2 1"/>
    </svg>
  ),
  Pin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  User: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Store: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/><path d="M3 9l2.45-4.9A1 1 0 0 1 6.34 3.5h11.32a1 1 0 0 1 .9.6L21 9"/><line x1="12" y1="9" x2="12" y2="21"/>
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
  ArrowR: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  ArrowL: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Spin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin .75s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
};

// ── Data ───────────────────────────────────────────────────────────────────────
const TYPES = [
  { id: "salon",        label: "Salon",         Icon: I.Salon,   sub: "Beauty & grooming" },
  { id: "home",         label: "Home Services", Icon: I.Home,    sub: "On-site solutions" },
  { id: "consultation", label: "Consultation",  Icon: I.Consult, sub: "Professional appts" },
];
const DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIMES = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00",
               "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];

// ── Styles ─────────────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
body,html{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#fff;}

.wrap{min-height:100vh;background:#fff;display:flex;align-items:flex-start;justify-content:center;padding:32px 20px 72px;}

.card{width:100%;max-width:820px;background:#fff;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;animation:up .4s cubic-bezier(.22,1,.36,1) both;}

/* header strip */
.hdr{padding:22px 36px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;justify-content:space-between;}
.hdr-left{display:flex;align-items:center;gap:12px;}
.hdr-dot{width:36px;height:36px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#6B7280;}
.hdr-title{font-size:15px;font-weight:700;color:#111827;letter-spacing:-.02em;}
.hdr-sub{font-size:12px;color:#9CA3AF;margin-top:1px;}
.step-badge{font-size:11px;font-weight:600;color:#6B7280;background:#F3F4F6;padding:4px 10px;border-radius:99px;letter-spacing:.03em;}

/* step bar */
.steps{display:flex;align-items:center;padding:20px 36px;border-bottom:1px solid #F3F4F6;gap:0;}
.step-item{display:flex;align-items:center;gap:8px;flex:1;}
.step-item:last-child{flex:none;}
.step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:all .3s;}
.step-dot.done{background:#111827;color:#fff;}
.step-dot.active{background:#FACC15;color:#111827;box-shadow:0 0 0 4px #FEF9C3;}
.step-dot.idle{background:#F3F4F6;color:#9CA3AF;}
.step-label{font-size:12px;font-weight:600;transition:color .3s;}
.step-label.active{color:#111827;}
.step-label.done{color:#6B7280;}
.step-label.idle{color:#9CA3AF;}
.step-line{flex:1;height:1px;background:#E5E7EB;margin:0 12px 0 0;transition:background .4s;}
.step-line.done{background:#111827;}

/* body */
.body{padding:28px 36px 32px;}

/* type selector */
.type-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px;}
.type-btn{border:1px solid #E5E7EB;border-radius:12px;padding:18px 14px 14px;background:#FAFAFA;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:6px;transition:all .18s;outline:none;}
.type-btn:hover{border-color:#D1D5DB;background:#F9FAFB;}
.type-btn.sel{border-color:#111827;background:#fff;box-shadow:0 0 0 3px #F3F4F6;}
.type-btn-icon{color:#9CA3AF;transition:color .18s;}
.type-btn.sel .type-btn-icon{color:#111827;}
.type-btn-name{font-size:13px;font-weight:700;color:#111827;}
.type-btn-sub{font-size:11px;color:#9CA3AF;font-weight:500;}
.type-btn.sel .type-btn-sub{color:#6B7280;}

/* form grid */
.row2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.row3{display:grid;grid-template-columns:1fr 110px 96px;gap:12px;}
.slot-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

/* field */
.field{display:flex;flex-direction:column;gap:5px;}
.lbl{font-size:11px;font-weight:600;color:#6B7280;letter-spacing:.05em;text-transform:uppercase;display:flex;align-items:center;gap:5px;}
.lbl svg{color:#9CA3AF;}
.req{color:#EF4444;margin-left:1px;}

.inp,.sel{width:100%;padding:9px 12px;font-size:14px;font-weight:500;font-family:inherit;background:#fff;border:1px solid #E5E7EB;border-radius:8px;color:#111827;outline:none;transition:border-color .15s,box-shadow .15s;}
.inp:focus,.sel:focus{border-color:#9CA3AF;box-shadow:0 0 0 3px #F3F4F6;}
.inp::placeholder{color:#D1D5DB;}
.inp.err,.sel.err{border-color:#FCA5A5;}
.sel{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;}
.err-msg{font-size:11px;color:#EF4444;display:flex;align-items:center;gap:4px;}
.hint{font-size:11px;color:#9CA3AF;}

/* section divider */
.sdiv{height:1px;background:#F3F4F6;margin:24px 0;}

/* service add box */
.add-box{background:#FAFAFA;border:1px solid #F3F4F6;border-radius:12px;padding:16px;margin-bottom:16px;}

/* primary add btn */
.btn-add{width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;font-size:13px;font-weight:600;font-family:inherit;background:#111827;color:#fff;border:none;border-radius:8px;cursor:pointer;margin-top:12px;transition:all .15s;}
.btn-add:hover{background:#1F2937;}
.btn-add:active{transform:scale(.98);}

/* list items */
.svc-list{display:flex;flex-direction:column;gap:7px;}
.svc-item{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #F3F4F6;border-radius:9px;padding:10px 14px;animation:in .18s ease both;}
.svc-left{display:flex;align-items:center;gap:8px;}
.svc-name{font-size:13px;font-weight:600;color:#111827;}
.svc-meta{font-size:11px;color:#9CA3AF;display:flex;align-items:center;gap:3px;}
.svc-price{font-size:12px;font-weight:700;color:#374151;background:#F3F4F6;padding:2px 8px;border-radius:6px;}
.btn-rm{background:none;border:none;cursor:pointer;color:#D1D5DB;display:flex;align-items:center;padding:5px;border-radius:6px;transition:all .15s;}
.btn-rm:hover{background:#FEF2F2;color:#EF4444;}

/* slots */
.day-block{margin-bottom:14px;}
.day-name{font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.07em;margin-bottom:7px;display:flex;align-items:center;gap:5px;}
.chips{display:flex;flex-wrap:wrap;gap:6px;}
.chip{display:flex;align-items:center;gap:5px;background:#F3F4F6;color:#374151;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;animation:in .15s ease both;}
.chip-rm{background:none;border:none;cursor:pointer;color:#9CA3AF;padding:0;display:flex;align-items:center;transition:color .12s;}
.chip-rm:hover{color:#EF4444;}

/* empty */
.empty{text-align:center;padding:24px;color:#D1D5DB;font-size:13px;font-weight:500;}
.empty svg{margin:0 auto 8px;display:block;}

/* summary */
.sum-bar{margin-top:16px;padding:10px 14px;background:#F9FAFB;border:1px solid #F3F4F6;border-radius:8px;font-size:12px;color:#6B7280;font-weight:600;display:flex;align-items:center;gap:6px;}

/* nav */
.nav{display:flex;justify-content:space-between;align-items:center;margin-top:28px;gap:12px;}
.btn-back{display:flex;align-items:center;gap:6px;padding:10px 18px;font-size:13px;font-weight:600;font-family:inherit;color:#6B7280;background:#fff;border:1px solid #E5E7EB;border-radius:9px;cursor:pointer;transition:all .15s;}
.btn-back:hover{border-color:#9CA3AF;color:#374151;}
.btn-next{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 24px;font-size:14px;font-weight:700;font-family:inherit;color:#111827;background:#FACC15;border:none;border-radius:9px;cursor:pointer;transition:all .18s;}
.btn-next:hover{background:#FDE047;}
.btn-next:active{transform:scale(.99);}
.btn-next:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-submit{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 24px;font-size:14px;font-weight:700;font-family:inherit;color:#fff;background:#111827;border:none;border-radius:9px;cursor:pointer;transition:all .18s;}
.btn-submit:hover{background:#1F2937;}
.btn-submit:disabled{opacity:.4;cursor:not-allowed;}

/* success */
.success{text-align:center;padding:56px 32px;animation:up .35s cubic-bezier(.22,1,.36,1) both;}
.success-ring{width:68px;height:68px;background:#111827;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:#FACC15;}
.success-title{font-size:20px;font-weight:700;color:#111827;margin-bottom:8px;}
.success-sub{font-size:14px;color:#6B7280;}

@media(max-width:540px){
  .type-row,.row2,.row3,.slot-row{grid-template-columns:1fr;}
  .body,.hdr,.steps{padding-left:20px;padding-right:20px;}
  .step-label{display:none;}
}
`;

// ── Sub-components ─────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, required, hint, error, children }) {
  return (
    <div className="field">
      <div className="lbl">
        {Icon && <Icon />}
        {label}{required && <span className="req">*</span>}
      </div>
      {children}
      {hint && <span className="hint">{hint}</span>}
      {error && (
        <span className="err-msg">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r=".5" fill="#EF4444"/></svg>
          {error}
        </span>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ShopDetails() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({});
    const navigate = useNavigate();
  // Step 1
  const [cat, setCat]         = useState("");
  const [name, setName]       = useState("");
  const [owner, setOwner]     = useState("");
  const [loc, setLoc]         = useState("");
  const [phone, setPhone]     = useState("");
  const [email, setEmail]     = useState("");

  // Step 2
  const [svcs, setSvcs]         = useState([]);
  const [sName, setSName]       = useState("");
  const [sPrice, setSPrice]     = useState("");
  const [sDur, setSDur]         = useState("");
  const [sErr, setSErr]         = useState("");

  // Step 3
  const [sched, setSched]   = useState({});
  const [sDay, setSDay]     = useState("");
  const [sTime, setSTime]   = useState("");
  const [slotErr, setSlotErr] = useState("");

  const totalSlots  = Object.values(sched).reduce((a, v) => a + v.length, 0);
  const daysCount   = Object.keys(sched).length;

  const v1 = () => {
    const e = {};
    if (!cat)          e.cat   = "Select a type";
    if (!name.trim())  e.name  = "Required";
    if (!owner.trim()) e.owner = "Required";
    if (!loc.trim())   e.loc   = "Required";
    if (!phone.trim()) e.phone = "Required";
    setErr(e);
    return !Object.keys(e).length;
  };
  const v2 = () => {
    if (!svcs.length) { setErr({ svcs: "Add at least one service" }); return false; }
    setErr({}); return true;
  };

  const addSvc = () => {
    if (!sName.trim()) { setSErr("Enter name"); return; }
    if (!sPrice)       { setSErr("Enter price"); return; }
    setSErr("");
    setSvcs(p => [...p, { id: Date.now(), name: sName.trim(), price: +sPrice, dur: sDur ? +sDur : null }]);
    setSName(""); setSPrice(""); setSDur("");
  };

  const addSlot = () => {
    if (!sDay)  { setSlotErr("Select day"); return; }
    if (!sTime) { setSlotErr("Select time"); return; }
    if ((sched[sDay] || []).includes(sTime)) { setSlotErr("Already added"); return; }
    setSlotErr("");
    setSched(p => ({ ...p, [sDay]: [...(p[sDay] || []), sTime].sort() }));
    setSTime("");
  };

  const rmSlot = (d, t) => setSched(p => {
    const nxt = (p[d] || []).filter(x => x !== t);
    if (!nxt.length) { const { [d]: _, ...rest } = p; return rest; }
    return { ...p, [d]: nxt };
  });

  const next = () => {
    if (step === 1 && !v1()) return;
    if (step === 2 && !v2()) return;
    setErr({}); setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => { setErr({}); setStep(s => s - 1); };

  const submit = async () => {
  const weekly = DAYS.reduce((a, d) => { a[d] = sched[d] || []; return a; }, {});

  const uid = auth.currentUser.uid;

  const body = {
    ownerId: uid,
    shopName: name.trim(),
    ownerName: owner.trim(),
    category: cat,
    location: loc.trim(),
    phone: phone.trim(),
    email: email.trim(),
    services: svcs.map(({ id, ...r }) => r),
    weeklySchedule: weekly,
  };

  setLoading(true);

  try {
    await API.post("/shop/create", body);

    setDone(true);

    setTimeout(() => {
      navigate("/providerdashboard");
    }, 1000);

  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const fetchUser = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const res = await API.get(`/user/${user.uid}`);
      const data = res.data;

      setOwner(data.name || "");
      setEmail(data.email || "");

    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
    }
  };

  fetchUser();
}, []);
  const LABELS = ["Shop Info", "Services", "Time Slots"];

  return (
    <>
      <style>{G}</style>
      <div className="wrap">
        <div className="card">

          {/* Header */}
          <div className="hdr">
            <div className="hdr-left">
              <div className="hdr-dot"><I.Store /></div>
              <div>
                <div className="hdr-title">Shop Registration</div>
                <div className="hdr-sub">Set up your business profile</div>
              </div>
            </div>
            {!done && <span className="step-badge">Step {step} of 3</span>}
          </div>

          {/* Step bar */}
          {!done && (
            <div className="steps">
              {LABELS.map((lbl, i) => {
                const n = i + 1;
                const state = step > n ? "done" : step === n ? "active" : "idle";
                return (
                  <div key={n} className="step-item">
                    <div className={`step-dot ${state}`}>
                      {step > n ? <I.Check size={12} /> : n}
                    </div>
                    <span className={`step-label ${state}`}>{lbl}</span>
                    {i < 2 && <div className={`step-line ${step > n ? "done" : ""}`} />}
                  </div>
                );
              })}
            </div>
          )}

          <div className="body">
            {done ? (
              <div className="success">
                <div className="success-ring"><I.Check size={28} /></div>
                <div className="success-title">Shop registered successfully</div>
                <div className="success-sub"><strong>{name}</strong> is now live. Customers can discover and book your services.</div>
              </div>
            ) : (
              <>

                {/* ─── STEP 1 ───────────────────────────────────────────── */}
                {step === 1 && (
                  <div style={{ animation: "up .28s cubic-bezier(.22,1,.36,1) both" }}>

                    <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".05em" }}>Business Type</div>
                    {err.cat && <div className="err-msg" style={{ marginBottom: 8 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/></svg>{err.cat}</div>}
                    <div className="type-row">
                      {TYPES.map(({ id, label, Icon, sub }) => (
                        <button key={id} type="button" className={`type-btn ${cat === id ? "sel" : ""}`}
                          onClick={() => { setCat(id); setErr(e => ({ ...e, cat: "" })); }}>
                          <span className="type-btn-icon"><Icon /></span>
                          <span className="type-btn-name">{label}</span>
                          <span className="type-btn-sub">{sub}</span>
                        </button>
                      ))}
                    </div>

                    <div className="sdiv" />

                    <div className="row2" style={{ marginBottom: 16 }}>
                      <Field label="Shop Name" icon={I.Store} required error={err.name}>
                        <input className={`inp${err.name ? " err" : ""}`} placeholder="Enter shop name" value={name} onChange={e => setName(e.target.value)} />
                      </Field>
                      <Field label="Owner Name" icon={I.User} required error={err.owner}>
                        <input className={`inp${err.owner ? " err" : ""}`} placeholder="Full name" value={owner} onChange={e => setOwner(e.target.value)} />
                      </Field>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <Field label="Location" icon={I.Pin} required error={err.loc}>
                        <input className={`inp${err.loc ? " err" : ""}`} placeholder="Street, area, city" value={loc} onChange={e => setLoc(e.target.value)} />
                      </Field>
                    </div>

                    <div className="row2">
                      <Field label="Phone" icon={I.Phone} required error={err.phone}>
                        <input className={`inp${err.phone ? " err" : ""}`} placeholder="+91 98765 43210" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                      </Field>
                      <Field label="Email" icon={I.Mail} hint="Optional">
                        <input className="inp" placeholder="shop@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ─── STEP 2 ───────────────────────────────────────────── */}
                {step === 2 && (
                  <div style={{ animation: "up .28s cubic-bezier(.22,1,.36,1) both" }}>

                    <div className="add-box">
                      <div className="row3">
                        <Field label="Service Name" icon={I.Tag} required>
                          <input className="inp" placeholder="e.g. Haircut" value={sName}
                            onChange={e => setSName(e.target.value)} onKeyDown={e => e.key === "Enter" && addSvc()} />
                        </Field>
                        <Field label="Price ₹" icon={I.Rupee} required>
                          <input className="inp" placeholder="0" type="number" min="0" value={sPrice}
                            onChange={e => setSPrice(e.target.value)} onKeyDown={e => e.key === "Enter" && addSvc()} />
                        </Field>
                        <Field label="Mins" icon={I.Clock} hint="Optional">
                          <input className="inp" placeholder="30" type="number" min="1" value={sDur}
                            onChange={e => setSDur(e.target.value)} onKeyDown={e => e.key === "Enter" && addSvc()} />
                        </Field>
                      </div>
                      {sErr && <div className="err-msg" style={{ marginTop: 8 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/></svg>{sErr}</div>}
                      <button className="btn-add" onClick={addSvc}><I.Plus /> Add Service</button>
                    </div>

                    {err.svcs && <div className="err-msg" style={{ marginBottom: 10 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/></svg>{err.svcs}</div>}

                    {svcs.length === 0 ? (
                      <div className="empty">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        No services added yet
                      </div>
                    ) : (
                      <div className="svc-list">
                        {svcs.map(s => (
                          <div key={s.id} className="svc-item">
                            <div className="svc-left">
                              <span style={{ color: "#D1D5DB" }}><I.Tag /></span>
                              <span className="svc-name">{s.name}</span>
                              {s.dur && <span className="svc-meta"><I.Clock />{s.dur}m</span>}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span className="svc-price">₹{s.price}</span>
                              <button className="btn-rm" onClick={() => setSvcs(p => p.filter(x => x.id !== s.id))}><I.Trash /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 3 ───────────────────────────────────────────── */}
                {step === 3 && (
                  <div style={{ animation: "up .28s cubic-bezier(.22,1,.36,1) both" }}>

                    <div className="add-box">
                      <div className="slot-row">
                        <Field label="Day" icon={I.Cal} required>
                          <select className="sel" value={sDay} onChange={e => setSDay(e.target.value)}>
                            <option value="">Select day</option>
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </Field>
                        <Field label="Time" icon={I.Clock} required>
                          <select className="sel" value={sTime} onChange={e => setSTime(e.target.value)}>
                            <option value="">Select time</option>
                            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </Field>
                      </div>
                      {slotErr && <div className="err-msg" style={{ marginTop: 8 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/></svg>{slotErr}</div>}
                      <button className="btn-add" onClick={addSlot}><I.Plus /> Add Slot</button>
                    </div>

                    {totalSlots === 0 ? (
                      <div className="empty">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        No time slots added yet
                      </div>
                    ) : (
                      <>
                        {DAYS.filter(d => sched[d]?.length).map(d => (
                          <div key={d} className="day-block">
                            <div className="day-name"><I.Cal />{d} <span style={{ fontWeight: 500, color: "#9CA3AF" }}>({sched[d].length})</span></div>
                            <div className="chips">
                              {sched[d].map(t => (
                                <div key={t} className="chip">
                                  {t}
                                  <button className="chip-rm" onClick={() => rmSlot(d, t)}><I.X /></button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="sum-bar">
                          <I.Check size={14} />
                          {totalSlots} slot{totalSlots > 1 ? "s" : ""} across {daysCount} day{daysCount > 1 ? "s" : ""}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Nav */}
                <div className="nav">
                  {step > 1
                    ? <button className="btn-back" onClick={back}><I.ArrowL /> Back</button>
                    : <div />
                  }
                  {step < 3
                    ? <button className="btn-next" onClick={next}>Continue <I.ArrowR /></button>
                    : (
                      <button className="btn-submit" onClick={submit} disabled={loading}>
                        {loading ? <><I.Spin /> Submitting…</> : <><I.Send /> Register Shop</>}
                      </button>
                    )
                  }
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}