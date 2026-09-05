import { describe, expect, it } from 'vitest';
import { buildMappings, buildSuggestions, requirementsFrom } from './domain';

describe('requirement mapping', () => {
  it('filters boilerplate and caps the review', () => {
    const requirements = requirementsFrom(
      [
        'We are hiring a designer.',
        ...Array.from(
          { length: 10 },
          (_, i) => `Own product workflow number ${i} from start to finish.`,
        ),
      ].join('\n'),
    );
    expect(requirements).toHaveLength(8);
    expect(requirements.some((item) => item.includes('hiring'))).toBe(false);
  });

  it('keeps evidence attached to supported claims', () => {
    const resume =
      'Built an accessible design system with engineering for a mobile product.';
    const role = 'Build and evolve accessible design systems with engineering.';
    const [mapping] = buildMappings(resume, role);
    expect(mapping.status).toBe('supported');
    expect(mapping.evidence).toBe(resume);
    expect(mapping.matchedTerms).toContain('accessible');
  });

  it('marks unsupported requirements as missing', () => {
    const [mapping] = buildMappings(
      'Designed onboarding flows and interviewed customers for a finance app.',
      'Lead clinical trials for oncology therapeutics.',
    );
    expect(mapping.status).toBe('missing');
    expect(mapping.evidence).toBeNull();
  });
});

describe('wording suggestions', () => {
  it('uses a narrower verb without changing the rest of the claim', () => {
    const [suggestion] = buildSuggestions(
      'Worked on a component library with engineering and documented patterns.',
      [],
    );
    expect(suggestion.replacement).toContain('Contributed to');
    expect(suggestion.status).toBe('open');
  });
});
