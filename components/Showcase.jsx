import ShowcaseModel from './canvas/ShowcaseModel';

export default function Showcase() {
  const items = [
    {
      modelUrl: '/models/catoon_coffe_draco.glb',
      scaleAdjust: 1.1,
      yOffset: -0.1,
      tag: 'Hot',
      tagAccent: false,
      name: 'Cappuccino',
      desc: 'Espresso, steamed milk, thick microfoam. A classic reimagined with precision.',
      price: '₹240',
      detail: '18g · Double shot · 6oz',
    },
    {
      modelUrl: '/models/coffee_cup_with_plate_opt.glb',
      scaleAdjust: 1.0,
      yOffset: 0,
      tag: 'Signature ✦',
      tagAccent: true,
      name: 'The Flat White',
      desc: 'Double ristretto, silky microfoam pulled to perfection. Our namesake, our pride.',
      price: '₹220',
      detail: '18g · Double ristretto · 5oz',
      featured: true,
    },
    {
      modelUrl: '/models/latte_art_opt.glb',
      scaleAdjust: 1.0,
      yOffset: 0,
      tag: 'Latte Art',
      tagAccent: false,
      name: 'Signature Latte',
      desc: 'Hand-poured latte art on every cup. Ethically sourced, locally roasted beans.',
      price: '₹260',
      detail: '18g · Single origin · 8oz',
    },
  ];

  return (
    <section className="showcase" id="showcase" aria-label="3D Coffee Showcase">
      <div className="section-bg-text" aria-hidden="true">3D</div>

      <div className="showcase__header">
        <p className="section__eyebrow">Interactive 3D</p>
        <h2 className="section__title">Every Cup,<br /><em>In Full Detail</em></h2>
        <p className="showcase__subtitle">
          Rotate, zoom &amp; explore our signature drinks in real-time 3D. Crafted with precision — now visible from every angle.
        </p>
      </div>

      <div className="showcase__grid" id="showcaseGrid">
        {items.map((item, i) => (
          <div
            key={i}
            className={`showcase-card${item.featured ? ' showcase-card--featured' : ''}`}
            aria-label={`${item.name} 3D model`}
          >
            <div className="showcase-card__viewer showcase-card__viewer--local">
              <ShowcaseModel modelUrl={item.modelUrl} scaleAdjust={item.scaleAdjust} yOffset={item.yOffset} />
              <div className="showcase-card__overlay" aria-hidden="true"></div>
            </div>
            <div className="showcase-card__body">
              <div className={`showcase-card__tag${item.tagAccent ? ' showcase-card__tag--accent' : ''}`}>
                {item.tag}
              </div>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <div className="showcase-card__meta">{item.detail}</div>
              <span className="showcase-card__price">{item.price}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="showcase__note" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Drag to rotate · Powered by WebGL
      </p>
    </section>
  );
}
