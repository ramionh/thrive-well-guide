
import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page title and effective date */}
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="italic text-gray-600 mb-8">Effective Date: July 3, 2025</p>

      {/* 1. Information We Collect */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>Mobile number you submit on <a href="/subscribe" className="text-blue-500 hover:underline">/subscribe</a></li>
          <li>Opt-in confirmation timestamp</li>
          <li>Message delivery status</li>
        </ul>
      </section>

      {/* 2. How We Use Your Information */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-700 leading-relaxed">
          To send you fitness-coaching SMS, manage your subscription, and improve our service.
        </p>
      </section>

      {/* 3. Sharing & Disclosure */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Sharing &amp; Disclosure</h2>
        <p className="text-gray-700 leading-relaxed">
          We do not sell or rent your personal data. We may share it with our SMS provider (Twilio) solely to deliver messages.
        </p>
      </section>

      {/* 4. Data Retention */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Data Retention</h2>
        <p className="text-gray-700 leading-relaxed">
          We retain your phone number and opt-in history for as long as you remain subscribed, plus 30 days.
        </p>
      </section>

      {/* 5. Your Rights */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
        <p className="text-gray-700 leading-relaxed">
          You can unsubscribe at any time by replying <strong>STOP</strong>. To review or delete your data, email{" "}
          <a href="mailto:privacy@genxshred.com" className="text-blue-500 hover:underline">privacy@genxshred.com</a>.
        </p>
      </section>

      {/* 6. Changes & Contact */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Changes to This Policy</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may update this Privacy Policy—changes will be posted here with a new effective date.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed">
          For privacy questions, contact <a href="mailto:privacy@genxshred.com" className="text-blue-500 hover:underline">privacy@genxshred.com</a>.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
