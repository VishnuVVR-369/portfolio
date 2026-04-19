"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Lightweight CSS-driven reveal. Uses [data-reveal] in globals.css.
// Single IntersectionObserver per page is plenty.

let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === "undefined") return null;
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          sharedObserver?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  return sharedObserver;
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = getObserver();
    if (!obs) {
      node.classList.add("is-visible");
      return;
    }
    obs.observe(node);
    return () => obs.unobserve(node);
  }, []);

  // Cast tag to a generic constructor — this lets us render any tag with the ref.
  const Component = Tag as unknown as "div";
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      data-reveal
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
