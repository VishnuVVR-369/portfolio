"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/lib/projects";

// A silent, seamless product loop. The poster renders on the server so
// the card never flashes empty; the video fades in over it once it is
// actually playing. It plays only while on screen, and never for people
// who ask for reduced motion or less data, who keep the still poster.
export function LoopVideo({
  loop,
  alt,
}: {
  loop: ProjectMedia["loop"];
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const still = usePrefersStill();
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || still) return;
    // React doesn't reliably reflect `muted` as an attribute, and
    // browsers only allow muted autoplay, so set the property directly.
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [still]);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-canvas-deep)]">
      <picture>
        <source srcSet={loop.posterAvif} type="image/avif" />
        <img
          src={loop.poster}
          alt={alt}
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      {!still && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setShowing(true)}
          className="absolute inset-0 size-full object-cover transition-opacity duration-500"
          style={{ opacity: showing ? 1 : 0 }}
        >
          <source src={loop.av1} type='video/mp4; codecs="av01.0.08M.08"' />
          <source src={loop.h264} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function usePrefersStill() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    const update = () => setStill(query.matches || Boolean(saveData));
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return still;
}
