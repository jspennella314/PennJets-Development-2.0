import React from 'react';
import { Link } from 'react-router-dom';
import {
  LAST_UPDATED, INTRO, HEADLINE, HEADLINE_BODY, INVENTORY, SECTIONS, RELATED,
} from '../../../content/cookiePolicy';

// Copy lives in src/content/cookiePolicy.js so the page and the draft Joseph
// approves cannot drift apart. See WO-4.12.
const CookiePolicy = () => {
  return (
    <>
      <div className="bg-gray-900 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-4">Cookie Policy</h1>
            <p className="body-lg text-gray-300">
              Penn Jets LLC. Last updated {LAST_UPDATED}.
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding bg-white">
        <div className="max-w-3xl mx-auto container-padding">
          <p className="text-lg leading-relaxed text-gray-700">{INTRO}</p>

          <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">{HEADLINE}</h2>
            {HEADLINE_BODY.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-gray-700">{p}</p>
            ))}
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">What is actually stored</h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              Measured on {LAST_UPDATED} in a browser profile with nothing in it, across
              the home page, the Market Notes index, a Market Note, the charter, buy and
              contact pages, and both legal pages.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {INVENTORY.head.map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-left font-semibold text-gray-900">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {INVENTORY.rows.map((r, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50 align-top">
                      {r.map((cell, j) => (
                        <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-gray-700">{p}</p>
              ))}
            </section>
          ))}

          <section className="mt-12 rounded-xl bg-gray-50 p-6">
            <p className="text-gray-700">
              {RELATED}{' '}
              <Link to="/privacy-policy" className="font-medium text-primary-700 hover:text-primary-800">
                Read the privacy policy
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
