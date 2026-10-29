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
//
// WO-4.56, 2026-10-29: the Google Ads tag arrived, so this page changed in the
// same commit, as the rule above says. Measured on the local build with a
// clean profile walking home, /charter, a Market Note and both legal pages:
// one cookie (_gcl_au, 90 days) and one local storage value (_gcl_ls), both
// set on page load before any interaction. Production is re-read after the
// merge; if it differs, this text is corrected in a follow-up commit.
//
// WO-4.57, 2026-10-29: the requests section counts Vercel's storage host,
// where Market Note pictures are served from (it sets nothing). Wording
// drafted by the lead and approved by Joseph as drafted.

export const LAST_UPDATED = '29 October 2026';

export const INTRO =
  'Most cookie policies describe a website other than the one you are reading. This one was written by measuring what pennjets.com actually puts on your device, page by page, in a browser with nothing stored in it.';

// The pages the measurement walked; the page prints it under the inventory.
export const MEASURED_ACROSS =
  'the home page, the charter page, a Market Note, and both legal pages';

export const HEADLINE = 'This site sets one cookie, for Google Ads.';

export const HEADLINE_BODY = [
  'We advertise charter on Google, and Google\'s advertising tag sets one cookie so that we can tell when a quote request or a phone call came from one of those ads. We walked the site in a clean browser profile and it was the only cookie in the store at the end.',
  'There is no analytics provider on this site, no remarketing and no profiling. We have told Google not to use visits here to build advertising audiences.',
];

// The measured inventory. Keep this table honest: it is the evidence, and the
// rest of the page is only a reading of it.
export const INVENTORY = {
  head: ['What', 'Type', 'Set by', 'Purpose', 'Lifetime'],
  rows: [
    [
      '_gcl_au',
      'Cookie',
      'Google Ads, on pennjets.com, when any page loads',
      'Lets Google match a charter quote request or a call to the ad click that led to it, so that we can count which ads produce enquiries.',
      '90 days',
    ],
    [
      '_gcl_ls',
      'Local storage',
      'Google Ads, on pennjets.com, when any page loads',
      'Ad-click information Google\'s tag keeps for the same purpose as _gcl_au.',
      'Until you clear this site\'s stored data',
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
    title: 'The one thing we store ourselves',
    body: [
      'Opening a Market Note puts a single value in your browser\'s session storage, under the name pj_view_session. It is a randomly generated id, it is not a cookie, and it disappears when you close the tab.',
      'It exists so that our own view count is accurate. If the page reports the same view more than once, the id lets us recognise it as one visit rather than two. It is sent to our own system along with the campaign parameters on the link you arrived from and the page your browser says you came from.',
      'It is an identifier on your device for as long as the tab is open, and we would rather say that plainly than describe it as nothing. What it is not: persistent, shared with anyone, or connected to you as a person. It cannot be, unless you later fill in a form and tell us who you are.',
    ],
  },
  {
    id: 'google-ads',
    title: 'Google Ads conversion tracking',
    body: [
      'Every page of this site loads Google\'s advertising tag. When it loads, your browser contacts Google, which receives the address of the page, the page you came from, your IP address and the identifiers in the table above.',
      'We count two things as conversions: sending the charter quote form successfully, and tapping our phone number to call us: the Call button on the charter page, the Call button in the bar at the bottom of the screen, or the number at the top of the page. A conversion tells Google that one of those happened. It does not include your name, email address, phone number or anything you typed.',
      'Ad personalisation is turned off for this tag, so visits here are not used to build remarketing audiences or to follow you with our ads elsewhere. We do not sell your information.',
    ],
  },
  {
    id: 'other-companies',
    title: 'Requests your browser makes to other companies',
    body: [
      'Three. Loading a page contacts pennforce.pennjets.com, our own system, which is where Market Notes are loaded from and where form submissions go. It also contacts Google, for the advertising tag described above, at www.googletagmanager.com, www.google.com and ad.doubleclick.net. Where a page shows a Market Note\'s picture, your browser fetches the picture from Vercel, the company that hosts our system, at a vercel-storage.com address; that is our own image, and the request sets nothing in your browser.',
      'The typeface used to be fetched from Google Fonts on every page. We moved those font files onto this site, so that request no longer happens.',
      'Apart from Google\'s advertising tag and our own pictures on Vercel, there is no analytics provider, no other advertising network and no embedded third-party content on this site to contact.',
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
      'Blocking cookies for this site, or blocking Google\'s advertising domains, stops the Google Ads cookie; the site works the same without it. Clearing this site\'s stored data removes _gcl_ls. Closing the tab removes our own session id.',
      'There is no consent banner. If what this site stores changes, this page changes at the same time as the thing it describes, not afterwards.',
    ],
  },
];

export const RELATED =
  'What happens to information you send us, rather than what is stored on your device, is on the privacy policy.';
