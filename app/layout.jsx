import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'The Flat White — Artisan Coffee House, Piplod Surat',
  description: 'Tucked in Piplod, Surat — crafted with intention. Come for the coffee. Stay for the feeling.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
