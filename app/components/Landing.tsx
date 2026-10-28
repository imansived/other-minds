"use client";

import { useEffect, useState } from "react";
import { AGENTS, type AgentId } from "@/app/lib/agents";
import { pickStarters } from "@/app/lib/starters";
import { AGENT_BLURB, agentVars } from "./agent-theme";
import Avatar from "./Avatar";
import Composer from "./Composer";

// Each card enters with its agent's own signature motion, so the personalities
// are legible before a single word is spoken.
const ENTRANCE: Record<AgentId, string> = {
  introspector: "enter-introspector",
  behaviorist: "enter-behaviorist",
  gardener: "enter-gardener",
};

export default function Landing({
  agentIds,
  input,
  onInputChange,
  onSubmit,
  busy,
}: {
  agentIds: AgentId[];
  input: string;
  onInputChange: (v: string) => void;
  onSubmit: () => void;
  busy: boolean;
}) {
  // Null until the page has loaded in the browser. Choosing at random during
  // the first render would give the server and the browser two different
  // answers, and React would throw the server's markup away to reconcile them.
  const [starters, setStarters] = useState<string[] | null>(null);
  useEffect(() => setStarters(pickStarters()), []);

  // Bumped when a question is chosen, so the box takes the cursor.
  const [focusSignal, setFocusSignal] = useState(0);

  // The questions are for an empty box that nobody is waiting on.
  const away = input.trim().length > 0 || busy;

  // Fills the box rather than sending: this is the person's question now, and
  // they may want to change a word of it before the minds see it.
  function choose(question: string) {
    onInputChange(question);
    setFocusSignal((n) => n + 1);
  }

  return (
    <div className="landing">
      <div className="landing-inner">
        {/* Three tiers, in the order they should be read: the name of the
            place, the idea behind it, then what to expect once you're in. */}
        <header className="landing-head">
          <h1>Other Minds</h1>
          {/* Each sentence is its own inline-block, so when the line has to
              break it breaks between them — never mid-thought. */}
          <p className="landing-idea">
            <span>One question.</span> <span>Three ways of seeing it.</span>
          </p>
          <p className="landing-sub">
            They won&apos;t always agree. That&apos;s the point.
          </p>
        </header>

        <div className="minds">
          {agentIds.map((id) => (
            <article
              key={id}
              className={`mind-card ${ENTRANCE[id]}`}
              style={agentVars(id)}
            >
              <Avatar agent={id} size={84} active />
              <div className="mind-copy">
                <h2>{AGENTS[id].name}</h2>
                <p>{AGENT_BLURB[id]}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="landing-composer">
          <Composer
            value={input}
            onChange={onInputChange}
            onSubmit={onSubmit}
            disabled={busy}
            placeholder="put a question on the table…"
            autoFocus
            focusSignal={focusSignal}
          />

          {/* For someone who has arrived and doesn't know what to ask. It is for
              the blank box only, so it folds away the moment they start typing.
              Folds rather than unmounts: removing it outright makes the page
              re-centre in one frame and the title jumps, which is the opposite of
              the room this is meant to be. `inert` takes it out of the tab order
              and the accessibility tree while it is folded. */}
          {starters && (
            <div
              className={`starters${away ? " away" : ""}`}
              inert={away}
              aria-hidden={away}
            >
              <div className="starters-inner" role="group" aria-label="Questions to start with">
                <div className="starters-head">
                  <p className="starters-label">not sure where to start?</p>
                  <button
                    type="button"
                    className="starters-more"
                    onClick={() => setStarters((now) => pickStarters(now ?? []))}
                  >
                    show others
                  </button>
                </div>
                <ul>
                  {starters.map((q) => (
                    <li key={q}>
                      <button type="button" className="starter" onClick={() => choose(q)}>
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <p className="landing-hint">
            They speak one at a time. Invite another mind after they speak.
          </p>
        </div>
      </div>
    </div>
  );
}
