import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'The Flat White — Artisan Coffee House, Piplod Surat',
  description: 'Tucked in Piplod, Surat — crafted with intention. Come for the coffee. Stay for the feeling.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/models/base_coffee_cup_draco.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/moka_pot_draco.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/canarian_cafe_-_coffee_machine_draco.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/coffee_maker_low_poly_draco.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/catoon_coffe_draco.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
