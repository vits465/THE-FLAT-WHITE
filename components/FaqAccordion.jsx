"use client";

import { useState } from 'react';

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: "What is your exact location and how do I find you?",
      answer: "We are situated at 8, Dimple Row House, Gymkhana Road, Piplod, Surat, Gujarat. We transformed a residential bungalow into a peaceful, white-washed coffee sanctuary. Look for our green foliage and our signature round signboard hanging at the entrance."
    },
    {
      question: "What are your opening hours?",
      answer: "We are open daily from 10:00 AM to 10:00 PM, seven days a week. Whether you need a morning pick-me-up or a late-night dessert paired with espresso, our baristas are ready to welcome you."
    },
    {
      question: "What makes a Flat White different from a Latte?",
      answer: "Our signature Flat White is crafted with a double shot of sweet ristretto and topped with thin, silky microfoam. It offers a stronger coffee flavor and smoother texture compared to a standard latte, which has a thicker layer of foam and a higher ratio of milk."
    },
    {
      question: "Do you have space for working or studying?",
      answer: "Yes, we designed our space to be work and study-friendly. We offer high-speed Wi-Fi, accessible power outlets at our main tables, and a serene, quiet atmosphere that lets you focus while enjoying the fresh aroma of roasting beans."
    },
    {
      question: "Do you offer vegan options and fresh bakery items?",
      answer: "Definitely. We provide high-quality oat and almond milk as alternatives for all our specialty drinks. In addition, we have an upstairs bakery that prepares fresh pastries daily, including flaky croissants, cheesecakes, and our highly recommended house Tiramisu."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq" aria-label="Frequently Asked Questions">
      <div className="section-bg-text" aria-hidden="true">FAQ</div>
      
      <div className="faq__inner">
        <div className="faq__header">
          <span className="section__eyebrow">Common Queries</span>
          <h2 className="section__title">Any Questions?<br /><em>We have answers</em></h2>
        </div>

        <div className="faq__accordion">
          {faqItems.map((item, i) => {
            const isOpen = activeIndex === i;
            return (
              <div 
                key={i} 
                className={`accordion-item${isOpen ? ' accordion-item--active' : ''}`}
              >
                <button
                  className="accordion-item__trigger"
                  onClick={() => toggleAccordion(i)}
                  aria-expanded={isOpen ? "true" : "false"}
                  aria-controls={`faq-content-${i}`}
                  id={`faq-trigger-${i}`}
                  type="button"
                >
                  <span className="accordion-item__num">0{i + 1}</span>
                  <span className="accordion-item__question">{item.question}</span>
                  <span className="accordion-item__icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                <div
                  className="accordion-item__content"
                  id={`faq-content-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  style={{
                    maxHeight: isOpen ? '200px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden'
                  }}
                >
                  <p className="accordion-item__answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
