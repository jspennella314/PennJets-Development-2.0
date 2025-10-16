import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import emailjs from '@emailjs/browser';
import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';

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
      // EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Template parameters matching your form fields
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not provided',
        service: formData.service || 'Not specified',
        message: formData.message,
        to_email: 'info@pennjets.com'
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setSubmitStatus('success');
      alert('Thank you for your message! We will contact you shortly at info@pennjets.com.');

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
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
      alert('Sorry, there was an error sending your message. Please try again or contact us directly at info@pennjets.com or call (973) 868-8425.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: 'Phone',
      info: '(973) 868-8425',
      description: 'Available 24/7 for urgent inquiries',
      icon: '📞'
    },
    {
      title: 'Email',
      info: 'INFO@PENNJETS.COM',
      description: 'We respond within 2 hours',
      icon: '✉️'
    },
    {
      title: 'Address',
      info: '690 SW 1st Ct #1030\nMiami, FL 33130',
      description: 'Visit our offices by appointment',
      icon: '📍'
    }
  ];

  const offices = [
    {
      city: 'Miami, FL',
      address: '690 SW 1st Ct #1030\nMiami, FL 33130',
      phone: '(973) 868-8425',
      isHQ: true
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact PennJets - Get in Touch with Aviation Experts</title>
        <meta name="description" content="Contact PennJets for all your aviation needs. Speak with our expert team about aircraft sales, acquisitions, charter, and management services." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 mt-16">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a service</option>
                    <option value="aircraft-sales">Aircraft Sales</option>
                    <option value="aircraft-acquisition">Aircraft Acquisition</option>
                    <option value="charter-services">Charter Services</option>
                    <option value="aircraft-management">Aircraft Management</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your aviation needs..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-2xl mr-4">{item.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 whitespace-pre-line mb-1">{item.info}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>By Appointment</span>
                  </div>
                  <div className="pt-2 border-t text-primary-600">
                    <span>24/7 Emergency Support Available</span>
                  </div>
                </div>
              </Card>

              {/* Quick Response */}
              <Card className="bg-primary-50">
                <div className="text-center">
                  <div className="text-primary-600 text-4xl mb-3">⚡</div>
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

      {/* Map Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">🗺️</div>
              <div className="text-xl">Interactive Map</div>
              <div className="text-sm">Google Maps integration would go here</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;