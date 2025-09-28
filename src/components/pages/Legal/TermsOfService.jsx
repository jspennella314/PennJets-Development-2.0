import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - PennJets LLC</title>
        <meta name="description" content="PennJets terms of service outlining the conditions for using our aviation brokerage services." />
      </Helmet>

      <div className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">Terms of Service</h1>
            <p className="body-lg text-gray-300">
              Penn Jets LLC - Effective Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding bg-white">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="prose prose-lg max-w-none">

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using PennJets.com, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, you may not use our website or services.
                Your continued use of the site constitutes acceptance of any updates to these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Provided</h2>
              <p className="text-gray-600 mb-4">
                Penn Jets LLC operates as a consulting and aircraft brokerage firm. We do not own
                or operate aircraft directly. All flights and charter services are conducted by
                FAA-licensed Part 135 operators, such as KLM Aviation Inc., who maintain full
                operational control and responsibility for flight operations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Guarantee of Availability</h2>
              <p className="text-gray-600 mb-4">
                Aircraft pricing, availability, and schedules are subject to change without notice.
                While we strive to provide accurate and up-to-date information, we cannot guarantee
                the availability of any specific aircraft or pricing at the time of your inquiry.
                All quotes and availability are subject to confirmation by the operating carrier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content on this website, including text, graphics, logos, images, and software,
                belongs to Penn Jets LLC and is protected by copyright and other intellectual property laws.
                You may not reproduce, distribute, or use any content from this website without our
                express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Penn Jets LLC shall not be liable for any damages, including but not limited to direct,
                indirect, incidental, or consequential damages, resulting from your use of this website
                or third-party operator services. This limitation applies whether the damages arise from
                contract, tort, negligence, or any other legal theory.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                Users agree not to misuse this website, commit fraud, or attempt unauthorized access
                to any part of our systems. You are responsible for maintaining the confidentiality
                of any account information and for all activities that occur under your account.
                You must notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms of Service are governed by the laws of the State of Florida, without
                regard to its conflict of law principles. Any disputes arising under these terms
                shall be resolved in the courts of Miami-Dade County, Florida.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to update these Terms of Service at any time. Changes will be
                posted on this page with a new effective date. Your continued use of the website
                after such changes constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Penn Jets LLC</strong></p>
                <p className="text-gray-700 mb-2">Email: <a href="mailto:info@pennjets.com" className="text-primary-600 hover:text-primary-700">info@pennjets.com</a></p>
                <p className="text-gray-700">Phone: <a href="tel:+19738688425" className="text-primary-600 hover:text-primary-700">(973) 868-8425</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;