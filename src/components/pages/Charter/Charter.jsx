import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { blogApi } from "../../../services/blogApi";
import useNarrowViewport from "../../../hooks/useNarrowViewport";

// 14 CFR 295.23 air charter broker disclosure. Wording approved by Joseph 2026-09-20.
const BROKER_DISCLOSURE =
  "Penn Jets LLC is an air charter broker, not a direct air carrier or direct foreign air carrier, and does not own, operate, or have operational control of any aircraft. All charter flights arranged by Penn Jets are operated by properly licensed direct air carriers or direct foreign air carriers, which have exclusive operational control of each flight.";

// ---------- Helper UI ----------

const Container = ({ children }) => (
  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="py-16">
    <Container>
      {title && (
        <header className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-2 max-w-3xl text-gray-600">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </Container>
  </section>
);

// One call to action, repeated. A constant rather than a string typed four
// times, because the order asks for identical wording every time and typing
// it again is how "Get a Quote" and "Get a Charter Quote" came to share a
// page. Approved by Joseph 2026-09-21. WO-4.22 item 7.
const CTA_LABEL = "Request a charter quote";

// ---------- Hero ----------

const Hero = () => (
  <header className="relative">
    <div className="h-[50vh] w-full bg-gradient-to-br from-gray-950 via-gray-900 to-primary-900 sm:h-[65vh]" aria-hidden />
    <div className="absolute inset-0 flex items-center pt-28 sm:pt-20">
      <Container>
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl font-semibold sm:text-5xl">Charter, Simplified.</h1>
          {/*
            Who charter is for, not what Penn Jets is. It replaced
            "On-demand private jet charter, arranged by a broker who works for
            you. Light to midsize jets flown by vetted, licensed operators.",
            which described the firm to a reader still deciding whether they
            are on the right page. Approved by Joseph 2026-09-21.
          */}
          <p className="mt-3 text-base sm:text-lg">
            Charter is for the trip an airline schedule cannot carry: a same‑day
            return, a closing that moved, four people to a field with no
            commercial service.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#quote"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              {CTA_LABEL}
            </a>
            <a
              href="tel:+19545460763"
              className="rounded-2xl px-5 py-3 text-sm font-medium text-white ring-1 ring-white/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              Call (954) 546‑0763
            </a>
          </div>
        </div>
      </Container>
    </div>
  </header>
);

// ---------- Benefits ----------

// The same call to action after each section, in the same words.
const SectionCta = () => (
  <div className="mt-8 flex justify-center">
    <a
      href="#quote"
      className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
    >
      {CTA_LABEL}
    </a>
  </div>
);


// Three blocks, Joseph's substance, approved 2026-09-21. They replaced four
// cards headed "Why Charter with PennJets" with the subtitle "Deal-maker
// expertise, white-glove execution", which was self-description and an
// unsupported claim on a page that has to be careful about both.
//
// Block three restates the footer disclosure in plain language. The two must
// not drift apart: if BROKER_DISCLOSURE changes, read this again.
const Benefits = () => {
  const items = [
    {
      title: "You talk to the broker who books your trip",
      body:
        "No call center and no ticket queue. The person who answers is the person who sources the aircraft and stays with the trip until you land.",
    },
    {
      title: "We compare operators and show you the numbers",
      // Joseph left this one unresolved: his note offered "approved as
      // written" or "We compare certificated operators and tell you why we
      // recommend the one we do." and both were still in the brackets. This
      // is the first, the one he marked approved. Swapping is one line.
      body:
        "You see what each certificated operator quoted and why one is recommended, not a single price with the reasoning left out.",
    },
    {
      title: "Every flight is operated by a licensed Part 135 carrier",
      body:
        "Penn Jets arranges the flight and does not operate it. A properly licensed direct air carrier has operational control of every leg.",
    },
  ];

  return (
    <Section title="Why charter through a broker">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {items.map((it) => (
          <article key={it.title} className="rounded-2xl border p-5 shadow-sm">
            <h3 className="text-base font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{it.body}</p>
          </article>
        ))}
      </div>
      <SectionCta />
    </Section>
  );
};
// ---------- Popular routes ----------
//
// City pairs only. The old table published distances, block times and
// aircraft classes as if they were ours, on a page for a broker that does
// not operate aircraft. Joseph dropped them. WO-4.22.
//
// Codes are what the form expects: free text, shown in the same
// "CODE / City" shape as its placeholders, so a prefilled field reads the
// way a typed one does.
const POPULAR_ROUTES = [
  { from: "TEB / Teterboro",   to: "PBI / Palm Beach" },
  { from: "HPN / Westchester", to: "PBI / Palm Beach" },
  { from: "TEB / Teterboro",   to: "APF / Naples" },
  { from: "TEB / Teterboro",   to: "CHS / Charleston" },
  { from: "TEB / Teterboro",   to: "PWK / Chicago Executive" },
  { from: "HPN / Westchester", to: "ACK / Nantucket" },
  { from: "ISP / Islip",       to: "MVY / Martha's Vineyard" },
];

const cityOf = (s) => s.split(" / ")[1];

const PopularRoutes = () => (
  <Section title="Popular routes from New York and New Jersey">
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {POPULAR_ROUTES.map((r) => (
        <li key={`${r.from}-${r.to}`}>
          {/* Same page, so this is a query-parameter link the form reads on
              mount and on change, rather than shared state. It survives a
              copied URL and a new tab, which state would not. */}
          <Link
            to={`/charter?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}#quote`}
            className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm hover:border-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <span className="font-medium">
              {cityOf(r.from)} <span aria-hidden="true">&rarr;</span>
              <span className="sr-only">to</span> {cityOf(r.to)}
            </span>
            <span className="text-gray-500">{CTA_LABEL}</span>
          </Link>
        </li>
      ))}
    </ul>
    <SectionCta />
  </Section>
);
const inputClass =
  "mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900";

const QuoteForm = () => {
  const [searchParams] = useSearchParams();
  const prefilledModel = searchParams.get("model");
  // Set by the route links above. Read on every change, not just on mount,
  // because clicking a second route does not remount this component.
  const prefilledFrom = searchParams.get("from") || "";
  const prefilledTo = searchParams.get("to") || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [from, setFrom] = useState(prefilledFrom);
  const [to, setTo] = useState(prefilledTo);
  const [date, setDate] = useState("");
  const [retDate, setRetDate] = useState("");
  const [pax, setPax] = useState(4);
  const [notes, setNotes] = useState(prefilledModel ? `Aircraft of interest: ${prefilledModel}` : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // Nine fields is too many above a submit button on a phone, so below sm the
  // form runs in two steps: the trip, then who you are. Both steps show five
  // fields or fewer. On a wider screen the whole form renders at once and
  // there is no Continue. WO-4.11.
  useEffect(() => {
    if (prefilledFrom) setFrom(prefilledFrom);
    if (prefilledTo) setTo(prefilledTo);
  }, [prefilledFrom, prefilledTo]);

  const narrow = useNarrowViewport();
  const [step, setStep] = useState(1);
  const formRef = useRef(null);
  const showTrip = !narrow || step === 1;
  const showContact = !narrow || step === 2;

  const continueToContact = () => {
    // Only the trip fields are mounted at this point, so native validation
    // checks exactly them.
    if (formRef.current && !formRef.current.reportValidity()) return;
    setStep(2);
  };

  const canSubmit = useMemo(
    () => name && email && phone && from && to && date && pax > 0 && !isSubmitting,
    [name, email, phone, from, to, date, pax, isSubmitting]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    // Structured fields are packed into `message` as labeled lines so the
    // webhook payload does not change (see CLAUDE.md, integration facts).
    const message = [
      "Charter quote request",
      `From: ${from}`,
      `To: ${to}`,
      `Departure: ${date}`,
      `Return: ${retDate || "one-way"}`,
      `Passengers: ${pax}`,
      notes ? `Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await blogApi.submitLead({ name, email, phone, service: "charter", message });
      setStatus("success");
      setName(""); setEmail(""); setPhone(""); setFrom(""); setTo("");
      setDate(""); setRetDate(""); setPax(4); setNotes("");
      setStep(1);
    } catch (err) {
      console.error("Charter quote submission failed:", err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // "Takes under a minute" in the subtitle below is measured, not assumed.
  // Filling this form and submitting it took 13.6s at 1280 and 16.0s at 390
  // arriving from a route link, and 20.8s and 23.4s typing From and To as
  // well. Typing at 180ms per character with a 900ms pause between fields, a
  // scripted stand-in for a reader rather than a user test. The slowest of the
  // four is the one the line has to be true of. Recheck when the form changes.
  // WO-4.22 item 8.
  //
  // It replaced "The Premier 1A is available for charter through a licensed
  // operator Penn Jets works with.", removed by Joseph 2026-09-21.
  return (
    <Section id="quote" title="Request a Charter Quote" subtitle="Tell us the trip. We'll come back with options and a firm quote. Takes under a minute.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border p-6 shadow-sm lg:col-span-2">
          {narrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">
              Step {step} of 2 — {step === 1 ? "the trip" : "your details"}
            </p>
          )}

          {showTrip && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">From (airport or city) *</span>
                <input required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="TEB / Teterboro" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">To (airport or city) *</span>
                <input required value={to} onChange={(e) => setTo(e.target.value)} placeholder="PBI / Palm Beach" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Departure Date *</span>
                <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Return Date (optional)</span>
                <input type="date" value={retDate} onChange={(e) => setRetDate(e.target.value)} className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Passengers *</span>
                <input required type="number" min={1} max={19} value={pax} onChange={(e) => setPax(parseInt(e.target.value || "0", 10))} className={inputClass} />
              </label>
            </div>
          )}

          {showContact && (
            <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${showTrip ? "mt-4" : ""}`}>
              <label className="block">
                <span className="text-sm font-medium">Name *</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email *</span>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Phone *</span>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Notes (pets, catering, ground, etc.)</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} />
              </label>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets about this request.</p>
            {narrow && step === 1 ? (
              <button
                type="button"
                onClick={continueToContact}
                className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
              >
                Continue
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {narrow && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white enabled:hover:bg-black disabled:opacity-40"
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            )}
          </div>

          {status === "success" && (
            <p className="mt-3 text-sm text-green-700" role="status">
              Thanks. Your request is in. We'll follow up shortly.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-700" role="alert">
              Sorry, that didn't go through. Please try again or call (954) 546‑0763.
            </p>
          )}
        </form>

        {/* What happens next */}
        <aside className="rounded-2xl border p-6 shadow-sm">
          <h3 className="text-base font-semibold">What happens next</h3>
          <ol className="mt-4 space-y-3 text-sm text-gray-700">
            <li className="flex gap-3"><span className="font-semibold">1.</span><span>We confirm the itinerary and passenger count with you.</span></li>
            <li className="flex gap-3"><span className="font-semibold">2.</span><span>We source options from licensed Part 135 operators and send you a firm quote with the operator named.</span></li>
            <li className="flex gap-3"><span className="font-semibold">3.</span><span>You approve. The operator flies the trip; we coordinate the details.</span></li>
          </ol>
          <p className="mt-4 text-xs text-gray-500">{BROKER_DISCLOSURE}</p>
          <Link to="/contact" className="mt-4 inline-block text-sm font-medium underline">Prefer to talk? Contact us</Link>
        </aside>
      </div>
    </Section>
  );
};

// ---------- Footer CTA ----------

const FooterCta = () => (
  <Section>
    <div className="rounded-2xl bg-gray-900 p-8 text-white sm:p-12">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold">Ready to go wheels up?</h3>
          <p className="mt-1 text-sm text-white/80">Call (954) 546‑0763 or send your itinerary for a fast quote.</p>
        </div>
        <div className="flex gap-3">
          <a href="#quote" className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md">{CTA_LABEL}</a>
          <Link to="/aircraft" className="rounded-2xl px-5 py-3 text-sm font-medium ring-1 ring-white/70 hover:bg-white/10">Browse Aircraft</Link>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/60">{BROKER_DISCLOSURE}</p>
    </div>
  </Section>
);

// ---------- Page ----------

const Charter = () => {
  return (
    <>
      <main>
        <Hero />
        <Benefits />
        <PopularRoutes />
        <QuoteForm />
        <FooterCta />
      </main>
    </>
  );
};

export default Charter;
