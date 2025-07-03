
import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page title and effective date */}
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="italic text-gray-600 mb-8">Effective Date: July 3, 2025</p>

      {/* 1. Acceptance */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-700 leading-relaxed">
          By subscribing to Gen X Shred LLC's SMS service, you agree to be bound by these Terms of Service.
          If you do not agree, do not opt in.
        </p>
      </section>

      {/* 2. Description of Service */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
        <p className="text-gray-700 leading-relaxed">
          We send daily fitness‐coaching text messages—workout reminders, protein prompts, motivational content—
          up to one message per day.
        </p>
      </section>

      {/* 3. Opt-In and Confirmation */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Opt-In and Confirmation</h2>
        <p className="text-gray-700 leading-relaxed">
          You opt in at <a href="/subscribe" className="text-blue-500 hover:underline">/subscribe</a> by entering your mobile number and confirming via a reply SMS.
          Only after you reply "YES" will messages begin.
        </p>
      </section>

      {/* 4. Message Frequency & Rates */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Message Frequency &amp; Rates</h2>
        <p className="text-gray-700 leading-relaxed">
          Up to one message per day. Msg &amp; data rates may apply.
        </p>
      </section>

      {/* 5. Opt-Out & Help */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Opt-Out &amp; Help</h2>
        <p className="text-gray-700 leading-relaxed">
          Reply <strong>STOP</strong> to unsubscribe; reply <strong>HELP</strong> for help.
        </p>
      </section>

      {/* 6. Changes, Governing Law, Contact */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Changes to Terms</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may update these Terms at any time. Continued use constitutes acceptance of the revised Terms.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3">7. Governing Law</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          These Terms are governed by the laws of the State of Georgia, USA.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed">
          Questions? Email <a href="mailto:legal@genxshred.com" className="text-blue-500 hover:underline">legal@genxshred.com</a>.
        </p>
      </section>
    </div>
  );
};

export default Terms;
