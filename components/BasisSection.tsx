"use client";

import { BASIS_SCREENSHOT_PREFIX } from "../lib/basisConstants";
import { BASIS_FEATURES } from "../lib/basisFeatures";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

type BasisSectionProps = {
  imageSrcs: string[];
  tagline: string;
};

function useReveal<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  const onIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setVisible(true);
      }
    },
    []
  );

  /** Browsers do not always emit an initial IntersectionObserver event; in-view = invisible UI without this. */
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
    const inView = r.top < h && r.bottom > 0 && r.left < w && r.right > 0;
    if (inView) {
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
      { root: null, rootMargin: "0px 0px 15% 0px", threshold: 0 }
    );
    obs.observe(el);
    const raf = requestAnimationFrame(() => syncInView());
    const late0 = window.setTimeout(() => syncInView(), 0);
    const late150 = window.setTimeout(() => syncInView(), 150);
    const late400 = window.setTimeout(() => syncInView(), 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(late0);
      window.clearTimeout(late150);
      window.clearTimeout(late400);
      obs.disconnect();
    };
  }, [onIntersect, syncInView]);

  return [ref, visible];
}

function useBasisReveal() {
  return useReveal<HTMLDivElement>();
}

function useBasisFeatureReveal() {
  return useReveal<HTMLLIElement>();
}

export default function BasisSection({
  imageSrcs,
  tagline,
}: BasisSectionProps) {
  const [headerRef, headerVis] = useBasisReveal();
  const [emptyRef, emptyVis] = useBasisReveal();

  return (
    <div className="basisLayout">
      <div
        ref={headerRef}
        className={`basisIntro basisReveal${headerVis ? " isVisible" : ""}`}
        style={{ transitionDelay: "0ms" }}
      >
        <div className="eyebrow">In development</div>
        <h2 className="basisTitle" id="basis-heading">
          BASIS
        </h2>
        <p className="basisTagline">{tagline}</p>
        <p className="basisBlurb">
          BASIS is an emerging workspace for systems and functional safety
          engineering designed to support end-to-end safety case capture with
          minimal ceremony and strong traceability. Built on decades of hands-on
          engineering experience, BASIS combines proven workflows with a modern,
          AI-ready architecture. The platform is currently in early-stage development
          and is open to partnership with organizations, universities, and research
          institutions. If you work at the intersection of systems engineering,
          functional safety, and innovation, you can help shape what comes next by
          joining the journey to build this tool together.
        </p>
        <a href="/contact" className="learnMoreButton basisContactCta">
          Learn more
        </a>
      </div>

      <div className="basisRightCol">
        {imageSrcs.length === 0 ? (
          <div
            ref={emptyRef}
            className={`basisEmpty basisReveal${emptyVis ? " isVisible" : ""}`}
            style={{ transitionDelay: "90ms" }}
          >
            <div className="basisEmptyFrame" aria-hidden>
              <div className="basisEmptyChrome" />
              <div className="basisEmptyBody" />
            </div>
            <p className="basisEmptyNote">
              Product screenshots will appear here when added to{" "}
              <code>public/brand</code> with names starting{" "}
              <code>{BASIS_SCREENSHOT_PREFIX}</code>
            </p>
          </div>
        ) : (
          <div className="basisGallery">
            {imageSrcs.map((src, i) => (
              <BasisFigure
                key={src}
                src={src}
                index={i}
                label={`BASIS interface preview ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div
          className="basisFeatures"
          aria-labelledby="basis-features-heading"
        >
          <h3 className="eyebrow" id="basis-features-heading">
            Features
          </h3>
          <ul className="basisFeatureList" role="list">
            {BASIS_FEATURES.map((text, i) => (
              <BasisFeatureItem key={text} text={text} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BasisFeatureItem({ text, index }: { text: string; index: number }) {
  const [ref, vis] = useBasisFeatureReveal();
  const delay = 80 + index * 60;
  return (
    <li
      ref={ref}
      className={`basisFeatureItem basisReveal${vis ? " isVisible" : ""}`}
      style={{ transitionDelay: `${Math.min(delay, 500)}ms` }}
    >
      {text}
    </li>
  );
}

function BasisFigure({
  src,
  index,
  label,
}: {
  src: string;
  index: number;
  label: string;
}) {
  const [ref, vis] = useBasisReveal();
  const delay = 70 + index * 55;
  return (
    <div
      ref={ref}
      className={`basisFigure basisReveal${vis ? " isVisible" : ""}`}
      style={{ transitionDelay: `${Math.min(delay, 420)}ms` }}
    >
      <figure className="basisFigureBlock">
        <div className="basisFigureInner">
          <div className="basisFigureGlow" aria-hidden />
          <Image
            src={src}
            alt={label}
            width={1280}
            height={800}
            sizes="(max-width: 1024px) 92vw, 896px"
            className="basisFigureImg"
            priority={index < 1}
          />
        </div>
      </figure>
    </div>
  );
}
