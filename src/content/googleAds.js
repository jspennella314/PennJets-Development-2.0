// Google Ads conversions (WO-4.56; the facts are in the CRM repo's
// docs/integration/GOOGLE-ADS.md). The tag itself, AW-18544502023, loads from
// index.html on every page.
//
// The two send_to values are AW-18544502023/<label>. The labels arrive from
// Joseph by file, never by chat; until they do, both are empty and
// sendConversion() sends nothing. That is the hold: the whole build runs and
// is testable with nothing counted.

export const AW_ID = 'AW-18544502023';

// The charter quote form, on a submit the webhook accepted (Charter.jsx).
export const SEND_TO_FORM = '';

// A tap on the charter page's Call button or the sticky bar's Call
// (Charter.jsx, StickyContactBar.jsx). No other tel: link on the site counts.
export const SEND_TO_CALL = '';

// The one place a conversion is sent. Nothing happens without a label or
// without the tag (blocked, or not loaded yet); never throws, so a conversion
// can never break the form or the call link it rides on. No user data is
// passed: send_to only.
export function sendConversion(sendTo) {
  if (!sendTo || typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  try {
    window.gtag('event', 'conversion', { send_to: sendTo });
    return true;
  } catch {
    return false;
  }
}
