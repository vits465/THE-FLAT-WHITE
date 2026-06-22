"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroModel from './canvas/HeroModel';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const triggers = [];

    // Parallax for video
    if (videoRef.current) {
      const videoTrig = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(videoRef.current, { y: 150, ease: 'none' })
      });
      triggers.push(videoTrig);
    }

    gsap.utils.toArray('.particle').forEach((p) => {
      const trig = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1 + Math.random(),
        onUpdate: (self) => {
          gsap.set(p, {
            y: -120 * self.progress - Math.random() * 80 * self.progress,
            x: (Math.random() - 0.5) * 60 * self.progress,
            rotation: (Math.random() - 0.5) * 200 * self.progress,
          });
        },
      });
      triggers.push(trig);
    });

    gsap.utils.toArray('.stat__num').forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix');
      const trig = ScrollTrigger.create({
        trigger: stat,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(stat, {
            innerHTML: target,
            duration: 2.2,
            ease: 'power3.out',
            snap: { innerHTML: 1 },
            onUpdate: function () {
              stat.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
            },
          });
        },
      });
      triggers.push(trig);
    });

    return () => triggers.forEach(t => t.kill());
  }, []);

  return (
    <section className="hero" id="home" aria-label="Hero — The Flat White" ref={heroRef}>
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="hero__video-bg"
        src="/hero.mp4"
      />

      {/* Unmute Toggle */}
      <button 
        className="hero__unmute-btn" 
        onClick={() => setIsMuted(!isMuted)}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        )}
      </button>

      {/* Background Overlay */}
      <div className="hero__video-overlay" aria-hidden="true"></div>

      {/* Ambient coffee bean particles */}
      <div className="hero__particles" aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <svg key={i} className={`particle particle--${i + 1}`} viewBox="0 0 20 28" fill="none">
            <path d="M10,2 C14.4,2 17.6,7.6 17.6,14 C17.6,20.4 14.4,26 10,26 C5.6,26 2.4,20.4 2.4,14 C2.4,7.6 5.6,2 10,2 Z" fill="#A67B5B" opacity=".4"/>
            <path d="M10,4 Q8,10 9,14 Q8,18 10,24" stroke="#6B3E2E" strokeWidth="1" fill="none" strokeLinecap="round"/>
          </svg>
        ))}
      </div>

      {/* Gold radial glow */}
      <div className="hero__glow" aria-hidden="true"></div>

      <div className="hero__inner">
        <div className="hero__text" id="heroText">
          <div className="hero__badge" id="heroEyebrow">
            <span className="hero__badge-dot"></span>
            Artisan Coffee House · Piplod, Surat
          </div>
          <h1 className="hero__title" id="heroTitle">
            <span className="hero__title-line">Rich &amp;</span>
            <em className="hero__title-em">Aromatic</em>
            <span className="hero__title-line hero__title-line--muted">Coffee</span>
          </h1>
          <p className="hero__subtitle" id="heroSubtitle">
            Tucked in Piplod — crafted with intention.<br />
            Come for the coffee. Stay for the feeling.
          </p>
          <div className="hero__actions" id="heroActions">
            <a href="#menu" className="btn btn--primary btn--magnetic btn--glow" id="heroCta">
              <span>Explore Menu</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#about" className="btn btn--ghost btn--magnetic">Our Story</a>
          </div>

          {/* Scroll indicator */}
          <div className="hero__scroll-hint" aria-hidden="true">
            <span>Scroll</span>
            <div className="hero__scroll-line"></div>
          </div>
        </div>

        <div className="hero__visual hero__visual--3d" id="heroVisual">
          <div className="hero__canvas-wrap" style={{ position: 'relative', width: '100%', height: '100%' }}>
            <HeroModel />
          </div>
          <div className="hero__model-tag" id="modelTag">
            <span className="hero__model-tag-dot"></span>
            Interactive 3D · Drag to rotate
          </div>
          {/* Floating info chips */}
          <div className="hero__chip hero__chip--1" aria-hidden="true">
            <span className="hero__chip-icon">☕</span>
            <span>Double Ristretto</span>
          </div>
          <div className="hero__chip hero__chip--2" aria-hidden="true">
            <span className="hero__chip-icon">🌿</span>
            <span>Ethically Sourced</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="hero__stats" id="heroStats">
        <div className="stat">
          <span className="stat__num" data-target="20" data-suffix="+">0</span>
          <span className="stat__label">Flavors</span>
        </div>
        <div className="stat__divider" aria-hidden="true"></div>
        <div className="stat">
          <span className="stat__num" data-target="150" data-suffix="k+">0</span>
          <span className="stat__label">Cups Poured</span>
        </div>
        <div className="stat__divider" aria-hidden="true"></div>
        <div className="stat">
          <span className="stat__num" data-target="5" data-suffix="★">0</span>
          <span className="stat__label">Google Rating</span>
        </div>
        <div className="stat__divider" aria-hidden="true"></div>
        <div className="stat">
          <span className="stat__num" data-target="2019" data-suffix="">0</span>
          <span className="stat__label">Est. Surat</span>
        </div>
      </div>
    </section>
  );
}
