import React from 'react';

// The credit under the featured image, built from the object the CRM's public
// API composes (lib/blog/imageAttribution.ts there), not from its `line`
// string, so the credit and the license are real links. The rules mirror that
// helper's, so the site prints what every caption prints: a Creative Commons
// license is named and linked, "Modified from original." follows it when the
// CRM says so, licensed stock names the credit alone, and null (an own photo,
// or nothing recorded) renders nothing at all. An object without a credit is
// not a shape the CRM produces; its sentence is printed as text rather than
// assembled wrongly. WO-4.27.
//
// Moved here unchanged from BlogArticle.jsx so the home page's newest-note
// card prints the same credit (WO-4.37).
export function imageCreditContent(attribution) {
  if (!attribution) return null;
  const { credit, sourceUrl, licenseLabel, licenseUrl, modified, line } = attribution;
  if (!credit) return line || null;
  const linkClass = 'underline decoration-gray-300 underline-offset-2 hover:text-gray-700';
  const licensed = Boolean(licenseUrl && licenseLabel);
  return (
    <>
      {'Photo: '}
      {sourceUrl ? (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {credit}
        </a>
      ) : credit}
      {licensed && (
        <>
          {', '}
          <a href={licenseUrl} target="_blank" rel="license noopener noreferrer" className={linkClass}>
            {licenseLabel}
          </a>
        </>
      )}
      {'.'}
      {licensed && modified ? ' Modified from original.' : null}
    </>
  );
}
