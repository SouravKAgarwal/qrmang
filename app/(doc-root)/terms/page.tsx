"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-extrabold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-4 text-lg">Effective Date: April 17, 2025</p>
        <div className="mt-6 flex justify-center">
          <svg
            className="h-24 w-24 text-indigo-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <path d="M12 8h2v2h-2zM10 12h2v2h-2zM14 12h2v2h-2zM12 16h2v2h-2z" />
          </svg>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p className="mt-4">
              Welcome to QRMang ("we," "us," or "our"), a platform for creating,
              managing, and sharing QR codes. By accessing or using our website,
              mobile app, or WhatsApp Business services (collectively, the
              "Services"), you agree to be bound by these Terms of Service
              ("Terms"). These Terms are governed by the laws of India,
              including the Digital Personal Data Protection Act, 2023 (DPDP
              Act) and the Information Technology Act, 2000. If you do not
              agree, please do not use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Eligibility</h2>
            <p className="mt-4">
              You must be at least 18 years old and have the legal capacity to
              enter into these Terms to use our Services. By using QRMang, you
              represent that you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Account Registration and Authentication
            </h2>
            <p className="mt-4">
              To access certain features, you must create an account using
              Google or GitHub authentication via our secure system (powered by
              Auth.js). You agree to:
            </p>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="auth-responsibilities">
                <AccordionTrigger>Your Responsibilities</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6">
                    <li>
                      Provide accurate and complete information during sign-in.
                    </li>
                    <li>
                      Keep your Google/GitHub credentials secure and
                      confidential.
                    </li>
                    <li>
                      Notify us at{" "}
                      <a
                        href="mailto:support@qrmang.in"
                        className="text-indigo-400 hover:underline"
                      >
                        support@qrmang.in
                      </a>{" "}
                      if you suspect unauthorized access.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="auth-data">
                <AccordionTrigger>Data Collection</AccordionTrigger>
                <AccordionContent>
                  We collect your name, email, and profile picture (if provided)
                  from Google or GitHub to manage your account. See our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-indigo-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="mt-4">
              You can revoke authentication access via your Google or GitHub
              account settings. Google and GitHub’s terms apply to their
              services (
              <a
                href="https://policies.google.com/terms"
                className="text-indigo-400 hover:underline"
              >
                Google Terms
              </a>
              ,{" "}
              <a
                href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"
                className="text-indigo-400 hover:underline"
              >
                GitHub Terms
              </a>
              ).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Use of WhatsApp Business Services
            </h2>
            <p className="mt-4">
              QRMang uses the WhatsApp Business Platform to communicate QR code
              updates, provide support, and send promotional messages (with your
              consent). You agree to:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>
                Provide explicit opt-in consent to receive WhatsApp messages
                (e.g., during signup or QR code creation).
              </li>
              <li>
                Not misuse our WhatsApp services (e.g., sending spam or
                unauthorized messages).
              </li>
              <li>
                Opt out of messages by replying “STOP” or contacting{" "}
                <a
                  href="mailto:support@qrmang.in"
                  className="text-indigo-400 hover:underline"
                >
                  support@qrmang.in
                </a>
                .
              </li>
            </ul>
            <p className="mt-4">
              We comply with WhatsApp Business Policy, using pre-approved
              templates and maintaining accurate contact details (
              <a
                href="https://qrmang.in"
                className="text-indigo-400 hover:underline"
              >
                qrmang.in
              </a>
              ). WhatsApp’s{" "}
              <a
                href="https://www.whatsapp.com/legal/business-terms"
                className="text-indigo-400 hover:underline"
              >
                Business Terms
              </a>{" "}
              apply to your interactions.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 border-none bg-green-600 text-white hover:bg-green-700"
            >
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us on WhatsApp
              </a>
            </Button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Acceptable Use</h2>
            <p className="mt-4">
              You agree to use QRMang Services in compliance with Indian law and
              these Terms. You will not:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>
                Use the Services for illegal activities, fraud, or harassment.
              </li>
              <li>
                Create or share QR codes containing malicious content, malware,
                or phishing links.
              </li>
              <li>
                Attempt to reverse-engineer, hack, or disrupt QRMang’s systems.
              </li>
              <li>
                Violate intellectual property rights or third-party rights.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">User Content</h2>
            <p className="mt-4">
              You retain ownership of any content (e.g., QR code designs,
              messages) you create or upload. By using QRMang, you grant us a
              non-exclusive, worldwide, royalty-free license to use, store, and
              display your content to provide the Services. You are responsible
              for ensuring your content complies with these Terms and Indian
              law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
            <p className="mt-4">
              QRMang’s Services, including our website, app, logos, and QR code
              generation technology, are protected by intellectual property
              laws. You may not copy, modify, or distribute our content without
              written permission. You are granted a limited, non-transferable
              license to use the Services as intended.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Payments and Subscriptions
            </h2>
            <p className="mt-4">
              Some QRMang features may require payment or subscriptions. You
              agree to provide accurate payment information and pay all
              applicable fees. We use third-party payment processors compliant
              with Indian law. Refunds, if any, are subject to our refund
              policy, available at{" "}
              <a
                href="https://qrmang.in/refund"
                className="text-indigo-400 hover:underline"
              >
                qrmang.in/refund
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Termination</h2>
            <p className="mt-4">
              We may suspend or terminate your account if you violate these
              Terms, misuse the Services, or engage in illegal activities. You
              may terminate your account by contacting{" "}
              <a
                href="mailto:support@qrmang.in"
                className="text-indigo-400 hover:underline"
              >
                support@qrmang.in
              </a>
              . Upon termination, your access to the Services will cease, and we
              may delete your data, subject to our{" "}
              <Link
                href="/privacy-policy"
                className="text-indigo-400 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p className="mt-4">
              To the extent permitted by Indian law, QRMang is not liable for
              indirect, incidental, or consequential damages arising from your
              use of the Services. Our liability is limited to the amount you
              paid for the Services in the preceding 12 months. The Services are
              provided “as is” without warranties, express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Indemnity</h2>
            <p className="mt-4">
              You agree to indemnify and hold QRMang harmless from any claims,
              losses, or damages arising from your use of the Services,
              violation of these Terms, or infringement of third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Governing Law and Dispute Resolution
            </h2>
            <p className="mt-4">
              These Terms are governed by the laws of India. Any disputes will
              be resolved exclusively in the courts of Bengaluru, Karnataka,
              India. You agree to attempt resolution through negotiation or
              mediation before pursuing legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Changes to These Terms</h2>
            <p className="mt-4">
              We may update these Terms to reflect changes in our Services or
              Indian law. We will notify you via email, WhatsApp, or our website
              (
              <a
                href="https://qrmang.in"
                className="text-indigo-400 hover:underline"
              >
                qrmang.in
              </a>
              ). Continued use of the Services after updates constitutes
              acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Button
                variant="outline"
                className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
              >
                <Mail />
                <a href="mailto:support@qrmang.in">support@qrmang.in</a>
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
              >
                <Phone />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </Button>
            </div>
            <p className="mt-4">
              Address: QRMang Pvt. Ltd., 123 Tech Park, Bengaluru, Karnataka,
              India
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
