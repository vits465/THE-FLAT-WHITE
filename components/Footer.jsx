// Footer.jsx
export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        
        <div className="footer__content">
          <div className="footer__brand-col">
            <div className="footer__brand">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              <span>The Flat White</span>
            </div>
            <p className="footer__tagline">Coffee as it was meant to be — simple, perfect, warm.</p>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__heading">Navigation</h4>
            <nav className="footer__links" aria-label="Footer navigation">
              {['#home:Home','#about:Story','#showcase:3D','#menu:Menu','#reviews:Reviews','#contact:Visit'].map(s => {
                const [href, label] = s.split(':');
                return <a key={href} href={href} className="btn--magnetic">{label}</a>;
              })}
            </nav>
          </div>

          <div className="footer__social-col">
            <h4 className="footer__heading">Social</h4>
            <a
              href="https://www.instagram.com/theflatwhite_coffeehouse"
              target="_blank" rel="noopener noreferrer"
              className="footer__instagram btn--magnetic"
              aria-label="Follow on Instagram"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="footer__huge-text" aria-hidden="true">
          THE FLAT WHITE
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {new Date().getFullYear()} The Flat White Coffee House.</p>
          <p className="footer__copy">Piplod, Surat, Gujarat.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
