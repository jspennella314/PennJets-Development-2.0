# pennjets.com site audit — 2026-09-19

Terminal 4 (site). Work order WO-4.2. Evidence gathered against the deployed site at `https://www.pennjets.com` and the repository at `origin/main` `827d6ab` on 2026-09-19. Part A is live evidence (deploy, build, Lighthouse, rendered `<head>`, API, assets). Part B is the full read-only code sweep, one section per route, with every quote at `file:line`.

Rules the audit checks against are in `CLAUDE.md` and Joseph's direction of 2026-09-19 (charter-broker disclosure, no operator/fleet/crew copy, no invented pricing or availability, no accreditation claims, credibility over polish).

---

## Part A — Live evidence

### A.1 Deploy path (verified)

- Deploys from `main` to **GitHub Pages** via `.github/workflows/deploy.yml` (build with Vite, copy `public/CNAME`, publish `dist/` to `gh-pages` with `peaceiris/actions-gh-pages@v3`). Build-time env in the workflow: `VITE_CRM_API_URL=https://www.pennforce.pennjets.com` plus three webhook IDs in plain text (`deploy.yml:27-31`).
- Last successful run: 2026-09-18T21:32Z (`Deploy to GitHub Pages`), Pages build 21:33Z. `origin/gh-pages` = `d27763f deploy: 20d0d7b`.
- DNS: `www.pennjets.com` and `pennjets.com` resolve to 185.199.108–111.153 (GitHub Pages). Apex 301s to `www`. Response header `Server: GitHub.com`.
- **No preview environment.** Branch pushes deploy nothing. Review happens at `http://localhost:5173` per Joseph's direction.
- **Stale deployment docs (all describe a Digital Ocean droplet 167.71.184.95 that DNS no longer points at):** `README.md` (Deployment section), `DEPLOYMENT_INSTRUCTIONS.md`, `QUICK_DEPLOY.md`, `deploy.sh`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`. Also stale: `EMAILJS-SETUP.md`, `URGENT_FIX_APPLIED.md`, `WEBHOOK_IMPLEMENTATION_COMPLETE.md`, `WEBHOOK_SETUP_GUIDE.md`, `CRM_WEBHOOK_CREATION_STEPS.md` (pre-date the PennForce webhook design; `.env` comments still point at `crm.pennjets.com`). `README.md` calls the business "aviation brokerage ... charter services, and management".
- Non-source directories tracked in git: `LEGAL-DOCS/` (4 PDFs), `dist - Copy/` (an old build, 276 KB), `Premier 1A Listing/` (3 JPGs), `Screenshots/subscribe.png` (529 KB). Tracked `public/` is 57.3 MB.

### A.2 Repository state and build

```
827d6ab (origin/main) Add standing rules for the site terminal
20d0d7b Add Embraer Phenom 300 to the gallery
10d0554 Stop the countdown banner clipping the PennJets logo on mobile
c63a03c Add Bombardier Challenger 650 to gallery, remove deleted stock photo
d8f1b7f Add Bombardier Challenger 650 gallery photo
```
Remote branches: `main`, `gh-pages`, `site/blog-view-beacon` (WO-4.1, pushed 2026-09-19). No `feature/blog-view-beacon` ever existed.

`npm run build` (2026-09-19, main):
```
vite v4.5.14 building for production...
✓ 75 modules transformed.
dist/index.html                   2.17 kB │ gzip:  0.97 kB
dist/assets/index-5235507f.css   46.99 kB │ gzip:  7.63 kB
dist/assets/index-45fed722.js   351.58 kB │ gzip: 97.79 kB
✓ built in 10.90s
```
`npm run lint` **fails before linting any file**:
```
ESLint couldn't find the config "@typescript-eslint/recommended" to extend from.
The config "@typescript-eslint/recommended" was referenced from the config file in ".eslintrc.cjs".
```
`@typescript-eslint/*` is not in `package.json`. Lint has never run in CI (the workflow does not call it).

Dependency notices at build: `caniuse-lite` 11 months old; `baseline-browser-mapping` over two months old.

### A.3 Lighthouse (mobile emulation, Lighthouse 12 via npx, 2026-09-19 19:57Z, production)

| Page | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Transferred |
|---|---|---|---|---|---|---|---|---|---|
| `/` | **70** | 89 | 100 | 100 | 2.7 s | **9.7 s** | 0 ms | 0.001 | **18,595 KiB** |
| `/blog/why-we-publish-market-notes` | **61** | 75 | 96 | 100 | 2.7 s | **60.9 s** | 420 ms | 0.014 | **12,018 KiB** |

Largest transfers, home:
```
8214 KiB  /images/E55-BARON-HOME/E55-BARON-HOME.JPEG
7201 KiB  /images/Diamond-1A/diamond-1a-ramp.JPEG
1462 KiB  /videos/Falcon-Hero-Flyover.MP4   (autoplay hero)
1350 KiB  /images/PennJets-Website-Logo.png (header logo AND favicon, every page)
 116 KiB  /images/PREMIER-1A-FEATURED.jpg
  97 KiB  /assets/index-984cc6ed.js
```
Largest transfers, article:
```
8654 KiB  /images/Meet-The-Team/JOSEPH-PENNELLA.JPEG  (rendered at 40-64 px circle)
1856 KiB  /images/Gallery/falcon.jpg                   (featured image)
1350 KiB  /images/PennJets-Website-Logo.png
```
Failing audits: home `button-name`, `color-contrast`; article `button-name`, `color-contrast`, `heading-order`, `label`, `errors-in-console`. Article also flags "Avoid multiple page redirects: 790 ms" (the GitHub Pages `404.html` to `/?/blog/...` to `replaceState` hop on every deep link, which is also every social click).

The SEO score of 100 is misleading: Lighthouse only checks that a title and description exist. See A.4.

Reports: the Lighthouse JSON and HTML (700 KB each) are in T4's scratchpad and are not committed; they can be attached on request.

### A.4 Rendered `<head>` per route (production, read from the live DOM after each route rendered)

Method: load `https://www.pennjets.com/`, then for each route push the URL into the SPA router and read `document.head` after render. Columns: canonical `<link>`, `og:*` tags, `twitter:*` tags, JSON-LD scripts.

| Route | `document.title` after render | description | canonical | og | twitter | JSON-LD | H1 | forms |
|---|---|---|---|---|---|---|---|---|
| `/` | PennJets - Premier Aviation Brokerage | index.html default | 0 | 0 | 0 | 0 | Access, You Deserve | 0 |
| `/about` | (default) | default | 0 | 0 | 0 | 0 | About PennJets | 0 |
| `/services` | (default) | default | 0 | 0 | 0 | 0 | Comprehensive Solutions for Sophisticated Aviation Needs | 0 |
| `/aircraft` | (default), later "Aircraft for Sale - Premium Private Jets \| PennJets" | default | 0 | 0 | 0 | 0 | Aircraft for Sale | 0 |
| `/aircraft/1` | (default) | default | 0 | 0 | 0 | 0 | 2003 Hawker 800XP | 0 |
| `/pennshare` | (default) | default | 0 | 0 | 0 | 0 | PennShare / Smart Ownership Solutions | 1 |
| `/charter` | (default) | default | 0 | 0 | 0 | 0 | Charter, Simplified. | 1 |
| `/contact` | (default) | default | 0 | 0 | 0 | 0 | Contact Us | 1 |
| `/blog` | (default) | default | 0 | 0 | 0 | 0 | Aviation Insights | 1 (newsletter) |
| `/blog/why-we-publish-market-notes` | (default), later "Why We Publish Market Notes \| PennJets Blog" | default at read time | 0 | 0 at read time | 0 | 0 at read time | Why We Publish Market Notes | 1 |
| `/gallery` | (default) | default | 0 | 0 | 0 | 0 | Gallery | 0 |
| `/privacy-policy` | (default) | default | 0 | 0 | 0 | 0 | Privacy Policy | 0 |
| `/terms-of-service` | (default) | default | 0 | 0 | 0 | 0 | Terms of Service | 0 |
| `/cookie-policy` | (default) | default | 0 | 0 | 0 | 0 | Cookie Policy | 0 |
| `/compliance` | (default) | default | 0 | 0 | 0 | 0 | Compliance Statement | 0 |
| `/this-route-does-not-exist` | (default) | default | 0 | 0 | 0 | 0 | (none, `<main>` empty) | 0 |

Observations:
- **No page has a canonical URL, a Twitter card, or an `og:url`/`og:image` that resolves.** Home sets `og:image` to `/images/og-hero.jpg`, which is a 404 (Part B §1).
- Helmet titles apply seconds late on production (the article title appeared only after the 8.6 MB author photo finished), and **bleed between routes**: after visiting `/aircraft` and then `/charter`, `document.title` on `/charter` read "Aircraft for Sale - Premium Private Jets | PennJets" because `/charter` sets no Helmet of its own.
- Social crawlers do not run JavaScript. **Every share of any URL shows the `index.html` default title and description, and no image.** This is the highest-impact SEO defect because social links are the funnel's entry point.
- `robots.txt` returns 404. `sitemap.xml` returns 404 (both verified on production).
- Unknown paths render a blank `<main>` with header and footer, no 404 message, HTTP 200 after the SPA redirect.

### A.5 Blog list and article load path (production)

- List: `GET https://www.pennforce.pennjets.com/api/public/blog` returns 200, 11,045 B, TTFB 0.14-0.19 s, `Cache-Control: public`, `X-Vercel-Cache: MISS`.
- Article: `GET /api/public/blog/why-we-publish-market-notes` returns 200, 2,835 B, TTFB 0.14-0.32 s. Response fields: `id, title, slug, content, excerpt, featuredImage, metaTitle, metaDescription, keywords, publishedAt, viewCount, leadCount, author{id,name,email}, contentHtml`.
- Both routes answer `Access-Control-Allow-Origin: *` for reads.
- The API is fast. The article page's 60.9 s LCP is entirely site-side assets (A.3), not the CRM.
- The CRM returns `metaTitle` and `metaDescription`; the site ignores both and uses `title`/`excerpt` (Part B §10).

### A.6 External resources loaded on production

From the live DOM on every route: `fonts.googleapis.com` (Inter), `fonts.gstatic.com`, preconnect to `www.pennforce.pennjets.com`. **No third-party scripts, tag managers, pixels, or iframes.** The only cross-origin calls are to the CRM (blog read, webhook post, newsletter subscribe, and after WO-4.1 the view beacon).

### A.7 Forms and where they post (summary; detail in Part B)

| Page | Posts to | Result |
|---|---|---|
| `/contact` | `POST {CRM}/api/webhooks/incoming/{VITE_CONTACT_WEBHOOK_ID}` | Lead created; success/failure shown with `alert()` |
| `/blog/:slug` | `POST {CRM}/api/webhooks/incoming/{author webhook}` with `blogPostSlug` | Lead created with blog attribution; `alert()` |
| `/blog` and unrouted `Blog.jsx` | `POST {CRM}/api/public/newsletter/subscribe` | Not in `CLAUDE.md`'s integration facts; the lead should know it exists |
| `/charter` quote form | **nowhere**: `console.log` then "Your request has been recorded" (Part B §7) | **Lead lost** |
| `/pennshare` form | **nowhere**: discards input and navigates to `/contact` (Part B §6) | **Lead lost** |

### A.8 Integration point status (for the lead)

- View beacon: implemented on `site/blog-view-beacon` (`02862b7`, `2e41dcc`), pushed, awaiting merge. Production `OPTIONS /api/public/blog/{slug}/view` from `Origin: https://www.pennjets.com` returns 204 with `Access-Control-Allow-Origin: https://www.pennjets.com`; from `http://127.0.0.1:5173` returns 403 (by design). The exact site payload posted with the allowed origin returned `201 {"recorded":true,"id":"cmu8tfq5j0001l804k1fa5okk","sessionId":"client_post:t4-1789848251-beacon-test"}`; a re-fire with the same `sessionId` returned the same `id` (update, not duplicate).
- Fallback hosts when `VITE_CRM_API_URL` is unset: `Contact.jsx:31` uses `https://crm.pennjets.com`, `blogApi.js:4` uses `http://localhost:3001`. Production is unaffected (the workflow sets the env) but local dev without `.env` silently posts to the wrong host.

### A.9 Mobile (390 px)

Time-boxed out of this session; it is WO-4.4 evidence. Part B records the structural mobile risks (two stacked fixed banners, 8-9 MB images, autoplay MP4 hero, missing `Helmet` on `/charter`). One desktop screenshot of `/charter` taken during the audit shows the quote form's "Total (est.) $9,190" price estimate and the small-print "PennJets is a broker and does not operate aircraft." line.

---

## Part B — Code sweep (read-only, every quote at file:line)

### PennJets site audit: read-only code sweep

Repo: `C:\Users\jspen\OneDrive\Desktop\PennJets-Development-2.0`
Branch at time of sweep: `site/blog-view-beacon`. The sweep started at HEAD `827d6ab`; T4 committed the view beacon on this branch (`02862b7 Add blog article view beacon`, `2e41dcc Send referrer as undefined when empty`) while the sweep ran. Line numbers for `src/components/pages/Blog/BlogArticle.jsx` (429 lines) and `src/services/blogApi.js` (279 lines) are from the final state at `2e41dcc`; the working tree was clean at the end of the sweep. All other files were unchanged throughout.
Date: 2026-09-19. No file in the repo was modified by this sweep.

All paths below are relative to the repo root unless absolute.

---

## 0. Global findings

### 0.1 Header nav (src/components/layout/Header/Header.jsx)

```
69	  const navigation = [
70	    { name: 'Home', href: '/' },
71	    { name: 'Aircraft', href: '/aircraft' },
72	    { name: 'Charter', href: '/charter' },
73	    { name: 'PennShare', href: '/pennshare' },
74	    { name: 'Services', href: '/services' },
75	    { name: 'About', href: '/about' },
76	    { name: 'Blog', href: '/blog' },
77	  ];
```
- Logo link: `Header.jsx:128 <Link to="/" ...>` with `Header.jsx:130 src="/images/PennJets-Website-Logo.png"` (file exists, **1,381,311 bytes** for a logo).
- Desktop CTA: `Header.jsx:164 <Link to="/contact">` "Contact Us"; mobile CTA `Header.jsx:209 <Link to="/contact" ...>`.
- All seven nav targets exist in App.jsx. `/gallery` and the four legal routes are NOT in the header (footer only).
- Header renders its OWN fixed countdown banner (`Header.jsx:86-114`, `fixed top-0 ... z-50`, text "Calendar Year Ending:" counting to `Header.jsx:47 new Date('2026-12-31T23:59:59')`). `TopBanner.jsx:48` renders ANOTHER `fixed top-0 ... z-50` banner ("Bonus Depreciation Deadline:"). Both are mounted in `App.jsx:30-31`. Two fixed z-50 bars at top:0 overlap each other; the Header measures only its own banner (`bannerRef`) for offset.

### 0.2 Footer links (src/components/layout/Footer/Footer.jsx)

```
18	  const footerSections = [
19	    {
20	      title: 'Services',
21	      links: [
22	        { name: 'Aircraft Sales', href: '/services#sales' },
23	        { name: 'Aircraft Acquisition', href: '/services#acquisition' },
24	        { name: 'Charter Services', href: '/services#charter' },
25	        { name: 'Aircraft Management', href: '/services#management' },
26	      ]
27	    },
28	    {
29	      title: 'Aircraft',
30	      links: [
31	        { name: 'Browse Aircraft', href: '/aircraft' },
32	        { name: 'Sell Your Aircraft', href: '/contact' },
33	        { name: 'Market Analysis', href: '/services#analysis' },
34	        { name: 'Valuation Services', href: '/services#analysis' },
35	      ]
36	    },
37	    {
38	      title: 'Company',
39	      links: [
40	        { name: 'About Us', href: '/about' },
41	        { name: 'Our Team', href: '/about#team' },
42	        { name: 'News & Insights', href: '/blog' },
43	        { name: 'Contact', href: '/contact' },
44	      ]
45	    },
46	    {
47	      title: 'Social',
48	      links: [
49	        { name: 'Gallery', href: '/gallery', iconKey: 'gallery' },
50	        { name: 'Instagram', href: 'https://instagram.com/pennjets', external: true, iconKey: 'instagram' },
51	        { name: 'Facebook', href: 'https://facebook.com/pennjets', external: true, iconKey: 'facebook' },
52	        { name: 'LinkedIn', href: 'https://linkedin.com/pennjets', external: true, iconKey: 'linkedin' },
53	        { name: 'X (Twitter)', href: 'https://twitter.com/pennjets', external: true, iconKey: 'twitter' },
54	      ]
55	    },
56	    {
57	      title: 'Legal',
58	      links: [
59	        { name: 'Privacy Policy', href: '/privacy-policy' },
60	        { name: 'Terms of Service', href: '/terms-of-service' },
61	        { name: 'Cookie Policy', href: '/cookie-policy' },
62	        { name: 'Compliance', href: '/compliance' },
63	      ]
64	    }
65	  ];
```
- Every internal footer target exists in App.jsx. Anchor ids exist: `Services.jsx:242 id={service.id}` yields `sales`, `acquisition`, `charter`, `management`, `analysis`, `consulting`; `About.jsx:112 id="team"`.
- `Footer.jsx:52 https://linkedin.com/pennjets` is not a valid LinkedIn URL shape (LinkedIn uses `/company/` or `/in/`); the commented-out line `Footer.jsx:69 // { name: 'LinkedIn', href: 'https://linkedin.com/company/pennjets' ...` had it right. `Footer.jsx:68 // Social media links will be added when accounts are set up` contradicts the live social links above it. Whether `instagram.com/pennjets`, `facebook.com/pennjets`, `twitter.com/pennjets` exist was not verified (code sweep only).
- Footer copy: `Footer.jsx:88 Premier aviation brokerage services with over two decades of experience.` (experience claim; About.jsx:94 says founded 2025).
- Copyright: `Footer.jsx:7 const currentYear = new Date().getFullYear();` and `Footer.jsx:149 © {currentYear} PennJets. All rights reserved.` -> renders **2026**. Not stale.
- Contact line: `Footer.jsx:152 <span>📞 Call: (954) 546-0763</span>` / `Footer.jsx:153 <span>✉️ Email: info@pennjets.com</span>`. Home page's in-page footer uses a different phone and email (see Home).
- The global footer contains NO broker / not-a-direct-air-carrier disclosure.

### 0.3 Environment variables referenced in src (`import.meta.env.*`)

```
src/components/pages/Contact/Contact.jsx:31:      const crmApiUrl = import.meta.env.VITE_CRM_API_URL || 'https://crm.pennjets.com';
src/components/pages/Contact/Contact.jsx:32:      const webhookId = import.meta.env.VITE_CONTACT_WEBHOOK_ID;
src/services/blogApi.js:4:const CRM_API_URL = import.meta.env.VITE_CRM_API_URL || 'http://localhost:3001';
src/services/blogApi.js:5:const FORM_SECRET = import.meta.env.VITE_CONTACT_FORM_SECRET || '';
src/services/blogApi.js:79:      'joe@pennjets.com': import.meta.env.VITE_WEBHOOK_JOE_PENNELLA,
src/services/blogApi.js:80:      'jameswofford@pennjets.com': import.meta.env.VITE_WEBHOOK_JAMES_WOFFORD,
src/services/blogApi.js:84:    return webhookMap[authorEmail?.toLowerCase()] || import.meta.env.VITE_CONTACT_WEBHOOK_ID;
```
Distinct: `VITE_CRM_API_URL`, `VITE_CONTACT_WEBHOOK_ID`, `VITE_WEBHOOK_JOE_PENNELLA`, `VITE_WEBHOOK_JAMES_WOFFORD`, `VITE_CONTACT_FORM_SECRET` (read but never used). `.env.example` only documents three EmailJS vars that nothing reads. Fallback hosts disagree with CLAUDE.md (`https://www.pennforce.pennjets.com`): Contact falls back to `https://crm.pennjets.com`, blogApi to `http://localhost:3001`. The CI build (`.github/workflows/deploy.yml:27-31`) sets `VITE_CRM_API_URL: https://www.pennforce.pennjets.com` and hardcodes the three webhook IDs in plain text in the workflow file.

### 0.4 src/utils/seo.js (full contents) and importers

```
 1	// SEO utility functions and constants
 2	
 3	export const siteConfig = {
 4	  siteName: 'PennJets',
 5	  siteUrl: 'https://pennjets.com',
 6	  description: 'Premier aviation brokerage services with 25+ years of experience. Buy, sell, and charter premium aircraft with confidence.',
 7	  keywords: 'aviation brokerage, private jets, aircraft sales, charter services, luxury aircraft, aircraft management',
 8	  author: 'PennJets',
 9	  twitterHandle: '@PennJets',
10	  ogImage: '/og-image.jpg',
11	  favicon: '/favicon.ico'
12	};
13	
14	export const generatePageTitle = (pageTitle) => {
15	  return pageTitle ? `${pageTitle} | ${siteConfig.siteName}` : siteConfig.siteName;
16	};
17	
18	export const generateMetaDescription = (description) => {
19	  return description || siteConfig.description;
20	};
21	
22	export const generateKeywords = (additionalKeywords = []) => {
23	  const baseKeywords = siteConfig.keywords.split(', ');
24	  return [...baseKeywords, ...additionalKeywords].join(', ');
25	};
26	
27	export const generateStructuredData = (type, data) => {
28	  const baseStructuredData = {
29	    '@context': 'https://schema.org',
30	    '@type': type,
31	    name: siteConfig.siteName,
32	    url: siteConfig.siteUrl,
33	    description: siteConfig.description,
34	    contactPoint: {
35	      '@type': 'ContactPoint',
36	      telephone: '+1-555-123-4567',
37	      contactType: 'sales',
38	      availableLanguage: 'English'
39	    },
40	    address: {
41	      '@type': 'PostalAddress',
42	      streetAddress: '123 Aviation Boulevard',
43	      addressLocality: 'Teterboro',
44	      addressRegion: 'NJ',
45	      postalCode: '07608',
46	      addressCountry: 'US'
47	    }
48	  };
49	
50	  return { ...baseStructuredData, ...data };
51	};
52	
53	export const aircraftStructuredData = (aircraft) => {
54	  return generateStructuredData('Product', {
55	    name: `${aircraft.year} ${aircraft.manufacturer} ${aircraft.name}`,
56	    description: aircraft.description,
57	    category: aircraft.category,
58	    brand: {
59	      '@type': 'Brand',
60	      name: aircraft.manufacturer
61	    },
62	    offers: {
63	      '@type': 'Offer',
64	      price: aircraft.price,
65	      priceCurrency: 'USD',
66	      availability: aircraft.status === 'Available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
67	    }
68	  });
69	};
```
**Nothing imports it.** `grep -rn "utils/seo\|seo'" src` returns no importers. It is dead code, but it contains a fake phone (`+1-555-123-4567`), a fake Teterboro address, a `25+ years` claim, and references `/og-image.jpg` and `/favicon.ico` which do not exist under `public/`. Safe to delete; dangerous if anyone wires it up.

### 0.5 public/ leftovers and asset sizes

Leftover / non-site files under `public/` (all are copied verbatim into `dist/` and are publicly reachable on www.pennjets.com):
- `public/scroll-test.html` (8,183 B) - title "PennJets Scroll Test", references `/images/night-flight.jpg?v=1` which does not exist.
- `public/scroll-integrated.html` (13,707 B) - standalone prototype page.
- `public/scroll-video-hero.html` (17,343 B) - standalone prototype page.
- `public/images/Salesforce-UI-Refernce-4-Claude.webp` (75,334 B) - CRM UI reference screenshot, not site content.
- `public/images/User-Interface-2.png` (264,862 B) - UI screenshot.
- `public/images/dad4b4e8cd994a4f7711925d90447894_tasks-list-split-view.webp` (49,124 B) - UI screenshot.
- `public/images/new_contact.png` (35,665 B) - UI screenshot.
- `public/images/blog/Gallery.md` (3,001 B) - internal README served publicly; `public/images/blog/{authors,content,featured}/` are empty directories.
- `public/images/hawker-800xp-exterior.jpg` (**30 bytes, ASCII text**: `placeholder-for-aircraft-image`) - NOT an image. Used by `Charter.jsx:23`.
- `public/images/night-flight-hero.jpg` (**109 bytes, ASCII text**: `[Image content would be written here - this is a placeholder since I cannot actually write binary image data]`) - NOT an image. Used as the `/charter` hero at `Charter.jsx:67`.
- `public/Aircraft Specs/Secifications_N400HH.pdf` (69,118 B) - misspelled filename, nothing in src links to it.
- Unreferenced images: `Hawker-sunset.png` (2,129,862 B), `PENNSHARE/AIRCRAFT1324.png` (1,056,130 B), `PENNSHARE/HAWKER-800XP1.jpg`, `HAWKER-800-XP/Hawker-800-xp-home.jpg`, `HAWKER-800-XP/IMG_3169.JPEG` (814,057 B), `HAWKER-800-XP/IMG_3176.JPEG` (824,526 B), `premier-1a-exterior.jpg`, `day-flight.jpg` (806,288 B, only referenced by unused `ScrollHeroSimple.jsx` and the scroll-*.html prototypes).
- Unreferenced video: `public/videos/Falcon-Hero-Flyover3.mp4` (1,594,832 B).

Root-level leftovers outside public (not deployed but clutter): `dist - Copy/`, `Premier 1A Listing/`, `Screenshots/`, `LEGAL-DOCS/`, `URGENT_FIX_APPLIED.md`, `WEBHOOK_*.md`, `EMAILJS-SETUP.md`, `CRM_WEBHOOK_CREATION_STEPS.md`, `deploy.sh`, `Dockerfile`, `docker-compose.yml`, `nginx.conf` (DigitalOcean/nginx path; actual deploy is GitHub Pages per `.github/workflows/deploy.yml`). `.env` (718 B) sits in the repo root with real webhook IDs.

Sizes, everything under public/images and public/videos (`ls -la`), **bold = over 500 KB**:

```
public/images/Cessna-182/CESSNA-182.jpg                       46,417
**public/images/Diamond-1A/diamond-1a-ramp.JPEG            7,369,851**
**public/images/E55-BARON-HOME/E55-BARON-HOME.JPEG        8,405,440**
public/images/Gallery/Bombardier_Challenger_650.jpg          328,583
public/images/Gallery/Embraer_Phenom_300.jpg                  65,273
**public/images/Gallery/commerical.jpg                     4,730,918**
**public/images/Gallery/falcon.jpg                         1,899,694**
**public/images/Gallery/future-aviation.jpg               2,229,026**
**public/images/Gallery/gulfstream.jpg                    2,209,826**
**public/images/Gallery/n400hh-ramp.jpg                   3,520,618**
public/images/Gallery/n400hh-wide-hero.jpg                   173,005
**public/images/Gallery/pc12.jpg                           4,253,344**
**public/images/Gallery/pj-interior.jpg                    3,087,432**
**public/images/Gallery/sunset-jet.jpg                       783,998**
public/images/HAWKER-800-XP/Hawker-800-xp-home.jpg           468,208
**public/images/HAWKER-800-XP/IMG_3169.JPEG                  814,057**
**public/images/HAWKER-800-XP/IMG_3176.JPEG                  824,526**
public/images/Hawker-night - Copy.jpg                        468,208
**public/images/Hawker-sunset.png                          2,129,862**
public/images/Meet-The-Team/CHARLES-BRENNAN.JPEG              86,424
**public/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG         8,856,577**
**public/images/PENNSHARE/AIRCRAFT1324.png                 1,056,130**
public/images/PENNSHARE/HAWKER-800XP.jpg                      53,736
public/images/PENNSHARE/HAWKER-800XP1.jpg                     52,445
public/images/PENNSHARE/PREMIER-1A.jpg                       118,364
public/images/PREMIER-1A-FEATURED.jpg                        118,364
**public/images/PennJets-Website-Logo.png                  1,381,311**
public/images/Salesforce-UI-Refernce-4-Claude.webp            75,334
public/images/User-Interface-2.png                           264,862
public/images/blog/Gallery.md                                  3,001
public/images/dad4b4e8...tasks-list-split-view.webp           49,124
**public/images/day-flight.jpg                               806,288**
public/images/hawker-800xp-exterior.jpg                           30   (text placeholder)
public/images/new_contact.png                                 35,665
public/images/night-flight-hero.jpg                              109   (text placeholder)
public/images/premier-1a-cabin.jpg                            27,388
public/images/premier-1a-entry.jpg                            21,256
public/images/premier-1a-exterior.jpg                         29,124
public/images/premier-1a-hangar - Copy.jpg                    18,282
public/images/premier-1a-hangar.jpg                           18,282
public/images/premier-1a-seating.jpg                          27,388
**public/videos/Falcon-Hero-Flyover.MP4                    1,495,647**  (autoplays on /)
**public/videos/Falcon-Hero-Flyover3.mp4                   1,594,832**  (unused)
```
Worst offenders actually served on pages: `JOSEPH-PENNELLA.JPEG` 8.86 MB (About team card, 128px circle), `E55-BARON-HOME.JPEG` 8.4 MB (Home featured card), `diamond-1a-ramp.JPEG` 7.4 MB (Home, /aircraft, /aircraft/4, /charter), Gallery totals ~23 MB on one page, logo PNG 1.38 MB loaded on every page as both header logo and favicon.

### 0.6 robots.txt / sitemap.xml

`public/robots.txt`: **does not exist**. `public/sitemap.xml`: **does not exist**. Neither is in `dist/` either. No `<link rel="canonical">` anywhere in src or index.html.

### 0.7 Unknown-route (404) handling

`src/App.jsx:33-49` has no `path="*"` route. For an unknown path (e.g. `/foo`) the app renders `TopBanner` + `Header` + an **empty `<main>`** + `Footer`: blank page, no message, no redirect, HTTP 200. On GitHub Pages the hosting 404 is `public/404.html` (spa-github-pages redirect to `/?/foo`), which `index.html:27-36` rewrites back to `/foo`, so the user still lands on the blank page. Sub-route fallbacks that do exist: `AircraftDetail.jsx:14-16` redirects an unknown `/aircraft/:id` to `/aircraft`; `BlogArticle.jsx:111-125` renders "Article Not Found" for an unknown slug.

### 0.8 Global `<head>` from index.html

```
 6	    <meta name="description" content="PennJets - Premier aviation brokerage services. Find and sell private jets, aircraft management, and charter services." />
 7	    <meta name="keywords" content="private jets, aircraft brokerage, charter services, aviation, luxury travel" />
 8	    <meta name="author" content="PennJets" />
 9	    <link rel="icon" type="image/png" href="/images/PennJets-Website-Logo.png" />
10	    <link rel="preconnect" href="https://fonts.googleapis.com">
11	    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
12	    <link rel="preconnect" href="https://www.pennforce.pennjets.com">
13	    <title>PennJets - Premier Aviation Brokerage</title>
```
Pages that set no Helmet (`/aircraft/:id`, `/charter`) fall through to this. "aircraft management, and charter services" in the default description implies providing management/charter. Favicon is the 1.38 MB logo PNG. `src/index.css:1 @import url('https://fonts.googleapis.com/css2?family=Inter:...')` is the only third-party stylesheet. There are no analytics scripts, tag managers, pixels, or iframes anywhere in src (consistent with CLAUDE.md).

### 0.9 Dead / unrouted code in src

- `src/App.jsx:12 import Blog from './components/pages/Blog/Blog';` is imported but never used in a Route (BlogList is routed). `Blog.jsx` contains six fabricated posts with fake authors ("James Peterson", "Sarah Mitchell", "Michael Rodriguez", "Emily Chen") dated 2024 and `/api/placeholder/600/400` images (`Blog.jsx:55-122`). Not rendered today, but bundled.
- `src/components/common/ScrollHero/ScrollHero.jsx`, `ScrollHeroSimple.jsx`, `common/Hero/Hero.jsx`: no importers. `ScrollHero.jsx:296` / `ScrollHeroSimple.jsx:121` say "Explore Our Fleet"; `ScrollHero.jsx:168` loads `https://upload.wikimedia.org/wikipedia/commons/5/5f/Film_grain_overlay.png`; `ScrollHeroSimple.jsx:56` references missing `/images/night-flight.jpg`.
- `src/components/pages/AircraftDetail/AircraftDetail.backup.jsx` (535 lines): not imported. It DID have a Helmet (`:85-88`); the live `AircraftDetail.jsx` lost it.
- `src/utils/seo.js`: see 0.4.
- `BlogArticle.jsx:241-264` uses `prose`/`prose-*` classes, but `package.json` has no `@tailwindcss/typography` and `tailwind.config.js:71 plugins: []`; `node_modules/@tailwindcss` does not exist. The prose classes are no-ops; only the `[&_p]:...` arbitrary variants at `:263-264` style article HTML.

### 0.10 14 CFR 295.23 charter-broker disclosure: where it exists

- `src/components/pages/Home/Home.jsx:282 PennJets is a broker and does not operate aircraft.` (small `text-xs text-gray-500` print inside the Home page's own in-page footer, not the global Footer).
- `src/components/pages/Charter/Charter.jsx:331 <p className="mt-3 text-xs text-white/60">PennJets is a broker and does not operate aircraft.</p>`
- `src/components/pages/Legal/TermsOfService.jsx:39-40 Penn Jets LLC operates as a consulting and aircraft brokerage firm. We do not own or operate aircraft directly.`
- `src/components/pages/Legal/Compliance.jsx:39 We do not hold ourselves out as a direct air carrier; we are not in operational control of aircraft.` and `:30-32 ... 14 CFR Part 295 (Air Charter Brokers). As an intermediary, we fully comply with ... obligations imposed on air charter brokers.`

The exact phrase "air charter broker" appears ONLY on `/compliance`. The statement "not a direct air carrier" appears ONLY on `/compliance`. Nothing in the global `Footer.jsx`, `index.html`, `/services`, `/about`, `/pennshare`, `/aircraft*`, `/blog*`, `/contact`, or `/gallery`. So the disclosure exists but is not site-wide, and the charter solicitation surfaces on `/services` (`Services.jsx:46-60`) and `/pennshare` carry none.

---

## 1. `/` -> `src/components/pages/Home/Home.jsx` (291 lines)

**Renders.** Autoplaying muted looping hero video with headline "Access, You Deserve" and two buttons; a "Featured Aircraft" grid of five hardcoded cards (`Home.jsx:10-76`, NOT read from `aircraftData.js`); the `BonusDepreciationCountdown` section; a "Why PennJets" list; and its own in-page `<footer>` (`:269-286`) rendered above the global Footer (two footers on the page). All data is static in the component.

**Head (Helmet, Home.jsx:154-195).**
```
155	        <title>PennJets — Private Jet Brokerage & Aviation Consulting</title>
156	        <meta name="description" content="PennJets is a private aviation brokerage and consulting firm specializing in aircraft sales, acquisitions, and charter brokerage. Partnering with vetted Part 135 operators. Call (973) 868‑8425." />
157	        <meta name="keywords" content="private aviation, aircraft brokerage, aviation consulting, charter broker, Premier 1A" />
158	        <meta property="og:title" content="PennJets — Private Jet Brokerage & Aviation Consulting" />
159	        <meta property="og:description" content="Private aviation. Done right. Brokerage, consulting, and charter connections." />
160	        <meta property="og:image" content="/images/og-hero.jpg" />
161	        <meta property="og:type" content="website" />
162	        <meta property="og:url" content="https://www.pennjets.com" />
163	        <meta name="twitter:card" content="summary_large_image" />
166	        <script type="application/ld+json">  (Organization: name PennJets, url https://www.pennjets.com, logo .../PennJets-Website-Logo.png, address "690 SW 1st Ct #1030, Miami, FL 33130", telephone "+1-973-868-8425", email info@pennjets.com, sameAs [https://www.pennjets.com])
```
No canonical. `og:image` is a relative path AND `public/images/og-hero.jpg` **does not exist**.

**Internal links.**
- `Home.jsx:20 url: "/aircraft/3"` -> exists.
- `Home.jsx:34 url: "/aircraft/1"` -> exists.
- `Home.jsx:48 url: "/aircraft/2"` -> exists.
- `Home.jsx:62 url: "/aircraft/4"` -> exists.
- `Home.jsx:72 url: "/aircraft/baron-e55"` -> route pattern matches, but `AircraftDetail.jsx:11 parseInt("baron-e55")` is NaN so it redirects to `/aircraft`. **Effectively broken** (the Baron is `id: 5` in aircraftData).
- `Home.jsx:98`, `:141 navigate(a.url)` (card image and "View Details").
- `Home.jsx:221 navigate('/aircraft/3')` "Browse Premier 1A Share" -> exists.
- `Home.jsx:227 navigate('/contact')` "Get a Quote" -> exists.
- `Home.jsx:275 href="mailto:inquiries@pennjets.com"` (mailto; every other page uses info@pennjets.com).
- via `BonusDepreciationCountdown.jsx:103 navigate('/pennshare')` -> exists.

**External.** None on the page itself (ld+json URLs only).

**Forms.** None.

**Copy conflicts.**
- `Home.jsx:16 price: "$550K Share — Charter Revenue Offset"` - pricing claim + implies charter revenue.
- `Home.jsx:23 blurb: "FLL-based • On Part 135 • Fast, efficient light jet"` - states the aircraft is on a Part 135 certificate (operational/availability claim).
- `Home.jsx:30 price: "$3,300,000"` for the Hawker shown as `featured: true` (`:36`), while `aircraftData.js:11 status: 'No Longer Available'`. Stale inventory presented as real, with a price.
- `Home.jsx:44 price: "$50,000 — 1/10th Share"`, `:47 location: "TBD"`.
- `Home.jsx:58 rangeNm: 1700` for the Diamond 1A vs `aircraftData.js:57 range: '1,512 nm'`.
- `Home.jsx:74 blurb: "Project aircraft • Trust signal tile"` - internal marketing note rendered to visitors on the SOLD Baron card.
- `Home.jsx:215-217 Aviation consulting and brokerage — with our transparent costs and deal making team. We partner with vetted Part 135 certified operators throughout the Domestic US.` - "certified" language; acceptable framing (partner) but regulatory wording per CLAUDE.md goes to Joseph.
- `Home.jsx:262 <li>Access to vetted operators and maintenance networks</li>`.
- `Home.jsx:274 <strong>Call:</strong> (973) 868‑8425 · <strong>Email:</strong> inquiries@pennjets.com` vs global `Footer.jsx:152-153 (954) 546-0763 / info@pennjets.com` - two footers, two phones, two emails on the same page.
- `Home.jsx:279 PennJets LLC — Private aviation. Simplified. Monetized.`
- `Home.jsx:282 PennJets is a broker and does not operate aircraft.` (the disclosure; good, but in `text-xs text-gray-500`).
- From `BonusDepreciationCountdown.jsx` (rendered on `/`):
  - `:6 endDate = new Date('2025-12-31T23:59:59-05:00')` - **expired**; timer shows 00/00/00/00.
  - `:78 <span>Limited Time Opportunity</span>`
  - `:82 Countdown to 2025 Bonus Depreciation Deadline`
  - `:85-87 Take advantage of significant tax benefits with fractional aircraft ownership. Time is running out to maximize your 2025 deductions.` - stale tax-year and tax-benefit claim.
  - `:109 Act now to secure bonus depreciation benefits before the deadline`
  - `:116-117 100% / Bonus Depreciation Available` - tax claim.
  - `:120-121 $550K / Premier 1A Share Price` - pricing.
  - `:124-125 6-8 / Passengers Capacity` (PennShare.jsx:210 says 6; Charter.jsx:10 says 7).
- From `TopBanner.jsx` (every page): `:26 target = new Date('2025-12-31T23:59:59-05:00')` **expired**, so every page shows "Bonus Depreciation Deadline: 000d 00h 00m 00s Learn More →" (`:55`, `:61-71`, `:78`).
- From `Header.jsx` (every page): `:47 endDate = new Date('2026-12-31T23:59:59')` "Calendar Year Ending:" - second countdown banner.

**Placeholder / stale.** `Home.jsx:47 location: "TBD"`; `:74 "Trust signal tile"`; `:113-115` hidden "Aircraft Image" fallback div; expired 2025 countdown (above); missing `og-hero.jpg`.

**Images.**
- `/images/PREMIER-1A-FEATURED.jpg` (`:21`) exists, 118,364 B.
- `/images/PENNSHARE/HAWKER-800XP.jpg` (`:35`) exists, 53,736 B.
- `/images/Cessna-182/CESSNA-182.jpg` (`:49`) exists, 46,417 B.
- `/images/Diamond-1A/diamond-1a-ramp.JPEG` (`:63`) exists, **7,369,851 B**.
- `/images/E55-BARON-HOME/E55-BARON-HOME.JPEG` (`:73`) exists, **8,405,440 B**.
- `/images/og-hero.jpg` (`:160`) **MISSING**.
- Logo via ld+json `:172` exists.

**Autoplay video.** `Home.jsx:199-206 <video src="/videos/Falcon-Hero-Flyover.MP4" autoPlay muted loop playsInline ...>` - file exists, **1,495,647 B (1.43 MB)**, no `poster`, no `preload` attribute, loads on every home visit. The footage is a Dassault Falcon fly-over; Penn Jets lists no Falcon. Stock/third-party footage used as the brand hero.

---

## 2. `/about` -> `src/components/pages/About/About.jsx` (268 lines)

**Renders.** Dark hero "About PennJets", "Our Story" two paragraphs, "Meet Our Team" grid of five hardcoded `teamMembers` (`:10-61`) with photo/phone/email/specialties, a "Collective Expertise" stats block (30+ / 24/7), three "Professional Services" cards, CTA. All static.

**Head (About.jsx:67-70).**
```
68	        <title>About PennJets - Premier Aviation Brokerage Since 1998</title>
69	        <meta name="description" content="Learn about PennJets' 25+ year history in aviation brokerage. Meet our expert team and discover why we're trusted for luxury aircraft transactions worldwide." />
```
No OG, no canonical.

**Internal links.** `About.jsx:250 navigate('/contact')` "Contact Our Team" -> exists; `:257 navigate('/aircraft')` "View Our Aircraft" -> exists. Team emails/phones are plain text, not links.

**External.** None.

**Forms.** None.

**Copy conflicts.**
- `About.jsx:68 About PennJets - Premier Aviation Brokerage Since 1998` and `:78 Since 1998, PennJets has been at the forefront of luxury aviation,` vs `:94-95 Founded in 2025 by Aviation Enthusiast Joseph Pennella, Penn Jets LLC, an emerging aviation broker.` - **direct self-contradiction on the same page** (also grammatically incomplete sentence at :94-95).
- `About.jsx:69 25+ year history in aviation brokerage ... trusted for luxury aircraft transactions worldwide` - experience + transaction-history claim.
- `About.jsx:99 looking for fractional ownership with 100% bonus depreciation` - tax claim.
- `About.jsx:100 provides the expertise, negotiation power, and end-to-end management` - "management".
- `About.jsx:25 ... modernizing private aviation operations through cutting-edge solutions ...` (CTO bio).
- `About.jsx:55 Our extended team includes certified mechanics, avionics specialists, insurance experts, and administrative professionals` - claims employed technical staff; conflicts with "no crew / not an operator" and with the four-person team listed.
- `About.jsx:52-60` a fake fifth "team member" named `'Aviation Team'` / `'Specialists & Support'` / `'Industry Professionals'` with `image: '/images/Meet-The-Team/aviation-team.jpg'` (missing).
- `About.jsx:183-184 Our team brings together decades of combined experience across all aspects of private aviation, from aircraft operations to deal structuring.`
- `About.jsx:190-191 30+ / Years Combined Experience` - round-number experience claim.
- `About.jsx:194-195 24/7 / Client Support`.
- `About.jsx:220-222 Smart ownership solutions with professional management and charter revenue opportunities.` - management/charter revenue claim.
- `About.jsx:229-230 Access to vetted Part 135 certified operators with experienced pilots and well-maintained aircraft through our trusted partner network.` - vouches for pilots/maintenance of third parties.
- `About.jsx:37 phone: '(310) 994-4060'` (James), `:27 '(908) 655-7075'` (Charles), `:17 '(973) 868-8425'` (Joseph), `:47 '(954) 546-0763'` (Joe Delisio) and `:57` same for "Aviation Team" - personal numbers published; the (954) number is also the global footer number.

**Placeholder / stale.** The "Aviation Team" pseudo-member (`:52-60`); `:136-138` initials fallback div; "Since 1998" vs "Founded in 2025".

**Images.**
- `/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG` (`:16`) exists, **8,856,577 B** (shown in a 128 px circle).
- `/images/Meet-The-Team/CHARLES-BRENNAN.JPEG` (`:26`) exists, 86,424 B.
- `/images/Meet-The-Team/james-wofford.jpg` (`:36`) **MISSING** (falls back to initials "JW").
- `/images/Meet-The-Team/joe-delisio.jpg` (`:46`) **MISSING** (falls back to "JD").
- `/images/Meet-The-Team/aviation-team.jpg` (`:56`) **MISSING** (falls back to "AT").

**Autoplay video.** None.

---

## 3. `/services` -> `src/components/pages/Services/Services.jsx` (405 lines)

**Renders.** Gradient hero, a six-card "Our Service Portfolio" grid (`services` array `:10-113`, each with an `id` anchor and a "Discuss This Service" button), a four-step "Our Approach" timeline, four "PennJets Advantage" cards, CTA. All static.

**Head (Services.jsx:199-202).**
```
200	        <title>Aviation Services - Aircraft Sales, Charter Brokerage & Consulting | PennJets</title>
201	        <meta name="description" content="Comprehensive aviation services including aircraft sales, acquisitions, charter brokerage, and consulting. Partnering with vetted Part 135 operators. Expert guidance for all your private aviation needs." />
```
No OG, no canonical.

**Internal links.** `Services.jsx:280 navigate('/contact')` (x6 "Discuss This Service") -> exists; `:385 navigate('/contact')` "Schedule a Consultation" -> exists; `:394 navigate('/aircraft')` "Browse Aircraft" -> exists. Anchor ids rendered at `:242 id={service.id}`: `sales`, `acquisition`, `charter`, `management`, `analysis`, `consulting` (all footer anchors resolve).

**External.** None.

**Forms.** None.

**Copy conflicts.**
- `Services.jsx:22 'Global buyer network and targeted outreach'`.
- `Services.jsx:40 'Financing and insurance coordination'`.
- `Services.jsx:46-47 'Charter Brokerage' / 'Access to vetted Part 135 operators through our extensive partner network.'` - fine as brokerage, but no 295.23 disclosure on this page.
- `Services.jsx:54 'Certified Part 135 operator partnerships'` - "certified" language.
- `Services.jsx:56 '24/7 concierge and trip support'` - service-level claim.
- `Services.jsx:57 'Transparent pricing with no hidden fees'` - pricing claim.
- `Services.jsx:63-64 'Aircraft Management' / 'Full-service aircraft management to maximize your investment and minimize complexity.'` - **operator-type service offered as a headline service** (also linked from Footer "Aircraft Management" and a Contact form option).
- `Services.jsx:71 'Maintenance coordination and oversight'`.
- `Services.jsx:72 'Professional crew recruitment and management'` - **crew employment/management claim**.
- `Services.jsx:73 'Insurance, registration, and regulatory compliance'`.
- `Services.jsx:75 'Charter revenue optimization strategies'`.
- `Services.jsx:105 'Fleet planning and optimization'`.
- `Services.jsx:108 'Tax strategy and legal structuring'` - tax/legal advice claim.
- `Services.jsx:161 '30+ years of combined experience in luxury aviation and aircraft transactions'` - round-number experience claim.
- `Services.jsx:170 'Extensive relationships with operators, buyers, and industry professionals worldwide'`.
- `Services.jsx:187-188 'Proven Track Record' / 'Successful transactions and satisfied clients across all aircraft categories'` - transaction-history claim (company founded 2025 per About).
- `Services.jsx:221-222 ... backed by decades of industry expertise ...`.
- `Services.jsx:298 A proven methodology refined over decades to deliver exceptional results`.

**Placeholder / stale.** None literal.

**Images.** None (inline SVG icons only).

**Autoplay video.** None.

---

## 4. `/aircraft` -> `src/components/pages/AircraftListing/AircraftListing.jsx` (311 lines)

**Renders.** Dark hero "Aircraft for Sale", a search box + four filter selects (manufacturer/category/price/status) + grid/list toggle, "Showing N of 5 aircraft", a card per aircraft from **`src/data/aircraftData.js`** (`aircraftDatabase`, `manufacturers`, `categories`, `priceRanges`), and a CTA. All five entries (Hawker 800XP "No Longer Available", Mitsubishi Diamond 1A "Under Contract"/for parts, Premier 1A 1/4 share, Cessna 182 1/10 share, Baron E55 "Sold") are listed regardless of status.

**Head (AircraftListing.jsx:85-88).**
```
86	        <title>Aircraft for Sale - Premium Private Jets | PennJets</title>
87	        <meta name="description" content="Browse our exclusive selection of premium private jets and aircraft for sale. Find your perfect aircraft with expert guidance from PennJets aviation consultants." />
```
No OG, no canonical.

**Internal links.** `:271 navigate(`/aircraft/${aircraft.id}`)` for ids 1,2,3,4,5 -> `/aircraft/:id` exists (id 5 Baron renders with placeholder image); `:278 navigate('/contact')` "Inquire"; `:302 navigate('/contact')` "Contact a Consultant". All exist.

**External.** None on this page.

**Forms.** Filter inputs only (`:109-178`); client-side state, no submission.

**Copy conflicts (including data from aircraftData.js rendered here).**
- `AircraftListing.jsx:96-97 Discover our curated collection of premium aircraft. Each listing represents exceptional quality, performance, and value in the luxury aviation market.` - inventory presented as real/curated; 3 of 5 are sold/parts/unavailable.
- `AircraftListing.jsx:187 Showing {filteredAircraft.length} of {aircraftDatabase.length} aircraft` -> "Showing 5 of 5 aircraft".
- `AircraftListing.jsx:296 Our aviation consultants have access to an extensive network of off-market aircraft.`
- `aircraftData.js:8-9 price: 3300000, priceFormatted: '$3,300,000'` with `:11 status: 'No Longer Available'` - **a price on an unavailable aircraft**; the status filter (`:174-177`) offers Available/Under Contract/Sold, so "No Longer Available" cannot be selected and gets the gray default badge.
- `aircraftData.js:36 The Hawker 800XP is a proven mid-size business jet ...` fine.
- `aircraftData.js:44-47 price: 0, priceFormatted: 'Under Contract', status: 'Under Contract'`; `:75 'Offered for Parts'`; `:79 ... offered for parts ... Full listing details and additional photos available on Aircraft Shopper Online.`
- `aircraftData.js:88-89 price: 550000, priceFormatted: '$550,000 (1/4 Share)'`, `:91 status: 'Available'`, `:121 Available as a 1/4 share ownership.` - pricing/availability claim.
- `aircraftData.js:129-130 price: 50000, priceFormatted: '$50,000 (1/10th Share)'`, `:132 status: 'Available'`, `:133 location: 'TBD'`, `:156 ... Perfect for personal transportation, training, or recreational flying.` - pricing/availability; "training" use for a fractional share.
- `aircraftData.js:164-167 price: 0, priceFormatted: 'SOLD', status: 'Sold'`, `:187 ... provided excellent training and personal transportation capabilities.` - a sold aircraft kept in the "for sale" list (transaction-history signal).
- `aircraftData.js:207-212 priceRanges` labels "Under $500K", "$500K - $1M", "$1M - $5M", "Over $5M".

**Placeholder / stale.** `aircraftData.js:133 location: 'TBD'`; `aircraftData.js:170-171 '/api/placeholder/800/600'` (Baron images - route does not exist, `onError` hides the img and shows the "Aircraft Image" gray box at `:226-228`); `aircraftData.js:14-16` and `:135-137` repeat the same image three times as a fake gallery; `:14 '/images/Hawker-night - Copy.jpg'` (a " - Copy" filename is served).

**Images (first image of each entry, `:217 src={aircraft.images[0]}`).**
- `/images/Hawker-night - Copy.jpg` exists, 468,208 B.
- `/images/Diamond-1A/diamond-1a-ramp.JPEG` exists, **7,369,851 B**.
- `/images/PREMIER-1A-FEATURED.jpg` exists, 118,364 B.
- `/images/Cessna-182/CESSNA-182.jpg` exists, 46,417 B.
- `/api/placeholder/800/600` **MISSING** (not a file; no such route on GitHub Pages).

**Autoplay video.** None.

---

## 5. `/aircraft/:id` -> `src/components/pages/AircraftDetail/AircraftDetail.jsx` (244 lines)

**Renders.** Looks up `aircraftDatabase.find(a => a.id === parseInt(id))` (`:11`); on miss, `navigate('/aircraft')` (`:15`). Breadcrumb, title, category, a status pill, price, location, one hero image chosen by a hardcoded `id === 1/2/3/4` ladder (`:77-117`, so id 5 gets the "Aircraft Image" box), Description, Specifications table (all keys), Key Features, a Quick Information sidebar, an optional "Full Listing Details" card linking to ASO (`:195-214`, only id 4 has `tradeAPlaneUrl`), and a generic "Contact a Consultant" card.

**Head.** **None.** No `Helmet` import or usage in `AircraftDetail.jsx`; the page inherits `index.html` title "PennJets - Premier Aviation Brokerage". (`AircraftDetail.backup.jsx:85-88` had `<title>{year} {manufacturer} {name} - {priceFormatted} | PennJets</title>` and a description; that file is unused.)

**Internal links.** `:15`, `:27`, `:45 navigate('/aircraft')` -> exists; `:43 navigate('/')` -> exists; `:231 navigate('/contact')` -> exists.

**External.** `:204-212 <a href={aircraft.tradeAPlaneUrl} target="_blank" rel="noopener noreferrer">` -> `aircraftData.js:80 https://www.aso.com/listings/spec/ViewAd.aspx?id=200889&listingType=true&IsInternal=True&pagingNo=1&searchId=62389252&dealerid=` (carries a session-ish `searchId`; may not resolve for third parties; not verified).

**Forms.** None.

**Copy conflicts.**
- `:62-64 <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">{aircraft.status}</span>` - **status pill is always green**, so "No Longer Available", "Under Contract", and "Sold" all render as green "available"-styled badges.
- `:66-68 {aircraft.priceFormatted}` and `:189 <span className="font-bold text-blue-600">{aircraft.priceFormatted}</span>` -> "$3,300,000" on `/aircraft/1` whose status is "No Longer Available".
- `:79 src="/images/PENNSHARE/HAWKER-800XP.jpg"` for id 1 while the listing card uses `Hawker-night - Copy.jpg` - two different aircraft photos for the same listing; neither is verified as the actual airframe.
- `:223-224 <div className="font-medium">Aviation Consultant</div> <div className="text-sm text-gray-600">Private Jet Advisor</div>` with a 👤 emoji - generic placeholder contact.
- `:227-228 📞 (973) 868-8425 / ✉️ info@pennjets.com` (vs footer (954) number).
- Data rendered from aircraftData.js as listed in section 4.

**Placeholder / stale.** `:118-120` "Aircraft Image" gray box (shown for id 5); the 👤 "Aviation Consultant" card; no Helmet.

**Images.** `/images/PENNSHARE/HAWKER-800XP.jpg` (`:79`) exists 53,736 B; `/images/Cessna-182/CESSNA-182.jpg` (`:89`) exists 46,417 B; `/images/PENNSHARE/PREMIER-1A.jpg` (`:99`) exists 118,364 B (byte-identical size to PREMIER-1A-FEATURED.jpg); `/images/Diamond-1A/diamond-1a-ramp.JPEG` (`:109`) exists **7,369,851 B**. Note the Premier 1A's six-image gallery in `aircraftData.js:93-100` (`premier-1a-hangar.jpg`, `-entry`, `-cabin`, `-seating`, `-hangar - Copy`) is never rendered by this component.

**Autoplay video.** None.

---

## 6. `/pennshare` -> `src/components/pages/PennShare/PennShare.jsx` (452 lines)

**Renders.** White hero with a "Featured Opportunity" table (2006 Premier 1A, 1/4 share, $550,000, 100 hours), four benefit cards, a Premier 1A showcase (image + 4 stat tiles), a "2004 Hawker 800XP" section (1/4 share, $750,000), and an "Inquire About PennShare" form. All static.

**Head (PennShare.jsx:30-33).**
```
31	        <title>PennShare - Fractional Aircraft Ownership | PennJets</title>
32	        <meta name="description" content="Discover PennShare fractional aircraft ownership. Reduce costs, enjoy professional management, and access private aviation with flexible ownership options." />
```
No OG, no canonical.

**Internal links.** `:55 navigate('/contact')` "Get Started Today"; `:62 navigate('/aircraft')` "View Available Shares"; `:93`, `:226`, `:240 navigate('/aircraft/3')`; `:298`, `:312 navigate('/aircraft/1')`; `:25 navigate('/contact')` (form submit). All targets exist. Note `/aircraft/1` is the Hawker whose data says "No Longer Available".

**External.** None.

**Forms (PennShare.jsx:348-445).** Fields: `name` (required), `email` (required), `phone`, `interest` select (1/4-share, 1/2-share, full-ownership, information), `comments` textarea (uncontrolled, `:417-422`), `consent` checkbox (required). Submit handler:
```
23	  const handleSubmit = (e) => {
24	    e.preventDefault();
25	    navigate('/contact');
26	  };
```
**Nothing is posted. The entered data is discarded** and the user is sent to `/contact` to start over. No success/error state, no alert. The copy above the form promises `:343 Our team will contact you within 24 hours.`

**Copy conflicts.**
- `:49 Share the costs, not the convenience. Professional management Exclusively through Part 135-Charter Operators` (odd capitalisation/hyphenation; management claim).
- `:75 2006 Beechcraft Premier 1A`, `:79 1/4 Ownership`, `:83 $550,000`, `:87 100 Hours` - pricing/availability/allotment claims.
- `:126 Share acquisition, operating, and maintenance costs ...`.
- `:137-141 Professional Management / PennJets handles all operational aspects including scheduling, maintenance, and regulatory compliance.` - **states PennJets performs operations** (scheduling, maintenance, regulatory compliance). Direct conflict with "not an operator".
- `:151-154 Guaranteed Access / Enjoy priority booking and guaranteed aircraft availability with our advanced scheduling system.` - **guarantee** + availability + implies an in-house scheduling system.
- `:165-168 Flexible Exit / Clear buy-sell agreements and structured exit strategies protect your investment.` - investment-protection claim.
- `:194 AVAILABLE NOW` badge; `:200 ... this meticulously maintained light jet.` - availability + maintenance-condition claim.
- `:206-219` Premier stats 1,460 nm / 6 pax / 456 kts / 41K ft.
- `:259 2004 Hawker 800XP` vs `aircraftData.js:7 year: 2003` and `Home.jsx:27 year: 2003` - **year mismatch**.
- `:264 1/4 Ownership` / `:268 $750,000` for the Hawker vs `aircraftData.js:8-11 $3,300,000 ... 'No Longer Available'` - **conflicting price and availability for the same aircraft across pages**.
- `:256 MID-SIZE JET`, `:272-273 Step up to mid-size luxury with exceptional range and performance. Perfect for transcontinental business travel ...`.
- `:343 Our team will contact you within 24 hours.` (response-time promise on a form that does not submit).
- `:391 placeholder="(973) 868-8425"` - a real company phone as the phone-field placeholder.

**Placeholder / stale.** `:186`, `:233`, `:305`, `:326 e.target.src = '/api/placeholder/...'` - onError fallback points to a non-existent route (would loop to a second 404). `:391` phone placeholder. The whole form is a stub (`:23-26`).

**Images.** `/images/PENNSHARE/PREMIER-1A.jpg` (`:182`, `:229` - same file shown twice, second labelled "Premier 1A Interior Details" though it is the same exterior shot) exists, 118,364 B. `/images/PENNSHARE/HAWKER-800XP.jpg` (`:301`, `:322` - same file twice) exists, 53,736 B.

**Autoplay video.** None.

---

## 7. `/charter` -> `src/components/pages/Charter/Charter.jsx` (350 lines)

**Renders.** A hero image with "Charter, Simplified.", four "Why Charter with PennJets" cards, a "Popular Routes" table of six FLL-origin routes with distances/block times, a "Fleet Access" grid of three cards from a hardcoded `FLEET` array (`:6-37`, labelled "Mock fleet data"), a "Request a Charter Quote" form with a live "Quick Estimate" price calculator, and a footer CTA. All static. Wraps everything in its own `<main>` (`:340`) nested inside App's `<main>` (`App.jsx:32`) - two `<main>` elements.

**Head.** **None.** No `Helmet` import in `Charter.jsx`; inherits `index.html` title/description.

**Internal links.**
- `:15 url: "/aircraft/premier-1a"` -> pattern matches but `parseInt` NaN -> redirects to `/aircraft`. **Effectively broken** (should be `/aircraft/3`).
- `:25`, `:35 url: "/aircraft"` -> exists.
- `:199 <Link to={f.url}>` "View Details".
- `:85 href="#quote"`, `:91 href="#fleet"`, `:327 href="#quote"` - in-page anchors (`id="quote"` at `:245`, `id="fleet"` at `:182`); plain `<a href="#...">`, fine.
- `:309 <Link to="/contact">` exists; `:328 <Link to="/aircraft">` exists.

**External.** None.

**Forms (Charter.jsx:248-295).** Fields: `from`, `to`, `date` (departure), `retDate`, `pax` (number 1-9), `hours` (block hours), `cabin` (light/midsize), `notes`. Submit:
```
237	  const handleSubmit = (e) => {
238	    e.preventDefault();
239	    // Replace with your POST to backend or email service
240	    console.log({ from, to, date, retDate, pax, hours, cabin, notes, estimate: total });
241	    setSubmitted(true);
242	  };
```
**Nothing is posted anywhere**; the lead is logged to the browser console and the user is shown `:293 Thanks! Your request has been recorded. We'll follow up shortly.` - **a false success message; the lead is lost**. No CRM webhook, no UTM capture (CLAUDE.md requires leads go to PennForce).

**Copy conflicts.**
- `:4 // ---------- Mock fleet data (swap for your real assets/links) ----------` and `const FLEET` (`:6`), `:179 // ---------- Fleet grid ----------`, `:181 const Fleet`, `:182 title="Fleet Access" subtitle="Light to midsize jets, matched to mission and budget."`, `:94 View Fleet` - **"fleet" framing throughout** on a page for a company with no fleet.
- `:14 note: "FLL‑based • On Part 135"` - operational status claim for the Premier 1A.
- `:10 pax: 7` (Premier) vs 6 elsewhere; `:20 pax: 8` (Hawker) vs 9 elsewhere; `:12`, `:22`, `:32 speedKt: 450` for all three (copy-paste).
- `:28-36` "Diamond 1A ... Light jet efficiency" presented as charter-available - `aircraftData.js:75-79` says it is offered **for parts**.
- `:78-81 Charter, Simplified. / On‑demand private jet charter with transparent pricing and responsive coordination. Light to midsize jets with vetted operators.` - "transparent pricing" claim.
- `:108-109 Vetted Operators / Trusted crews, strong maintenance programs, and repeat‑client safety culture.` - vouches for crews/maintenance/safety.
- `:112-113 Transparent Quotes / Fuel, FBO fees, overnights, de‑icing—disclosed up front. No surprises.`
- `:116-117 24/7 Coordination / Concierge for ground transfers, catering, pets, and itinerary changes.`
- `:120-121 Premier 1A Access / Flagship FLL‑based Premier 1A—efficient and charter‑ready.` - **"Flagship"** implies company-owned fleet; "charter-ready" is an operational status claim.
- `:141-148 POPULAR_ROUTES` with `miles`/`hours` and `:151 subtitle="Indicative flight times for planning. Request a quote for live pricing."`.
- `:212-220 useCharterEstimate`: `:214 const base = cabin === "midsize" ? 6300 : 4200; // per flight hour (USD)`, `:216 const fees = 650;`, `:217 const catering = pax * 35;` and rendered at `:302-307` as "Cabin base (per hr) $4,200", "Ops fees (est.) $650", "Catering ...", "Total (est.) $..." - **invented hourly charter pricing shown as dollar figures** (`:300` "Not a quote" caveat is present).
- `:245 subtitle="We'll respond quickly with live availability and a firm price."` - availability + firm-price promise.
- `:288 By submitting, you agree to be contacted by PennJets. We respond quickly.`
- `:323-324 Ready to go wheels up? / Call (973) 868‑8425 or send your itinerary for a fast quote.`
- `:331 PennJets is a broker and does not operate aircraft.` (disclosure present, `text-xs text-white/60`).

**Placeholder / stale.** `:4` "Mock fleet data (swap for your real assets/links)"; `:65 {/* Ensure your hero image is exported with fixed dimensions to avoid CLS */}`; `:139 // ---------- Popular routes (static sample) ----------`; `:213 // Very simple heuristic ranges; replace with your pricing logic or API call`; `:239 // Replace with your POST to backend or email service`; the two text-file "images" below.

**Images.**
- `/images/night-flight-hero.jpg` (`:67`, the page hero, `loading="eager"`, `alt="Private jet on ramp at sunset"`) exists on disk but is a **109-byte ASCII text file**, not an image -> **broken hero image on /charter**.
- `/images/premier-1a-cabin.jpg` (`:13`) exists, 27,388 B.
- `/images/hawker-800xp-exterior.jpg` (`:23`) exists on disk but is a **30-byte text file** (`placeholder-for-aircraft-image`) -> **broken image**; no `onError` fallback on this card (`:186-193`).
- `/images/Diamond-1A/diamond-1a-ramp.JPEG` (`:33`) exists, **7,369,851 B**.

**Autoplay video.** None.

---

## 8. `/contact` -> `src/components/pages/Contact/Contact.jsx` (338 lines)

**Renders.** Dark hero "Contact Us", a contact form card, a "Get in Touch" list (phone/email/address), a "Quick Response" card, an "Our Locations" grid with one Miami HQ card, and a gray "Interactive Map" placeholder box. Static apart from the webhook POST.

**Head (Contact.jsx:125-128).**
```
126	        <title>Contact PennJets - Get in Touch with Aviation Experts</title>
127	        <meta name="description" content="Contact PennJets for all your aviation needs. Speak with our expert team about aircraft sales, acquisitions, charter brokerage, and consulting services." />
```
No OG, no canonical.

**Internal links.** None (no Link/navigate on the page). Phone/email are plain text, not `tel:`/`mailto:`.

**External.** The webhook POST (below).

**Forms (Contact.jsx:150-245).** Fields: `name` (required), `email` (required), `phone`, `company`, `service` select (aircraft-sales, aircraft-acquisition, charter-brokerage, **aircraft-management**, consulting, other), `message` (required). Posts to:
```
31	      const crmApiUrl = import.meta.env.VITE_CRM_API_URL || 'https://crm.pennjets.com';
32	      const webhookId = import.meta.env.VITE_CONTACT_WEBHOOK_ID;
38	      const webhookUrl = `${crmApiUrl}/api/webhooks/incoming/${webhookId}`;
43	      const response = await fetch(webhookUrl, { method: 'POST', ... JSON body: name, email, phone, company, service, message, pageUrl, utm_source, utm_medium, utm_campaign, utm_term, utm_content })
```
Success (`:71-83`): `setSubmitStatus('success')`, **`alert('Thank you for your message! We will contact you shortly.')`**, form reset. Error (`:84-88`): `setSubmitStatus('error')`, **`alert('Sorry, there was an error sending your message. Please try again or contact us directly at info@pennjets.com or call (973) 868-8425.')`**. `submitStatus` is set but never rendered; feedback is `window.alert` only. `:40 console.log('Submitting to CRM webhook:', webhookUrl)` logs the webhook URL (with ID) to the console. Fallback host `https://crm.pennjets.com` differs from CLAUDE.md's `https://www.pennforce.pennjets.com` (CI sets the env var, so production is fine; local dev without `.env` would post to the wrong host).

**Copy conflicts.**
- `:97 description: 'Available 24/7 for urgent inquiries'` (phone) - 24/7 claim.
- `:103 description: 'We respond within 2 hours'` and `:279 We typically respond to all inquiries within 2 hours during business hours.` - response-time promises.
- `:109 'Visit our offices by appointment'`; `:293-294 Visit us at any of our convenient locations or schedule a meeting at your preferred airport.` - "any of our convenient locations" while `offices` (`:114-121`) has exactly one entry.
- `:216 <option value="aircraft-management">Aircraft Management</option>` - offers management as a service.
- `:96`, `:118 '(973) 868-8425'` vs `Footer.jsx:152 (954) 546-0763`.
- `:108`, `:117 '690 SW 1st Ct #1030\nMiami, FL 33130'` (consistent with Home ld+json and legal pages; contradicts dead `seo.js` Teterboro address).

**Placeholder / stale.**
```
329	              <div className="text-xl">Interactive Map</div>
330	              <div className="text-sm">Google Maps integration would go here</div>
```
rendered to visitors in a full-width `aspect-video` gray box (`:322-334`). `:231 placeholder="Tell us about your aviation needs..."` is a normal input placeholder.

**Images.** None (react-icons only).

**Autoplay video.** None.

---

## 9. `/blog` -> `src/components/pages/Blog/BlogList.jsx` (291 lines)

**Renders.** Dark hero "Aviation Insights", a category-pill filter derived from post keywords, a grid of post cards (featured image, category, read time, title, excerpt, author, date, "Read More"), and a newsletter signup. **Data source: CRM API** via `blogApi.getPosts()` -> `GET ${VITE_CRM_API_URL}/api/public/blog` (`blogApi.js:33`); on any failure it silently returns `[]` and the page shows "No articles found".

**Head (BlogList.jsx:94-101).**
```
95	        <title>Aviation Insights & Industry News | PennJets Blog</title>
96	        <meta name="description" content="Stay informed with the latest aviation industry insights, aircraft reviews, market analysis, and expert guidance from PennJets aviation consultants." />
97	        <meta name="keywords" content="aviation blog, private jets, aircraft news, aviation insights, industry trends" />
98	        <meta property="og:title" content="PennJets Aviation Blog" />
99	        <meta property="og:description" content="Expert insights on private aviation, aircraft ownership, and industry trends" />
100	        <meta property="og:type" content="website" />
```
No og:image, no og:url, no canonical.

**Internal links.** `:53 navigate(`/blog/${slug}`)` (title `:201`, "Read More" `:222`) -> `/blog/:slug` exists.

**External.** `:8 const NEWSLETTER_API = 'https://www.pennforce.pennjets.com/api/public/newsletter/subscribe';` (hardcoded production host, not the env var); `blogApi.js:33 fetch(`${CRM_API_URL}/api/public/blog`)`; `:171 src={post.featuredImage}` (URL supplied by CRM, may be external).

**Forms (BlogList.jsx:243-280).** Newsletter: `email` (required) + hidden honeypot `website` (`:245-254`). Posts `{ email, honeypot }` to `NEWSLETTER_API` (`:71-75`). Success: inline `Thank you for subscribing!` (`:80`); error: inline `data.error || 'Subscription failed. Please try again.'` (`:83`) or `Network error. Please try again.` (`:86`). Inline state, no alert. `:282 No spam, unsubscribe at any time.`

**Copy conflicts.** `:109-110 ... expert insights from our team of aviation professionals.`; `:240-241 ... exclusive industry analysis delivered to your inbox.` Otherwise article content comes from the CRM and is out of this sweep's scope.

**Placeholder / stale.** `:179-181` hidden "Article Image" fallback. Nothing else.

**Images.** `post.featuredImage` from CRM (not verifiable here).

**Autoplay video.** None.

---

## 10. `/blog/:slug` -> `src/components/pages/Blog/BlogArticle.jsx` (429 lines, working-tree version)

**Renders.** Loads one post via `blogApi.getPost(slug)` -> `GET ${CRM_API_URL}/api/public/blog/${slug}` (`blogApi.js:58`); shows loading spinner, "Article Not Found" on error, else: back link, category/tags, title, author avatar/name/title, date, read time, featured image, the article body via `dangerouslySetInnerHTML={{ __html: article.content }}` (`:265`), tags, an Author Bio card, a per-author contact form, and a back button. Working tree adds the view beacon: `:31-40` effect calls `blogApi.recordView(slug)` once per slug after render -> `POST ${CRM_API_URL}/api/public/blog/${slug}/view` with utm_*, referrer, sessionId (`blogApi.js:175-197`, sessionStorage key `pj_view_session` at `blogApi.js:10-24`).

**Head (BlogArticle.jsx:130-168).**
```
131	        <title>{article.title} | PennJets Blog</title>
132	        <meta name="description" content={article.excerpt} />
133	        <meta name="keywords" content={article.tags?.join(', ')} />
134	        <meta name="author" content={article.author.name} />
137	        <meta property="og:type" content="article" />
138	        <meta property="og:title" content={article.title} />
139	        <meta property="og:description" content={article.excerpt} />
140	        {article.featuredImage && <meta property="og:image" content={article.featuredImage} />}
141	        <meta property="article:published_time" content={article.publishedAt} />
142	        <meta property="article:author" content={article.author.name} />
145	        <script type="application/ld+json">  (Article: headline, description, image, datePublished, author Person {name, jobTitle}, publisher Organization "PennJets" logo https://www.pennjets.com/images/PennJets-Website-Logo.png)
```
No og:url, no canonical (social traffic arrives with `?utm_*` query strings, so a canonical is the obvious missing tag). Helmet only renders after the fetch resolves; crawlers that do not execute JS see the index.html defaults.

**Internal links.** `:120`, `:177`, `:419 navigate('/blog')` -> exists. `:308 href={`mailto:${article.author.email}`}`.

**External.** CRM GET (`blogApi.js:58`), beacon POST (`blogApi.js:186`), lead POST (`blogApi.js:104-124` -> `${CRM_API_URL}/api/webhooks/incoming/${webhookId}`), `article.featuredImage`, `article.author.avatar`, and whatever the CRM HTML contains (rendered unsanitised).

**Forms (BlogArticle.jsx:336-410).** Fields: `name` (required), `email` (required), `phone`, `company`, `message` (required). Submit (`:65-98`) -> `blogApi.submitContactForm(article.author.id, formData, slug, article.author.email)` which picks a webhook by author email (`blogApi.js:77-85`: joe@ -> `VITE_WEBHOOK_JOE_PENNELLA`, jameswofford@ -> `VITE_WEBHOOK_JAMES_WOFFORD`, else `VITE_CONTACT_WEBHOOK_ID`) and POSTs `{name,email,phone,company,message,blogPostSlug,pageUrl,utm_source,utm_medium,utm_campaign}`. Success: **`alert(`Thank you for your message! ${article.author.name} will contact you shortly.`)`** (`:79`) + reset. Error: **`alert(`Sorry, there was an error ... contact ${article.author.name} directly at ${article.author.email}`)`** (`:94`). `blogApi.js:119-142` logs the webhook URL, full payload, author email, webhook ID, and raw response to the console with emoji prefixes; `:70-73` in BlogArticle logs slug/author id/form data.

**Copy conflicts.**
- `:333 Have questions about this article? Get in touch and I'll respond within 24 hours.` - response-time promise attributed to the author.
- From `blogApi.js` author table (rendered in the bio card `:306` and byline):
  - `blogApi.js:212-213 title: 'Partner Operator Liaison', bio: 'Partner Operator Liaison and Captain at KLM Aviation, established in 1991. Brings over three decades of aviation expertise to the PennJets partnership network. Coordinates with Part 135 certified operators to ensure the highest standards of safety, compliance, and service for PennJets clients.'` - names a third-party operator, "Captain", "three decades", "Part 135 certified", safety assurance. (Steven Smyth is NOT on the About page team.)
  - `blogApi.js:266 title: authorDetails.title || post.author.title || 'Aviation Consultant'` and `:267` default bio `Aviation expert at PennJets, dedicated to providing insights and guidance on private aviation.` - any CRM author with no mapping is labelled an "Aviation expert at PennJets".
  - `blogApi.js:265 email: post.author.email || 'info@pennjets.com'`.
- Article body HTML is CRM-authored and not auditable here.

**Placeholder / stale.** None in the component. `prose-*` classes are inert (section 0.9).

**Images.** `article.author.avatar` from `blogApi.js`: `/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG` (exists, 8.86 MB, used at 40 px and 64 px); `/images/Meet-The-Team/steven-smyth.jpg` (**MISSING**); `/images/Meet-The-Team/CHARLES-BRENNAN.JPEG` (exists); `/images/Meet-The-Team/james-wofford.jpg` (**MISSING**); `/images/Meet-The-Team/joe-delisio.jpg` (**MISSING**). Missing avatars render as broken `<img>` (no onError handler at `:206-211`, `:294-299`, `:318-323`). Publisher logo `https://www.pennjets.com/images/PennJets-Website-Logo.png` exists.

**Autoplay video.** None.

---

## 11. `/gallery` -> `src/components/pages/Gallery/Gallery.jsx` (207 lines)

**Renders.** Dark hero "Gallery", a 4-column grid of 12 hardcoded images (`:19-104`), and a lightbox modal that shows the image, its path in a `<code>` block, and a **"Copy Image URL" button** that copies `${window.location.origin}${url}` to the clipboard (`:109-114`, `:188-197`). This is an internal asset-picker for blog authors, exposed publicly and linked from the footer "Social" column.

**Head (Gallery.jsx:118-121).**
```
119	        <title>Image Gallery | PennJets</title>
120	        <meta name="description" content="Browse and manage images for PennJets blog articles and content." />
```
"Browse and manage images for ... blog articles" is internal-tool copy in a public meta description. No OG, no canonical.

**Internal links.** None (no Link/navigate).

**External.** None.

**Forms.** None.

**Copy conflicts / stock photos.** The grid is labelled by `category` "Aircraft" with descriptions `Falcon Jet` (`:32`), `Gulfstream` (`:46`), `PC-12` (`:53`), `Private Jet Interior` (`:60`), `Sunset Jet` (`:67`), `Bombardier Challenger 650` (`:95`), `Embraer Phenom 300` (`:102`), `Commercial Aviation` (`:25`, file misspelled `commerical.jpg`), `Future of Aviation` (`:39`), plus `N400HH on the Ramp` (`:74`) and `N400HH Wide Hero` (`:88`) and the logo (`:81`). Penn Jets brokers no Falcon, Gulfstream, PC-12, Challenger, or Phenom; these are stock/third-party photos shown under the PennJets brand with no attribution or caption saying so. N400HH appears to be a real tail number (a spec sheet `public/Aircraft Specs/Secifications_N400HH.pdf` exists) - its ownership/consent for use is not established in the repo. No text on the page says the images are stock, and no text says they are company aircraft; the presentation (PennJets gallery, category "Aircraft") leans toward implying association. Flagged for Joseph.

**Placeholder / stale.** `:12-14 // Load images from the blog directory / For now, we'll populate this manually as you add images`; `:137-140 No images yet / Add images to see them here.` (empty-state copy for an admin tool); `:22 name: 'commercial.jpg'` vs actual file `commerical.jpg` (`:23`).

**Images (all exist).** `/images/Gallery/commerical.jpg` **4,730,918 B**; `/images/Gallery/falcon.jpg` **1,899,694 B**; `/images/Gallery/future-aviation.jpg` **2,229,026 B**; `/images/Gallery/gulfstream.jpg` **2,209,826 B**; `/images/Gallery/pc12.jpg` **4,253,344 B**; `/images/Gallery/pj-interior.jpg` **3,087,432 B**; `/images/Gallery/sunset-jet.jpg` **783,998 B**; `/images/Gallery/n400hh-ramp.jpg` **3,520,618 B**; `/images/PennJets-Website-Logo.png` **1,381,311 B**; `/images/Gallery/n400hh-wide-hero.jpg` 173,005 B; `/images/Gallery/Bombardier_Challenger_650.jpg` 328,583 B; `/images/Gallery/Embraer_Phenom_300.jpg` 65,273 B. Total ~24.6 MB on first paint; none use `loading="lazy"`.

**Autoplay video.** None.

---

## 12. `/privacy-policy` -> `src/components/pages/Legal/PrivacyPolicy.jsx` (180 lines)

**Renders.** Dark hero "Privacy Policy / Penn Jets LLC - Effective Date: September 28, 2025" and static policy sections. Static.

**Head (PrivacyPolicy.jsx:7-10).**
```
8	        <title>Privacy Policy - PennJets LLC</title>
9	        <meta name="description" content="PennJets privacy policy detailing how we collect, use, and protect your personal information." />
```

**Internal links.** `:147 <a href="/cookie-policy" ...>Cookie Policy</a>` - plain `<a>`, causes a full page reload rather than a router transition; target route exists. `:132`, `:169 href="mailto:privacy@pennjets.com"`; `:170 href="tel:+19545460763"`.

**External.** None.

**Forms.** None.

**Copy conflicts / claims needing review.**
- `:41-42 We collect information you provide such as name, email, phone, billing contact details, and message content. Payment information is handled by our payment processor and not stored in full by us.` - the site takes no payments and has no payment processor.
- `:48-49 We also collect IP address, device/browser type, pages viewed, referring URLs, approximate location, and cookie identifiers.` and `:55 We may receive limited information from advertising or analytics partners.` - the codebase has no analytics or advertising integrations (CLAUDE.md lists them as out of scope); the beacon does send `referrer` and a session id.
- `:68 <li>Arrange introductions with licensed operators</li>`.
- `:89 <li>Licensed FAA operators such as KLM Aviation Inc.</li>` - names a specific third-party operator as a data recipient.
- `:90 <li>Advertising or analytics partners</li>`.
- `:126-127 ... California, Colorado, Virginia, Connecticut, Utah, or Nevada ...` - state-privacy-law claims (legal review).
- `:144 Our website uses cookies and analytics tools to track usage patterns` - no analytics in code.
- `:170 (954) 546-0763` vs TOS `(973) 868-8425`.

**Placeholder / stale.** Effective date is fixed text (`:17`), fine.

**Images.** None.

**Autoplay video.** None.

---

## 13. `/terms-of-service` -> `src/components/pages/Legal/TermsOfService.jsx` (122 lines)

**Renders.** Dark hero "Terms of Service" and static sections. Static.

**Head (TermsOfService.jsx:7-10).**
```
8	        <title>Terms of Service - PennJets LLC</title>
9	        <meta name="description" content="PennJets terms of service outlining the conditions for using our aviation brokerage services." />
```

**Internal links.** `:111 href="mailto:info@pennjets.com"`; `:112 href="tel:+19738688425"`. No router links.

**External.** None.

**Forms.** None.

**Copy conflicts / claims needing review.**
- `:17 Penn Jets LLC - Effective Date: {new Date().toLocaleDateString()}` - **the effective date is "today", every day**; legally meaningless and locale-formatted.
- `:39-42 Penn Jets LLC operates as a consulting and aircraft brokerage firm. We do not own or operate aircraft directly. All flights and charter services are conducted by FAA-licensed Part 135 operators, such as KLM Aviation Inc., who maintain full operational control and responsibility for flight operations.` - correct broker posture, but names KLM Aviation Inc. and uses FAA/Part 135 language (goes to Joseph per CLAUDE.md).
- `:49-52 Aircraft pricing, availability, and schedules are subject to change without notice. ... we cannot guarantee ... All quotes and availability are subject to confirmation by the operating carrier.` - sensible disclaimer; note it contradicts PennShare.jsx:151-154 "Guaranteed Access ... guaranteed aircraft availability".
- `:80-82 ... You are responsible for maintaining the confidentiality of any account information ... under your account.` - the site has no user accounts.
- `:89-91` Florida law / Miami-Dade venue (legal review).

**Placeholder / stale.** The dynamic effective date (`:17`).

**Images.** None. **Autoplay video.** None.

---

## 14. `/cookie-policy` -> `src/components/pages/Legal/CookiePolicy.jsx` (178 lines)

**Renders.** Dark hero "Cookie Policy / Effective Date: September 28, 2025" and static sections. Static.

**Head (CookiePolicy.jsx:7-10).**
```
8	        <title>Cookie Policy - PennJets LLC</title>
9	        <meta name="description" content="PennJets cookie policy explaining how we use cookies to enhance your browsing experience." />
```

**Internal links.** `:167 href="mailto:privacy@pennjets.com"`; `:168 href="tel:+19545460763"`.

**External.** `:110-112` list `aboutads.info/choices`, `optout.networkadvertising.org`, `youronlinechoices.eu` as plain text (not links).

**Forms.** None.

**Copy conflicts / claims needing review.**
- `:29-31 ... uses cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and provide personalized content and advertising.`
- `:50 Required for the website to function (e.g., page navigation, secure login).` - no login exists.
- `:55-58 Performance & Analytics Cookies / Help us understand how visitors use the site (e.g., Google Analytics).` - **no Google Analytics in the codebase**.
- `:70-73 Advertising & Targeting Cookies / May be set by us or third parties to deliver relevant ads or track performance of campaigns.` - no ad tech in the codebase (CLAUDE.md: out of scope).
- `:87 <li>Support our marketing and advertising efforts</li>`; `:89 <li>Enable social media integration and sharing features</li>` - none present.
- `:134-135 ... third-party cookies from our partners and service providers, such as analytics platforms and advertising networks.`
- The only browser storage the site actually uses is `sessionStorage['pj_view_session']` (`blogApi.js:10-24`, working tree); the policy does not mention it, and there is no consent banner.

**Placeholder / stale.** None literal.

**Images.** None. **Autoplay video.** None.

---

## 15. `/compliance` -> `src/components/pages/Legal/Compliance.jsx` (208 lines)

**Renders.** Dark hero "Compliance Statement / Effective Date: September 28, 2025" and static sections on 14 CFR Part 295, fair business practices, client protection, website security, business transparency, regulatory updates, contact. Static.

**Head (Compliance.jsx:7-10).**
```
8	        <title>Compliance Statement - PennJets LLC</title>
9	        <meta name="description" content="PennJets compliance statement detailing our adherence to aviation, data protection, and industry regulations." />
```

**Internal links.** `:197 href="mailto:compliance@pennjets.com"`; `:198 href="tel:+19545460763"`.

**External.** None.

**Forms.** None.

**Copy conflicts / regulatory claims (all go to Joseph per CLAUDE.md).**
- `:29-32 ... in compliance with applicable U.S. laws and regulations, including 14 CFR Part 295 (Air Charter Brokers). As an intermediary, we fully comply with the consumer protection, advertising, and disclosure obligations imposed on air charter brokers.` - "fully comply" assertion.
- `:39-42 We do not hold ourselves out as a direct air carrier; we are not in operational control of aircraft. All flights facilitated through our Services are provided by properly certificated direct air carriers (FAA-licensed Part 135 operators, such as KLM Aviation Inc.) ...` - the site's only "not a direct air carrier" statement; names KLM Aviation Inc.
- `:54 In all advertising or solicitations, we clearly disclose that Penn Jets is a broker, not a direct operator` - **not true of the site itself**: the disclosure is absent from `/services`, `/pennshare`, `/about`, `/aircraft*`, `/blog*`, `/contact`, and the global footer (section 0.10).
- `:64 Before contracting, we disclose: operator name, our role as intermediary, total costs, and liability insurance coverage` - process claim.
- `:74 Refunds issued within 20 days for cash/check purchases, with client cancellation options for late disclosures` - refund-policy claim.
- `:92 <li>Misrepresenting aircraft specifications or availability</li>` and `:93 <li>Misrepresenting schedules or pricing</li>` - listed as practices avoided, while `/pennshare` shows the Hawker as available at $750K and `/` shows it at $3.3M featured.
- `:102-103 ... Penn Jets operates as a fully compliant charter broker ...`.
- `:110 Full adherence to 14 CFR Part 295 Air Charter Broker regulations and consumer protection requirements.`
- `:126-127 ... to protect your information and ensure secure transactions.` and `:136-137 SSL Encryption / All data transmission secured with industry-standard SSL encryption` - hosting claim (GitHub Pages does serve HTTPS; not verified here).
- `:195 Penn Jets LLC - Compliance Department` - implies a department.

**Placeholder / stale.** None literal.

**Images.** None. **Autoplay video.** None.

---

## 16. Cross-page consistency table (facts that disagree with each other)

| Fact | Values found |
|---|---|
| Company founding / experience | `About.jsx:68,78` "Since 1998"; `About.jsx:69` "25+ year history"; `About.jsx:94` "Founded in 2025"; `Footer.jsx:88` "over two decades"; `Services.jsx:161`, `About.jsx:190` "30+ years combined"; `seo.js:6` "25+ years" (dead) |
| Hawker 800XP | year 2003 (`aircraftData.js:7`, `Home.jsx:27`) vs 2004 (`PennShare.jsx:259,323`); price $3,300,000 whole (`aircraftData.js:9`, `Home.jsx:30`) vs $750,000 1/4 share (`PennShare.jsx:268`); status "No Longer Available" (`aircraftData.js:11`) vs Featured (`Home.jsx:36`) vs "1/4 Ownership" available (`PennShare.jsx:264`); pax 9 (`aircraftData.js:25`, `Home.jsx:31`, `PennShare.jsx:282`) vs 8 (`Charter.jsx:20`) |
| Premier 1A pax | 6 (`aircraftData.js:108`, `Home.jsx:17`, `PennShare.jsx:210`) vs 7 (`Charter.jsx:10`) vs "6-8" (`BonusDepreciationCountdown.jsx:124`) |
| Diamond 1A | "Offered for parts" (`aircraftData.js:75,79`, `Home.jsx:64`) vs charter "Fleet Access ... Light jet efficiency" (`Charter.jsx:28-36`); range 1,512 nm (`aircraftData.js:57`) vs ~1700 (`Home.jsx:58`) vs ~1500 (`Charter.jsx:30`) |
| Premier 1A base | "Fort Lauderdale (FLL)" (`Home.jsx:19`, `Charter.jsx:14,121`) vs "Miami, FL" (`aircraftData.js:92`) |
| Phone | (973) 868-8425 (`Home.jsx:156,184,274`, `Contact.jsx:96,118`, `AircraftDetail.jsx:227`, `Charter.jsx:324`, `TermsOfService.jsx:112`, `About.jsx:17`) vs (954) 546-0763 (`Footer.jsx:152`, `About.jsx:47,57`, `PrivacyPolicy.jsx:170`, `CookiePolicy.jsx:168`, `Compliance.jsx:198`) |
| Email | info@pennjets.com (most) vs inquiries@pennjets.com (`Home.jsx:275-276`) vs privacy@ / compliance@ (legal pages) |
| Bonus-depreciation deadline | 2025-12-31 (`TopBanner.jsx:26`, `BonusDepreciationCountdown.jsx:6`) - expired; 2026-12-31 (`Header.jsx:47`) |
| Broker disclosure | present `/` (`Home.jsx:282`), `/charter` (`Charter.jsx:331`), `/terms-of-service`, `/compliance`; absent everywhere else |

---

## 17. Summary of the worst findings

1. **Operator/fleet/management copy contradicts the business rules across the site**: `Services.jsx:63-75` sells "Full-service aircraft management" incl. "Professional crew recruitment and management"; `PennShare.jsx:140` "PennJets handles all operational aspects including scheduling, maintenance, and regulatory compliance"; `PennShare.jsx:151-154` "Guaranteed Access ... guaranteed aircraft availability with our advanced scheduling system"; `Charter.jsx:4-37,120-121,182` "Fleet"/"Flagship FLL-based Premier 1A"; `About.jsx:55` "certified mechanics, avionics specialists"; and the 14 CFR 295.23 broker/not-a-direct-air-carrier statement exists only as small print on `/` and `/charter` plus the legal pages, not in the global footer or on `/services`, `/pennshare`, `/about`, `/aircraft*`, `/blog*`.
2. **Two lead forms silently lose leads**: `/charter` quote form only `console.log`s and shows a fake "Your request has been recorded" (`Charter.jsx:237-242,293`); `/pennshare` form discards all input and redirects to `/contact` (`PennShare.jsx:23-26`) under a "we will contact you within 24 hours" promise. Neither posts to PennForce.
3. **Fabricated/contradictory facts presented as real**: "Since 1998 / 25+ years" vs "Founded in 2025" on the same About page (`About.jsx:68,78,94`); the Hawker 800XP is "No Longer Available" at $3,300,000 in data (`aircraftData.js:8-11`) yet "Featured" on `/` and sold as a $750,000 1/4 share of a "2004" airframe on `/pennshare` (`PennShare.jsx:259-268`); `/aircraft/:id` renders every status in a green "available" pill (`AircraftDetail.jsx:62-64`); invented $4,200/$6,300 per-hour charter pricing (`Charter.jsx:214-217`); expired 2025 bonus-depreciation countdowns on every page (`TopBanner.jsx:26`, `BonusDepreciationCountdown.jsx:6`) plus a second "Calendar Year Ending" banner (`Header.jsx:47`) stacked on top of it.
4. **Broken/placeholder assets in production paths**: `/charter` hero `night-flight-hero.jpg` and card `hawker-800xp-exterior.jpg` are 109- and 30-byte text files, not images; `og:image /images/og-hero.jpg` (`Home.jsx:160`) and team photos `james-wofford.jpg`, `joe-delisio.jpg`, `aviation-team.jpg`, `steven-smyth.jpg` are missing; `/api/placeholder/*` used as image URLs and onError fallbacks; "Google Maps integration would go here" (`Contact.jsx:330`) and "Trust signal tile" (`Home.jsx:74`) shown to visitors; `Home.jsx:72` and `Charter.jsx:15` link to `/aircraft/baron-e55` and `/aircraft/premier-1a` which redirect to the listing; no `robots.txt`, no `sitemap.xml`, no canonical on any page, no Helmet on `/charter` or `/aircraft/:id`, no 404 route (unknown paths render a blank page).
5. **Weight and leftovers**: 8.9 MB and 8.4 MB JPEGs on `/about` and `/`, a 7.4 MB Diamond photo on four pages, ~24.6 MB on `/gallery`, a 1.38 MB PNG as logo+favicon on every page, a 1.43 MB autoplay MP4 of a Falcon (not a Penn Jets aircraft) as the home hero; `public/` also ships three scroll-*.html prototypes, four CRM UI screenshots, an internal README, and ~7 MB of unreferenced images/video; `/gallery` is an internal "Copy Image URL" asset picker (meta: "Browse and manage images for PennJets blog articles") of stock Gulfstream/Falcon/Challenger/Phenom/PC-12 photos exposed publicly and linked from the footer.
