import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── PALETTE ───────────────────────────────
   ONLY light yellows — no amber / orange
   y50  = #FEFCE8   y100 = #FEF9C3
   y200 = #FEF08A   y300 = #FDE047
   y400 = #FACC15   darkText = #713F12
─────────────────────────────────────────── */

/* ─── REUSABLE SVG ICON ATOMS ─────────────── */
const IconCalendar = ({ size = 16, color = "#A16207" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="3"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <rect x="8" y="14" width="4" height="4" rx="1" fill={color} stroke="none"/>
  </svg>
);
const IconClock = ({ size = 16, color = "#A16207" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 7 12 12 16 14"/>
  </svg>
);
const IconShield = ({ size = 16, color = "#A16207" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconGrid = ({ size = 16, color = "#A16207" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const IconList = ({ size = 16, color = "#A16207" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3.5" cy="6" r="1.5" fill={color} stroke="none"/>
    <circle cx="3.5" cy="12" r="1.5" fill={color} stroke="none"/>
    <circle cx="3.5" cy="18" r="1.5" fill={color} stroke="none"/>
  </svg>
);
const IconTrend = ({ size = 16, color = "#A16207" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

/* ────────────────────────────────────────────
   ILLUSTRATION 1 — Easy Booking
──────────────────────────────────────────── */
const BookingIllustration = () => (
  <svg viewBox="0 0 320 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="320" height="186" fill="#FEFCE8"/>

    {/* Calendar card */}
    <rect x="24" y="16" width="160" height="156" rx="14" fill="white" stroke="#FEF08A" strokeWidth="1.4"/>
    <rect x="24" y="16" width="160" height="38" rx="14" fill="#FEF9C3"/>
    <rect x="24" y="40" width="160" height="14" fill="#FEF9C3"/>
    {/* calendar icon in header */}
    <rect x="36" y="23" width="16" height="16" rx="3" fill="none" stroke="#A16207" strokeWidth="1.4"/>
    <line x1="36" y1="28.5" x2="52" y2="28.5" stroke="#A16207" strokeWidth="1"/>
    <line x1="40.5" y1="20" x2="40.5" y2="25" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="47.5" y1="20" x2="47.5" y2="25" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="114" y="39" fontSize="10" fill="#713F12" fontWeight="700" textAnchor="middle">April 2025</text>
    {/* day labels */}
    {["S","M","T","W","T","F","S"].map((d,i)=>(
      <text key={i} x={40+i*20} y="70" fontSize="7.5" fill="#A16207" fontWeight="600" textAnchor="middle">{d}</text>
    ))}
    {/* dates */}
    {Array.from({length:21},(_,i)=>i+1).map((n,i)=>{
      const row=Math.floor(i/7),col=i%7,sel=n===15;
      return (
        <g key={n}>
          {sel && <circle cx={40+col*20} cy={85+row*20} r="9" fill="#FACC15"/>}
          <text x={40+col*20} y={89+row*20} fontSize="8" fill={sel?"#713F12":"#374151"}
            fontWeight={sel?"700":"400"} textAnchor="middle">{n}</text>
        </g>
      );
    })}

    {/* Time panel */}
    <rect x="196" y="16" width="100" height="156" rx="14" fill="white" stroke="#FEF08A" strokeWidth="1.4"/>
    {/* clock icon */}
    <circle cx="218" cy="36" r="10" fill="#FEF9C3"/>
    <circle cx="218" cy="36" r="7" fill="none" stroke="#A16207" strokeWidth="1.3"/>
    <line x1="218" y1="36" x2="218" y2="31" stroke="#A16207" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="218" y1="36" x2="222" y2="38.5" stroke="#A16207" strokeWidth="1.3" strokeLinecap="round"/>
    <text x="254" y="40" fontSize="9" fill="#713F12" fontWeight="700" textAnchor="middle">Time</text>
    {["9:00 AM","10:00 AM","11:00 AM","1:00 PM","3:00 PM"].map((t,i)=>{
      const sel=i===2;
      return (
        <g key={t}>
          <rect x="206" y={55+i*24} width="84" height="18" rx="9"
            fill={sel?"#FACC15":"#FEFCE8"} stroke={sel?"#FDE047":"#FEF08A"} strokeWidth="1"/>
          {sel && <polyline points={`214,${64+i*24} 217,${67+i*24} 222,${61+i*24}`}
            stroke="#713F12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          <text x="248" y={67+i*24} fontSize="8" fill={sel?"#713F12":"#A16207"}
            fontWeight={sel?"700":"400"} textAnchor="middle">{t}</text>
        </g>
      );
    })}
  </svg>
);

/* ────────────────────────────────────────────
   ILLUSTRATION 2 — Real-Time Availability
──────────────────────────────────────────── */
const AvailabilityIllustration = () => {
  const slots=[
    {l:"9 AM",a:true},{l:"10 AM",a:false},{l:"11 AM",a:true},
    {l:"12 PM",a:true},{l:"1 PM",a:false},{l:"2 PM",a:true},
    {l:"3 PM",a:true},{l:"4 PM",a:true},{l:"5 PM",a:false},
  ];
  return (
    <svg viewBox="0 0 320 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="186" fill="#FEFCE8"/>
      {/* header */}
      <rect x="24" y="12" width="272" height="30" rx="12" fill="#FEF9C3" stroke="#FEF08A" strokeWidth="1.2"/>
      {/* calendar icon */}
      <rect x="36" y="19" width="14" height="14" rx="2.5" fill="none" stroke="#A16207" strokeWidth="1.3"/>
      <line x1="36" y1="24" x2="50" y2="24" stroke="#A16207" strokeWidth="1"/>
      <line x1="40" y1="16" x2="40" y2="20" stroke="#A16207" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="46" y1="16" x2="46" y2="20" stroke="#A16207" strokeWidth="1.3" strokeLinecap="round"/>
      <text x="178" y="31" fontSize="10" fill="#713F12" fontWeight="700" textAnchor="middle">Today — Wednesday</text>

      {/* 3×3 grid */}
      {slots.map(({l,a},i)=>{
        const col=i%3,row=Math.floor(i/3),x=24+col*96,y=52+row*40;
        return (
          <g key={i}>
            <rect x={x} y={y} width="88" height="30" rx="9"
              fill={a?"white":"#F9FAFB"} stroke={a?"#FDE047":"#E5E7EB"} strokeWidth="1.2"/>
            {/* dot */}
            <circle cx={x+14} cy={y+15} r="5" fill={a?"#FACC15":"#E5E7EB"}/>
            {/* check / X */}
            {a
              ? <polyline points={`${x+11},${y+15} ${x+13.5},${y+17.5} ${x+18},${y+12}`}
                  stroke="#713F12" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              : <>
                  <line x1={x+11} y1={y+12} x2={x+17} y2={y+18} stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1={x+17} y1={y+12} x2={x+11} y2={y+18} stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
                </>
            }
            <text x={x+52} y={y+18} fontSize="9" fill={a?"#713F12":"#9CA3AF"}
              fontWeight={a?"600":"400"} textAnchor="middle">{l}</text>
            <text x={x+78} y={y+18} fontSize="7.5" fill={a?"#A16207":"#D1D5DB"} textAnchor="middle">
              {a?"Free":"Taken"}
            </text>
          </g>
        );
      })}
      {/* legend */}
      <circle cx="82" cy="176" r="5" fill="#FACC15"/>
      <text x="92" y="180" fontSize="8" fill="#713F12" fontWeight="500">Available</text>
      <circle cx="148" cy="176" r="5" fill="#E5E7EB"/>
      <text x="158" y="180" fontSize="8" fill="#9CA3AF" fontWeight="500">Taken</text>
    </svg>
  );
};

/* ────────────────────────────────────────────
   ILLUSTRATION 3 — Secure Payments
──────────────────────────────────────────── */
const PaymentIllustration = () => (
  <svg viewBox="0 0 320 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="cg" x1="40" y1="24" x2="236" y2="136" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF9C3"/><stop offset="1" stopColor="#FEF08A"/>
      </linearGradient>
    </defs>
    <rect width="320" height="186" fill="#FEFCE8"/>

    {/* card body */}
    <rect x="40" y="24" width="196" height="112" rx="16" fill="url(#cg)" stroke="#FDE047" strokeWidth="1.4"/>
    {/* chip grid */}
    <rect x="60" y="50" width="30" height="22" rx="4" fill="white" stroke="#FDE047" strokeWidth="1"/>
    <line x1="60" y1="57" x2="90" y2="57" stroke="#FDE047" strokeWidth="0.8"/>
    <line x1="60" y1="63" x2="90" y2="63" stroke="#FDE047" strokeWidth="0.8"/>
    <line x1="68" y1="50" x2="68" y2="72" stroke="#FDE047" strokeWidth="0.8"/>
    <line x1="75" y1="50" x2="75" y2="72" stroke="#FDE047" strokeWidth="0.8"/>
    <line x1="82" y1="50" x2="82" y2="72" stroke="#FDE047" strokeWidth="0.8"/>
    {/* contactless */}
    <path d="M97 54 Q103 61 97 68" stroke="#A16207" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M102 51 Q111 61 102 71" stroke="#A16207" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* card number */}
    <text x="60" y="102" fontSize="10.5" fill="#713F12" fontWeight="600" letterSpacing="1.5">•••• •••• •••• 4291</text>
    <text x="60" y="120" fontSize="7.5" fill="#A16207" opacity="0.8">VALID THRU  09/27</text>
    {/* network circles */}
    <circle cx="206" cy="112" r="10" fill="#FDE047" opacity="0.65"/>
    <circle cx="218" cy="112" r="10" fill="#FACC15" opacity="0.45"/>

    {/* lock icon badge */}
    <rect x="248" y="52" width="42" height="50" rx="12" fill="white" stroke="#FEF08A" strokeWidth="1.2"/>
    <rect x="256" y="42" width="26" height="18" rx="13" fill="none" stroke="#FDE047" strokeWidth="2.5"/>
    <circle cx="269" cy="73" r="5.5" fill="#FACC15"/>
    <rect x="267" y="73" width="4" height="9" rx="2" fill="#FACC15"/>
    <line x1="269" y1="76" x2="269" y2="82" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>

    {/* shield-check SVG icon confirmation */}
    <rect x="50" y="150" width="220" height="26" rx="13" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1.2"/>
    <path d="M68 155.5 l5-2.5 5 2.5v4.5c0 2.5-2.5 4.5-5 5.5-2.5-1-5-3-5-5.5v-4.5z"
      fill="none" stroke="#A16207" strokeWidth="1.2"/>
    <polyline points="66.5,162 69.5,165 74.5,159" stroke="#A16207" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="168" y="167" fontSize="9" fill="#713F12" fontWeight="700" textAnchor="middle">Payment confirmed instantly</text>
  </svg>
);

/* ────────────────────────────────────────────
   ILLUSTRATION 4 — Manage Slots
──────────────────────────────────────────── */
const SlotsIllustration = () => {
  const days=["Mon","Tue","Wed","Thu","Fri"];
  const cells=[
    ["9 AM","10 AM","Off"],
    ["9 AM","Off","1 PM"],
    ["9 AM","11 AM","2 PM"],
    ["Off","10 AM","3 PM"],
    ["9 AM","2 PM","Off"],
  ];
  return (
    <svg viewBox="0 0 320 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="186" fill="#FEFCE8"/>
      {days.map((d,i)=>(
        <g key={d}>
          <rect x={12+i*61} y="12" width="54" height="24" rx="8" fill="#FEF9C3" stroke="#FEF08A" strokeWidth="1"/>
          <text x={39+i*61} y="28" fontSize="9" fill="#713F12" fontWeight="700" textAnchor="middle">{d}</text>
        </g>
      ))}
      {cells.map((col,ci)=>
        col.map((cell,ri)=>{
          const off=cell==="Off",x=12+ci*61,y=44+ri*44;
          return (
            <g key={`${ci}-${ri}`}>
              <rect x={x} y={y} width="54" height="36" rx="9"
                fill={off?"#F9FAFB":"white"} stroke={off?"#E5E7EB":"#FEF08A"} strokeWidth="1.2"/>
              {off
                ? <>
                    <line x1={x+16} y1={y+10} x2={x+38} y2={y+26} stroke="#D1D5DB" strokeWidth="1.6" strokeLinecap="round"/>
                    <line x1={x+38} y1={y+10} x2={x+16} y2={y+26} stroke="#D1D5DB" strokeWidth="1.6" strokeLinecap="round"/>
                    <text x={x+27} y={y+34} fontSize="6.5" fill="#9CA3AF" textAnchor="middle">Blocked</text>
                  </>
                : <>
                    {/* mini clock */}
                    <circle cx={x+18} cy={y+14} r="7" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1"/>
                    <line x1={x+18} y1={y+14} x2={x+18} y2={y+10} stroke="#A16207" strokeWidth="1.1" strokeLinecap="round"/>
                    <line x1={x+18} y1={y+14} x2={x+21} y2={y+16} stroke="#A16207" strokeWidth="1.1" strokeLinecap="round"/>
                    <text x={x+36} y={y+16} fontSize="7.5" fill="#713F12" fontWeight="600" textAnchor="middle">{cell}</text>
                    {/* check circle */}
                    <circle cx={x+42} cy={y+28} r="5" fill="#FACC15"/>
                    <polyline points={`${x+39},${y+28} ${x+41.5},${y+30.5} ${x+46},${y+25}`}
                      stroke="#713F12" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </>
              }
            </g>
          );
        })
      )}
    </svg>
  );
};

/* ────────────────────────────────────────────
   ILLUSTRATION 5 — Track Bookings
──────────────────────────────────────────── */
const TrackIllustration = () => {
  const items=[
    {time:"9:00 AM", name:"Sarah K.",  svc:"Haircut",   done:true},
    {time:"11:00 AM",name:"James R.",  svc:"Beard Trim",done:true},
    {time:"2:00 PM", name:"Priya M.",  svc:"Facial",    done:false},
    {time:"4:00 PM", name:"Tom B.",    svc:"Massage",   done:false},
  ];
  const initials=["SK","JR","PM","TB"];
  return (
    <svg viewBox="0 0 320 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="186" fill="#FEFCE8"/>
      {/* header */}
      <rect x="20" y="10" width="280" height="28" rx="12" fill="#FEF9C3" stroke="#FEF08A" strokeWidth="1"/>
      {/* list SVG icon */}
      <line x1="34" y1="19" x2="58" y2="19" stroke="#A16207" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="34" y1="24" x2="58" y2="24" stroke="#A16207" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="30" cy="19" r="2" fill="#FACC15" stroke="none"/>
      <circle cx="30" cy="24" r="2" fill="#FACC15" stroke="none"/>
      <text x="182" y="28" fontSize="10" fill="#713F12" fontWeight="700" textAnchor="middle">Today's Schedule</text>

      {/* timeline */}
      <line x1="48" y1="46" x2="48" y2="180" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="3 3"/>

      {items.map(({time,name,svc,done},i)=>(
        <g key={i}>
          <circle cx="48" cy={58+i*34} r="7" fill={done?"#FACC15":"#FEF9C3"} stroke="#FDE047" strokeWidth="1.5"/>
          {done && <polyline points={`45,${58+i*34} 47.5,${60.5+i*34} 52,${55.5+i*34}`}
            stroke="#713F12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          <text x="62" y={55+i*34} fontSize="7.5" fill="#A16207" fontWeight="600">{time}</text>
          <rect x="62" y={59+i*34} width="230" height="22" rx="8"
            fill={done?"#FEFCE8":"white"} stroke={done?"#FDE047":"#F3F4F6"} strokeWidth="1"/>
          {/* avatar */}
          <circle cx="78" cy={70+i*34} r="8" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1"/>
          <text x="78" y={73.5+i*34} fontSize="5.5" fill="#713F12" fontWeight="700" textAnchor="middle">{initials[i]}</text>
          <text x="98" y={73.5+i*34} fontSize="9" fill="#374151" fontWeight="600">{name}</text>
          <text x="162" y={73.5+i*34} fontSize="8" fill="#9CA3AF">· {svc}</text>
          {done
            ? <><circle cx="278" cy={70+i*34} r="7" fill="#FACC15"/>
                <polyline points={`275,${70+i*34} 277.5,${72.5+i*34} 282,${67+i*34}`}
                  stroke="#713F12" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>
            : <circle cx="278" cy={70+i*34} r="7" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1"/>
          }
        </g>
      ))}
    </svg>
  );
};

/* ────────────────────────────────────────────
   ILLUSTRATION 6 — Business Growth
──────────────────────────────────────────── */
const GrowthIllustration = () => {
  const pts=[[30,152],[70,132],[110,112],[150,90],[190,70],[230,50],[270,32]];
  const area=`M${pts.map(([x,y])=>`${x},${y}`).join("L")}L270,158L30,158Z`;
  const line=`M${pts.map(([x,y])=>`${x},${y}`).join("L")}`;
  return (
    <svg viewBox="0 0 320 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="af" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#FEF08A" stopOpacity="0.5"/>
          <stop offset="1" stopColor="#FEF08A" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="320" height="186" fill="#FEFCE8"/>
      {/* axes */}
      <line x1="30" y1="158" x2="288" y2="158" stroke="#FEF08A" strokeWidth="1.2"/>
      <line x1="30" y1="16"  x2="30"  y2="158" stroke="#FEF08A" strokeWidth="1.2"/>
      {/* grid */}
      {[50,90,130].map(y=>(
        <line key={y} x1="30" y1={y} x2="288" y2={y} stroke="#FEF9C3" strokeWidth="1" strokeDasharray="4 3"/>
      ))}
      {/* area + line */}
      <path d={area} fill="url(#af)"/>
      <path d={line} stroke="#FACC15" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#FACC15" strokeWidth="2"/>
      ))}
      {/* month labels */}
      {["Jan","Feb","Mar","Apr","May","Jun","Jul"].map((m,i)=>(
        <text key={m} x={30+i*40} y="172" fontSize="7.5" fill="#A16207" textAnchor="middle">{m}</text>
      ))}

      {/* star rating badge */}
      <rect x="172" y="10" width="136" height="44" rx="10" fill="white" stroke="#FEF08A" strokeWidth="1.2"/>
      <text x="240" y="27" fontSize="8.5" fill="#713F12" fontWeight="700" textAnchor="middle">Customer Rating</text>
      {/* SVG stars */}
      {[0,1,2,3,4].map(s=>(
        <text key={s} x={184+s*19} y="44" fontSize="14" fill="#FACC15">★</text>
      ))}

      {/* growth badge — uses trend-up SVG path */}
      <rect x="8" y="10" width="84" height="44" rx="10" fill="white" stroke="#FEF08A" strokeWidth="1.2"/>
      <polyline points="16,42 22,36 28,40 36,28" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="32,28 36,28 36,32"         stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="50" y="24" fontSize="7.5" fill="#A16207" fontWeight="600" textAnchor="middle">New Customers</text>
      <text x="50" y="43" fontSize="14" fill="#FACC15" fontWeight="900" textAnchor="middle">+142%</text>
    </svg>
  );
};

/* ────────────────────────────────────────────
   FEATURE CARD — zigzag + 3D tilt + glow
──────────────────────────────────────────── */
const FeatureCard = ({ illustration: Illustration, title, description, icon: Icon, index }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const innerRef = useRef(null);

  const onMove = useCallback((e) => {
    const r = cardRef.current.getBoundingClientRect();
    gsap.to(cardRef.current, {
      rotateX: -(e.clientY - r.top  - r.height/2)/22,
      rotateY:  (e.clientX - r.left - r.width /2)/22,
      duration:0.3, ease:"power2.out",
    });
  }, []);

  const onEnter = useCallback(() => {
    gsap.to(glowRef.current,  { opacity:1, scale:1,   duration:0.4, ease:"power2.out" });
    gsap.to(innerRef.current, { y:-8,
      boxShadow:"0 28px 60px -8px rgba(250,204,21,0.25), 0 8px 20px -4px rgba(0,0,0,0.05)",
      duration:0.35, ease:"power2.out" });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(cardRef.current,  { rotateX:0, rotateY:0, duration:0.5, ease:"power2.out" });
    gsap.to(glowRef.current,  { opacity:0, scale:0.96,duration:0.4, ease:"power2.in"  });
    gsap.to(innerRef.current, { y:0,
      boxShadow:"0 2px 14px -4px rgba(0,0,0,0.05), 0 1px 3px -1px rgba(0,0,0,0.03)",
      duration:0.4, ease:"power2.out" });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ willChange:"transform", perspective:"900px", transformStyle:"preserve-3d" }}
      className={`feature-card relative ${index%2!==0?"mt-10":"mt-0"}`}
    >
      {/* yellow glow ring */}
      <div ref={glowRef} className="absolute -inset-[3px] rounded-[26px] opacity-0 pointer-events-none"
        style={{ background:"linear-gradient(135deg,rgba(250,204,21,0.5) 0%,rgba(254,240,138,0.18) 50%,transparent 75%)",
          filter:"blur(10px)", zIndex:0, transform:"scale(0.96)" }}/>

      <div ref={innerRef} className="relative z-10 rounded-[22px] bg-white overflow-hidden flex flex-col"
        style={{ border:"1px solid #FEF08A",
          boxShadow:"0 2px 14px -4px rgba(0,0,0,0.05), 0 1px 3px -1px rgba(0,0,0,0.03)",
          willChange:"transform,box-shadow" }}>

        {/* illustration */}
        <div className="w-full overflow-hidden rounded-t-[22px]" style={{ height:"186px" }}>
          <Illustration/>
        </div>

        <div style={{ height:"1px", background:"#FEF9C3" }}/>

        {/* text */}
        <div className="px-6 pt-5 pb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background:"#FEFCE8", border:"1px solid #FEF08A" }}>
              <Icon size={15} color="#A16207"/>
            </div>
            <h3 className="text-gray-900 font-black text-[16px] tracking-tight leading-snug">{title}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────
   DATA
──────────────────────────────────────────── */
const CUSTOMERS = [
  { illustration:BookingIllustration,      title:"Easy Booking",           description:"Choose service, date & time — then confirm in one click. Simple, fast, done.",        icon:IconCalendar },
  { illustration:AvailabilityIllustration, title:"Real-Time Availability", description:"See only open slots. No waiting, no overlaps — always perfectly in sync.",             icon:IconClock    },
  { illustration:PaymentIllustration,      title:"Secure Payments",        description:"Pay safely online and get instant confirmation. Your details are always protected.",   icon:IconShield   },
];
const SELLERS = [
  { illustration:SlotsIllustration,  title:"Manage Slots",    description:"Set working hours, block time off, and take full control of your availability.", icon:IconGrid  },
  { illustration:TrackIllustration,  title:"Track Bookings",  description:"View every appointment at a glance. Stay prepared with a clear daily overview.",  icon:IconList  },
  { illustration:GrowthIllustration, title:"Business Growth", description:"Win more customers, earn trust with ratings, and compound your bookings over time.", icon:IconTrend },
];

/* ────────────────────────────────────────────
   APP
──────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("customers");
  const sectionRef = useRef(null);
  const features = tab === "customers" ? CUSTOMERS : SELLERS;

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".feature-card"),
      { opacity:0, y:44, scale:0.97 },
      { opacity:1, y:0,  scale:1, stagger:0.1, duration:0.65, ease:"power3.out" }
    );
  }, [tab]);

  return (
    <>
      <section className="relative min-h-screen py-20 overflow-hidden bg-white">

        {/* light yellow dot grid */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage:"radial-gradient(circle,#FEF08A 1px,transparent 1px)",
          backgroundSize:"28px 28px", opacity:0.3 }}/>

        {/* soft blobs — only light yellow shades */}
        <div className="absolute top-0 right-0 w-[440px] h-[440px] rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle,#FEF9C3,transparent)", opacity:0.7, filter:"blur(80px)" }}/>
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle,#FEF08A,transparent)", opacity:0.45, filter:"blur(80px)" }}/>

        <div className="relative z-10 max-w-5xl mx-auto px-6">

          {/* badge */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
              style={{ background:"#FEFCE8", border:"1px solid #FEF08A" }}>
              {/* sparkle star */}
              <svg width="11" height="11" viewBox="0 0 11 11" fill="#FACC15">
                <path d="M5.5 0 L6.6 4.1 L11 5.5 L6.6 6.9 L5.5 11 L4.4 6.9 L0 5.5 L4.4 4.1 Z"/>
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color:"#A16207" }}>
                Features
              </span>
            </div>

            <h2 className="text-5xl font-black text-gray-950 tracking-tight leading-[1.07] mb-4">
              Built for{" "}
              <span style={{ color:"#FACC15" }}>everyone.</span>
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              Whether you're booking an appointment or running a business, Slotify has you covered.
            </p>
          </div>

          {/* tab switcher */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex rounded-full p-1 gap-1"
              style={{ background:"#FEFCE8", border:"1px solid #FEF08A" }}>
              {[
                { key:"customers", label:"Customers",
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="3"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg> },
                { key:"sellers", label:"Providers",
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg> },
              ].map(({ key, label, icon }) => {
                const active = tab===key;
                return (
                  <button key={key} onClick={()=>setTab(key)}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
                    style={{
                      background: active?"#FACC15":"transparent",
                      color:      active?"#713F12":"#A16207",
                      boxShadow:  active?"0 4px 14px rgba(250,204,21,0.35)":"none",
                    }}>
                    <span style={{ color:active?"#713F12":"#A16207" }}>{icon}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* zigzag card grid */}
          <div ref={sectionRef} className="grid grid-cols-3 gap-6 items-start">
            {features.map((f,i)=>(
              <FeatureCard key={f.title} {...f} index={i}/>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;background:white;font-family:system-ui,-apple-system,sans-serif;}
      `}</style>
    </>
  );
}