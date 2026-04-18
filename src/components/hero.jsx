import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Heroback from '../assets/heroback.jpeg';
import { useNavigate } from "react-router-dom";

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'हि', label: 'हिन्दी' },
  { code: 'தமிழ்', label: 'தமிழ்' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'FR', label: 'Français' },
  { code: 'JP', label: '日本語' },
];


export default function App() {
  const langRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target))
        setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = ['Explore Services', 'For Providers', 'About Us', 'Contact'];

  return (
    <>
      {/* Minimal style block — only for custom keyframes Tailwind can't express */}
      <style>{`
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(7px); }
        }
        .dot-pulse  { animation: dot-pulse 2s ease-in-out infinite; }
        .scroll-bounce { animation: scroll-bounce 2.4s ease-in-out infinite; }
      `}</style>

      {/* ── NAV ── */}
      <motion.nav
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-black/85 backdrop-blur-xl border-b border-white/5 py-3'
            : 'bg-transparent border-b border-transparent py-5',
        ].join(' ')}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-screen-xl mx-auto px-12 max-[900px]:px-6 flex items-center justify-between">

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <div className="w-6 h-6 bg-white rounded-[5px] flex items-center justify-center">
              <div className="w-3 h-3 bg-zinc-950 rounded-[3px]" />
            </div>
            <span className="text-white font-bold text-[15px] tracking-[0.12em] uppercase">
              Slotify
            </span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden min-[901px]:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative inline-block px-3.5 py-2 text-[13px] font-medium no-underline rounded-lg transition-colors duration-200"
                style={{ color: hoveredLink === link ? '#fff' : 'rgba(161,161,170,1)' }}
              >
                <motion.span
                  className="absolute inset-0 rounded-lg bg-white/5"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{
                    opacity: hoveredLink === link ? 1 : 0,
                    scale: hoveredLink === link ? 1 : 0.92,
                  }}
                  transition={{ duration: 0.18 }}
                />
                <span className="relative z-[1]">{link}</span>
              </a>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden min-[901px]:flex items-center gap-1">

            {/* Language dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-[7px] rounded-lg bg-transparent border-0 cursor-pointer text-zinc-400 text-[13px] font-medium transition-colors duration-200 hover:text-white hover:bg-white/5"
              >
                <Globe size={14} className="opacity-70" />
                <span>{activeLang.code}</span>
                <ChevronDown
                  size={12}
                  className="opacity-60 transition-transform duration-200"
                  style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute right-0 top-[calc(100%+8px)] w-40 py-1.5 rounded-xl bg-[#0c0c0c]/[0.97] border border-white/[0.08] backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] z-[100]"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setActiveLang(lang); setLangOpen(false); }}
                        className={[
                          'w-full flex items-center justify-between px-4 py-2.5 border-0 cursor-pointer text-[13px] font-normal transition-colors duration-150',
                          activeLang.code === lang.code
                            ? 'bg-white/[0.06] text-white'
                            : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        <span>{lang.label}</span>
                        {activeLang.code === lang.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/10 mx-1.5" />

            {/* Log In */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="px-4 py-2 border-0 rounded-lg bg-transparent cursor-pointer text-zinc-400 text-[13px] font-medium transition-colors duration-200 hover:text-white hover:bg-white/5"
                >
                Log In
                </motion.button>

            {/* Get Started */}
            <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                onClick={() => navigate("/login")}
                className="ml-1 px-5 py-2 bg-white text-black border-0 rounded-full text-[13px] font-semibold cursor-pointer hover:bg-zinc-100 transition-colors duration-200"
                >
                Get Started
                </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="flex min-[901px]:hidden bg-transparent border-0 text-white cursor-pointer p-2 rounded-lg"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden bg-[#080808]/[0.97] backdrop-blur-2xl border-b border-white/[0.06]"
            >
              <div className="px-6 pt-3 pb-6 flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    onMouseEnter={() => setHoveredLink(link)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="relative inline-block px-3.5 py-2 text-[13px] font-medium no-underline rounded-lg transition-colors duration-200"
                    style={{ color: hoveredLink === link ? '#fff' : 'rgba(161,161,170,1)' }}
                  >
                    <motion.span
                      className="absolute inset-0 rounded-lg bg-white/5"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{
                        opacity: hoveredLink === link ? 1 : 0,
                        scale: hoveredLink === link ? 1 : 0.92,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                    <span className="relative z-[1]">{link}</span>
                  </a>
                ))}

                <div className="h-px bg-white/[0.06] my-2" />

                {/* Mobile lang chips */}
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLang(lang)}
                      className={[
                        'text-xs font-medium px-2.5 py-1.5 rounded-lg border-0 cursor-pointer transition-all duration-150',
                        activeLang.code === lang.code
                          ? 'bg-white/10 text-white'
                          : 'bg-transparent text-zinc-500',
                      ].join(' ')}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>

                <button className="text-left px-3 py-3.5 rounded-lg border-0 bg-transparent text-white text-[15px] font-medium cursor-pointer">
                  Log In
                </button>
                <button className="px-3 py-3.5 rounded-full border-0 bg-white text-black text-[15px] font-semibold cursor-pointer mt-1">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        className="w-full min-h-screen relative flex items-center py-24 max-[900px]:py-20 max-[600px]:py-[88px_0_56px] bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${Heroback})`, backgroundPosition: 'center 35%' }}
      >
        {/* Overlay 1 — dark directional gradient */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(105deg, rgba(5,4,3,0.96) 0%, rgba(5,4,3,0.75) 45%, rgba(5,4,3,0.2) 100%)' }}
        />
        {/* Overlay 2 — orange radial glow */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 15% 60%, rgba(249,115,22,0.07) 0%, transparent 70%)' }}
        />

        <div className="relative z-[2] w-full max-w-screen-xl mx-auto px-[72px] max-[1279px]:px-[52px] max-[900px]:px-9 max-[600px]:px-6 max-[380px]:px-[18px]">
          <div className="max-w-[620px] max-[900px]:max-w-full flex flex-col gap-0">

            {/* Title */}
            <motion.h1
              className="text-[64px] max-[1279px]:text-[54px] max-[900px]:text-[46px] max-[600px]:text-[36px] max-[380px]:text-[30px] font-bold leading-[1.03] tracking-[-2.5px] max-[900px]:tracking-[-1.6px] max-[600px]:tracking-[-1.1px] max-[380px]:tracking-[-0.8px] text-white mb-[18px] max-[600px]:mb-3.5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block text-white/30 font-semibold">Your Ultimate</span>
              <span className="block">Service<span className="text-yellow-400">.</span></span>
              <span className="block">Starts Here</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-[15px] max-[600px]:text-[14px] max-[380px]:text-[13px] font-normal text-white/[0.44] leading-[1.78] mb-8 max-[600px]:mb-6 max-w-[430px] max-[900px]:max-w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              Discover vetted professionals and book the perfect service instantly — your gateway to exceptional experiences.
            </motion.p>

            {/* Search bar */}
            <motion.div
              className="flex items-center bg-white/[0.06] border border-white/[0.12] rounded-[14px] max-[600px]:rounded-xl p-1.5 max-[600px]:p-[5px] pl-[18px] max-[600px]:pl-3.5 mb-7 max-[600px]:mb-5 max-w-[480px] max-[900px]:max-w-full focus-within:border-white/[0.28] focus-within:bg-white/[0.09] transition-all duration-200"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <input
                type="text"
                placeholder="Search for a service — e.g. plumber, designer…"
                className="flex-1 bg-transparent border-0 outline-none text-white text-[14px] max-[600px]:text-[13px] font-normal placeholder:text-white/30 font-inherit"
                style={{ fontFamily: 'inherit' }}
              />
              <button
                className="bg-yellow-400 border-0 rounded-[10px] px-5 max-[600px]:px-3.5 py-2.5 max-[600px]:py-[9px] cursor-pointer shrink-0 text-[13px] max-[600px]:text-[12px] font-semibold text-black flex items-center gap-1.5 hover:bg-orange-500 hover:-translate-y-px transition-all duration-200"
                style={{ fontFamily: 'inherit' }}
              >
                Search <ArrowRight size={13} />
              </button>
            </motion.div>

            {/* Popular tags */}
            <motion.div
              className="flex items-center flex-wrap gap-2 max-[600px]:gap-1.5 mb-9 max-[600px]:mb-7"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[11px] font-medium text-white/[0.28] tracking-[0.3px] mr-0.5">
                Popular:
              </span>
              {['Home Cleaning', 'Web Design', 'Photography', 'Personal Training', 'Tutoring'].map((tag) => (
                <button
                  key={tag}
                  className="text-xs font-medium text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1 cursor-pointer hover:text-white hover:border-white/25 hover:bg-white/[0.09] transition-all duration-[180ms]"
                >
                  {tag}
                </button>
              ))}
            </motion.div>

            {/* Trust row */}
            <motion.div
              className="flex items-center gap-5 max-[600px]:gap-3.5 pt-7 max-[600px]:pt-[22px] border-t border-white/[0.07] flex-wrap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Avatars */}
              <div className="flex">
                {['AK', 'MR', 'JS', 'PL'].map((initials, i) => (
                  <div
                    key={initials}
                    className={[
                      'w-[30px] h-[30px] rounded-full border-2 border-zinc-950/80 bg-white/[0.12] flex items-center justify-center text-[10px] font-bold text-white/60 overflow-hidden',
                      i !== 0 ? '-ml-2' : '',
                    ].join(' ')}
                  >
                    {initials}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-px">
                <strong className="text-[13px] font-semibold text-white">1M+ bookings made</strong>
                <span className="text-[11px] text-white/35">by happy customers</span>
              </div>

              <div className="w-px h-7 bg-white/[0.08] max-[600px]:hidden" />

              <div className="flex flex-col gap-px">
                <strong className="text-[13px] font-semibold text-white">4.9 ★ avg rating</strong>
                <span className="text-[11px] text-white/35">across all services</span>
              </div>

              <div className="w-px h-7 bg-white/[0.08] max-[600px]:hidden" />

              <div className="flex flex-col gap-px">
                <strong className="text-[13px] font-semibold text-white">Same-day</strong>
                <span className="text-[11px] text-white/35">availability</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-bounce absolute bottom-7 left-1/2 flex flex-col items-center gap-1 opacity-[0.18] z-[2] pointer-events-none">
          <span className="text-[8px] text-white tracking-[2.5px] uppercase">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/90 to-transparent" />
        </div>
      </section>
    </>
  );
}