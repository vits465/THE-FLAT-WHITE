"use client";

import { useEffect } from 'react';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Showcase from '@/components/Showcase';
import Footer from '@/components/Footer';
import Animations from '@/components/Animations';
import Gallery from '@/components/Gallery';
import FaqAccordion from '@/components/FaqAccordion';
import Quiz from '@/components/Quiz';
import shopInside from '@/img/shop_inside.jpg';
import { useDeviceTier } from '@/components/hooks/useDeviceTier';

export default function Home() {
  const tier = useDeviceTier();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.error('SW registration failed:', err));
    }

    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    let tx = -200, ty = -200, cx = -200, cy = -200, animId;
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMouseMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      cx = lerp(cx, tx, 0.14);
      cy = lerp(cy, ty, 0.14);
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      animId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animId = requestAnimationFrame(tick);

    const interactives = document.querySelectorAll('a, button, .menu-card, .review-card, .showcase-card, input, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--active'));
    });

    const videos = document.querySelectorAll('.about__image-mask, .secret-sauce__cup');
    videos.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--video'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--video'));
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <Animations />
      <Loader />


      {/* Custom cursor */}
      <div className="cursor" id="cursor" aria-hidden="true">
        <div className="cursor__dot"></div>
        <div className="cursor__ring"></div>
        <div className="cursor__text">VIEW</div>
      </div>

      <Nav />

      <main>
        <Hero />

        {/* PARALLAX BAND */}
        <section className="parallax-band" aria-hidden="true">
          <div className="parallax-band__track" id="parallaxTrack">
            {[
              { text: "100% Specialty Arabica", outline: false },
              { text: "Single Origin Colombia", outline: true },
              { text: "Notes of Citrus & Cocoa", outline: false },
              { text: "Barista Crafted Signature", outline: true },
              { text: "Ethically Sourced Beans", outline: false },
              { text: "Microfoam Latte Art", outline: true },
              { text: "Freshly Roasted Weekly", outline: false }
            ].flatMap((item, i) => {
              const iconIndex = i % 3;
              let iconNode;
              if (iconIndex === 0) {
                iconNode = (
                  <svg className="band-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 15px' }}>
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                  </svg>
                );
              } else if (iconIndex === 1) {
                iconNode = (
                  <svg className="band-icon" width="16" height="18" viewBox="0 0 20 28" fill="none" style={{ margin: '0 15px' }}>
                    <path d="M10,2 C14.4,2 17.6,7.6 17.6,14 C17.6,20.4 14.4,26 10,26 C5.6,26 2.4,20.4 2.4,14 C2.4,7.6 5.6,2 10,2 Z" fill="currentColor" opacity=".8"/>
                    <path d="M10,4 Q8,10 9,14 Q8,18 10,24" stroke="#12100E" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  </svg>
                );
              } else {
                iconNode = <span className="parallax-band__dot" style={{ margin: '0 20px' }}>✦</span>;
              }

              return [
                <span key={`t1-${i}`} className={item.outline ? 'outlined' : ''}>{item.text}</span>,
                <span key={`i1-${i}`}>{iconNode}</span>,
                <span key={`t2-${i}`} className={!item.outline ? 'outlined' : ''}>{item.text}</span>,
                <span key={`i2-${i}`}>{iconNode}</span>
              ];
            })}
          </div>
        </section>

        <Showcase />

        {/* ABOUT */}
        <section className="about" id="about" aria-label="Our story">
          <div className="section-bg-text" aria-hidden="true">STORY</div>
          <div className="about__grid">
            <div className="about__image-wrap">
              <div className="about__image-mask" id="aboutImageMask">
                <video 
                  autoPlay={tier !== 'low'} 
                  loop 
                  muted 
                  playsInline 
                  preload="none"
                  poster="/img/video_poster.jpg"
                  src="/interior.mp4" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div className="about__image-deco" aria-hidden="true"></div>
              <div className="about__image-stat" aria-hidden="true">
                <span className="about__image-stat-num">2019</span>
                <span className="about__image-stat-label">Est. Piplod, Surat</span>
              </div>
            </div>

            <div className="about__content" id="aboutContent">
              <p className="about__eyebrow">Our Philosophy</p>
              <h2 className="about__title">A space designed<br />to make you stay</h2>
              <p className="about__text">
                Tucked within Piplod, Surat, The Flat White Coffee House began as a simple conviction — transform an existing bungalow into a space where great coffee and honest architecture could coexist. The monochrome palette was a deliberate choice: to let the coffee, the food, the people, and the light do all the talking.
              </p>
              <a href="#contact" className="btn btn--outline btn--magnetic">
                Visit Us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </a>
              <div className="about__features">
                {[
                  { icon: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>, title: 'Expert Barista', sub: 'Championship-trained' },
                  { icon: <><path d="M17 8l4 4-4 4"/><path d="M3 12h18"/><path d="M3 6h8"/><path d="M3 18h8"/></>, title: 'Garden Terrace', sub: 'Open-air seating' },
                  { icon: <><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M20 2v6h-6"/></>, title: 'Bakery Upstairs', sub: 'Freshly baked daily' },
                ].map((f, i) => (
                  <div key={i} className="about__feature" id={`feature${i+1}`}>
                    <div className="about__feature-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{f.icon}</svg>
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECRET SAUCE */}
        <section className="secret-sauce" id="secretSauce" aria-label="Our secret sauce">
          <div className="secret-sauce__bg-text" aria-hidden="true">SECRET</div>
          <div className="secret-sauce__inner">
            <div className="secret-sauce__cup" id="sauceCup">
              <video 
                autoPlay={tier !== 'low'} 
                loop 
                muted 
                playsInline 
                preload="none"
                poster="/img/video_poster.jpg"
                src="/reference.mp4" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div className="secret-sauce__label">Secret Sauce ✦</div>
            </div>
            <div className="secret-sauce__content">
              <p className="secret-sauce__eyebrow">What makes us different</p>
              <h2 className="secret-sauce__title">Premium Beans,<br />Freshly Ground<br /><em>Every Morning</em></h2>
              <p className="secret-sauce__text">Single-origin, ethically sourced. Ground fresh each morning. Pulled at precise pressure. Served with care and craft.</p>
              <div className="secret-sauce__stats">
                <div className="secret-sauce__stat">
                  <span className="secret-sauce__stat-num">9</span>
                  <span className="secret-sauce__stat-label">Bar Pressure</span>
                </div>
                <div className="secret-sauce__stat">
                  <span className="secret-sauce__stat-num">93°</span>
                  <span className="secret-sauce__stat-label">Brew Temp</span>
                </div>
                <div className="secret-sauce__stat">
                  <span className="secret-sauce__stat-num">25s</span>
                  <span className="secret-sauce__stat-label">Pull Time</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUIZ */}
        <Quiz />

        {/* GALLERY */}
        <Gallery />

        {/* MENU */}
        <section className="menu" id="menu" aria-label="Our specialties menu">
          <div className="section-bg-text" aria-hidden="true">MENU</div>
          <div className="menu__header">
            <p className="section__eyebrow">Our Specialties</p>
            <h2 className="section__title">Crafted for the<br /><em>curious palate</em></h2>
          </div>
          <div className="menu__grid" id="menuGrid">
            {[
              { name: 'The Flat White', price: '₹220', tag: 'Coffee',       img: '1572442388796-11668a67e53d', desc: 'Double ristretto, silky microfoam — our namesake and signature.' },
              { name: 'Orange Mocha',   price: '₹280', tag: 'House Special', img: '1578314675249-a6910f80cc4e', desc: 'House specialty. Citrus meets dark chocolate in perfect harmony.', special: true },
              { name: 'Single Origin',  price: '₹180', tag: 'Pour Over',    img: '1554118811-1e0d58224f24', desc: 'Seasonal roast, fruity finish. Sourced from a single ethical farm.' },
              { name: 'Cold Brew',      price: '₹260', tag: 'Cold',         img: '1461023058943-07fcbe16d735', desc: '18-hour slow steep. Smooth, low-acid, naturally sweet.' },
              { name: 'Butter Croissant', price: '₹180', tag: 'Bakery',    img: '1442512595331-e89e73853f31', desc: 'Freshly baked daily. Layers of flaky, buttery perfection.' },
              { name: 'Tiramisu',       price: '₹260', tag: 'Dessert',      img: '1571877227200-a0d98ea607e9', desc: 'House recipe. Espresso-soaked layers with mascarpone cream.' },
            ].map((item, i) => (
              <article key={i} className="menu-card" tabIndex="0" aria-label={`${item.name} — ${item.price}`}>
                <div className="menu-card__image">
                  <img src={`https://images.unsplash.com/photo-${item.img}?w=420&h=420&fit=crop&q=80&auto=format`} alt={item.name} loading="lazy" width="420" height="420" />
                  <div className="menu-card__overlay" aria-hidden="true"></div>
                </div>
                <div className="menu-card__body">
                  <div className={`menu-card__tag${item.special ? ' menu-card__tag--hot' : ''}`}>{item.tag}</div>
                  <h3 className="menu-card__name">{item.name}</h3>
                  <p className="menu-card__desc">{item.desc}</p>
                  <div className="menu-card__footer">
                    <span className="menu-card__price">{item.price}</span>
                    <button className="menu-card__btn" aria-label={`View ${item.name}`} type="button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section className="reviews" id="reviews" aria-label="Customer testimonials">
          <div className="section-bg-text reviews__bg-text" aria-hidden="true">LOVE</div>
          <div className="reviews__header">
            <p className="section__eyebrow">Testimonials</p>
            <h2 className="section__title">What people<br /><em>are saying</em></h2>
          </div>
          <div className="reviews__deco" aria-hidden="true">"</div>
          <div className="reviews__carousel" id="reviewsCarousel">
            <div className="reviews__track" id="reviewsTrack">
              {[
                { name: 'Darshan Thumar', text: 'Just entering this beautiful cafe gives the aroma of amazing coffee. The outdoor garden is just wonderful — I could sit there all day. Every cup is crafted with so much love.', src: 'Zomato', bg: '2C1810' },
                { name: 'Verified Customer', text: 'He takes you on an experience to broaden your coffee knowledge, exposing you to flavours you might not have expected. A magical, transportive place in the heart of Piplod.', src: 'Google', bg: '6B3E2E' },
                { name: 'Food Enthusiast', text: 'Commitment to quality, sustainability, and excellent service makes this place truly stand out in Surat. The Orange Mocha is absolutely unmissable — nothing else comes close.', src: 'Zomato', bg: 'A67B5B' },
              ].map((r, i) => (
                <div key={i} className="review-card" role="group" aria-label={`Review ${i+1} of 3 — ${r.name}`}>
                  <div className="review-card__stars" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="star" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <p className="review-card__text">"{r.text}"</p>
                  <div className="review-card__author">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=${r.bg}&color=F5E6D3&size=100&font-size=0.4`} alt={r.name} width="54" height="54" loading="lazy" />
                    <div><h4>{r.name}</h4><span>⭐ {r.src} Review</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="reviews__nav" role="group" aria-label="Review carousel navigation">
              <button className="reviews__btn btn--magnetic" id="reviewsPrev" aria-label="Previous review" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div className="reviews__dots" role="tablist">
                {[0,1,2].map(i => (
                  <button key={i} className={`reviews__dot${i===0?' reviews__dot--active':''}`} role="tab" aria-selected={i===0?'true':'false'} aria-label={`Review ${i+1}`} data-index={i} type="button"></button>
                ))}
              </div>
              <button className="reviews__btn btn--magnetic" id="reviewsNext" aria-label="Next review" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </section>

        <FaqAccordion />

        {/* CONTACT */}
        <section className="contact" id="contact" aria-label="Visit us and get in touch">
          <div className="section-bg-text" aria-hidden="true">VISIT</div>
          <div className="contact__header">
            <p className="section__eyebrow">Get In Touch</p>
            <h2 className="section__title">Visit Us &amp;<br /><em>Say Hello</em></h2>
          </div>
          <div className="contact__grid">
            <form className="contact__form" id="contactForm" noValidate aria-label="Send us a message" onSubmit={(e) => e.preventDefault()}>
              {[
                { id: 'fname',   type: 'text',  label: 'Your Name',      auto: 'name' },
                { id: 'femail',  type: 'email', label: 'Email Address',   auto: 'email' },
              ].map(f => (
                <div key={f.id} className="form-group">
                  <input type={f.type} id={f.id} name={f.id} required placeholder=" " autoComplete={f.auto} aria-required="true" />
                  <label htmlFor={f.id}>{f.label}</label>
                  <span className="form-group__line" aria-hidden="true"></span>
                </div>
              ))}
              <div className="form-group">
                <textarea id="fmessage" name="message" rows="4" placeholder=" "></textarea>
                <label htmlFor="fmessage">Your Message</label>
                <span className="form-group__line" aria-hidden="true"></span>
              </div>
              <button type="submit" className="btn btn--primary btn--magnetic btn--submit">
                <span className="btn__text">Send Message</span>
              </button>
            </form>

            <div className="contact__info">
              <div className="contact__info-block">
                <div className="contact__info-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>8, Dimple Row House, Gymkhana Rd,<br />Piplod, Surat, Gujarat 395007</p>
                </div>
              </div>
              <div className="contact__info-block">
                <div className="contact__info-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <h4>Hours</h4>
                  <p>Daily: 10:00 AM – 10:00 PM</p>
                </div>
              </div>
              <div className="contact__info-block">
                <div className="contact__info-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.35 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l1.12-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
                </div>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:+918799370091">+91 87993 70091</a>
                </div>
              </div>
              
              <div className="contact__map-wrap">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.7811028222127!2d72.7680231752603!3d21.161107880521513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d3ac3010b5b%3A0xd6fb3a56d4ec87f6!2sThe%20Flat%20White%20Coffee%20House!5e0!3m2!1sen!2sin!4v1781635683133!5m2!1sen!2sin" 
                  width="100%" 
                  height="220" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contact__map"
                  title="The Flat White Coffee House Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
