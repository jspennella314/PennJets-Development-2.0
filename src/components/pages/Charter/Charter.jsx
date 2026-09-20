import React, { useMemo, useRef, useState } from "react";
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

// ---------- Hero ----------

const Hero = () => (
  <header className="relative">
    <div className="h-[50vh] w-full bg-gradient-to-br from-gray-950 via-gray-900 to-primary-900 sm:h-[65vh]" aria-hidden />
    <div className="absolute inset-0 flex items-center pt-28 sm:pt-20">
      <Container>
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl font-semibold sm:text-5xl">Charter, Simplified.</h1>
          <p className="mt-3 text-base sm:text-lg">
            On‑demand private jet charter, arranged by a broker who works for you.
            Light to midsize jets flown by vetted, licensed operators.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#quote"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              Get a Charter Quote
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

const Benefits = () => {
  const items = [
    {
      title: "Broker, Not Operator",
      body: "Penn Jets arranges your flight and represents you. Every trip is flown by a licensed Part 135 direct air carrier with operational control.",
    },
    {
      title: "Vetted Operators",
      body: "We source from licensed operators with strong safety records, and we tell you who is flying you.",
    },
    {
      title: "Transparent Quotes",
      body: "Fuel, FBO fees, overnights, de‑icing—disclosed up front. No surprises.",
    },
    {
      title: "Trip Coordination",
      body: "We coordinate with the operator on ground transfers, catering, pets, and itinerary changes.",
    },
  ];

  return (
    <Section title="Why Charter with PennJets" subtitle="Deal‑maker expertise, white‑glove execution.">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <article key={it.title} className="rounded-2xl border p-5 shadow-sm">
            <h3 className="text-base font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{it.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
};

// ---------- Popular routes (indicative) ----------

const POPULAR_ROUTES = [
  { from: "FLL", to: "TEB", miles: 1070, hours: 2.4, className: "Light/Midsize" },
  { from: "FLL", to: "ATL", miles: 580, hours: 1.8, className: "Light Jet" },
  { from: "FLL", to: "PBI", miles: 40, hours: 0.3, className: "Light Jet" },
  { from: "FLL", to: "MYEF", miles: 180, hours: 0.8, className: "Light Jet" },
  { from: "FLL", to: "MYNN", miles: 50, hours: 0.4, className: "Light Jet" },
  { from: "FLL", to: "TNCM", miles: 1040, hours: 2.3, className: "Light/Midsize" },
];

const PopularRoutes = () => (
  <Section title="Popular Routes" subtitle="Indicative flight times for planning. Request a quote for live pricing.">
    <div className="overflow-hidden rounded-2xl border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">From</th>
            <th className="px-4 py-3 text-left font-semibold">To</th>
            <th className="px-4 py-3 text-left font-semibold">Distance</th>
            <th className="px-4 py-3 text-left font-semibold">Block Time</th>
            <th className="px-4 py-3 text-left font-semibold">Typical Class</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {POPULAR_ROUTES.map((r) => (
            <tr key={`${r.from}-${r.to}`} className="odd:bg-white even:bg-gray-50">
              <td className="px-4 py-3 font-medium">{r.from}</td>
              <td className="px-4 py-3">{r.to}</td>
              <td className="px-4 py-3">{r.miles} nm</td>
              <td className="px-4 py-3">~{r.hours.toFixed(1)} hr</td>
              <td className="px-4 py-3">{r.className}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Section>
);

// ---------- Quote form ----------

const inputClass =
  "mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900";

const QuoteForm = () => {
  const [searchParams] = useSearchParams();
  const prefilledModel = searchParams.get("model");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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
    () => name && email && from && to && date && pax > 0 && !isSubmitting,
    [name, email, from, to, date, pax, isSubmitting]
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

  return (
    <Section id="quote" title="Request a Charter Quote" subtitle="Tell us the trip. We'll come back with options and a firm quote. The Premier 1A is available for charter through a licensed operator Penn Jets works with.">
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
                <input required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="FLL / Fort Lauderdale" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">To (airport or city) *</span>
                <input required value={to} onChange={(e) => setTo(e.target.value)} placeholder="TEB / Teterboro" className={inputClass} />
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
                <span className="text-sm font-medium">Phone</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
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
          <a href="#quote" className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md">Get a Quote</a>
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
