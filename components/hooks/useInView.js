"use client";
import { useEffect, useRef, useState } from "react";
export function useInView(rootMargin = "200px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setInView(true), io.disconnect()),
      { rootMargin }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}
