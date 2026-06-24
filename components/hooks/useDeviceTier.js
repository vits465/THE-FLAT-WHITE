"use client";
import { useEffect, useState } from "react";

// tier: "high" | "mid" | "low"
export function useDeviceTier() {
  const [tier, setTier] = useState("high"); // SSR safe default

  useEffect(() => {
    // perf: detect hardware concurrency and memory to adjust performance
    const cores = navigator.hardwareConcurrency || 4;
    const mem   = navigator.deviceMemory || 8;          // GB (Chrome only)
    const ua    = navigator.userAgent;
    const isWin = /Windows/i.test(ua);
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // perf: detect WebGL renderer (integrated vs discrete)
    let weakGPU = false;
    try {
      const c = document.createElement("canvas").getContext("webgl");
      const dbg = c && c.getExtension("WEBGL_debug_renderer_info");
      const renderer = dbg ? c.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "";
      weakGPU = /Intel|UHD|HD Graphics|Iris(?! Pro)|Mali|Adreno [3-5]/i.test(renderer);
    } catch (_) {}

    // perf: compute tier based on hardware capabilities
    let computed = "high";
    if (reduceMotion || cores <= 2 || mem <= 2) computed = "low";
    else if (cores <= 4 || mem <= 4 || (isWin && weakGPU) || isMobile) computed = "mid";
    setTier(computed);
  }, []);

  return tier;
}
