'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  FileCheck2,
  FileText,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  buildMappings,
  buildSuggestions,
  type Mapping,
  type MappingStatus,
  type Suggestion,
} from '@/lib/domain';

const SAMPLE_RESUME = `Maya Chen
Product Designer

EXPERIENCE
Senior Product Designer — Acme Studio, 2022–Present
Led research and interaction design for an onboarding redesign, improving completion by 18% across web and mobile.
Worked on a reusable component library with engineering and documented accessibility patterns.
Facilitated customer interviews and translated findings into tested product flows.

SKILLS
Product strategy, user research, Figma, prototyping, design systems, accessibility`;

const SAMPLE_ROLE = `Northstar Labs is hiring a Product Designer.
Own end-to-end product design from discovery through delivery.
Build and evolve accessible design systems with engineering.
Use customer research and product data to improve onboarding.
Healthcare industry experience is preferred.`;

function savedField(field: 'resume' | 'role' | 'locksInput', fallback: string) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = JSON.parse(
      window.localStorage.getItem('fitmarkly-workspace-v1') ?? '{}',
    ) as Record<string, unknown>;
    return typeof value[field] === 'string' ? value[field] : fallback;
  } catch {
    return fallback;
  }
}

function download(name: string, value: string, type = 'text/plain') {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([value], { type }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

const statusStyle: Record<MappingStatus, string> = {
  supported: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  partial: 'border-amber-200 bg-amber-50 text-amber-950',
  missing: 'border-border bg-background text-foreground',
};

export default function Home() {
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [resume, setResume] = useState(() =>
    savedField('resume', SAMPLE_RESUME),
  );
  const [role, setRole] = useState(() => savedField('role', SAMPLE_ROLE));
  const [locksInput, setLocksInput] = useState(() =>
    savedField('locksInput', 'Acme Studio; 18%; 2022–Present'),
  );
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [notice, setNotice] = useState('Ready for a private, local review.');
  const fileRef = useRef<HTMLInputElement>(null);

  const locks = useMemo(
    () =>
      locksInput
        .split(';')
        .map((lock) => lock.trim())
        .filter(Boolean)
        .slice(0, 12),
    [locksInput],
  );

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      'fitmarkly-workspace-v1',
      JSON.stringify({ resume, role, locksInput }),
    );
  }, [hydrated, resume, role, locksInput]);

  function analyze() {
    if (resume.trim().length < 40 || role.trim().length < 30) {
      setNotice('Add a fuller resume and role description before analyzing.');
      return;
    }
    const nextMappings = buildMappings(resume, role);
    setMappings(nextMappings);
    setSuggestions(buildSuggestions(resume, locks));
    setSelected(0);
    setNotice(
      `${nextMappings.filter((item) => item.status === 'supported').length} supported · ${nextMappings.filter((item) => item.status === 'partial').length} partial · ${nextMappings.filter((item) => item.status === 'missing').length} missing`,
    );
  }

  function updateSuggestion(id: string, status: Suggestion['status']) {
    setSuggestions((current) =>
      current.map((suggestion) => {
        if (suggestion.id !== id || suggestion.status === 'blocked')
          return suggestion;
        if (status === 'accepted') {
          setResume((value) =>
            value.replace(suggestion.original, suggestion.replacement),
          );
        }
        return { ...suggestion, status };
      }),
    );
    setNotice(
      status === 'accepted'
        ? 'Change accepted and saved locally.'
        : 'Suggestion dismissed.',
    );
  }

  function resetSample() {
    setResume(SAMPLE_RESUME);
    setRole(SAMPLE_ROLE);
    setLocksInput('Acme Studio; 18%; 2022–Present');
    setMappings([]);
    setSuggestions([]);
    setSelected(null);
    setNotice('Sample restored. Nothing has been analyzed yet.');
  }

  async function copyResume() {
    await navigator.clipboard.writeText(resume);
    setNotice('Resume copied.');
  }

  function exportReview() {
    download(
      'fitmarkly-review.json',
      JSON.stringify({ resume, role, locks, mappings, suggestions }, null, 2),
      'application/json',
    );
    setNotice('Review ledger exported.');
  }

  async function readFile(file: File | undefined) {
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      setNotice(
        'This first build accepts .txt and .md resumes. PDF and DOCX parsing are next.',
      );
      return;
    }
    setResume(await file.text());
    setNotice(`${file.name} loaded locally.`);
  }

  const currentMapping = selected === null ? null : mappings[selected];
  const openSuggestions = suggestions.filter((item) => item.status === 'open');

  if (!hydrated) {
    return (
      <main
        className="min-h-screen bg-background"
        aria-label="Loading Fitmarkly"
      />
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <a
        href="#workspace"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-3"
      >
        Skip to workspace
      </a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur lg:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <FileCheck2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold tracking-tight">Fitmarkly</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Match the role without making things up.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            <ShieldCheck data-icon="inline-start" /> Local workspace
          </Badge>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <a
                href="https://github.com/Satwik-P28/fitmarkly"
                target="_blank"
                rel="noreferrer"
                aria-label="Star Fitmarkly on GitHub"
              />
            }
          >
            <Star data-icon="inline-start" /> Star
          </Button>
          <Button variant="outline" size="sm" onClick={resetSample}>
            <RotateCcw data-icon="inline-start" /> Reset sample
          </Button>
        </div>
      </header>

      <section
        id="workspace"
        className="grid min-h-[calc(100vh-4rem)] xl:grid-cols-[17rem_minmax(0,1fr)_25rem]"
      >
        <aside className="border-b bg-sidebar p-4 xl:border-b-0 xl:border-r xl:p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <section className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BriefcaseBusiness className="size-4" /> Target role
              </div>
              <Textarea
                aria-label="Target job description"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="mt-3 min-h-44 resize-y border-white/20 bg-white/10 text-sm text-white placeholder:text-white/50 focus-visible:border-white/50 xl:min-h-64"
              />
            </section>

            <section className="rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <LockKeyhole className="size-4 text-accent-foreground" /> Claim
                locks
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Separate facts that cannot change with semicolons.
              </p>
              <Textarea
                aria-label="Protected resume claims"
                value={locksInput}
                onChange={(event) => setLocksInput(event.target.value)}
                className="mt-3 min-h-24 resize-y bg-background"
              />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {locks.map((lock) => (
                  <Badge key={lock} variant="outline">
                    {lock}
                  </Badge>
                ))}
              </div>
            </section>
          </div>
        </aside>

        <section className="min-w-0 p-4 lg:p-7">
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Resume evidence
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Show what your resume actually proves.
                </h1>
                <p
                  aria-live="polite"
                  className="mt-2 text-sm text-muted-foreground"
                >
                  {notice}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Input
                  ref={fileRef}
                  type="file"
                  accept=".txt,.md,text/plain,text/markdown"
                  className="hidden"
                  aria-label="Upload resume text file"
                  onChange={(event) => void readFile(event.target.files?.[0])}
                />
                <Button
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload data-icon="inline-start" /> Upload text
                </Button>
                <Button onClick={analyze} className="h-9 px-4">
                  Analyze role <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </div>

            <article className="overflow-hidden rounded-[1.5rem] border bg-card shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="size-4 text-primary" /> Current resume
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void copyResume()}
                  >
                    <Clipboard data-icon="inline-start" /> Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => download('fitmarkly-resume.txt', resume)}
                  >
                    <Download data-icon="inline-start" /> Export text
                  </Button>
                </div>
              </div>
              <Textarea
                aria-label="Resume text"
                value={resume}
                onChange={(event) => setResume(event.target.value)}
                className="min-h-[34rem] resize-y rounded-none border-0 bg-card px-6 py-7 font-[Georgia,serif] text-[15px] leading-7 shadow-none focus-visible:ring-0 sm:px-10"
              />
            </article>

            {suggestions.length > 0 && (
              <section className="mt-5 rounded-[1.5rem] border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Wording review</h2>
                    <p className="text-xs text-muted-foreground">
                      Small edits only. Every change is yours to accept.
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {openSuggestions.length} open
                  </Badge>
                </div>
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <article
                      key={suggestion.id}
                      className="rounded-2xl border bg-background p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="line-through decoration-red-400/70">
                            {suggestion.original}
                          </p>
                          <p className="mt-2 rounded-xl bg-secondary p-3 text-secondary-foreground">
                            {suggestion.replacement}
                          </p>
                          <p className="mt-3 text-sm text-muted-foreground">
                            {suggestion.rationale}
                          </p>
                        </div>
                        {suggestion.status === 'open' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                updateSuggestion(suggestion.id, 'accepted')
                              }
                            >
                              <Check data-icon="inline-start" /> Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateSuggestion(suggestion.id, 'dismissed')
                              }
                            >
                              <X data-icon="inline-start" /> Dismiss
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant={
                              suggestion.status === 'accepted'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {suggestion.status}
                          </Badge>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>

        <aside className="border-t bg-card p-5 xl:border-l xl:border-t-0 xl:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Requirement map</h2>
              <p className="text-xs text-muted-foreground">
                Evidence, not a mystery score
              </p>
            </div>
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
          </div>

          {mappings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed p-6 text-center">
              <ShieldCheck className="mx-auto size-8 text-primary" />
              <p className="mt-3 font-medium">No analysis yet</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Fitmarkly maps role requirements to exact resume evidence and
                names what is missing.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 space-y-2">
                {mappings.map((mapping, index) => (
                  <button
                    key={`${mapping.requirement}-${index}`}
                    onClick={() => setSelected(index)}
                    className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${statusStyle[mapping.status]} ${selected === index ? 'ring-2 ring-primary/25' : ''}`}
                  >
                    <span className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                      {mapping.status}
                      {mapping.status === 'supported' && (
                        <CheckCircle2 className="size-4" />
                      )}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-sm font-medium leading-5">
                      {mapping.requirement}
                    </span>
                  </button>
                ))}
              </div>

              {currentMapping && (
                <section className="mt-4 rounded-2xl border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Why this result
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    {currentMapping.evidence ??
                      'No resume evidence was found. Add truthful experience or leave this requirement unmatched.'}
                  </p>
                  {currentMapping.matchedTerms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {currentMapping.matchedTerms.map((term) => (
                        <Badge key={term} variant="outline">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <Button
                variant="outline"
                className="mt-5 w-full"
                onClick={exportReview}
              >
                <Download data-icon="inline-start" /> Export review ledger
              </Button>
            </>
          )}

          <footer className="mt-8 border-t pt-5 text-xs leading-5 text-muted-foreground">
            Demo analysis runs on this device. It does not predict hiring
            outcomes or fabricate qualifications.
          </footer>
        </aside>
      </section>
    </main>
  );
}
