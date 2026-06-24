"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const sectionRef = useRef(null);

  // Replace these with your actual photo paths in the future, e.g. '/gallery/outside-1.jpg'
  const images = [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800", 
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=800",
  ];

  useEffect(() => {
    // Only apply parallax on desktop to prevent layout issues on mobile
    if (window.innerWidth <= 768) return;

    const ctx = gsap.context(() => {
      gsap.to('.gallery__col--1', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
      gsap.to('.gallery__col--2', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
      gsap.to('.gallery__col--3', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="gallery" id="atmosphere" ref={sectionRef} aria-label="Cafe Atmosphere">
      <div className="section-bg-text" aria-hidden="true">SPACES</div>
      
      <div className="gallery__header">
        <p className="gallery__eyebrow">The Atmosphere</p>
        <h2 className="gallery__title">A blend of natural light<br />and warm textures</h2>
      </div>

      <div className="gallery__grid">
        <div className="gallery__col gallery__col--1">
          {images.slice(0, 3).map((src, i) => (
            <div key={`col1-${i}`} className="gallery__img-wrap gallery-item cursor--video">
              <img
                src={src}
                alt="Cafe view"
                loading="lazy"
                decoding="async"
                className="gallery-img"
              />
            </div>
          ))}
        </div>
        
        <div className="gallery__col gallery__col--2">
          {images.slice(3, 6).map((src, i) => (
            <div key={`col2-${i}`} className="gallery__img-wrap gallery-item cursor--video">
              <img
                src={src}
                alt="Cafe view"
                loading="lazy"
                decoding="async"
                className="gallery-img"
              />
            </div>
          ))}
        </div>

        <div className="gallery__col gallery__col--3">
          {images.slice(6, 9).map((src, i) => (
            <div key={`col3-${i}`} className="gallery__img-wrap gallery-item cursor--video">
              <img
                src={src}
                alt="Cafe view"
                loading="lazy"
                decoding="async"
                className="gallery-img"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
