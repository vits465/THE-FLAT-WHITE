"use client";

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanillaTilt from 'vanilla-tilt';
import { useDeviceTier } from './hooks/useDeviceTier';

gsap.registerPlugin(ScrollTrigger);

export default function Animations() {
  const tier = useDeviceTier();

  useEffect(() => {
    let ctx = gsap.context(() => {
      /* ── Reveal helper ── */
      const reveal = (selector, vars = {}) => {
        if (!document.querySelector(selector)) return;
        gsap.fromTo(selector, 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: selector, start: 'top 82%' },
            ...vars,
          }
        );
      };

      /* ── Parallax bg texts ── */
      if (tier !== 'low') {
        gsap.utils.toArray('.section-bg-text').forEach((el) => {
          gsap.to(el, {
            y: '-18%', ease: 'none',
            scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1.8 },
          });
        });
      }

      /* ── About ── */
      ScrollTrigger.create({
        trigger: '#aboutImageMask', start: 'top 80%', once: true,
        onEnter: () => {
          gsap.to('#aboutImageMask', { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power3.inOut' });
          document.getElementById('aboutImageMask')?.classList.add('revealed');
        },
      });
      reveal('.about__eyebrow, .about__title, .about__text', { scrollTrigger: { trigger: '#aboutContent', start: 'top 82%' } });
      reveal('.about__feature', { scrollTrigger: { trigger: '.about__features', start: 'top 85%' } });

      /* ── Secret Sauce ── */
      gsap.fromTo('#sauceCup', { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '#secretSauce', start: 'top 78%' } });
      reveal('.secret-sauce__eyebrow, .secret-sauce__title, .secret-sauce__text', { scrollTrigger: { trigger: '#secretSauce', start: 'top 76%' } });

      /* ── Showcase ── */
      reveal('.showcase__header .section__eyebrow, .showcase__header .section__title, .showcase__subtitle', { scrollTrigger: { trigger: '.showcase__header', start: 'top 84%' } });
      gsap.fromTo('.showcase-card', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.18, ease: 'power3.out', scrollTrigger: { trigger: '#showcaseGrid', start: 'top 82%' } });

      /* ── Menu ── */
      reveal('.menu__header .section__eyebrow, .menu__header .section__title', { scrollTrigger: { trigger: '.menu__header', start: 'top 84%' } });
      gsap.fromTo('.menu-card', { y: 75, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '#menuGrid', start: 'top 82%' } });

      /* ── Reviews ── */
      if (document.querySelector('.reviews__header')) {
        reveal('.reviews__header .section__eyebrow, .reviews__header .section__title', { scrollTrigger: { trigger: '.reviews__header', start: 'top 84%' } });
      }

      /* ── Contact ── */
      gsap.fromTo('.contact__form', { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: '.contact__grid', start: 'top 80%' } });
      gsap.fromTo('.contact__info-block', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.contact__grid', start: 'top 80%' } });

      /* ── Footer Reveal ── */
      if (document.querySelector('.footer__inner') && tier !== 'low') {
        gsap.fromTo('.footer__inner',
          { yPercent: -40, opacity: 0.5 },
          { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } }
        );
      }

      /* ── Nav scroll ── */
      const nav = document.getElementById('nav');
      if (nav) {
        ScrollTrigger.create({
          start: 'top -80',
          onUpdate: (self) => { nav.classList.toggle('nav--scrolled', self.scroll() > 80); },
        });
      }
    });

    /* ── Magnetic Buttons ── */
    const magnets = document.querySelectorAll('.btn--magnetic');
    let rafId = null;
    const handleMouseMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - rect.left - rect.width / 2;
      const dy = e.clientY - rect.top  - rect.height / 2;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        gsap.to(btn, { x: Math.max(-16, Math.min(16, dx * 0.3)), y: Math.max(-16, Math.min(16, dy * 0.3)), duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
      });
    };
    const handleMouseLeave = (e) => {
      gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    };
    magnets.forEach(btn => {
      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);
    });

    /* ── Vanilla Tilt ── */
    try {
      const cards = document.querySelectorAll('.menu-card');
      if (cards.length > 0 && tier !== 'low') {
        VanillaTilt.init(cards, { max: 10, speed: 400, glare: true, 'max-glare': 0.18, scale: 1.02 });
      }
    } catch (e) { console.error('VanillaTilt error:', e); }

    /* ── Parallax band ── */
    const track = document.getElementById('parallaxTrack');
    let parallaxReqId;
    if (track && tier !== 'low') {
      let offset = 0;
      const animate = () => {
        offset -= 0.4;
        if (offset <= -track.scrollWidth / 2) offset = 0;
        track.style.transform = `translateX(${offset}px)`;
        parallaxReqId = requestAnimationFrame(animate);
      };
      parallaxReqId = requestAnimationFrame(animate);
    }

    /* ── Reviews Carousel ── */
    let current = 0;
    let timer = null;

    const setCarousel = (index) => {
      const reviewCards = document.querySelectorAll('.review-card');
      const dots = document.querySelectorAll('.reviews__dot');
      if (!reviewCards.length) return;
      const total = reviewCards.length;
      current = ((index % total) + total) % total;
      reviewCards.forEach((card, i) => {
        card.classList.remove('is-active', 'is-prev', 'is-next');
        if (i === current) card.classList.add('is-active');
        else if (i === (current - 1 + total) % total) card.classList.add('is-prev');
        else card.classList.add('is-next');
      });
      dots.forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle('reviews__dot--active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    const carousel  = document.getElementById('reviewsCarousel');
    const prevBtn   = document.getElementById('reviewsPrev');
    const nextBtn   = document.getElementById('reviewsNext');
    const dots      = document.querySelectorAll('.reviews__dot');
    const dotListeners = [];

    const handlePrev = () => setCarousel(current - 1);
    const handleNext = () => setCarousel(current + 1);
    const stopRot = () => clearInterval(timer);
    const startRot = () => { timer = setInterval(() => setCarousel(current + 1), 5000); };

    let touchX = 0;
    const onTouchStart = (e) => { touchX = e.changedTouches[0].clientX; };
    const onTouchEnd   = (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) dx < 0 ? setCarousel(current + 1) : setCarousel(current - 1);
    };

    if (carousel) {
      setCarousel(0);
      startRot();
      carousel.addEventListener('mouseenter', stopRot);
      carousel.addEventListener('mouseleave', startRot);
      carousel.addEventListener('touchstart', onTouchStart, { passive: true });
      carousel.addEventListener('touchend',   onTouchEnd,   { passive: true });
    }
    if (prevBtn) prevBtn.addEventListener('click', handlePrev);
    if (nextBtn) nextBtn.addEventListener('click', handleNext);
    dots.forEach((dot, i) => {
      const listener = () => setCarousel(i);
      dot.addEventListener('click', listener);
      dotListeners.push({ dot, listener });
    });
    
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
      magnets.forEach(btn => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (carousel) {
        clearInterval(timer);
        carousel.removeEventListener('mouseenter', stopRot);
        carousel.removeEventListener('mouseleave', startRot);
        carousel.removeEventListener('touchstart', onTouchStart);
        carousel.removeEventListener('touchend',   onTouchEnd);
      }
      if (prevBtn) prevBtn.removeEventListener('click', handlePrev);
      if (nextBtn) nextBtn.removeEventListener('click', handleNext);
      dotListeners.forEach(({ dot, listener }) => dot.removeEventListener('click', listener));
      if (parallaxReqId) cancelAnimationFrame(parallaxReqId);
    };
  }, []);

  return null;
}
