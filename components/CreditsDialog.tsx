"use client";

import { useCallback, useEffect, useRef } from "react";
import CreditsList from "./CreditsList";

export default function CreditsDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onPointerDown = (e: PointerEvent) => {
      if (e.target === el) close();
    };
    el.addEventListener("pointerdown", onPointerDown);
    return () => el.removeEventListener("pointerdown", onPointerDown);
  }, [close]);

  return (
    <>
      <button
        type="button"
        className="footerCreditsLink"
        onClick={open}
        title="Vecteezy, Wikimedia Commons, and other image credits (e.g. medical & aerospace tiles)"
      >
        Image credits
      </button>
      <dialog ref={dialogRef} className="creditsDialog" aria-labelledby="credits-dialog-title">
        <div className="creditsDialogSurface">
          <header className="creditsDialogHeader">
            <h2 id="credits-dialog-title" className="creditsDialogTitle">
              Image credits
            </h2>
            <button type="button" className="creditsDialogClose" onClick={close} aria-label="Close credits">
              ×
            </button>
          </header>
          <div className="creditsDialogBody">
            <CreditsList />
            <p className="creditsDialogPageHint">
              <a href="/credits/" className="creditsDialogPageLink">
                Open full credits page
              </a>{" "}
              for the same list in a normal page (bookmarking, printing, screen readers).
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
