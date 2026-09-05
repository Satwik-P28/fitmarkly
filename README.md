# Fitmarkly

[![Live demo](https://img.shields.io/badge/live%20demo-try%20now-2ea44f?style=for-the-badge)](https://fitmarkly.nex3sss.chatgpt.site)
[![GitHub stars](https://img.shields.io/github/stars/Satwik-P28/fitmarkly?style=for-the-badge&logo=github)](https://github.com/Satwik-P28/fitmarkly/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/Satwik-P28/fitmarkly/ci.yml?branch=main&style=for-the-badge)](https://github.com/Satwik-P28/fitmarkly/actions)

**Match a resume to a role without inventing experience.**

Fitmarkly is a **free, local-first, open-source resume review workspace** — a privacy-first alternative to paid ATS keyword tools such as Jobscan. It maps job requirements to **exact resume sentences**, labels the strength of each match, protects user-defined facts, and proposes only narrow wording changes you can accept or dismiss.

[**Try the public demo**](https://fitmarkly.nex3sss.chatgpt.site) · [**Star this repo**](https://github.com/Satwik-P28/fitmarkly) · [**Run with Docker**](#docker)

No account. No upload. Your resume never leaves the browser in this release.

![Fitmarkly social preview](public/og.png)

## Why this exists

Resume “match” products often pressure you to sprinkle keywords until a score goes up — even when that score rewards phrasing you cannot honestly claim. Fitmarkly refuses that game. It is an **evidence-based resume-to-job matcher**: every requirement is tied to a sentence you already wrote, and claim locks stop the tool from rewriting facts you must keep.

| | Paid resume scanners | **Fitmarkly** |
| --- | --- | --- |
| Price | Subscription / credit packs | Free, MIT, self-host |
| Your resume | Uploaded to a vendor | Stays in this browser |
| Match quality | Opaque percentage | Supported / partial / missing + evidence |
| Rewrites | Easy to invent experience | Claim locks + accept-or-dismiss only |
| Export | Vendor reports | Resume text + JSON review ledger |

## What works today

- Editable resume and job-description workspace
- Local `.txt` and `.md` resume import
- Deterministic **supported / partial / missing** requirement mapping
- Exact evidence and matched-term inspection
- **Claim locks** for facts that must not change
- Accept-or-dismiss wording suggestions
- Browser-local persistence with no account required
- Resume text and JSON review-ledger export
- Responsive, keyboard-friendly interface

The current analyzer is deliberately deterministic and runs in the browser. It does not predict hiring outcomes, fabricate accomplishments, or upload resume text to a server. PDF/DOCX parsing and optional model-provider adapters are future work.

## Quick start

Requires [Node.js](https://nodejs.org/) 22.13 or newer.

```bash
git clone https://github.com/Satwik-P28/fitmarkly.git
cd fitmarkly
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Docker

```bash
docker pull ghcr.io/satwik-p28/fitmarkly:latest
docker run --rm -p 3000:3000 ghcr.io/satwik-p28/fitmarkly:latest
```

Or build locally:

```bash
docker compose up --build
```

## How a review works

1. Paste (or import) a resume and a job description.
2. Name the facts that must not change — company names, metrics, dates.
3. Run a local review. Each requirement is labeled supported, partial, or missing, with the resume sentence that justified the call.
4. Accept or dismiss only the wording suggestions you agree with.
5. Export the resume and a JSON ledger of the review.

## Architecture

- React 19 + TypeScript
- Tailwind CSS and shadcn components
- Vinext/Vite with Cloudflare Workers output
- Pure domain functions in `lib/domain.ts`, tested with Vitest
- `localStorage` for workspace persistence

## Privacy and safety

Resume and job-description text remain in the current browser in this release. Treat exported ledgers as sensitive personal data. Fitmarkly is an independent project and is not affiliated with Jobscan or any employer, recruiting platform, or applicant-tracking system.

## Quality checks

```bash
npm run check
npm audit
```

## Contributing

If Fitmarkly helped you apply honestly — **[star the repo](https://github.com/Satwik-P28/fitmarkly)** so other job seekers can find a scanner that will not invent experience.

Open an issue before a large change. Keep claim-preservation behavior deterministic and cover domain changes with tests. See [CONTRIBUTING.md](CONTRIBUTING.md).

### Blurb for awesome-lists

> **[Fitmarkly](https://github.com/Satwik-P28/fitmarkly)** — Local-first open-source resume-to-job matcher with evidence-linked requirements and claim locks. `MIT` `Docker` `Nodejs` `Privacy`

## License

[MIT](LICENSE)
