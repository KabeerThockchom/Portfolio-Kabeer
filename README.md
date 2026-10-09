# Kabeer Thockchom — personal portfolio

Live at https://www.kabeerthockchom.dev, deployed by the existing Vercel GitHub integration.

## Develop

Use Node.js 22, then run `npm ci` and `npm run dev`. Run `npm run build` before publishing.

## Edit content

`app/data.ts` contains the profile, projects, experience, education, writing, and contact details. The resume chatbot derives its knowledge from the same file. Update `PROFILE` once to change the homepage and chatbot biography together.

`app/portfolio.tsx` renders the homepage, project filters, on-demand demo embeds, and resume assistant. `app/globals.css` holds the responsive light/dark design. Resume downloads use the existing PDF in `public/`.

The contact form creates a mailto draft; it does not send messages from the server. Project videos and the resume preview load when opened.

The existing Spotify integration uses `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`. Resume chat uses `GROQ_API_KEY`. Keep secrets in Vercel environment settings or ignored local environment files.

Enterprise project descriptions must remain generalized. Do not add customer names or confidential account information.
