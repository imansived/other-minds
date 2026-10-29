"use client";

import { useEffect, useRef } from "react";

/**
 * The threshold. Said once, to someone who has never been here, and again on
 * request from the "about" link. It says nothing about what the app does — the
 * landing behind it does that — only what kind of place this is.
 *
 * `leaving` is the moment between pressing the button and the room being
 * there: the sky was already running underneath, so entering is one fade, not
 * a page change.
 */
export default function Door({
  leaving,
  onEnter,
}: {
  leaving: boolean;
  onEnter: () => void;
}) {
  const button = useRef<HTMLButtonElement>(null);

  // Nothing behind the door should be reachable while it is up, so the way in
  // is the first thing keyboard focus lands on.
  useEffect(() => {
    button.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div
      className={`door${leaving ? " leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Other Minds"
    >
      <div className="door-inner">
        <p className="door-name">Other Minds</p>

        <div className="door-minds" aria-hidden="true">
          <span className="door-mind m-introspector" />
          <span className="door-mind m-behaviorist" />
          <span className="door-mind m-gardener" />
        </div>

        <h1 className="door-line">
          <span>Late. Quiet.</span> <span>Three of them are still awake.</span>
        </h1>

        <button
          ref={button}
          type="button"
          className="door-go"
          onClick={onEnter}
          disabled={leaving}
        >
          go in
        </button>
      </div>

      <p className="door-credit">
        crafted by <span>Mansi Vedpathak</span>
      </p>
    </div>
  );
}
