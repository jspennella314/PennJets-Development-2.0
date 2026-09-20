import React, { useState } from 'react';

// Keeps a form to five visible fields above its submit button at 390, without
// dropping anything. WO-4.11.
//
// Below sm the wrapped fields are collapsed behind a toggle that names what is
// inside, so a reader who needs one of them knows to open it. At sm and above
// everything is shown at once and the toggle is not rendered.
//
// Only put optional fields in here. A `required` input inside a display:none
// container makes the browser refuse to submit with a control it cannot focus.
const MoreFields = ({ summary, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`${open ? 'contents' : 'hidden'} sm:contents`}>{children}</div>
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800"
        >
          <span aria-hidden="true" className={`transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
          {open ? 'Hide extra details' : summary}
        </button>
      </div>
    </>
  );
};

export default MoreFields;
