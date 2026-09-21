import React, { useState } from 'react';
import { HiPhone, HiMail, HiLocationMarker, HiClock } from 'react-icons/hi';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';
import MoreFields from '../../common/MoreFields/MoreFields';

// The CRM filters leads on exactly four service values. This page's dropdown
// predates them, so each option is mapped to one of the four before the lead is
// posted; an option with no home among them sends no service at all rather than
// inventing a fifth value the filter would not know. WO-4.15.
//
// Sales and Acquisition follow this site's own definitions on /services:
// Aircraft Sales is selling an owner's aircraft, Aircraft Acquisition is
// finding and buying one for a client.
const SERVICE_MAP = {
  'aircraft-sales': 'sell',
  'aircraft-acquisition': 'buy',
  'charter-brokerage': 'charter',
  consulting: 'consulting',
  other: undefined,
  '': undefined,
};

// What the reader saw, so the broker can still read their actual choice even
// when it maps to no service.
const SERVICE_LABELS = {
  'aircraft-sales': 'Aircraft Sales',
  'aircraft-acquisition': 'Aircraft Acquisition',
  'charter-brokerage': 'Charter Brokerage',
  consulting: 'Consulting',
  other: 'Other',
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get CRM API endpoint and webhook ID from environment
      const crmApiUrl = import.meta.env.VITE_CRM_API_URL || 'https://www.pennforce.pennjets.com';
      const webhookId = import.meta.env.VITE_CONTACT_WEBHOOK_ID;

      if (!webhookId) {
        throw new Error('Webhook not configured. Please contact support.');
      }

      const webhookUrl = `${crmApiUrl}/api/webhooks/incoming/${webhookId}`;

      console.log('Submitting to CRM webhook:', webhookUrl);

      // Send to CRM webhook using new multi-tenant endpoint
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          service: SERVICE_MAP[formData.service],
          message: SERVICE_LABELS[formData.service]
            ? `Service interest: ${SERVICE_LABELS[formData.service]}\n\n${formData.message}`
            : formData.message,
          pageUrl: window.location.href,
          // Add UTM parameters if available (from URL query params)
          utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
          utm_term: new URLSearchParams(window.location.search).get('utm_term') || undefined,
          utm_content: new URLSearchParams(window.location.search).get('utm_content') || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      console.log('Lead created successfully:', data);
      setSubmitStatus('success');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: 'Phone',
      info: '(954) 546-0763',
      description: 'Available 24/7 for urgent inquiries',
      icon: HiPhone
    },
    {
      title: 'Email',
      info: 'joe@pennjets.com',
      description: 'We respond within 2 hours',
      icon: HiMail
    },
    {
      title: 'Address',
      info: '690 SW 1st Ct #1030\nMiami, FL 33130',
      description: 'Visit our offices by appointment',
      icon: HiLocationMarker
    }
  ];

  const offices = [
    {
      city: 'Miami, FL',
      address: '690 SW 1st Ct #1030\nMiami, FL 33130',
      phone: '(954) 546-0763',
      isHQ: true
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-24">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-lg mb-6">Contact Us</h1>
            <p className="body-lg text-gray-300">
              Ready to take the next step in your aviation journey? Our team of experts 
              is here to help you with all your private aircraft needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="h-fit">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Name *</span>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Email *</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MoreFields summary="Add phone and company">
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700 mb-1">Phone</span>
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700 mb-1">Company</span>
                      <input
                        type="text"
                        autoComplete="organization"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </label>
                  </MoreFields>
                </div>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Service Interest</span>
                  <select
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a service</option>
                    <option value="aircraft-sales">Aircraft Sales</option>
                    <option value="aircraft-acquisition">Aircraft Acquisition</option>
                    <option value="charter-brokerage">Charter Brokerage</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Message *</span>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your aviation needs..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </label>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                {submitStatus === 'success' && (
                  <p className="text-sm text-green-700" role="status">Thank you. Your message is in. We'll be in touch shortly.</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-sm text-red-700" role="alert">Sorry, that didn't go through. Please try again, email joe@pennjets.com, or call (954) 546-0763.</p>
                )}
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex items-start">
                        <div className="text-primary-600 mr-4">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-gray-600 whitespace-pre-line mb-1">{item.info}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Response */}
              <Card className="bg-primary-50">
                <div className="text-center">
                  <div className="text-primary-600 mb-3 flex justify-center">
                    <HiClock className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Response</h3>
                  <p className="text-gray-600 text-sm">
                    We typically respond to all inquiries within 2 hours during business hours.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Our Locations</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Visit us at any of our convenient locations or schedule a meeting at your preferred airport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="text-center">
                {office.isHQ && (
                  <div className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full mb-4">
                    Headquarters
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {office.city}
                </h3>
                <p className="text-gray-600 whitespace-pre-line mb-3">
                  {office.address}
                </p>
                <p className="text-primary-600 font-medium">
                  {office.phone}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </>
  );
};

export default Contact;