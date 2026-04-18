import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

/* ─── Data ─────────────────────────────────────────────────────────────── */
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
    { name: "FixIt Fast",  sub: "4.8 · 530 reviews", rating: 4.8, tag: "Appliances", hot: true,  image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80" },
    { name: "HandyPro",    sub: "4.6 · 470 reviews", rating: 4.6, tag: "General",    hot: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { name: "TechMend",    sub: "4.7 · 380 reviews", rating: 4.7, tag: "Electronics",hot: false, image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80" },
    { name: "HomeShield",  sub: "4.5 · 290 reviews", rating: 4.5, tag: "Furniture",  hot: false, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80" },
  ],
  Plumbing: [
    { name: "AquaFix",    sub: "4.9 · 850 reviews", rating: 4.9, tag: "Emergency",   hot: true,  image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80" },
    { name: "PipePro",    sub: "4.7 · 620 reviews", rating: 4.7, tag: "Installation",hot: false, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80" },
    { name: "FlowMaster", sub: "4.8 · 710 reviews", rating: 4.8, tag: "Drain Clear", hot: true,  image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80" },
    { name: "DrainKing",  sub: "4.6 · 440 reviews", rating: 4.6, tag: "Maintenance", hot: false, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80" },
  ],
  Electrician: [
    { name: "VoltEdge",  sub: "4.9 · 920 reviews", rating: 4.9, tag: "Rewiring", hot: true,  image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80" },
    { name: "WireWise",  sub: "4.7 · 670 reviews", rating: 4.7, tag: "Panels",   hot: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { name: "BrightFix", sub: "4.8 · 540 reviews", rating: 4.8, tag: "Lighting", hot: false, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80" },
    { name: "SafeWatt",  sub: "4.6 · 390 reviews", rating: 4.6, tag: "Safety",   hot: true,  image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80" },
  ],
};

const services = Object.keys(DATA);

/* ─── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-2
        -translate-x-1/2 bg-gray-900 text-white text-sm font-medium
        px-5 py-3 rounded-full pointer-events-none whitespace-nowrap`}
      style={{
        transition: "opacity 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? "0" : "2rem"})`,
      }}
    >
      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs flex-shrink-0">
        ✓
      </span>
      {message}
    </div>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */
function ServiceCard({ center, onView, onBook }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const onEnter = () => {
    setHovered(true);
    gsap.to(cardRef.current, { y: -8, scale: 1.025, duration: 0.3, ease: "power2.out" });
  };
  const onLeave = () => {
    setHovered(false);
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
  };

  const handleView = (e) => {
    e.stopPropagation();
    gsap.fromTo(cardRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
    );
    onView(center.name);
  };

  const handleBook = (e) => {
    e.stopPropagation();
    gsap.timeline()
      .to(cardRef.current, { y: -10, duration: 0.18, ease: "power2.out" })
      .to(cardRef.current, { y: 0,   duration: 0.5,  ease: "elastic.out(1.4, 0.5)" });
    onBook(center.name);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative bg-white rounded-[18px] overflow-hidden cursor-pointer border-[1.5px] transition-colors duration-300"
      style={{ borderColor: hovered ? "#F5A623" : "#eeeeee" }}
    >
      {/* HOT badge */}
      {center.hot && (
        <div
          className="absolute top-[-8px] left-3 z-20 bg-amber-400 text-amber-900
            text-[10px] font-bold px-2 py-[2px] rounded-full tracking-widest transition-transform duration-300"
          style={{ transform: hovered ? "translateY(-4px)" : "translateY(0)" }}
        >
          HOT
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={center.image}
          alt={center.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            transform: hovered ? "scale(1.12)" : "scale(1)",
            filter: hovered ? "brightness(1.05)" : "brightness(1)",
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
            opacity: hovered ? 0.75 : 1,
          }}
        />

        {/* Rating */}
        <div
          className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900
            text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 transition-transform duration-300"
          style={{ transform: hovered ? "translateY(-3px) scale(1.1)" : "translateY(0) scale(1)" }}
        >
          ★ {center.rating}
        </div>

        {/* Tag */}
        <div
          className="absolute bottom-2.5 left-2.5 text-white text-[11px] font-medium
            px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-sm transition-transform duration-300"
          style={{
            background: "rgba(255,255,255,0.18)",
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
          }}
        >
          {center.tag}
        </div>

        {/* Hover action strip */}
        <div
          className="absolute bottom-0 left-0 right-0 flex gap-2 p-2.5 transition-transform duration-300"
          style={{
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(8px)",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
          }}
        >
          <button
            onClick={handleView}
            className="flex-1 py-[7px] text-[11px] font-semibold text-white rounded-lg
              bg-white/15 border border-white/30 hover:bg-white/30
              active:scale-95 transition-all duration-150 tracking-wide"
          >
            View details
          </button>
          <button
            onClick={handleBook}
            className="flex-1 py-[7px] text-[11px] font-bold text-amber-900 rounded-lg
              bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all duration-150 tracking-wide"
          >
            Book now
          </button>
        </div>
      </div>

      {/* Body */}
      {/* <div className="p-3.5">
        <p
          className="text-sm font-bold mb-0.5 transition-colors duration-200"
          style={{ color: hovered ? "#854F0B" : "#1a1a1a" }}
        >
          {center.name}
        </p>
        <p className="text-[11px] text-gray-400 mb-3">{center.sub}</p>
        <div className="flex gap-2">
          <button
            onClick={handleView}
            className="flex-1 py-[7px] text-[11px] font-semibold text-gray-600
              bg-gray-100 rounded-lg hover:bg-gray-200 hover:scale-[1.03]
              active:scale-95 transition-all duration-150"
          >
            View
          </button>
          <button
            onClick={handleBook}
            className="flex-1 py-[7px] text-[11px] font-bold text-amber-900
              bg-amber-400 rounded-lg hover:bg-amber-500 hover:scale-[1.03]
              active:scale-95 transition-all duration-150"
          >
            Book now
          </button>
        </div>
      </div> */}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function About() {
  const [active, setActive]     = useState("Cleaning");
  const [rendered, setRendered] = useState(true);
  const [toast, setToast]       = useState({ msg: "", show: false });
  const gridRef  = useRef(null);
  const timerRef = useRef(null);

  /* Animate grid out → swap data → animate in */
  const switchTab = useCallback((svc) => {
    if (svc === active) return;
    gsap.to(gridRef.current, {
      opacity: 0, y: 10, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setActive(svc);
        setRendered(false);
        requestAnimationFrame(() => {
          setRendered(true);
          gsap.fromTo(gridRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0,  duration: 0.32, ease: "power2.out" }
          );
        });
      },
    });
  }, [active]);

  /* Stagger cards on every active change */
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".svc-card");
    gsap.fromTo(cards,
      { opacity: 0, y: 28, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.45, stagger: 0.07, ease: "power3.out" }
    );
  }, [active]);

  const showToast = useCallback((msg) => {
    clearTimeout(timerRef.current);
    setToast({ msg, show: true });
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2400);
  }, []);

  const handleView = useCallback((name) => showToast(`Viewing ${name}`), [showToast]);
  const handleBook = useCallback((name) => showToast(`Booked ${name} successfully!`), [showToast]);

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">

      {/* ── Hero ── */}
      <div className="text-center pt-12 pb-8 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 mb-4">
          <span className="w-[7px] h-[7px] bg-green-500 rounded-full animate-pulse" />
          247 providers online now
        </div>
        <h1 className="text-[clamp(1.6rem,4vw,2.8rem)] font-bold text-gray-900 leading-tight tracking-tight">
          Find &amp; Book{" "}
          <span className="text-amber-400">Trusted Services</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 tracking-wide">
          Seamless booking · Verified professionals · Instant confirmation
        </p>
      </div>

      {/* ── Chips ── */}
      <div className="flex gap-2.5 flex-wrap justify-center px-4 sm:px-8 md:px-16 lg:px-24 pb-6">
        {services.map(svc => (
          <button
            key={svc}
            onClick={() => switchTab(svc)}
            className={`px-5 py-2 rounded-full text-sm font-medium border-[1.5px]
              whitespace-nowrap transition-all duration-300
              ${active === svc
                ? "bg-amber-400 border-amber-400 text-amber-900 scale-105 -translate-y-0.5"
                : "bg-white border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-800 hover:-translate-y-0.5"
              }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {svc}
          </button>
        ))}
      </div>

      {/* ── Section label ── */}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em]
        px-4 sm:px-8 md:px-16 lg:px-24 mb-3">
        {active} services
      </p>

      {/* ── Grid ── */}
      <div
        ref={gridRef}
        className="grid gap-[18px] px-4 sm:px-8 md:px-16 lg:px-24 pb-20
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {rendered && (DATA[active] || []).map((c, i) => (
          <div key={`${active}-${i}`} className="svc-card">
            <ServiceCard center={c} onView={handleView} onBook={handleBook} />
          </div>
        ))}
      </div>

      <Toast message={toast.msg} visible={toast.show} />
    </div>
  );
}
