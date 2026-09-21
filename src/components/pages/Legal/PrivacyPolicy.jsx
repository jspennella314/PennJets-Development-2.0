import React from 'react';
import {
  LAST_UPDATED, INTRO, SHORT_VERSION, SECTIONS, CONTACT,
} from '../../../content/privacyPolicy';

// Copy lives in src/content/privacyPolicy.js so the page and the draft Joseph
// approves cannot drift apart. See WO-4.10.
const PrivacyPolicy = () => {
  return (
    <>
      <div className="bg-gray-900 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-4">Privacy Policy</h1>
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
            <h2 className="text-lg font-semibold text-gray-900">The short version</h2>
            <ul className="mt-4 space-y-2">
              {SHORT_VERSION.map((line, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <span aria-hidden="true" className="text-primary-600">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{s.title}</h2>
              {s.body?.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-gray-700">{p}</p>
              ))}

              {s.table && (
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {s.table.head.map((h) => (
                          <th key={h} scope="col" className="px-4 py-3 text-left font-semibold text-gray-900">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {s.table.rows.map((r, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50 align-top">
                          <td className="px-4 py-3 font-medium text-gray-900">{r[0]}</td>
                          <td className="px-4 py-3 text-gray-700">{r[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((item, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span aria-hidden="true" className="text-primary-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {s.after?.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-gray-700">{p}</p>
              ))}
            </section>
          ))}

          <section className="mt-12 rounded-xl bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
            <p className="mt-3 font-medium text-gray-900">{CONTACT.name}</p>
            <p className="text-gray-700">{CONTACT.address}</p>
            <p className="mt-2 text-gray-700">{CONTACT.email}</p>
            <p className="text-gray-700">
              <a href={CONTACT.phoneHref} className="text-primary-700 hover:text-primary-800">{CONTACT.phone}</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
