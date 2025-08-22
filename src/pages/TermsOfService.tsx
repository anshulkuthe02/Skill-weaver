import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: August 21, 2025</p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    By accessing and using SkillWeave ("the Service"), you accept and agree to be bound by the 
                    terms and provision of this agreement. If you do not agree to abide by the above, please do 
                    not use this service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    SkillWeave provides a platform for creating and hosting developer portfolios. Our service includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Portfolio building tools and templates</li>
                    <li>AI-powered content generation</li>
                    <li>Website hosting and custom domains</li>
                    <li>Analytics and SEO tools</li>
                    <li>Export and backup functionality</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    To use our service, you must create an account. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Maintaining the confidentiality of your account information</li>
                    <li>All activities that occur under your account</li>
                    <li>Providing accurate and current information</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>You agree not to use the service to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Upload content that violates any laws or infringes on rights of others</li>
                    <li>Distribute malware, viruses, or harmful code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use the service for any illegal or unauthorized purpose</li>
                    <li>Interfere with or disrupt the service or servers</li>
                    <li>Create false identities or impersonate others</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Content Ownership</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    You retain ownership of all content you create and upload to our platform. By using our service, 
                    you grant us a limited license to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Host and display your content as part of the service</li>
                    <li>Make backups for security and reliability purposes</li>
                    <li>Use anonymized data for service improvement</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    For paid services:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Payments are processed securely through third-party providers</li>
                    <li>Subscriptions renew automatically unless cancelled</li>
                    <li>Refunds are available within 30 days of purchase</li>
                    <li>We may change pricing with 30 days notice</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    We strive to maintain high availability but cannot guarantee uninterrupted service. 
                    We may temporarily suspend service for maintenance, updates, or unforeseen circumstances.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    SkillWeave shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages resulting from your use of the service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    Either party may terminate this agreement at any time. Upon termination:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Your access to the service will be discontinued</li>
                    <li>You may export your data within 30 days</li>
                    <li>We may delete your data after the grace period</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    For questions about these Terms of Service, contact us at:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>Email: legal@skillweave.com</p>
                    <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
