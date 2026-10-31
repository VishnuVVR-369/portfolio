"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/lib/projects";

type Tour = NonNullable<ProjectMedia["tour"]>;

// Narrated product tour. Until someone presses play, it is just a poster
// and a button: the 13 MB video isn't requested at all. Chapters sit in
// a rail beside the screen and seek the video, starting it if needed.
export function TourPlayer({
  tour,
  poster,
  posterAvif,
  name,
}: {
  tour: Tour;
  poster: string;
  posterAvif: string;
  name: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const activeChapter = tour.chapters.reduce(
    (active, chapter, i) => (time >= chapter.at ? i : active),
    0,
  );

  const playFrom = useCallback(
    (at: number) => {
      const video = videoRef.current;
      if (!started || !video) {
        pendingSeek.current = at;
        setStarted(true);
        return;
      }
      video.currentTime = at;
      setTime(at);
      video.play().catch(() => {});
    },
    [started],
  );

  // Once the video element mounts, apply a chapter picked from the poster.
  useEffect(() => {
    const video = videoRef.current;
    if (!started || !video) return;
    const at = pendingSeek.current;
    pendingSeek.current = null;
    if (at) {
      video.currentTime = at;
      setTime(at);
    }
    video.play().catch(() => {});
  }, [started]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:gap-5">
      {/* Screen */}
      <div
        className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas-deep)]"
        style={{
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.045), 0 24px 60px -32px rgba(0,0,0,0.8)",
        }}
      >
        <div className="flex items-center justify-between gap-3 whitespace-nowrap border-b border-[var(--color-border)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
          <span className="inline-flex min-w-0 items-center gap-2">
            {/* Tally light: red while the tour is on air */}
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full transition-colors"
              style={{
                background: playing
                  ? "var(--color-danger)"
                  : "var(--color-border-strong)",
                boxShadow: playing ? "0 0 6px rgba(245,126,84,0.7)" : undefined,
              }}
            />
            tour · {name}
          </span>
          <span className="tabular">
            {formatTime(tour.durationSeconds)}
            <span className="hidden sm:inline"> · narrated · captions</span>
          </span>
        </div>

        <div className="relative aspect-video w-full">
          {started ? (
            <video
              ref={videoRef}
              src={tour.src}
              controls
              playsInline
              preload="auto"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              className="absolute inset-0 size-full bg-black object-contain"
            >
              <track
                kind="captions"
                src={tour.captions}
                srcLang="en"
                label="English"
                default
              />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => playFrom(0)}
              className="group absolute inset-0 size-full cursor-pointer text-left"
              aria-label={`Play the ${formatTime(tour.durationSeconds)} narrated tour of ${name}`}
            >
              <picture>
                <source srcSet={posterAvif} type="image/avif" />
                <img
                  src={poster}
                  alt=""
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
              </picture>
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6 md:p-8">
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)] sm:text-[11px]">
                    watch the tour
                    <span className="text-white/70 sm:hidden">
                      {" "}
                      · {formatTime(tour.durationSeconds)}
                    </span>
                  </span>
                  <span className="mt-1.5 hidden max-w-md text-pretty font-display font-medium leading-snug tracking-tight text-white sm:block sm:text-[1.5rem] md:text-[1.75rem]">
                    {formatTime(tour.durationSeconds)} of teammates doing
                    real work, start to finish.
                  </span>
                </span>
                <span
                  aria-hidden
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-canvas-deep)] shadow-[0_8px_30px_-6px_rgba(245,180,84,0.6)] transition-transform group-hover:scale-105 group-active:scale-95 sm:h-16 sm:w-16"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6"
                    fill="currentColor"
                  >
                    <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.5-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Chapter rail */}
      <nav aria-label="Tour chapters">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
          chapters
        </p>
        <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {tour.chapters.map((chapter, i) => {
            const active = started && i === activeChapter;
            return (
              <li key={chapter.at}>
                <button
                  type="button"
                  onClick={() => playFrom(chapter.at)}
                  aria-current={active ? "step" : undefined}
                  className={`grid min-h-[40px] w-full grid-cols-[2.75rem_1fr] items-baseline gap-2 rounded-md border px-3 py-2 text-left transition-colors ${
                    active
                      ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)]"
                      : "border-transparent hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tabular ${
                      active
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-subtle)]"
                    }`}
                  >
                    {formatTime(chapter.at)}
                  </span>
                  <span
                    className={`text-[14px] leading-snug ${
                      active
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {chapter.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
