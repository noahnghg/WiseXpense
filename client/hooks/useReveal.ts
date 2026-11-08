"use client";

import { useEffect } from "react";

/**
 * Fades + lifts every [data-reveal] element into place as it scrolls into
 * view. Elements start hidden via the .reveal-hidden utility, so nothing
 * flashes before the observer attaches; if IntersectionObserver is missing
 * we clear the class immediately rather than leaving content invisible.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (nodes.length === 0) return;

    const show = (el: HTMLElement) => el.classList.remove("reveal-hidden");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
