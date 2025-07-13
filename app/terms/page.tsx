export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using FridgeTrack, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                FridgeTrack is a food waste reduction platform that helps users track grocery expiry dates, receive
                reminders, and get recipe suggestions. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Food inventory tracking and management</li>
                <li>Expiry date notifications and reminders</li>
                <li>Recipe suggestions for expiring ingredients</li>
                <li>Waste reduction analytics and reporting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semib old text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">As a user of FridgeTrack, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not interfere with or disrupt the service</li>
                <li>Not use the service for any unlawful purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Subscription and Billing</h2>
              <p className="text-gray-600 mb-4">
                FridgeTrack offers both free and premium subscription plans. For premium subscriptions:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Billing occurs monthly or annually as selected</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Price changes will be communicated 30 days in advance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600">
                FridgeTrack shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact Information</h2>
              <p className="text-gray-600">For questions about these Terms of Service, please contact us at:</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@fridgetrack.com
                  <br />
                  <strong>Address:</strong> 123 Tech Street, San Francisco, CA 94105
                  <br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
