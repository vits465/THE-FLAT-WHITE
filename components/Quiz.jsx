"use client";

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const QUESTIONS = [
  {
    question: "How do you usually start your morning?",
    options: [
      { label: "Need an immediate wake-up call", points: { intense: 2, sweet: 0, cold: 0 } },
      { label: "Slow and relaxed", points: { intense: 0, sweet: 1, cold: 0 } },
      { label: "On the go, feeling the heat", points: { intense: 1, sweet: 0, cold: 2 } },
    ]
  },
  {
    question: "What's your ideal flavor profile?",
    options: [
      { label: "Dark, bold, and robust", points: { intense: 2, sweet: 0, cold: 0 } },
      { label: "Citrusy with a hint of chocolate", points: { intense: 1, sweet: 1, cold: 0 } },
      { label: "Sweet and creamy", points: { intense: 0, sweet: 2, cold: 1 } },
    ]
  },
  {
    question: "What's the temperature outside?",
    options: [
      { label: "Freezing", points: { intense: 1, sweet: 1, cold: 0 } },
      { label: "Perfect breeze", points: { intense: 1, sweet: 0, cold: 0 } },
      { label: "Scorching hot", points: { intense: 0, sweet: 1, cold: 2 } },
    ]
  }
];

const RESULTS = [
  {
    name: "The Flat White",
    desc: "Our signature double ristretto with velvety microfoam. Perfect for a bold, balanced morning.",
    condition: (scores) => scores.intense >= 3 && scores.cold < 2
  },
  {
    name: "Orange Mocha",
    desc: "Citrus meets dark chocolate. The ideal choice for a sweet, sophisticated palate.",
    condition: (scores) => scores.sweet >= 3
  },
  {
    name: "Cold Brew",
    desc: "18-hour slow steep. Smooth, refreshing, and perfect for beating the heat.",
    condition: (scores) => scores.cold >= 2
  },
  {
    name: "Single Origin Pour Over",
    desc: "Clean, fruity, and highly caffeinated for the true coffee purist.",
    condition: (scores) => true // fallback
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ intense: 0, sweet: 0, cold: 0 });
  const [result, setResult] = useState(null);
  
  const contentRef = useRef(null);

  const handleOption = (points) => {
    // Animate out
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        const newScores = {
          intense: scores.intense + points.intense,
          sweet: scores.sweet + points.sweet,
          cold: scores.cold + points.cold
        };
        setScores(newScores);

        if (currentStep < QUESTIONS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Calculate result
          const finalResult = RESULTS.find(r => r.condition(newScores));
          setResult(finalResult);
        }
        
        // Animate in
        gsap.fromTo(contentRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    });
  };

  const resetQuiz = () => {
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setCurrentStep(0);
        setScores({ intense: 0, sweet: 0, cold: 0 });
        setResult(null);
        gsap.fromTo(contentRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    });
  };

  return (
    <section className="quiz-section" style={{ padding: '8rem 0', backgroundColor: 'var(--bg-muted)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p className="section__eyebrow" style={{ marginBottom: '1rem' }}>The Concierge</p>
        <h2 className="section__title" style={{ marginBottom: '4rem' }}>Find Your <em>Perfect Brew</em></h2>
        
        <div 
          ref={contentRef}
          style={{ 
            backgroundColor: 'var(--bg)', 
            padding: '4rem 2rem', 
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {!result ? (
            <>
              <span style={{ color: 'var(--accent)', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>
                QUESTION {currentStep + 1} OF {QUESTIONS.length}
              </span>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem', color: 'var(--text)' }}>
                {QUESTIONS[currentStep].question}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                {QUESTIONS[currentStep].options.map((opt, i) => (
                  <button 
                    key={i} 
                    className="btn btn--outline btn--magnetic" 
                    style={{ width: '100%', maxWidth: '400px' }}
                    onClick={() => handleOption(opt.points)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--accent)', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>
                YOUR MATCH
              </span>
              <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text)' }}>
                {result.name}
              </h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
                {result.desc}
              </p>
              <button className="btn btn--primary btn--magnetic" onClick={resetQuiz} style={{ margin: '0 auto' }}>
                Retake Quiz
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
