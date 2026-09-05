export type MappingStatus = 'supported' | 'partial' | 'missing';

export type Mapping = {
  requirement: string;
  status: MappingStatus;
  evidence: string | null;
  matchedTerms: string[];
};

export type Suggestion = {
  id: string;
  original: string;
  replacement: string;
  rationale: string;
  status: 'open' | 'accepted' | 'dismissed' | 'blocked';
};

const STOP_WORDS = new Set([
  'and',
  'the',
  'with',
  'from',
  'into',
  'your',
  'this',
  'that',
  'for',
  'are',
  'our',
  'through',
  'will',
  'preferred',
  'hiring',
  'experience',
]);

export function terms(input: string) {
  return Array.from(
    new Set(
      input
        .toLowerCase()
        .replace(/[^a-z0-9+#.\- ]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !STOP_WORDS.has(word)),
    ),
  );
}

export function sentences(input: string) {
  return input
    .split(/\n+|(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 15);
}

export function requirementsFrom(input: string) {
  return sentences(input)
    .filter((line) => !/hiring|about us|equal opportunity/i.test(line))
    .slice(0, 8);
}

export function buildMappings(resume: string, role: string): Mapping[] {
  const resumeSentences = sentences(resume);
  return requirementsFrom(role).map((requirement) => {
    const requirementTerms = terms(requirement);
    let best = { sentence: '', matched: [] as string[] };

    for (const sentence of resumeSentences) {
      const lower = sentence.toLowerCase();
      const matched = requirementTerms.filter((term) => lower.includes(term));
      if (matched.length > best.matched.length) best = { sentence, matched };
    }

    const ratio = requirementTerms.length
      ? best.matched.length / requirementTerms.length
      : 0;
    const status: MappingStatus =
      best.matched.length >= 2 && ratio >= 0.3
        ? 'supported'
        : best.matched.length >= 1
          ? 'partial'
          : 'missing';

    return {
      requirement,
      status,
      evidence: status === 'missing' ? null : best.sentence,
      matchedTerms: best.matched,
    };
  });
}

export function buildSuggestions(
  resume: string,
  locks: string[],
): Suggestion[] {
  const patterns = [
    {
      from: 'Worked on',
      to: 'Contributed to',
      rationale:
        'Clarifies contribution without increasing the level of ownership.',
    },
    {
      from: 'Helped with',
      to: 'Supported',
      rationale: 'Uses a more direct verb while preserving the original claim.',
    },
  ];

  return patterns
    .filter(({ from }) => resume.includes(from))
    .map(({ from, to, rationale }, index) => {
      const original =
        sentences(resume).find((line) => line.includes(from)) ?? from;
      const replacement = original.replace(from, to);
      const blocksLock = locks.some(
        (lock) =>
          original.toLowerCase().includes(lock.toLowerCase()) &&
          !replacement.toLowerCase().includes(lock.toLowerCase()),
      );
      return {
        id: `${from}-${index}`,
        original,
        replacement,
        rationale,
        status: blocksLock ? 'blocked' : 'open',
      };
    });
}
