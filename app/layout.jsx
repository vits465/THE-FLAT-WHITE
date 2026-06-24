import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import ReactDOM from 'react-dom';

export const metadata = {
  title: 'The Flat White — Artisan Coffee House, Piplod Surat',
  description: 'Tucked in Piplod, Surat — crafted with intention. Come for the coffee. Stay for the feeling.',
};

export default function RootLayout({ children }) {
  ReactDOM.preload('/models/base_coffee_cup_draco.glb', { as: 'fetch', crossOrigin: 'anonymous' });

  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
