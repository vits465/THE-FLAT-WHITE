"use client";
import { ReactLenis } from 'lenis/react';
import { useDeviceTier } from './hooks/useDeviceTier';

export default function SmoothScroll({ children }) {
  const tier = useDeviceTier();

  if (tier === 'low') {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: true }}>
      {children}
    </ReactLenis>
  );
}
