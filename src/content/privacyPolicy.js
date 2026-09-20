// Privacy policy copy, WO-4.10.
//
// APPROVED AS WRITTEN by Joseph, 2026-09-20. Written from the lead
// engineer's verification of the CRM schema and production on 2026-09-20, plus
// what this site was measured doing on production the same day, and from
// nothing else.
//
// Nothing in this file is a claim Joseph has not already made or the lead has
// not verified, so the page renders cleanly and truthfully even if it ships
// before he has read it. Decisions he still owes are NOT in this file; they are
// queued in docs/drafts/t4/for-joseph-WO-4.10.md.
//
// This module is the single source for both the rendered page and the draft in
// docs/drafts/t4/privacy-policy.md, so the two cannot drift apart.

// A statement of fact about this document, not a legal effective date. Joseph
// sets the effective date when he approves the wording.
export const LAST_UPDATED = '20 September 2026';

// Already published on the previous version of this page, so not a new claim.
// Joseph confirms or replaces it.
export const PRIVACY_EMAIL = 'privacy@pennjets.com';

export const INTRO =
  'This page describes what happens to information when you use pennjets.com. It is written from what this site and the system behind it actually do, not from a template. If anything here is unclear, ask us and we will answer plainly.';

export const SHORT_VERSION = [
  'We do not use advertising pixels, profiling, or third-party analytics.',
  'This site sets no cookies.',
  'Reading an article is recorded against a session, not against you.',
  'If you send us a form, it becomes a lead in our CRM and a broker reads it.',
  'We do not sell your information.',
];

export const SECTIONS = [
  {
    id: 'reading',
    title: 'When you read a Market Note',
    body: [
      'Each time an article is viewed, our own system records one row about that view. It is recorded against a session, not against you.',
    ],
    table: {
      head: ['What is recorded', 'Where it comes from'],
      rows: [
        ['A session id', 'Generated for the view. It lets a repeated signal update the same row instead of adding another one.'],
        ['Campaign source, medium and campaign name', 'The utm_ parameters on the link you arrived from, usually a social post.'],
        ['Referrer', 'The page your browser reports you came from.'],
        ['Device, browser and operating system', 'Read from your browser user agent.'],
        ['Country and city', "Our host's geolocation headers. City level. Your IP address itself is not stored."],
        ['Time on the page and how far you scrolled', 'Timing signals sent by the page.'],
        ['Which path recorded the view', 'Whether the row came from the page being fetched or from your browser reporting the view.'],
      ],
    },
    after: [
      'There is no name, no email address, no account and no identifier that follows you to other websites. A view cannot be connected to a person unless that person later submits a form.',
    ],
  },
  {
    id: 'forms',
    title: 'When you send us a form',
    body: [
      'The site has forms for charter, buying, selling, consulting, fractional shares, general contact, and a message form on each Market Note. Sending one creates a lead in our CRM and notifies a broker, who will reply to you.',
      'A lead holds your name and email address, along with whichever of phone, company and message you typed. It also records which service you chose, which Market Note you came from if you came from one, the campaign parameters on your link, and the address of the page you submitted from.',
      'We use this to answer you and to do the work you asked about. Nothing more.',
    ],
  },
  {
    id: 'newsletter',
    title: 'When you subscribe to the newsletter',
    body: [
      'Your email address is stored as a contact and added to our Weekly Newsletter list.',
      'Newsletter emails include an unsubscribe link, and they carry a tracking pixel that records whether the message was opened and whether a link in it was clicked. This is the one place we measure something against an individual rather than a session. Unsubscribing stops both the messages and the measurement.',
    ],
  },
  {
    id: 'security',
    title: 'Keeping the site working',
    body: [
      'We count requests per IP address for a short period to stop abuse of the public forms and endpoints. These are counters, not profiles, and they are not used to build a picture of anyone.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and browser storage',
    body: [
      'This site sets no cookies. We measured it: loading a page leaves your cookie store untouched.',
      'One value is kept in your browser session storage, an anonymous session id used by the view counting described above. It is cleared when you close the tab and it identifies a visit rather than a person.',
      'Because there is nothing to consent to, there is no cookie banner. We would rather not interrupt you with a dialog about tracking we are not doing.',
    ],
  },
  {
    id: 'sharing',
    title: 'Who else sees it',
    body: [
      'We do not sell your information and we do not share it with advertisers, data brokers or analytics companies. There are none involved in this site.',
      'The companies that run our infrastructure process it on our behalf:',
    ],
    list: [
      'Vercel, which hosts the CRM and serves it.',
      'Neon, which holds the database.',
      'Upstash, which holds the short-lived rate limiting counters.',
      'Resend, which delivers our email.',
      'The social platforms we publish posts to, for the posts themselves.',
    ],
    after: [
      'We may also disclose information where the law requires it.',
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: [
      'Leads and contacts stay in our CRM. We do not delete them automatically. If you want yours removed, ask and we will remove it.',
    ],
  },
  {
    id: 'rights',
    title: 'Asking for a copy, or asking us to delete it',
    body: [
      `Write to ${PRIVACY_EMAIL} and tell us what you want. We will tell you what we hold about you, correct it, or delete it. You do not need to give a reason, and you do not need to be a customer.`,
      'If you subscribed to the newsletter, the unsubscribe link in any message removes you immediately without writing to anyone.',
    ],
  },
];

export const CONTACT = {
  name: 'Penn Jets LLC',
  address: '690 SW 1st Ct #1030, Miami, FL 33130',
  email: PRIVACY_EMAIL,
  phone: '(954) 546-0763',
  phoneHref: 'tel:+19545460763',
};
