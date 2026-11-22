"use client";

import { useEffect, useRef, useState } from "react";

export const CALENDLY_URL =
  "https://calendly.com/jamiewardlaw-converent/30min";

const REVEAL_MS = 2200;

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="8" y="2" width="3.2" height="6" rx="1.4" fill="currentColor" />
      <rect x="20.8" y="2" width="3.2" height="6" rx="1.4" fill="currentColor" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 6.5h22a2.5 2.5 0 0 1 2.5 2.5v17a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 26V9A2.5 2.5 0 0 1 5 6.5zm.6 6.7h20.8V26.2H5.6V13.2z"
      />
      <rect x="7.2" y="15.2" width="4" height="4" rx="0.7" fill="currentColor" />
      <rect x="14" y="15.2" width="4" height="4" rx="0.7" fill="currentColor" />
      <rect x="20.8" y="15.2" width="4" height="4" rx="0.7" fill="currentColor" />
      <rect x="7.2" y="21.2" width="4" height="4" rx="0.7" fill="currentColor" />
      <rect x="14" y="21.2" width="4" height="4" rx="0.7" fill="currentColor" />
      <rect x="20.8" y="21.2" width="4" height="4" rx="0.7" fill="currentColor" />
    </svg>
  );
}

export default function BookCallTab() {
  const [open, setOpen] = useState(false);
  const pinned = useRef(false);
  const intro = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpen(true);
      return;
    }

    let cancelled = false;
    let startTimer = 0;
    let closeTimer = 0;

    const play = () => {
      if (cancelled) return;
      startTimer = window.setTimeout(() => {
        intro.current = true;
        setOpen(true);
        closeTimer = window.setTimeout(() => {
          intro.current = false;
          if (!pinned.current) setOpen(false);
        }, REVEAL_MS);
      }, 650);
    };

    const hero = document.querySelector(".homeHero");
    if (hero && !document.body.classList.contains("homeHeroSettled")) {
      const observer = new MutationObserver(() => {
        if (!document.body.classList.contains("homeHeroSettled")) return;
        observer.disconnect();
        play();
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => {
        cancelled = true;
        observer.disconnect();
        window.clearTimeout(startTimer);
        window.clearTimeout(closeTimer);
      };
    }

    play();
    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(closeTimer);
    };
  }, []);

  const pin = (value: boolean) => {
    pinned.current = value;
    if (value) setOpen(true);
    else if (!intro.current) setOpen(false);
  };

  return (
    <a
      className={open ? "bookCallTab isOpen" : "bookCallTab"}
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => pin(true)}
      onMouseLeave={() => pin(false)}
      onFocus={() => pin(true)}
      onBlur={() => pin(false)}
    >
      <span className="bookCallTabMark">
        <CalendarIcon className="bookCallTabIcon" />
      </span>
      <span className="bookCallTabReveal">
        <span className="bookCallTabLabel">Book a call</span>
      </span>
    </a>
  );
}
