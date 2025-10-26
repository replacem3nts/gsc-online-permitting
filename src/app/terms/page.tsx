export default function TermsPage() {
  return (
    <div className="py-12" style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl border overflow-hidden" style={{ borderColor: 'rgb(85, 85, 85)' }}>
          {/* Header */}
          <div className="px-8 py-8" style={{ backgroundColor: 'rgb(59, 102, 126)' }}>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'EB Garamond, serif' }}>
              Terms of Service
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Greenwich Shellfish Permit Application Terms and Conditions
            </p>
          </div>

          {/* Content */}
          <div className="p-8 prose prose-lg max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>1. Permit Application</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                  By submitting a shellfish permit application through this website, you agree to provide accurate and complete information. 
                  Any false or misleading information may result in the denial of your permit application or revocation of an issued permit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>2. Permit Types and Fees</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <ul className="space-y-2" style={{ color: 'rgb(85, 85, 85)' }}>
                    <li><strong>Regular Permit:</strong> $15.00 - Available to all individuals 16 years and older</li>
                    <li><strong>Senior Permit:</strong> $10.00 - Available to individuals 65 years and older</li>
                    <li><strong>Junior Permit:</strong> $1.00 - Available to individuals ages 5-13</li>
                  </ul>
                </div>
                <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                  All permits are valid for the calendar year (January 1 - December 31) and are non-transferable. 
                  Permit fees are non-refundable once the permit has been issued.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>3. Shellfish Harvesting Regulations</h2>
                <p className="leading-relaxed mb-4" style={{ color: 'rgb(85, 85, 85)' }}>
                  Permit holders must comply with all applicable state and local regulations, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'rgb(85, 85, 85)' }}>
                  <li>Daily bag limits and size restrictions</li>
                  <li>Seasonal closures and area restrictions</li>
                  <li>Proper handling and storage of harvested shellfish</li>
                  <li>Reporting requirements for commercial harvesters</li>
                  <li>Environmental protection measures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>4. Safety and Health</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                  Shellfish harvesting involves inherent risks. Permit holders assume all responsibility for their safety and the safety of others. 
                  The Town of Greenwich and the Shellfish Commission are not liable for any injuries, illnesses, or damages that may occur during shellfish harvesting activities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>5. Environmental Responsibility</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                  Permit holders must practice responsible harvesting techniques that protect the marine environment and ensure the sustainability of shellfish populations. 
                  This includes proper disposal of waste, avoiding damage to marine habitats, and following all environmental protection guidelines.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>6. Permit Revocation</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                  The Town of Greenwich reserves the right to revoke any permit for violations of these terms, applicable regulations, or for any other reason deemed necessary for the protection of public health, safety, or the environment.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>7. Privacy and Data Protection</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                  Personal information collected through this application will be used solely for permit processing and administration purposes. 
                  We will not share your personal information with third parties except as required by law or for legitimate governmental purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>8. Contact Information</h2>
                <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(59, 102, 126, 0.1)' }}>
                  <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                    For questions about these terms or your permit application, please contact:
                  </p>
                  <div className="mt-2" style={{ color: 'rgb(85, 85, 85)' }}>
                    <p><strong>Greenwich Shellfish Commission</strong></p>
                    <p>Town of Greenwich</p>
                    <p>101 Field Point Road</p>
                    <p>Greenwich, CT 06830</p>
                    <p>Phone: (203) 622-7700</p>
                    <p>Email: shellfish@greenwichct.org</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>9. Agreement</h2>
                <p className="leading-relaxed" style={{ color: 'rgb(85, 85, 85)' }}>
                  By submitting your permit application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                  These terms may be updated from time to time, and continued use of your permit constitutes acceptance of any changes.
                </p>
              </section>

              <div className="border-t pt-6 mt-8" style={{ borderColor: 'rgb(221, 221, 221)' }}>
                <p className="text-sm text-center" style={{ color: 'rgb(136, 136, 136)' }}>
                  Last updated: October 2024 | Town of Greenwich, Connecticut
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}