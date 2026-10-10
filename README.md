# Kabeer Thockchom — personal portfolio

Live at https://www.kabeerthockchom.dev, deployed by the existing Vercel GitHub integration.

## Develop

Use Node.js 22, then run `npm ci` and `npm run dev`. Run `npm run build` before publishing.

## Edit content

`app/data.ts` contains the profile, projects, experience, education, writing, and contact details. The resume chatbot derives its knowledge from the same file. Update `PROFILE` once to change the homepage and chatbot biography together.

`app/portfolio.tsx` renders the homepage, project filters, on-demand demo embeds, and resume assistant. `app/globals.css` holds the responsive black-and-white design in light and dark modes. All 11 projects have optimized GPT Image covers in `public/projects/`. The prompts are documented in `docs/project-artwork.md`. Resume downloads use the existing PDF in `public/`.

The contact link opens an email draft. Project videos and the resume preview load when opened. Project notes, role details, skills, and the resume assistant are expandable to keep the page concise.

The existing Spotify integration uses `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`. Resume chat uses `GROQ_API_KEY` and defaults to `openai/gpt-oss-120b`. Set the optional `GROQ_MODEL` environment variable to change models. Requests time out after 12 seconds, and completions are capped at 1,024 tokens. Keep secrets in Vercel environment settings or ignored local environment files.

Enterprise project descriptions must remain generalized. Do not add customer names or confidential account information.
