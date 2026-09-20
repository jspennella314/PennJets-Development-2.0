import { useEffect, useState } from 'react';

// True below Tailwind's `sm` breakpoint, which is where the five-field limit
// from WO-4.11 applies. Used to split a long form into steps on a phone while
// showing it whole on a wider screen.
export default function useNarrowViewport(query = '(max-width: 639px)') {
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return narrow;
}
