"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Loader() {
  const loaderRef = useRef(null);

  useEffect(() => {
    const mainEl = document.querySelector('main');
    const hasLoaded = sessionStorage.getItem('flatWhiteLoaded');

    if (hasLoaded) {
      if (loaderRef.current) loaderRef.current.style.display = 'none';
      if (mainEl) mainEl.style.opacity = 1;
      document.body.style.overflow = 'auto';
      return;
    }

    const ctx = gsap.context(() => {
      const fragments = document.querySelectorAll('.loader__frag');
      fragments.forEach((frag, i) => {
        gsap.set(frag, {
          x: (i % 2 === 0 ? -1 : 1) * (10 + i * 4),
          y: -20 + i * 10,
          opacity: 0,
          rotation: Math.random() * 60 - 30,
        });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (loaderRef.current) loaderRef.current.style.display = 'none';
          document.body.style.overflow = 'auto';
          ScrollTrigger.refresh();
          sessionStorage.setItem('flatWhiteLoaded', 'true');
        },
      });

      tl
        .to('#loaderLogo',  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
        .to('#loaderBar',   { width: '100%', duration: 1.8, ease: 'power1.inOut' }, 0.2)
        .to('#beanCrease',  { strokeDashoffset: 0, duration: 1.0, ease: 'power3.inOut' }, 0.4)
        .from('#beanSvg',   { opacity: 0, scale: 0.8, duration: 0.7, ease: 'power2.out' }, 0.3)
        .to('#beanCrack',   { attr: { 'stroke-width': 8 }, duration: 0.5, ease: 'power4.inOut' }, 1.5)
        .to('#milkPour',    { height: 220, opacity: 0.95, duration: 0.7, ease: 'power2.out' }, 1.65)
        .to('#beanLeft',    { x: -95, rotation: -20, opacity: 0.2, duration: 1.0, ease: 'power3.inOut' }, 2.1)
        .to('#beanRight',   { x: 95,  rotation:  20, opacity: 0.2, duration: 1.0, ease: 'power3.inOut' }, 2.1)
        .to('#milkPour',    { opacity: 0, duration: 0.5 }, 2.1)
        .to('#beanCrack',   { opacity: 0, duration: 0.5 }, 2.1)
        .to(fragments,      { opacity: 1, duration: 0.15, stagger: 0.04 }, 2.1)
        .to(fragments, {
          x: (i) => (i % 2 === 0 ? -1 : 1) * (85 + Math.random() * 65),
          y: (i) => 85 + Math.random() * 145,
          rotation: (i) => (i % 2 === 0 ? -230 : 230),
          opacity: 0,
          duration: 1.0,
          stagger: 0.05,
          ease: 'power2.out',
        }, 2.15)
        .to('#loaderCreamBg', { clipPath: 'circle(150% at 50% 50%)', duration: 0.95, ease: 'power3.inOut' }, 2.7)
        .to(loaderRef.current, { opacity: 0, duration: 0.45, pointerEvents: 'none' }, 3.4);

      if (mainEl) {
        tl.to(mainEl, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 3.5);
      }
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="loader" ref={loaderRef} role="status" aria-label="Loading The Flat White">
      {/* Background Video for Preloader */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        src="/hero.mp4"
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)', zIndex: 0 }}></div>

      <div className="loader__cream-bg" id="loaderCreamBg"></div>

      <div className="loader__logo-wrap" id="loaderLogo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
        The Flat White
      </div>

      <div className="loader__stage" id="loaderStage">
        <svg className="loader__bean-svg" id="beanSvg" viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <radialGradient id="beanGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#8B5A3A"/>
              <stop offset="50%" stopColor="#5C2E1A"/>
              <stop offset="100%" stopColor="#1A0F0A"/>
            </radialGradient>
            <radialGradient id="beanGloss" cx="30%" cy="25%" r="45%">
              <stop offset="0%" stopColor="rgba(255,248,240,0.18)"/>
              <stop offset="100%" stopColor="rgba(255,248,240,0)"/>
            </radialGradient>
            <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF8F0"/>
              <stop offset="100%" stopColor="rgba(255,248,240,0)"/>
            </linearGradient>
            <clipPath id="beanLeftClip"><rect x="0" y="0" width="80" height="220"/></clipPath>
            <clipPath id="beanRightClip"><rect x="80" y="0" width="80" height="220"/></clipPath>
          </defs>

          <g id="beanLeft" clipPath="url(#beanLeftClip)">
            <path d="M80,12 C48,12 22,52 22,110 C22,168 48,208 80,208 Z" fill="url(#beanGrad)"/>
            <path d="M80,12 C48,12 22,52 22,110 C22,168 48,208 80,208 Z" fill="url(#beanGloss)"/>
          </g>
          <g id="beanRight" clipPath="url(#beanRightClip)">
            <path d="M80,12 C112,12 138,52 138,110 C138,168 112,208 80,208 Z" fill="url(#beanGrad)"/>
            <path d="M80,12 C112,12 138,52 138,110 C138,168 112,208 80,208 Z" fill="url(#beanGloss)"/>
          </g>

          <path id="beanCrease" d="M80,18 Q72,60 76,110 Q72,160 80,202" stroke="#A67B5B" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="210" strokeDashoffset="210"/>
          <path id="beanCrack" d="M80,20 L81,55 L79,90 L81,130 L79,165 L80,200" stroke="#FFF8F0" strokeWidth="0" fill="none" strokeLinecap="round"/>
          <rect id="milkPour" x="77" y="0" width="6" height="0" fill="url(#milkGrad)" rx="3" opacity="0.9"/>
          <ellipse cx="58" cy="70" rx="10" ry="18" fill="rgba(255,248,240,0.08)" transform="rotate(-20 58 70)"/>
        </svg>

        {[1,2,3,4,5,6].map(n => (
          <div key={n} className="loader__frag" id={`frag${n}`}></div>
        ))}
      </div>

      <div className="loader__progress-wrap">
        <div className="loader__progress-bar" id="loaderBar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  );
}
