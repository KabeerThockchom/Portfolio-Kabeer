# Portfolio Refresh: EY-era to Databricks-era

Date: 2026-08-07
Status: Approved

## Problem

The live site (kabeerthockchom.dev) is roughly a year out of date.
It shows Ernst & Young as the current employer and never mentions Databricks.
The resume (source of truth) has Kabeer as Senior Solutions Engineer at Databricks (Dec 2025 - Present), with the EY history restructured into three roles, a new demos section, a new skills taxonomy, and a Recognition section.

Separately, the chatbot's knowledge base is a hardcoded string (`KABEER_KNOWLEDGE` in `app/api/chat/route.ts`) that has already drifted from `app/data.ts` (e.g. "50,000 transcripts" vs "200,000", missing the current role). Every content edit currently has to be made in two places or the chatbot misrepresents Kabeer.

## Goals

1. Bring all site content in line with the current resume.
2. Eliminate the duplicated chatbot knowledge base so `data.ts` is the single source of truth.
3. Add company logos and targeted visual polish.
4. Point the resume tab at the new PDF.
5. Genericize all Databricks-era content so no customer is identifiable on a public, indexed page.

## Non-goals

- No bold visual overhaul; keep the existing clean template aesthetic.
- No changes to the Spotify integration, blog posts, or contact form behavior.
- No new pages or routes.

## Confidentiality rules (public-page safe altitude)

The site is public and Google-indexed, unlike a resume shared 1:1 with recruiters. Therefore:

- No customer names or identifiers in any Databricks-era copy. "F500 membership warehouse retailer running Domo/Power BI in Latin America" becomes "a Fortune 500 retailer consolidating BI onto a single AI platform."
- No internal customer codenames.
- Featured GitHub repos exclude any repo whose name references a real customer (e.g. `allegiantair`, `allegiant-air-sdp`). Only neutral, original work is surfaced.
- Databricks demos (Smallville Mart, Multi-Agent Retail Ops, CoDA) are described at a generic altitude - capability and pattern, not account.

## Architecture: single source of truth

`app/data.ts` is extended and becomes the only file to edit for content.

New / changed typed fields:

- `Project`: add optional `githubUrl?: string`. Keep `video`, `link`, `techStack`.
- `WorkExperience`: add optional `logo?: string` (path under `/public/logos/`).
- `Education`: add optional `logo?: string`, `coursework?: string[]`.
- New `RECOGNITION: Recognition[]` array (NVIDIA GTC 2025, EY Hackathon Winner, Dean's Scholar).
- New exported constant `LAST_UPDATED = '2026-08-07'` (optional footer/meta use).

New helper `buildKnowledgeBase()` (either colocated in `data.ts` or a small `lib/knowledge.ts`) assembles a plain-text knowledge string from `PROJECTS`, `WORK_EXPERIENCE`, `EDUCATION`, `SKILLS`, `CERTIFICATIONS`, `RECOGNITION`, `EMAIL`, and the About/summary copy.

`app/api/chat/route.ts` imports `buildKnowledgeBase()` instead of the hardcoded `KABEER_KNOWLEDGE` block, which is deleted. The system prompt persona/guidelines stay as-is (only the facts are now derived). The knowledge string is built once at module load (data is static), not per request.

## Content changes (from resume)

### About / summary
Rewrite to the Databricks Senior Solutions Engineer narrative: greenfield F500 retail / travel / hospitality account strategy, migrations off Snowflake / BigQuery / Domo / Power BI / AS400, agentic demos and reusable reference assets, hands-on multi-agent / RAG builder shipped to 10+ F500 customers, NVIDIA GTC 2025 speaker. Keep interest tags (AI/ML, Economics, Product, Dogs, Tea, Hiking, Movies) and the human-centered-design closing note.

### Experience (replaces current list)
1. Databricks - Senior Solutions Engineer, Retail/Travel/Hospitality (Dec 2025 - Present) - genericized bullets.
2. Ernst & Young LLP - Senior Applied AI Engineer (Jul 2025 - Dec 2025).
3. Ernst & Young LLP - AI Platform Engineer (Oct 2023 - Jul 2025).
4. Stealth Startup - Founder & AI Engineer (Jan 2024 - Jul 2025).
5. Ernst & Young LLP - AI Engineering Intern (Jun 2022 - Aug 2022).
6. UC Davis Graduate School of Management - Research Analyst, NLP (Jun 2021 - Aug 2022).

Each gets a `logo` where one exists (Databricks, EY, UC Davis).

### Education
- University of Texas, Austin - M.S. Data Science (Jan 2025 - Present); focus ML Systems / Distributed Computing / Statistical Learning; coursework MLOps, A/B Testing, Experiment Design. Logo.
- UC Davis - B.S. CS & Quantitative Economics (2019-2023); GPA 3.7; minors Statistics + Technology Management; honors Dean's Scholar / March Fund; coursement ML, DB Systems, Stats, HCI. Logo.

### Skills (replace with resume's 7 categories)
Solutions Engineering; Databricks Platform; LLMs & Agents; Data & ML; Cloud & Infra; MLOps; Languages (Spoken).

### Certifications
PMP (2024), Microsoft AI-900 (2024), DeepLearning.AI LLM Fine-tuning Specialization (2023). (Drops the older AZ-900 and Lamini-specific naming to match resume.)

### Recognition (new section, rendered on Experience tab)
- NVIDIA GTC 2025 - Featured Speaker (Mar 2025), "EY Voice: AI-Powered Contact Centers," 500+ attendees.
- EY Wealth Asset Management Hackathon Winner (Feb 2025), $50K prize.
- Dean's Scholar & March Fund Award (2020-2022).

## Projects tab (merge)

Keep existing cards that have real demo videos / live links; refresh their copy to match the resume; add genericized Databricks-era demos; add a GitHub icon link on cards that map to a public, customer-neutral repo.

Final card set (order):

1. Multi-Agent Retail Ops Reference Architecture (Databricks, genericized; no public video - text + tech stack).
2. Retail Generative-Agents Simulation (Databricks, genericized).
3. Browser AI Agents Reference App (Databricks, genericized) - GitHub: `coding-agents-databricks-apps` (neutral name, keep) or omit link if judged too tied; default keep.
4. Portfolio AI - Voice Financial Assistant (existing video + live link) - GitHub: `portfolio-ai-nxt`.
5. Text2SQL - NL Business Intelligence (existing) - GitHub: `Text2SQLAI`.
6. EY Voice - GenAI Call Center (existing).
7. BottegaAI - Restaurant Voice Agent (existing).
8. EYLAR - Local Agentic RAG (existing).
9. Generative UI Banking POC (existing; kept for range).
10. AI Monopoly Arena (existing; kept for range) - GitHub if public repo exists.
11. ETF AI (existing).

Additional customer-neutral repos to consider linking from relevant cards: `SidekickAI-OpenSourceCluely`, `contextforge`, `wezterm-claude-kit`, `personalPortfolioDeepAgent`.
Excluded from featuring: `allegiantair`, `allegiant-air-sdp` (customer-named).

GitHub links render as a small GitHub icon on the card, not a separate "Open Source" section.

## Visual: logos + targeted polish

- Add `public/logos/` with self-hosted SVGs: Databricks, EY, UT Austin, UC Davis. No hotlinking. Rendered small (e.g. 20-24px) beside the company/school name, with a sensible fallback if a logo is missing (name only).
- Delete stale `app/page 2.tsx` (duplicate of `page.tsx`) and the duplicated root-level image in `app/` that also exists in `public/`.
- Tidy tab-bar spacing and ensure the new logos + Recognition section are responsive at mobile widths.
- Keep colors, typography, and animations as-is.

## Resume PDF

- Self-host the provided PDF at `public/Kabeer_Thockchom_Resume.pdf`; point the "Download PDF" button at `/Kabeer_Thockchom_Resume.pdf`.
- Update the preview iframe + any Drive reference to the new file id `1o0xc-DgIRA8UTWNnnv0t3p1YyjT-vuGp`.

## Error handling / edge cases

- Missing logo file: render name only, no broken image.
- Project without `video`: render a text/tech-stack card (no empty iframe).
- Project without `githubUrl`: no icon rendered.
- Chatbot: behavior unchanged; if `GROQ_API_KEY` is unset the existing 500 path still applies (local dev without a key just returns the error message in the UI).

## Verification

- `npm run dev`, manual walkthrough of every tab (About, Projects, Experience, Blog, Resume, Contact) in light + dark, desktop + mobile widths.
- `npm run build` and `npm run lint` clean.
- Chatbot answers a question with a fact that only exists in the new resume (e.g. current Databricks role) to prove the derived knowledge base works.
- User visually approves before push. Vercel auto-redeploys on push to the default branch.
