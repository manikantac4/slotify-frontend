import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Heroback from '../assets/heroback.jpeg';

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

  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    transition: 'all 0.5s ease',
    background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled
      ? '1px solid rgba(255,255,255,0.05)'
      : '1px solid transparent',
    padding: scrolled ? '12px 0' : '20px 0',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .desktop-links { display: flex; align-items: center; gap: 2px; }
        .desktop-right  { display: flex; align-items: center; gap: 4px; }
        .mobile-toggle  { display: none; }

        @media (max-width: 900px) {
          .desktop-links, .desktop-right { display: none; }
          .mobile-toggle { display: flex; }
          .nav-inner { padding: 0 24px; }
        }

        /* ── HERO ── */
        .hero {
          width: 100%; min-height: 100vh;
          position: relative; display: flex; align-items: center;
          padding: 100px 0 72px;
         background-image: url(${Heroback});
          background-size: cover; background-position: center 35%;
          overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(105deg, rgba(5,4,3,0.96) 0%, rgba(5,4,3,0.75) 45%, rgba(5,4,3,0.2) 100%);
        }
        .hero::after {
          content: ''; position: absolute; inset: 0; z-index: 1;
          background: radial-gradient(ellipse 70% 60% at 15% 60%, rgba(249,115,22,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-inner {
          position: relative; z-index: 2;
          width: 100%; max-width: 1280px;
          margin: 0 auto; padding: 0 72px;
        }
        .hero-content {
          max-width: 620px;
          display: flex; flex-direction: column; gap: 0;
        }

        /* ── eyebrow pill ── */
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.25);
          border-radius: 40px; padding: 5px 14px 5px 8px;
          margin-bottom: 22px; width: fit-content;
        }
        .hero-eyebrow-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(249,115,22,0.18);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .hero-eyebrow-dot::after {
          content: ''; width: 7px; height: 7px; border-radius: 50%;
          background: #facc15;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.3); opacity: 0.7; }
        }
        .hero-eyebrow span {
          font-size: 11px; font-weight: 600; letter-spacing: 1.2px;
          text-transform: uppercase; color: #facc15;
        }

        /* ── title ── */
        .hero-title {
          font-size: 64px; font-weight: 700;
          line-height: 1.03; letter-spacing: -2.5px;
          color: #fff; margin-bottom: 18px;
        }
        .line-muted  { display: block; color: rgba(255,255,255,0.32); font-weight: 600; }
        .line-main   { display: block; }
        .line-accent { display: block; }
        .dot-accent  { color: #facc15; }

        /* ── subtitle ── */
        .hero-sub {
          font-size: 15px; font-weight: 400;
          color: rgba(255,255,255,0.44); line-height: 1.78;
          margin-bottom: 32px; max-width: 430px;
        }

        /* ── search bar ── */
        .hero-search {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 6px 6px 6px 18px;
          margin-bottom: 28px; max-width: 480px;
          transition: border-color 0.2s, background 0.2s;
        }
        .hero-search:focus-within {
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.09);
        }
        .hero-search input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #fff; font-size: 14px; font-weight: 400;
          font-family: inherit;
        }
        .hero-search input::placeholder { color: rgba(255,255,255,0.3); }
        .hero-search-btn {
          background: #facc15; border: none; border-radius: 10px;
          padding: 10px 20px; cursor: pointer; flex-shrink: 0;
          font-size: 13px; font-weight: 600; color: #fff;
          display: flex; align-items: center; gap: 6px;
          transition: background 0.2s, transform 0.15s;
          font-family: inherit;
        }
        .hero-search-btn:hover { background: #ea6c0a; transform: translateY(-1px); }

        /* ── popular tags ── */
        .hero-tags {
          display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
          margin-bottom: 36px;
        }
        .hero-tags-label {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.28); letter-spacing: 0.3px;
          margin-right: 2px;
        }
        .hero-tag {
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 4px 12px; cursor: pointer;
          transition: color 0.18s, border-color 0.18s, background 0.18s;
        }
        .hero-tag:hover { color: #fff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.09); }

        /* ── trust row ── */
        .hero-trust {
          display: flex; align-items: center; gap: 20px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .trust-avatars { display: flex; }
        .trust-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          border: 2px solid rgba(10,10,10,0.8);
          background: rgba(255,255,255,0.12);
          margin-left: -8px; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.6);
        }
        .trust-avatar:first-child { margin-left: 0; }
        .trust-text { display: flex; flex-direction: column; gap: 1px; }
        .trust-text strong { font-size: 13px; font-weight: 600; color: #fff; }
        .trust-text span { font-size: 11px; color: rgba(255,255,255,0.35); }
        .trust-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.08); }
        .trust-stat { display: flex; flex-direction: column; gap: 1px; }
        .trust-stat strong { font-size: 13px; font-weight: 600; color: #fff; }
        .trust-stat span { font-size: 11px; color: rgba(255,255,255,0.35); }

        /* ── scroll hint ── */
        .scroll-hint {
          position: absolute; bottom: 28px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          opacity: 0.18; z-index: 2; pointer-events: none;
          animation: scrollBounce 2.4s ease-in-out infinite;
        }
        .scroll-hint span { font-size: 8px; color: #fff; letter-spacing: 2.5px; text-transform: uppercase; }
        .scroll-arrow { width: 1px; height: 24px; background: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent); }
        @keyframes scrollBounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(7px); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1279px) and (min-width: 901px) {
          .hero-inner { padding: 0 52px; }
          .hero-title { font-size: 54px; letter-spacing: -2px; }
        }
        @media (max-width: 900px) {
          .hero { padding: 96px 0 64px; }
          .hero-inner { padding: 0 36px; }
          .hero-title { font-size: 46px; letter-spacing: -1.6px; }
          .hero-content { max-width: 100%; }
          .hero-sub { max-width: 100%; }
          .hero-search { max-width: 100%; }
        }
        @media (max-width: 600px) {
          .hero { padding: 88px 0 56px; }
          .hero-inner { padding: 0 22px; }
          .hero-title { font-size: 36px; letter-spacing: -1.1px; line-height: 1.07; margin-bottom: 14px; }
          .hero-sub { font-size: 14px; margin-bottom: 24px; }
          .hero-eyebrow { margin-bottom: 18px; }
          .hero-search { border-radius: 12px; margin-bottom: 20px; padding: 5px 5px 5px 14px; }
          .hero-search input { font-size: 13px; }
          .hero-search-btn { padding: 9px 14px; font-size: 12px; }
          .hero-tags { margin-bottom: 28px; gap: 6px; }
          .hero-trust { gap: 14px; padding-top: 22px; flex-wrap: wrap; }
          .trust-divider { display: none; }
        }
        @media (max-width: 380px) {
          .hero-inner { padding: 0 18px; }
          .hero-title { font-size: 30px; letter-spacing: -0.8px; }
          .hero-sub { font-size: 13px; }
        }
      `}</style>

      {/* NAV */}
      <motion.nav
        style={navStyle}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-inner">

          {/* Logo */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <div style={{ width: 26, height: 26, background: '#fff', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, background: '#0a0a0a', borderRadius: 3 }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Slotify
            </span>
          </motion.div>

          {/* Desktop Links */}
          <div className="desktop-links">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  position: 'relative',
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: hoveredLink === link ? '#fff' : 'rgba(161,161,170,1)',
                  textDecoration: 'none',
                  borderRadius: 8,
                  transition: 'color 0.2s',
                  display: 'inline-block',
                }}
              >
                <motion.span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                  }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{
                    opacity: hoveredLink === link ? 1 : 0,
                    scale: hoveredLink === link ? 1 : 0.92,
                  }}
                  transition={{ duration: 0.18 }}
                />
                <span style={{ position: 'relative', zIndex: 1 }}>{link}</span>
              </a>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="desktop-right">

            {/* Language dropdown */}
            <div style={{ position: 'relative' }} ref={langRef}>
              <button
                onClick={() => setLangOpen((p) => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 8,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(161,161,170,1)', fontSize: 13, fontWeight: 500,
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(161,161,170,1)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Globe size={14} style={{ opacity: 0.7 }} />
                <span>{activeLang.code}</span>
                <ChevronDown
                  size={12}
                  style={{
                    opacity: 0.6,
                    transition: 'transform 0.2s',
                    transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      width: 160, padding: '6px 0', borderRadius: 12,
                      background: 'rgba(12,12,12,0.97)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
                      zIndex: 100,
                    }}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setActiveLang(lang); setLangOpen(false); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 16px', border: 'none', cursor: 'pointer',
                          background: activeLang.code === lang.code ? 'rgba(255,255,255,0.06)' : 'transparent',
                          color: activeLang.code === lang.code ? '#fff' : 'rgba(161,161,170,1)',
                          fontSize: 13, fontWeight: 400,
                          transition: 'color 0.15s, background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            activeLang.code === lang.code ? 'rgba(255,255,255,0.06)' : 'transparent';
                          e.currentTarget.style.color =
                            activeLang.code === lang.code ? '#fff' : 'rgba(161,161,170,1)';
                        }}
                      >
                        <span>{lang.label}</span>
                        {activeLang.code === lang.code && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#facc15', flexShrink: 0 }} />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 6px' }} />

            {/* Log In */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: 8,
                background: 'transparent', cursor: 'pointer',
                color: 'rgba(161,161,170,1)', fontSize: 13, fontWeight: 500,
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(161,161,170,1)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Log In
            </motion.button>

            {/* Get Started */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              style={{
                marginLeft: 4, padding: '9px 22px',
                background: '#fff', color: '#000',
                border: 'none', borderRadius: 40,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f4f4f5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            style={{
              background: 'transparent', border: 'none',
              color: '#fff', cursor: 'pointer',
              padding: 8, borderRadius: 8,
            }}
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
              style={{
                overflow: 'hidden',
                background: 'rgba(8,8,8,0.97)',
                backdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    onMouseEnter={() => setHoveredLink(link)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      position: 'relative',
                      padding: '8px 14px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: hoveredLink === link ? '#fff' : 'rgba(161,161,170,1)',
                      textDecoration: 'none',
                      borderRadius: 8,
                      transition: 'color 0.2s',
                      display: 'inline-block',
                    }}
                  >
                    <motion.span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                      }}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{
                        opacity: hoveredLink === link ? 1 : 0,
                        scale: hoveredLink === link ? 1 : 0.92,
                      }}
                      transition={{ duration: 0.18 }}
                    />
                    <span style={{ position: 'relative', zIndex: 1 }}>{link}</span>
                  </a>
                ))}

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />

                {/* Mobile lang chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 12px 8px' }}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLang(lang)}
                      style={{
                        fontSize: 12, fontWeight: 500,
                        padding: '6px 10px', borderRadius: 8,
                        border: 'none', cursor: 'pointer',
                        background: activeLang.code === lang.code
                          ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: activeLang.code === lang.code
                          ? '#fff' : 'rgba(113,113,122,1)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>

                <button
                  style={{
                    textAlign: 'left', padding: '13px 12px', borderRadius: 8,
                    border: 'none', background: 'transparent',
                    color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Log In
                </button>
                <button
                  style={{
                    padding: '13px', borderRadius: 40,
                    border: 'none', background: '#fff',
                    color: '#000', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', marginTop: 4,
                  }}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">

           

            {/* Title */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="line-muted">Your Ultimate</span>
              <span className="line-main">Service<span className="dot-accent">.</span></span>
              <span className="line-accent">Starts Here</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              Discover vetted professionals and book the perfect service instantly — your gateway to exceptional experiences.
            </motion.p>

            {/* Search bar */}
            <motion.div
              className="hero-search"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <input type="text" placeholder="Search for a service — e.g. plumber, designer…" />
              <button className="hero-search-btn">
                Search <ArrowRight size={13} />
              </button>
            </motion.div>

            {/* Popular tags */}
            <motion.div
              className="hero-tags"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hero-tags-label">Popular:</span>
              {['Home Cleaning', 'Web Design', 'Photography', 'Personal Training', 'Tutoring'].map((tag) => (
                <button key={tag} className="hero-tag">{tag}</button>
              ))}
            </motion.div>

            {/* Trust row */}
            <motion.div
              className="hero-trust"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="trust-avatars">
                {['AK', 'MR', 'JS', 'PL'].map((initials) => (
                  <div key={initials} className="trust-avatar">{initials}</div>
                ))}
              </div>
              <div className="trust-text">
                <strong>1M+ bookings made</strong>
                <span>by happy customers</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-stat">
                <strong>4.9 ★ avg rating</strong>
                <span>across all services</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-stat">
                <strong>Same-day</strong>
                <span>availability</span>
              </div>
            </motion.div>

          </div>
        </div>

        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>
    </>
  );
}