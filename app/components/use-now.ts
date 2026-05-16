"use client";

import { useSyncExternalStore } from "react";

const FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

type Listener = () => void;

const listeners = new Set<Listener>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let current = "";

function format(): string {
  return FORMATTER.format(new Date()) + " ist";
}

function ensureStarted() {
  if (intervalId !== null) return;
  current = format();
  intervalId = setInterval(() => {
    current = format();
    for (const fn of listeners) fn();
  }, 30_000);
}

function subscribe(listener: Listener): () => void {
  ensureStarted();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot(): string {
  return current;
}

function getServerSnapshot(): string {
  return "";
}

export function useNow(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
