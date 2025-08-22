import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CookiePolicy = () => {
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
            <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: August 21, 2025</p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    Cookies are small text files that are placed on your device when you visit our website. 
                    They help us provide you with a better experience by remembering your preferences and 
                    analyzing how you use our site.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-sm leading-relaxed mb-2">
                      These cookies are necessary for the website to function properly. They enable core functionality 
                      such as security, network management, and accessibility.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Authentication and session management</li>
                      <li>Security and fraud prevention</li>
                      <li>Load balancing and performance optimization</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Functional Cookies</h3>
                    <p className="text-sm leading-relaxed mb-2">
                      These cookies enable enhanced functionality and personalization, such as remembering your 
                      preferences and settings.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Language preferences</li>
                      <li>Theme and layout settings</li>
                      <li>Form data retention</li>
                      <li>Recently viewed content</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-sm leading-relaxed mb-2">
                      These cookies help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Page views and user journeys</li>
                      <li>Traffic sources and referrals</li>
                      <li>Feature usage and performance metrics</li>
                      <li>Error tracking and debugging</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Marketing Cookies</h3>
                    <p className="text-sm leading-relaxed mb-2">
                      These cookies are used to deliver relevant advertisements and track the effectiveness 
                      of our marketing campaigns.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Personalized advertising</li>
                      <li>Social media integration</li>
                      <li>Campaign performance tracking</li>
                      <li>Cross-site behavior analysis</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    We may use third-party services that set their own cookies. These include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Google Analytics:</strong> For website analytics and user behavior tracking</li>
                    <li><strong>Stripe:</strong> For secure payment processing</li>
                    <li><strong>Intercom:</strong> For customer support and messaging</li>
                    <li><strong>Social Media Platforms:</strong> For social sharing and login functionality</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    You have several options for managing cookies:
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Cookie Preference Center</h4>
                    <p className="mb-3">
                      Use our cookie preference center to customize which types of cookies you allow.
                    </p>
                    <Button size="sm">Manage Cookie Preferences</Button>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Browser Settings</h4>
                    <p className="mb-2">
                      You can control cookies through your browser settings:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Block all cookies</li>
                      <li>Block third-party cookies only</li>
                      <li>Delete existing cookies</li>
                      <li>Set cookies to expire when you close your browser</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Opt-Out Links</h4>
                    <p className="mb-2">
                      You can opt out of specific tracking services:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline">Google Analytics Opt-out</a></li>
                      <li><a href="https://www.facebook.com/help/568137493302217" className="text-accent hover:underline">Facebook Pixel Opt-out</a></li>
                      <li><a href="http://optout.networkadvertising.org/" className="text-accent hover:underline">Network Advertising Initiative</a></li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Cookie Retention</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    Different cookies have different retention periods:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                    <li><strong>Persistent cookies:</strong> Remain until expiration date or manual deletion</li>
                    <li><strong>Essential cookies:</strong> Typically expire after 1 year</li>
                    <li><strong>Analytics cookies:</strong> Usually expire after 2 years</li>
                    <li><strong>Marketing cookies:</strong> Generally expire after 30-90 days</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    We may update this Cookie Policy from time to time. When we do, we will post the updated 
                    policy on this page and update the "Last updated" date. We encourage you to review this 
                    policy periodically.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    If you have questions about our use of cookies, please contact us at:
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

export default CookiePolicy;
