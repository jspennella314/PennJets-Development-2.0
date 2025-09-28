import React from 'react';
import { Helmet } from 'react-helmet-async';

const Compliance = () => {
  return (
    <>
      <Helmet>
        <title>Compliance Statement - PennJets LLC</title>
        <meta name="description" content="PennJets compliance statement detailing our adherence to aviation, data protection, and industry regulations." />
      </Helmet>

      <div className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">Compliance Statement</h1>
            <p className="body-lg text-gray-300">
              Penn Jets LLC - Effective Date: September 28, 2025
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding bg-white">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="prose prose-lg max-w-none">

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-blue-900 text-sm">
                Penn Jets LLC ("Penn Jets," "we," "us," "our") conducts its aviation brokerage and consulting services
                in compliance with applicable U.S. laws and regulations, including 14 CFR Part 295 (Air Charter
                Brokers). As an intermediary, we fully comply with the consumer protection, advertising, and disclosure
                obligations imposed on air charter brokers.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Aviation Compliance - 14 CFR Part 295</h2>
              <p className="text-gray-600 mb-4">
                We do not hold ourselves out as a direct air carrier; we are not in operational control of aircraft.
                All flights facilitated through our Services are provided by properly certificated direct air carriers
                (FAA-licensed Part 135 operators, such as KLM Aviation Inc.) in full compliance with applicable safety
                and operational regulations.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Required Disclosures & Compliance</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Clear Broker Identification</h4>
                      <p className="text-green-800 text-sm">In all advertising or solicitations, we clearly disclose that Penn Jets is a broker, not a direct operator</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Pre-Contract Disclosures</h4>
                      <p className="text-green-800 text-sm">Before contracting, we disclose: operator name, our role as intermediary, total costs, and liability insurance coverage</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Prompt Refund Processing</h4>
                      <p className="text-green-800 text-sm">Refunds issued within 20 days for cash/check purchases, with client cancellation options for late disclosures</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fair Business Practices</h2>
              <p className="text-gray-600 mb-4">
                We adhere to fair business practices and do not engage in unfair or deceptive acts or
                methods of competition as prohibited by Part 295.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Prohibited Practices We Avoid</h3>
                <ul className="list-disc list-inside text-yellow-800 space-y-1">
                  <li>Misrepresenting our status as broker vs. operator</li>
                  <li>Misrepresenting aircraft specifications or availability</li>
                  <li>Misrepresenting schedules or pricing</li>
                  <li>Misrepresenting insurance status or coverage</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Trust & Protection</h2>
              <p className="text-gray-600 mb-4">
                By using our Services, you can trust that Penn Jets operates as a fully compliant charter broker,
                respecting regulatory obligations and protecting your interests.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Regulatory Compliance</h3>
                  <p className="text-blue-800 text-sm">
                    Full adherence to 14 CFR Part 295 Air Charter Broker regulations and consumer protection requirements.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Transparency</h3>
                  <p className="text-purple-800 text-sm">
                    Complete disclosure of all fees, operator information, and liability coverage before any commitments.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Website & Security Compliance</h2>
              <p className="text-gray-600 mb-4">
                We maintain industry-standard security measures and website compliance protocols
                to protect your information and ensure secure transactions.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">SSL Encryption</h4>
                    <p className="text-gray-600 text-sm">All data transmission secured with industry-standard SSL encryption</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Restricted Data Access</h4>
                    <p className="text-gray-600 text-sm">Limited access controls and authentication for sensitive information</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Industry-Standard Safeguards</h4>
                    <p className="text-gray-600 text-sm">Regular security updates and monitoring for potential vulnerabilities</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Transparency</h2>
              <p className="text-gray-600 mb-4">
                We maintain complete transparency in all our business dealings and financial
                arrangements with our clients.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Disclosure Policy</h3>
                <p className="text-yellow-800">
                  All commissions, fees, and financial arrangements are fully disclosed to clients
                  in writing before any commitments are made. We believe in complete transparency
                  to build trust and ensure informed decision-making.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Updates</h2>
              <p className="text-gray-600 mb-4">
                We continuously monitor regulatory changes and update our compliance practices
                accordingly. Our team stays informed about evolving requirements in aviation,
                data protection, and business regulations to ensure ongoing compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Compliance</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our compliance practices or would like to report
                a compliance concern, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Penn Jets LLC - Compliance Department</strong></p>
                <p className="text-gray-700 mb-2">690 SW 1st Ct #1030, Miami, FL 33130</p>
                <p className="text-gray-700 mb-2">Email: <a href="mailto:compliance@pennjets.com" className="text-primary-600 hover:text-primary-700">compliance@pennjets.com</a></p>
                <p className="text-gray-700">Phone: <a href="tel:+19545460763" className="text-primary-600 hover:text-primary-700">(954) 546-0763</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default Compliance;