// Questions to start from, for someone who has arrived and doesn't know what to
// ask.
//
// The personal ones are in the voice the minds were tuned against — most are
// lifted from the corpus in backend/scripts/seed_corpus.py, so they are known
// to land well rather than merely sounding plausible. The abstract ones are
// there on purpose: an abstract question is a real question here (see "An
// abstract question is a real question" in the house prompt), it is where the
// three lenses part company most visibly, and showing one tells a newcomer
// they are not required to have a crisis to bring.
//
// Nothing here decides anything about a conversation. It only fills a box that
// the person can still edit.

const PERSONAL = [
  "I keep saying yes to things I don't want to do.",
  "My mother is getting older and lives four hours away. Do I move back?",
  "Everyone says I should be grateful for this job. I'm not.",
  "I stopped painting three years ago and I miss it, but I never pick up a brush.",
  "I'm good at my job and bored by it.",
  "My sister keeps asking to borrow money and I keep lending it.",
  "My father and I haven't spoken in two years and I don't know who should call.",
  "I moved to a new city eight months ago and still haven't made friends.",
  "I promised myself I'd run a marathon this year and I've trained twice.",
  "I can't tell if I'm tired or if I've stopped caring.",
] as const;

const ABSTRACT = [
  "What makes a life feel well lived?",
  "Is it ever right to break a promise?",
  "Can a person really change who they are?",
  "What do we owe the people we love?",
] as const;

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Three questions: two personal, one abstract, in a mixed order.
 *
 * `avoid` is what is on screen now, so "show others" actually shows others —
 * unless that would leave too little to choose from, in which case repeating is
 * better than showing fewer than three.
 *
 * `random` is injectable so this can be tested without chance in it.
 */
export function pickStarters(
  avoid: readonly string[] = [],
  random: () => number = Math.random,
): string[] {
  const fresh = <T extends string>(pool: readonly T[], need: number) => {
    const rest = pool.filter((q) => !avoid.includes(q));
    return shuffled(rest.length >= need ? rest : pool, random).slice(0, need);
  };
  return shuffled([...fresh(PERSONAL, 2), ...fresh(ABSTRACT, 1)], random);
}

export const STARTER_POOL: readonly string[] = [...PERSONAL, ...ABSTRACT];
