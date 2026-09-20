// Cookie policy copy, WO-4.12.
//
// APPROVED AS WRITTEN by Joseph, 2026-09-20. Written from a measurement,
// not from a template: a fresh browser profile walked home, the Market Notes
// index, a Market Note arrived at from a social link, charter, buy, contact and
// both legal pages on 2026-09-20. The cookie jar was empty at the end of that
// walk and localStorage was empty. One session storage entry was set.
//
// The standing rule this page follows, Joseph 2026-09-20: policy follows
// reality, never the reverse. If analytics are ever added, this page changes in
// the same order as the analytics, not before to be ready and not after to
// catch up.
//
// This module is the single source for both the rendered page and the draft in
// docs/drafts/t4/cookie-policy.md, so the two cannot drift apart.

export const LAST_UPDATED = '20 September 2026';

export const INTRO =
  'Most cookie policies describe a website other than the one you are reading. This one was written by measuring what pennjets.com actually puts on your device, page by page, in a browser with nothing stored in it.';

export const HEADLINE = 'This site sets no cookies.';

export const HEADLINE_BODY = [
  'Not strictly necessary ones, not analytics ones, not advertising ones. We walked the site in a clean browser profile and the cookie store was still empty at the end of it.',
  'There are no third-party analytics on this site, no advertising pixels and no profiling. That was a deliberate decision, and it is why you are reading this instead of clicking through a consent banner.',
];

// The measured inventory. Keep this table honest: it is the evidence, and the
// rest of the page is only a reading of it.
export const INVENTORY = {
  head: ['What', 'Type', 'Set by', 'Purpose', 'Lifetime'],
  rows: [
    [
      'No cookies at all',
      'Cookie',
      'nothing',
      'There are none to describe.',
      'n/a',
    ],
    [
      'pj_view_session',
      'Session storage',
      'pennjets.com, when you open a Market Note',
      'A generated id, so that if the page reports the same view twice we update one record instead of counting two. It is not linked to a name, an email address or an account.',
      'Cleared when you close the tab',
    ],
  ],
};

export const SECTIONS = [
  {
    id: 'the-one-thing',
    title: 'The one thing we do store',
    body: [
      'Opening a Market Note puts a single value in your browser\'s session storage, under the name pj_view_session. It is a randomly generated id, it is not a cookie, and it disappears when you close the tab.',
      'It exists so that our own view count is accurate. If the page reports the same view more than once, the id lets us recognise it as one visit rather than two. It is sent to our own system along with the campaign parameters on the link you arrived from and the page your browser says you came from.',
      'It is an identifier on your device for as long as the tab is open, and we would rather say that plainly than describe it as nothing. What it is not: persistent, shared with anyone, or connected to you as a person. It cannot be, unless you later fill in a form and tell us who you are.',
    ],
  },
  {
    id: 'other-companies',
    title: 'Requests your browser makes to other companies',
    body: [
      'One, and it is ours. Loading a page contacts pennforce.pennjets.com, our own system, which is where Market Notes are loaded from and where form submissions go.',
      'Nothing else. The typeface used to be fetched from Google Fonts, which meant your browser contacted Google and Google received your IP address on every page. We moved those font files onto this site, so that request no longer happens.',
      'There is no analytics provider, no advertising network, no tag manager and no embedded third-party content on this site to contact.',
    ],
  },
  {
    id: 'not-cookies',
    title: 'Two things that sound like tracking and are not',
    body: [
      'We count requests per IP address for a short period, to stop the public forms being abused. That is a counter held briefly on a server, not a cookie, and it is not used to build a picture of anyone.',
      'Our newsletter emails carry an unsubscribe link and a pixel that records whether the message was opened and whether a link was clicked. That is the one place we measure something against an individual rather than a session, it happens in email rather than on this website, and unsubscribing ends it.',
    ],
  },
  {
    id: 'controls',
    title: 'What you can do about it',
    body: [
      'Blocking cookies for this site changes nothing, because there are none to block. Clearing your session storage, or simply closing the tab, removes the one id described above.',
      'There is no consent banner because there is nothing here to consent to. If that ever changes, this page changes at the same time as the thing it describes, not afterwards.',
    ],
  },
];

export const RELATED =
  'What happens to information you send us, rather than what is stored on your device, is on the privacy policy.';
