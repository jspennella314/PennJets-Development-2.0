import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - PennJets LLC</title>
        <meta name="description" content="PennJets privacy policy detailing how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="bg-gray-900 text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">Privacy Policy</h1>
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
                Penn Jets LLC ("Penn Jets," "we," "us," "our") respects your privacy. This Privacy Policy explains what
                we collect, how we use it, how we share it, and the choices you have. By using PennJets.com and
                related services ("Services"), you agree to this Policy and our Terms of Service.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Information You Provide</h3>
                  <p className="text-gray-600">
                    We collect information you provide such as name, email, phone, billing contact details, and message content.
                    Payment information is handled by our payment processor and not stored in full by us.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                  <p className="text-gray-600">
                    We also collect IP address, device/browser type, pages viewed, referring URLs, approximate location,
                    and cookie identifiers.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Information</h3>
                  <p className="text-gray-600">
                    We may receive limited information from advertising or analytics partners.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Information</h2>
              <p className="text-gray-600 mb-4">
                We use this information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide brokerage and consulting services</li>
                <li>Arrange introductions with licensed operators</li>
                <li>Communicate with you about our services</li>
                <li>Process payments securely</li>
                <li>Improve the Services and user experience</li>
                <li>Comply with legal obligations</li>
                <li>Enforce agreements and protect our rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sharing of Information</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold">
                  We do not sell your information for money.
                </p>
              </div>
              <p className="text-gray-600 mb-4">
                We may disclose information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Service providers under contract</li>
                <li>Licensed FAA operators such as KLM Aviation Inc.</li>
                <li>Advertising or analytics partners</li>
                <li>Legal authorities in response to legal obligations</li>
                <li>Third parties in connection with a merger or transfer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security & Retention</h2>
              <p className="text-gray-600 mb-4">
                We use reasonable administrative, technical, and physical safeguards to protect information,
                but no system is 100% secure.
              </p>
              <p className="text-gray-600 mb-4">
                We retain information only as long as necessary for our purposes or legal obligations
                and then delete or de-identify it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our Services are not directed to children under 13, and we do not knowingly collect
                information from them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
              <p className="text-gray-600 mb-4">
                Our Services may contain links to third-party sites; we are not responsible for their practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                Depending on where you live, including California, Colorado, Virginia, Connecticut, Utah, or Nevada,
                you may have rights to access, delete, correct, or opt out of certain uses of your data.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Exercise Your Rights</h3>
                <p className="text-blue-800 mb-2">
                  To exercise these rights email <a href="mailto:privacy@pennjets.com" className="text-primary-600 hover:text-primary-700 underline">privacy@pennjets.com</a> or mail us at our business address.
                </p>
                <p className="text-blue-800 text-sm">
                  We may need to verify your identity and will respond within legal timeframes.
                  You can also unsubscribe from marketing communications at any time.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies & Analytics</h2>
              <p className="text-gray-600 mb-4">
                Our website uses cookies and analytics tools to track usage patterns and improve functionality.
                While you may disable cookies in your browser settings, please note that this may limit
                some features of our website. For more details, please see our{' '}
                <a href="/cookie-policy" className="text-primary-600 hover:text-primary-700">Cookie Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this privacy policy from time to time to reflect changes in our practices
                or legal requirements. Revised versions will be posted on this page with a new effective date.
                We encourage you to review this policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or how we handle your personal information,
                please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Penn Jets LLC</strong></p>
                <p className="text-gray-700 mb-2">690 SW 1st Ct #1030, Miami, FL 33130</p>
                <p className="text-gray-700 mb-2">Email: <a href="mailto:privacy@pennjets.com" className="text-primary-600 hover:text-primary-700">privacy@pennjets.com</a></p>
                <p className="text-gray-700">Phone: <a href="tel:+19545460763" className="text-primary-600 hover:text-primary-700">(954) 546-0763</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;