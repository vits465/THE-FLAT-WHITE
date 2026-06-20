"use client";

import { useEffect } from 'react';

export default function Nav() {
  useEffect(() => {
    const toggle   = document.getElementById('navToggle');
    const links    = document.getElementById('navLinks');
    const iconOpen  = document.getElementById('menuIconOpen');
    const iconClose = document.getElementById('menuIconClose');
    if (!toggle || !links) return;

    const closeMenu = () => {
      links.classList.remove('nav__links--open');
      toggle.setAttribute('aria-expanded', 'false');
      if (iconOpen)  iconOpen.style.display  = 'block';
      if (iconClose) iconClose.style.display = 'none';
      document.body.style.overflow = 'auto';
    };

    const handleToggle = () => {
      const isOpen = links.classList.toggle('nav__links--open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (iconOpen)  iconOpen.style.display  = isOpen ? 'none'  : 'block';
      if (iconClose) iconClose.style.display = isOpen ? 'block' : 'none';
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    };

    toggle.addEventListener('click', handleToggle);
    const navLinks = links.querySelectorAll('.nav__link');
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    const onKeydown = (e) => {
      if (e.key === 'Escape' && links.classList.contains('nav__links--open')) {
        closeMenu(); toggle.focus();
      }
    };
    document.addEventListener('keydown', onKeydown);

    return () => {
      toggle.removeEventListener('click', handleToggle);
      navLinks.forEach(link => link.removeEventListener('click', closeMenu));
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);

  return (
    <header className="nav" id="nav">
      <a href="#home" className="nav__logo" aria-label="The Flat White — Home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
        <span>The Flat White</span>
      </a>

      <nav className="nav__links" id="navLinks" aria-label="Main navigation">
        {['#home:Home','#about:Story','#showcase:Showcase','#menu:Menu','#reviews:Reviews','#contact:Contact'].map(s => {
          const [href, label] = s.split(':');
          return <a key={href} href={href} className="nav__link">{label}</a>;
        })}
      </nav>

      <div className="nav__right">
        <a href="tel:+918799370091" className="btn btn--sm btn--primary btn--magnetic nav__cta" aria-label="Call us">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l1.12-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
          Call Us
        </a>
        <button className="nav__toggle" id="navToggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="navLinks" type="button">
          <svg id="menuIconOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <svg id="menuIconClose" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{display:'none'}}>
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
