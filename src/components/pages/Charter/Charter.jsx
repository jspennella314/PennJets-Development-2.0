import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ---------- Mock fleet data (swap for your real assets/links) ----------

const FLEET = [
  {
    id: "premier-1a",
    name: "Beechcraft Premier 1A",
    pax: 7,
    rangeNm: 1500,
    speedKt: 450,
    image: "/images/premier-1a-cabin.jpg",
    note: "FLL‑based • On Part 135",
    url: "/aircraft/premier-1a",
  },
  {
    id: "hawker-800xp",
    name: "Hawker 800XP",
    pax: 8,
    rangeNm: 2540,
    speedKt: 450,
    image: "/images/hawker-800xp-exterior.jpg",
    note: "Midsize comfort & range",
    url: "/aircraft",
  },
  {
    id: "diamond-1a",
    name: "Diamond 1A",
    pax: 7,
    rangeNm: 1500,
    speedKt: 450,
    image: "/images/Diamond-1A/diamond-1a-ramp.JPEG",
    note: "Light jet efficiency",
    url: "/aircraft",
  },
];

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
    {/* Ensure your hero image is exported with fixed dimensions to avoid CLS */}
    <img
      src="/images/night-flight-hero.jpg"
      alt="Private jet on ramp at sunset"
      width={1920}
      height={1080}
      loading="eager"
      className="h-[50vh] w-full object-cover sm:h-[65vh]"
    />
    <div className="absolute inset-0 bg-black/40" aria-hidden />
    <div className="absolute inset-0 flex items-center">
      <Container>
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl font-semibold sm:text-5xl">Charter, Simplified.</h1>
          <p className="mt-3 text-base sm:text-lg">
            On‑demand private jet charter with transparent pricing and responsive
            coordination. Light to midsize jets with vetted operators.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#quote"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              Get a Charter Quote
            </a>
            <a
              href="#fleet"
              className="rounded-2xl px-5 py-3 text-sm font-medium text-white ring-1 ring-white/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              View Fleet
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
      title: "Vetted Operators",
      body: "Trusted crews, strong maintenance programs, and repeat‑client safety culture.",
    },
    {
      title: "Transparent Quotes",
      body: "Fuel, FBO fees, overnights, de‑icing—disclosed up front. No surprises.",
    },
    {
      title: "24/7 Coordination",
      body: "Concierge for ground transfers, catering, pets, and itinerary changes.",
    },
    {
      title: "Premier 1A Access",
      body: "Flagship FLL‑based Premier 1A—efficient and charter‑ready.",
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

// ---------- Popular routes (static sample) ----------

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

// ---------- Fleet grid ----------

const Fleet = () => (
  <Section id="fleet" title="Fleet Access" subtitle="Light to midsize jets, matched to mission and budget.">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FLEET.map((f) => (
        <article key={f.id} className="overflow-hidden rounded-2xl border shadow-sm">
          <img
            src={f.image}
            alt={`${f.name} cabin for up to ${f.pax} passengers`}
            width={900}
            height={600}
            loading="lazy"
            className="aspect-[3/2] w-full object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{f.name}</h3>
            <p className="text-sm text-gray-600">{f.pax} pax · ~{f.rangeNm} nm · ~{f.speedKt} kt</p>
            {f.note && <p className="mt-1 text-sm text-gray-700">{f.note}</p>}
            {f.url && (
              <Link to={f.url} className="mt-3 inline-block text-sm font-medium underline">
                View Details
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  </Section>
);

// ---------- Quote form with simple estimator ----------

function useCharterEstimate(hours, pax, cabin) {
  // Very simple heuristic ranges; replace with your pricing logic or API call
  const base = cabin === "midsize" ? 6300 : 4200; // per flight hour (USD)
  const est = hours * base;
  const fees = 650; // buffer for FBO/overnight/etc
  const catering = pax * 35;
  const total = Math.max(0, Math.round(est + fees + catering));
  return { base, est, fees, catering, total };
}

const QuoteForm = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [retDate, setRetDate] = useState("");
  const [pax, setPax] = useState(4);
  const [hours, setHours] = useState(2);
  const [cabin, setCabin] = useState("light");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { base, est, fees, catering, total } = useCharterEstimate(hours, pax, cabin);

  const canSubmit = useMemo(() => from && to && date && pax > 0, [from, to, date, pax]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your POST to backend or email service
    console.log({ from, to, date, retDate, pax, hours, cabin, notes, estimate: total });
    setSubmitted(true);
  };

  return (
    <Section id="quote" title="Request a Charter Quote" subtitle="We'll respond quickly with live availability and a firm price.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border p-6 shadow-sm lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">From (ICAO/IATA/City)</span>
              <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="FLL / Fort Lauderdale" className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">To (ICAO/IATA/City)</span>
              <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="TPA / Tampa" className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Departure Date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Return Date (optional)</span>
              <input type="date" value={retDate} onChange={(e) => setRetDate(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Passengers</span>
              <input type="number" min={1} max={9} value={pax} onChange={(e) => setPax(parseInt(e.target.value || "0", 10))} className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Estimated Block Hours</span>
              <input type="number" min={0.5} step={0.1} value={hours} onChange={(e) => setHours(parseFloat(e.target.value || "0"))} className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Preferred Cabin</span>
              <select value={cabin} onChange={(e) => setCabin(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="light">Light Jet</option>
                <option value="midsize">Midsize Jet</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Notes (pets, catering, ground, etc.)</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-gray-500">By submitting, you agree to be contacted by PennJets. We respond quickly.</p>
            <button disabled={!canSubmit} className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white enabled:hover:bg-black disabled:opacity-40">Send Request</button>
          </div>

          {submitted && (
            <p className="mt-3 text-sm text-green-700">Thanks! Your request has been recorded. We'll follow up shortly.</p>
          )}
        </form>

        {/* Estimator Card */}
        <aside className="rounded-2xl border p-6 shadow-sm">
          <h3 className="text-base font-semibold">Quick Estimate</h3>
          <p className="mt-1 text-sm text-gray-600">Not a quote. Final price depends on day/time, repositioning, and availability.</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Cabin base (per hr)</dt><dd>${base.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt>Flight time</dt><dd>~{hours} hr</dd></div>
            <div className="flex justify-between"><dt>Est. flight subtotal</dt><dd>${est.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt>Ops fees (est.)</dt><dd>${fees.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt>Catering ({pax})</dt><dd>${catering.toLocaleString()}</dd></div>
            <div className="mt-3 border-t pt-3 flex justify-between font-semibold"><dt>Total (est.)</dt><dd>${total.toLocaleString()}</dd></div>
          </dl>
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
          <p className="mt-1 text-sm text-white/80">Call (973) 868‑8425 or send your itinerary for a fast quote.</p>
        </div>
        <div className="flex gap-3">
          <a href="#quote" className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow hover:shadow-md">Get a Quote</a>
          <Link to="/aircraft" className="rounded-2xl px-5 py-3 text-sm font-medium ring-1 ring-white/70 hover:bg-white/10">Browse Aircraft</Link>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/60">PennJets is a broker and does not operate aircraft.</p>
    </div>
  </Section>
);

// ---------- Page ----------

const Charter = () => {
  return (
    <main>
      <Hero />
      <Benefits />
      <PopularRoutes />
      <QuoteForm />
      <FooterCta />
    </main>
  );
};

export default Charter;
