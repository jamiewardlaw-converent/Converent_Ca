"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Perspective } from "../lib/perspectiveTypes";

type FeaturedPerspectivesCarouselProps = {
  perspectives: Perspective[];
};

function pageWidth(clip: HTMLDivElement) {
  const w = clip.getBoundingClientRect().width;
  return w > 0 ? w : clip.clientWidth;
}

export default function FeaturedPerspectivesCarousel({
  perspectives,
}: FeaturedPerspectivesCarouselProps) {
  const slides = useMemo(() => {
    const chunks: Perspective[][] = [];
    for (let i = 0; i < perspectives.length; i += 2) {
      chunks.push(perspectives.slice(i, i + 2));
    }
    return chunks;
  }, [perspectives]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);
  const pauseAutoRef = useRef(false);

  const syncActiveFromScroll = useCallback(() => {
    const clip = clipRef.current;
    if (!clip || slides.length === 0) return;
    const w = pageWidth(clip);
    if (w < 1) return;
    const idx = Math.min(
      slides.length - 1,
      Math.max(0, Math.round(clip.scrollLeft / w)),
    );
    if (idx !== activeSlideRef.current) {
      activeSlideRef.current = idx;
      setActiveSlide(idx);
    }
  }, [slides.length]);

  const goToSlide = useCallback(
    (idx: number) => {
      const clip = clipRef.current;
      if (!clip || slides.length === 0) return;
      const w = pageWidth(clip);
      if (w < 1) return;
      const clamped = Math.max(0, Math.min(slides.length - 1, idx));
      const left = clamped * w;
      // `auto` avoids smooth-scroll + scroll-snap fighting each other (common dot no-op).
      clip.scrollTo({ left, behavior: "auto" });
      activeSlideRef.current = clamped;
      setActiveSlide(clamped);
    },
    [slides.length],
  );

  useLayoutEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;
    syncActiveFromScroll();
    clip.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    return () => {
      clip.removeEventListener("scroll", syncActiveFromScroll);
    };
  }, [slides.length, syncActiveFromScroll]);

  useLayoutEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;
    const ro = new ResizeObserver(() => syncActiveFromScroll());
    ro.observe(clip);
    return () => ro.disconnect();
  }, [syncActiveFromScroll]);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const wrap = wrapRef.current;
    const pause = () => {
      pauseAutoRef.current = true;
    };
    const resume = () => {
      pauseAutoRef.current = false;
    };

    const onFocusOut = (e: FocusEvent) => {
      const t = e.relatedTarget as Node | null;
      if (!wrap?.contains(t)) resume();
    };

    wrap?.addEventListener("mouseenter", pause);
    wrap?.addEventListener("mouseleave", resume);
    wrap?.addEventListener("focusin", pause);
    wrap?.addEventListener("focusout", onFocusOut);

    const id = window.setInterval(() => {
      if (pauseAutoRef.current || document.hidden) return;
      const next = (activeSlideRef.current + 1) % slides.length;
      goToSlide(next);
    }, 5000);

    return () => {
      window.clearInterval(id);
      wrap?.removeEventListener("mouseenter", pause);
      wrap?.removeEventListener("mouseleave", resume);
      wrap?.removeEventListener("focusin", pause);
      wrap?.removeEventListener("focusout", onFocusOut);
    };
  }, [slides.length, goToSlide]);

  return (
    <div ref={wrapRef} className="perspectivesCarouselWrap">
      <div
        ref={clipRef}
        className="perspectivesCarouselClip"
        tabIndex={0}
        aria-label="Featured perspectives carousel"
      >
        {slides.map((slide, idx) => (
          <div key={`slide-${idx}`} className="perspectivesSlide">
            <div className="perspectivesSlideGrid" role="list">
              {slide.map((item) => (
                <a
                  key={item.slug}
                  href={`/perspectives/${item.slug}`}
                  className="perspectiveTile card"
                  role="listitem"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="perspectiveTileImage"
                  />
                  <div className="eyebrow">Perspective</div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span className="tileCta">Read full perspective →</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="perspectivesDots" aria-label="Carousel pages">
          {slides.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              type="button"
              aria-label={`Go to slide ${idx + 1} of ${slides.length}`}
              aria-current={activeSlide === idx ? "true" : undefined}
              className={`perspectiveDot ${activeSlide === idx ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
