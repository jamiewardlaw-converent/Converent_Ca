"use client";

import type { ServiceTile } from "../lib/serviceTiles";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

function useReveal<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  const onIntersect = useCallback((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) setVisible(true);
  }, []);

  const syncInView = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const h = window.innerHeight || 1;
    const w = window.innerWidth || 1;
    const r = el.getBoundingClientRect();
    if (r.top < h && r.bottom > 0 && r.left < w && r.right > 0) {
      setVisible(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    syncInView();
  }, [syncInView]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) onIntersect(e);
        }
      },
      { root: null, rootMargin: "0px 0px 12% 0px", threshold: 0 }
    );
    obs.observe(el);
    const raf = requestAnimationFrame(() => syncInView());
    const t0 = window.setTimeout(() => syncInView(), 0);
    const t1 = window.setTimeout(() => syncInView(), 150);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      obs.disconnect();
    };
  }, [onIntersect, syncInView]);

  return [ref, visible];
}

function PillarBlock({
  tile,
  reverse,
  className,
}: {
  tile: ServiceTile;
  reverse: boolean;
  className?: string;
}) {
  const [ref, vis] = useReveal<HTMLElement>();
  const hasVisual = Boolean(tile.logoSrc);
  const innerClass =
    "servicesPillarInner" +
    (hasVisual && reverse ? " servicesPillarInner--reverse" : "") +
    (!hasVisual ? " servicesPillarInner--textOnly" : "");

  return (
    <section
      ref={ref}
      id={tile.anchor}
      className={`section card servicesPillar ${className ?? ""} servicesReveal${
        vis ? " isVisible" : ""
      }`}
      aria-labelledby={`services-pillar-${tile.anchor}`}
    >
      <div className={innerClass}>
        {hasVisual ? (
          <div className="servicesPillarVisual">
            <div className="servicesPillarFigure">
              <img
                src={tile.logoSrc}
                alt=""
                className="servicesPillarImg"
                width={320}
                height={320}
                decoding="async"
              />
            </div>
          </div>
        ) : null}
        <div className="servicesPillarBody">
          <h2 className="servicesPillarTitle" id={`services-pillar-${tile.anchor}`}>
            {tile.title}
          </h2>
          <p className="servicesPillarExcerpt">{tile.excerpt}</p>
        </div>
      </div>
    </section>
  );
}

type ServicesPillarsProps = {
  tiles: readonly ServiceTile[];
  className?: string;
};

export default function ServicesPillars({ tiles, className }: ServicesPillarsProps) {
  return (
    <div className="servicesPillars">
      {tiles.map((tile, i) => (
        <PillarBlock
          key={tile.anchor}
          tile={tile}
          reverse={i % 2 === 1}
          className={className}
        />
      ))}
    </div>
  );
}
