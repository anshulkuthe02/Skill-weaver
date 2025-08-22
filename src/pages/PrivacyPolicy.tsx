import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: August 21, 2025</p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, 
                    build a portfolio, or contact us for support.
                  </p>
                  <h3 className="font-semibold">Personal Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name and email address</li>
                    <li>Profile information (bio, skills, projects)</li>
                    <li>Contact details you choose to include in your portfolio</li>
                    <li>Payment information (processed securely by our payment providers)</li>
                  </ul>
                  <h3 className="font-semibold">Usage Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>How you interact with our platform</li>
                    <li>Pages visited and features used</li>
                    <li>Device and browser information</li>
                    <li>IP address and general location data</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Detect and prevent fraud and abuse</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    except as described in this policy:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>With service providers who assist in our operations</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction. This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Limited access to personal information on a need-to-know basis</li>
                    <li>Secure payment processing through certified providers</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Export your portfolio data</li>
                    <li>Lodge a complaint with supervisory authorities</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    We use cookies and similar technologies to improve your experience, analyze usage, 
                    and personalize content. You can control cookie preferences through your browser settings.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>Email: privacy@skillweave.com</p>
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

export default PrivacyPolicy;
