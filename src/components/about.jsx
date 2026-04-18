import React, { useState, useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────────────────────────────────
   ONLY these minimal keyframes are injected — they cannot be expressed
   in Tailwind utility classes at all (ticker scroll, shimmer sweep,
   floating badge, skeleton pulse). Everything else is pure Tailwind.
───────────────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes sb-ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes sb-shimmer  { from{background-position:-600px 0} to{background-position:600px 0} }
  @keyframes sb-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes sb-skeleton { from{background-position:-400px 0} to{background-position:400px 0} }
  @keyframes sb-fadein   { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes sb-heroin   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sb-pulsedot { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5)} 60%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }
  * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
`;

if (!document.getElementById("sb-kf")) {
  const el = document.createElement("style");
  el.id = "sb-kf";
  el.textContent = KEYFRAMES;
  document.head.appendChild(el);
}

/* ── Data ──────────────────────────────────────────────────────────────── */
const DATA = {
  Cleaning: [
    { name: "Quick Clean",   sub: "4.5 · 980 reviews",  rating: 4.5, tag: "Deep Clean",  hot: false, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80" },
    { name: "Sparkle Home",  sub: "4.7 · 1.1k reviews", rating: 4.7, tag: "Move-in/out", hot: true,  image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80" },
    { name: "Neat Services", sub: "4.6 · 720 reviews",  rating: 4.6, tag: "Regular",     hot: false, image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80" },
    { name: "CleanPro",      sub: "4.8 · 640 reviews",  rating: 4.8, tag: "Office",      hot: true,  image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80" },
  ],
  Salon: [
    { name: "GlamStudio",  sub: "4.9 · 1.2k reviews", rating: 4.9, tag: "Hair & Makeup", hot: true,  image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80" },
    { name: "Velvet Cuts", sub: "4.7 · 860 reviews",  rating: 4.7, tag: "Barber",        hot: false, image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80" },
    { name: "Pure Glow",   sub: "4.8 · 530 reviews",  rating: 4.8, tag: "Skin & Nails",  hot: false, image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80" },
    { name: "Urban Sheen", sub: "4.6 · 410 reviews",  rating: 4.6, tag: "Full Service",  hot: true,  image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" },
  ],
  Repair: [
    { name: "FixIt Fast",  sub: "4.8 · 530 reviews", rating: 4.8, tag: "Appliances",  hot: true,  image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80" },
    { name: "HandyPro",    sub: "4.6 · 470 reviews", rating: 4.6, tag: "General",     hot: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { name: "TechMend",    sub: "4.7 · 380 reviews", rating: 4.7, tag: "Electronics", hot: false, image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80" },
    { name: "HomeShield",  sub: "4.5 · 290 reviews", rating: 4.5, tag: "Furniture",   hot: false, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80" },
  ],
  Plumbing: [
    { name: "AquaFix",    sub: "4.9 · 850 reviews", rating: 4.9, tag: "Emergency",    hot: true,  image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80" },
    { name: "PipePro",    sub: "4.7 · 620 reviews", rating: 4.7, tag: "Installation", hot: false, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80" },
    { name: "FlowMaster", sub: "4.8 · 710 reviews", rating: 4.8, tag: "Drain Clear",  hot: true,  image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80" },
    { name: "DrainKing",  sub: "4.6 · 440 reviews", rating: 4.6, tag: "Maintenance",  hot: false, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80" },
  ],
  Electrician: [
    { name: "VoltEdge",  sub: "4.9 · 920 reviews", rating: 4.9, tag: "Rewiring", hot: true,  image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80" },
    { name: "WireWise",  sub: "4.7 · 670 reviews", rating: 4.7, tag: "Panels",   hot: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { name: "BrightFix", sub: "4.8 · 540 reviews", rating: 4.8, tag: "Lighting", hot: false, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80" },
    { name: "SafeWatt",  sub: "4.6 · 390 reviews", rating: 4.6, tag: "Safety",   hot: true,  image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80" },
  ],
};
const SERVICES = Object.keys(DATA);

const TICKER_ITEMS = [
  { text: "247 Providers Online", accent: true },
  { text: "Verified Professionals" },
  { text: "Instant Confirmation" },
  { text: "5-Star Rated" },
  { text: "Trusted by 50k+ Homes", accent: true },
  { text: "Same-Day Booking" },
  { text: "Background Checked" },
  { text: "Insured & Licensed", accent: true },
  { text: "Free Cancellation" },
  { text: "24/7 Live Support" },
];

/* ── Ticker ─────────────────────────────────────────────────────────────── */
function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative overflow-hidden bg-stone-50 border-b border-stone-200 h-10 flex items-center">
      {/* fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right,#FAFAF9,transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left,#FAFAF9,transparent)" }} />

      <div
        className="inline-flex whitespace-nowrap"
        style={{ animation: "sb-ticker 32s linear infinite", willChange: "transform" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6">
            <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
            <span className={`text-xs tracking-wide font-medium ${item.accent ? "text-amber-600 font-semibold" : "text-stone-400"}`}>
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ message, visible }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2.5 bg-stone-900 text-white text-sm font-medium px-5 py-3 rounded-full pointer-events-none whitespace-nowrap"
      style={{
        transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
      }}
    >
      <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-stone-900 font-bold flex-shrink-0"
        style={{ fontSize: 10 }}>✓</span>
      {message}
    </div>
  );
}

/* ── ServiceCard ────────────────────────────────────────────────────────── */
function ServiceCard({ center, onView, onBook, index }) {
  const cardRef     = useRef(null);
  const stripRef    = useRef(null);
  const [loaded, setLoaded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  /* Corner accent refs */
  const tlRef = useRef(null); // top-left
  const brRef = useRef(null); // bottom-right
  const trRef = useRef(null); // top-right (inside image)
  const blRef = useRef(null); // bottom-left (inside image)

  const onMouseEnter = () => {
    setHovered(true);
    gsap.to(cardRef.current, { y: -6, duration: 0.35, ease: "power2.out" });
    gsap.to(stripRef.current, { y: 0, duration: 0.38, ease: "back.out(1.4)" });
    // outer corners
    gsap.to(tlRef.current, { opacity: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    gsap.to(brRef.current, { opacity: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    // inner image corners
    gsap.to([trRef.current, blRef.current], { opacity: 1, duration: 0.25, delay: 0.06 });
  };

  const onMouseLeave = () => {
    setHovered(false);
    gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(stripRef.current, { y: "100%", duration: 0.3, ease: "power2.in" });
    gsap.to(tlRef.current, { opacity: 0, x: -5, y: -5, duration: 0.25 });
    gsap.to(brRef.current, { opacity: 0, x: 5,  y: 5,  duration: 0.25 });
    gsap.to([trRef.current, blRef.current], { opacity: 0, duration: 0.2 });
  };

  const handleView = (e) => {
    e.stopPropagation();
    gsap.timeline()
      .to(cardRef.current, { scale: 0.97, duration: 0.1, ease: "power2.in" })
      .to(cardRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1.1,0.5)" });
    onView(center.name);
  };

  const handleBook = (e) => {
    e.stopPropagation();
    gsap.timeline()
      .to(cardRef.current, { y: -10, rotate: -0.8, duration: 0.13, ease: "power2.out" })
      .to(cardRef.current, { y: 0, rotate: 0, duration: 0.55, ease: "elastic.out(1.2,0.45)" });
    onBook(center.name);
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-white rounded-2xl border border-stone-200 overflow-hidden cursor-pointer will-change-transform select-none"
      style={{
        boxShadow: hovered
          ? "0 16px 40px rgba(245,158,11,0.13), 0 2px 8px rgba(0,0,0,0.04)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.28s ease, border-color 0.28s ease",
        borderColor: hovered ? "#F59E0B" : undefined,
        animationName: "sb-fadein",
        animationDuration: "0.5s",
        animationTimingFunction: "cubic-bezier(0.34,1.36,0.64,1)",
        animationFillMode: "both",
        animationDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Corner accents (outer card) ── */}
      {/* top-left */}
      <span ref={tlRef} className="absolute top-2.5 left-2.5 z-20 pointer-events-none"
        style={{ opacity: 0, transform: "translate(-5px,-5px)" }}>
        <svg width="16" height="16" fill="none">
          <path d="M0 14 L0 0 L14 0" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {/* bottom-right */}
      <span ref={brRef} className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none"
        style={{ opacity: 0, transform: "translate(5px,5px)" }}>
        <svg width="16" height="16" fill="none">
          <path d="M16 2 L16 16 L2 16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>

      {/* ── Image frame ── */}
      <div className="relative h-48 overflow-hidden bg-stone-100">
        {/* inner image corner accents */}
        <span ref={trRef} className="absolute top-2.5 right-2.5 z-10 pointer-events-none" style={{ opacity: 0 }}>
          <svg width="16" height="16" fill="none">
            <path d="M2 0 L16 0 L16 14" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span ref={blRef} className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none" style={{ opacity: 0 }}>
          <svg width="16" height="16" fill="none">
            <path d="M14 16 L0 16 L0 2" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>

        {/* skeleton */}
        {!loaded && (
          <div className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg,#F5F5F4 25%,#FAFAF9 50%,#F5F5F4 75%)",
              backgroundSize: "400% 100%",
              animation: "sb-skeleton 1.8s infinite",
            }} />
        )}

        {/* image */}
        <img
          src={center.image}
          alt={center.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover block"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease, opacity 0.3s",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            filter: hovered ? "brightness(1.05) saturate(1.08)" : "brightness(1) saturate(1)",
          }}
        />

        {/* gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(28,25,23,0.6) 0%, transparent 52%)",
            opacity: hovered ? 0.85 : 1,
            transition: "opacity 0.3s",
          }} />

        {/* shimmer sweep */}
        {hovered && (
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg,transparent 28%,rgba(255,255,255,0.14) 50%,transparent 72%)",
              backgroundSize: "600px 100%",
              animation: "sb-shimmer 1.2s ease forwards",
            }} />
        )}

        {/* HOT badge */}
        {center.hot && (
          <div
            className="absolute top-2.5 left-3 z-10 bg-amber-400 text-stone-900 text-xs font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
            style={{
              animation: "sb-float 3s ease-in-out infinite",
              boxShadow: "0 3px 10px rgba(245,158,11,0.4)",
            }}
          >
            🔥 Hot
          </div>
        )}

        {/* Rating chip */}
        <div
          className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transform: hovered ? "scale(1.1) translateY(-2px)" : "scale(1) translateY(0)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
            ...(hovered && { boxShadow: "0 5px 16px rgba(245,158,11,0.25)" }),
          }}
        >
          <span className="text-amber-400">★</span>
          {center.rating}
        </div>

        {/* Tag chip */}
        <div
          className="absolute bottom-2.5 left-2.5 z-10 text-white text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm tracking-wide"
          style={{
            background: hovered ? "rgba(245,158,11,0.22)" : "rgba(255,255,255,0.14)",
            borderColor: hovered ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.32)",
            transform: hovered ? "translateY(-3px)" : "translateY(0)",
            transition: "transform 0.28s ease, background 0.28s, border-color 0.28s",
          }}
        >
          {center.tag}
        </div>

        {/* Action strip — GSAP controlled */}
        <div
          ref={stripRef}
          className="absolute bottom-0 left-0 right-0 flex gap-2 p-2.5 z-20"
          style={{
            background: "rgba(28,25,23,0.88)",
            backdropFilter: "blur(10px)",
            transform: "translateY(100%)",
          }}
        >
          <button
            onClick={handleView}
            className="flex-1 py-2 text-xs font-semibold text-white/90 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-150 tracking-wide"
          >
            View details
          </button>
          <button
            onClick={handleBook}
            className="flex-1 py-2 text-xs font-bold text-stone-900 rounded-lg bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all duration-150 tracking-wide"
            style={{ boxShadow: "0 3px 12px rgba(245,158,11,0.38)" }}
          >
            Book now ↗
          </button>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="px-4 py-3.5 border-t border-stone-100">
        <p className="text-sm font-bold tracking-tight mb-0.5 transition-colors duration-200"
          style={{ color: hovered ? "#B45309" : "#1C1917" }}>
          {center.name}
        </p>
        <p className="text-xs text-stone-400 font-normal">{center.sub}</p>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function About() {
  const [active,   setActive]   = useState("Cleaning");
  const [rendered, setRendered] = useState(true);
  const [toast,    setToast]    = useState({ msg: "", show: false });
  const gridRef  = useRef(null);
  const timerRef = useRef(null);

  /* Tab switch — GSAP crossfade */
  const switchTab = useCallback((svc) => {
    if (svc === active) return;
    gsap.to(gridRef.current, {
      opacity: 0, y: 14, scale: 0.98, duration: 0.18, ease: "power2.in",
      onComplete() {
        setActive(svc);
        setRendered(false);
        requestAnimationFrame(() => {
          setRendered(true);
          gsap.fromTo(gridRef.current,
            { opacity: 0, y: 18, scale: 0.97 },
            { opacity: 1, y: 0,  scale: 1, duration: 0.34, ease: "power3.out" }
          );
        });
      },
    });
  }, [active]);

  /* Toast */
  const showToast = useCallback((msg) => {
    clearTimeout(timerRef.current);
    setToast({ msg, show: true });
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2600);
  }, []);

  const handleView = useCallback((n) => showToast(`Viewing ${n}`),              [showToast]);
  const handleBook = useCallback((n) => showToast(`${n} booked successfully!`), [showToast]);

  /* Hero entrance */
  useEffect(() => {
    gsap.fromTo(".sb-hero-anim",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out", delay: 0.05 }
    );
  }, []);

 
  return (
    <div className="min-h-screen bg-white">

      {/* Ticker */}
      <Ticker />

      {/* ── Hero ── */}
      <div className="text-center px-5 pt-14 pb-9 max-w-2xl mx-auto">
        {/* Live badge */}
        <div className="sb-hero-anim inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-5">
          <span
            className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
            style={{ animation: "sb-pulsedot 2s ease-in-out infinite" }}
          />
          <span className="text-xs font-semibold text-amber-700 tracking-wide">247 providers online right now</span>
        </div>

        <h1 className="sb-hero-anim text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Find &amp; Book{" "}
          <span className="text-amber-400 underline decoration-amber-200 underline-offset-4 decoration-4">
            Trusted Services
          </span>
        </h1>

        
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-100 max-w-screen-xl mx-auto" />

      {/* ── Category chips ── */}
      <div className="flex flex-wrap justify-center gap-2 px-5 pt-7 pb-7 max-w-3xl mx-auto">
        {SERVICES.map(svc => {
          const isActive = active === svc;
          return (
            <button
              key={svc}
              onClick={() => switchTab(svc)}
              className={[
                "px-5 py-2 rounded-full text-sm font-semibold border-[1.5px] whitespace-nowrap outline-none transition-all duration-300",
                isActive
                  ? "bg-amber-400 border-amber-400 text-stone-900 shadow-lg"
                  : "bg-white border-stone-200 text-stone-400 hover:border-amber-400 hover:text-amber-700",
              ].join(" ")}
              style={isActive
                ? { transform: "translateY(-2px) scale(1.04)", boxShadow: "0 6px 20px rgba(245,158,11,0.28)" }
                : { transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }
              }
            >
              {svc}
            </button>
          );
        })}
      </div>

      {/* ── Section label ── */}
      <div className="px-5 pb-3 max-w-screen-xl mx-auto">
        <p className="text-xs font-bold tracking-[0.12em] uppercase text-stone-300">
          {active} · {DATA[active].length} providers
        </p>
      </div>

      {/* ── Grid ── */}
      <div
        ref={gridRef}
        className="grid gap-5 px-5 pb-24 max-w-screen-xl mx-auto
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {rendered && DATA[active].map((c, i) => (
          <ServiceCard
            key={`${active}-${i}`}
            center={c}
            index={i}
            onView={handleView}
            onBook={handleBook}
          />
        ))}
      </div>

      <Toast message={toast.msg} visible={toast.show} />
    </div>
  );
}