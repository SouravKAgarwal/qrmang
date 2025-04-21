"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 pt-8 text-center"
      >
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg font-medium">Last Updated: April 17, 2025</p>
        <div className="mt-6 flex justify-center">
          <svg
            className="h-24 w-24 text-indigo-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-label="QRMang QR Code Icon"
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
          <CardTitle className="text-3xl font-semibold">
            Protecting Your Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              Welcome to QRMang ("we," "us," or "our"). QRMang is a platform for
              creating and managing QR codes, designed to empower businesses in
              India and beyond. This Privacy Policy explains how we collect,
              use, disclose, and protect your personal data when you use our
              website, app, or WhatsApp Business services. We comply with
              India’s Digital Personal Data Protection Act, 2023 (DPDP Act),
              WhatsApp Business Policy, and other applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <Separator className="my-4" />
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="auth-data">
                <AccordionTrigger>
                  Authentication Data (Google/GitHub)
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed">
                  When you sign in using Google or GitHub via our authentication
                  system (powered by Auth.js), we collect your name, email
                  address, and profile picture (if provided) to create and
                  manage your QRMang account.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="personal-info">
                <AccordionTrigger>Personal Information</AccordionTrigger>
                <AccordionContent className="leading-relaxed">
                  Name, phone number, email, and other details you provide
                  during registration or when opting into WhatsApp
                  communications.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="usage-data">
                <AccordionTrigger>Usage Data</AccordionTrigger>
                <AccordionContent className="leading-relaxed">
                  Interactions with our platform, such as QR code creation,
                  scans, messages sent/received, and timestamps.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="device-info">
                <AccordionTrigger>Device Information</AccordionTrigger>
                <AccordionContent className="leading-relaxed">
                  Device type, operating system, IP address, and technical data
                  collected during service usage.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="business-data">
                <AccordionTrigger>Business Interaction Data</AccordionTrigger>
                <AccordionContent className="leading-relaxed">
                  Details from WhatsApp Business interactions, such as order
                  confirmations, support queries, or QR code shares.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Authentication with Google and GitHub
            </h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              QRMang uses Auth.js to provide secure sign-in via Google and
              GitHub. When you authenticate:
            </p>
            <ul className="mt-4 list-disc pl-6 leading-relaxed">
              <li>
                We collect minimal data (e.g., name, email) to create your
                account and personalize your experience.
              </li>
              <li>
                Google and GitHub may share additional data per their privacy
                policies. We only store what’s necessary for QRMang services.
              </li>
              <li>
                You can revoke access anytime via your Google or GitHub account
                settings.
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Review{" "}
              <Link
                href="https://policies.google.com/privacy"
                className="text-indigo-600 hover:underline"
              >
                Google’s Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                className="text-indigo-600 hover:underline"
              >
                GitHub’s Privacy Statement
              </Link>{" "}
              for details on their data practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">WhatsApp Business Usage</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              We use the WhatsApp Business Platform to send QR code updates,
              provide customer support, and share promotional messages (with
              your consent). To comply with WhatsApp Business Policy and the
              DPDP Act:
            </p>
            <ul className="mt-4 list-disc pl-6 leading-relaxed">
              <li>
                We obtain explicit opt-in consent before messaging you via
                WhatsApp (e.g., during signup or QR code creation).
              </li>
              <li>
                We use pre-approved message templates for business-initiated
                messages outside the 24-hour customer service window.
              </li>
              <li>
                Our WhatsApp Business profile includes accurate details:{" "}
                <Link
                  href="mailto:support@qrmang.vercel.app"
                  className="text-indigo-600 hover:underline"
                >
                  support@qrmang.vercel.app
                </Link>{" "}
                and{" "}
                <Link
                  href="https://qrmang.vercel.app"
                  className="text-indigo-600 hover:underline"
                >
                  qrmang.vercel.app
                </Link>
                .
              </li>
              <li>We do not use WhatsApp for non-business purposes.</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              WhatsApp (owned by Meta) processes metadata to deliver its
              services. See{" "}
              <Link
                href="https://www.whatsapp.com/legal/privacy-policy"
                className="text-indigo-600 hover:underline"
              >
                WhatsApp’s Privacy Policy
              </Link>{" "}
              for more information.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 border-none bg-green-500 text-white hover:bg-green-700"
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
            <h2 className="text-2xl font-semibold">
              How We Use Your Information
            </h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">We use your data to:</p>
            <ul className="mt-4 list-disc pl-6 leading-relaxed">
              <li>
                Provide and improve QR code creation and management services.
              </li>
              <li>
                Authenticate users via Google and GitHub for secure access.
              </li>
              <li>
                Send transactional notifications and promotional messages (with
                consent) via WhatsApp.
              </li>
              <li>Analyze usage to enhance platform performance.</li>
              <li>
                Comply with legal obligations under the DPDP Act and other laws.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Data Sharing</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">We share data with:</p>
            <ul className="mt-4 list-disc pl-6 leading-relaxed">
              <li>
                Google and GitHub for authentication services, as per their
                privacy policies.
              </li>
              <li>WhatsApp/Meta for messaging services.</li>
              <li>
                Service providers (e.g., cloud hosting, analytics) under strict
                data processing agreements compliant with the DPDP Act.
              </li>
              <li>Legal authorities when required by Indian law.</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              We do not sell your data or share it for purposes unrelated to
              QRMang services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Data Transfers</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              Your data may be transferred to countries like the US for
              processing by WhatsApp, Google, GitHub, or our service providers.
              We ensure compliance with the DPDP Act through data protection
              agreements and safeguards like Standard Contractual Clauses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              Your Rights Under the DPDP Act
            </h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              As a user in India, you have the following rights under the DPDP
              Act:
            </p>
            <ul className="mt-4 list-disc pl-6 leading-relaxed">
              <li>
                <strong>Consent:</strong> Access and withdraw consent for data
                processing.
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                data.
              </li>
              <li>
                <strong>Erasure:</strong> Request deletion of your data, subject
                to legal obligations.
              </li>
              <li>
                <strong>Portability:</strong> Request your data in a
                machine-readable format.
              </li>
              <li>
                <strong>Grievance Redressal:</strong> Raise concerns with our
                Grievance Officer.
              </li>
              <li>
                <strong>Opt-Out:</strong> Opt out of WhatsApp messages by
                replying “STOP” or emailing{" "}
                <Link
                  href="mailto:support@qrmang.vercel.app"
                  className="text-indigo-600 hover:underline"
                >
                  support@qrmang.vercel.app
                </Link>
                .
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              To exercise these rights, contact our Grievance Officer at{" "}
              <Link
                href="mailto:grievance@qrmang.vercel.app"
                className="text-indigo-600 hover:underline"
              >
                grievance@qrmang.vercel.app
              </Link>
              . We will respond within 30 days, as required by the DPDP Act.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              We implement encryption, access controls, and other measures to
              protect your data, in line with the DPDP Act. WhatsApp messages
              are end-to-end encrypted. Please safeguard your Google/GitHub
              credentials and QRMang account details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Data Retention</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              We retain your data only as long as necessary for QRMang services
              or as required by Indian law. WhatsApp chat data is stored for 30
              days unless you request deletion or legal requirements apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Children’s Privacy</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              QRMang is not intended for users under 18, as per Indian law. We
              do not knowingly collect children’s data. Contact us at{" "}
              <Link
                href="mailto:support@qrmang.vercel.app"
                className="text-indigo-600 hover:underline"
              >
                support@qrmang.vercel.app
              </Link>{" "}
              if you have concerns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Policy Updates</h2>
            <Separator className="my-4" />
            <p className="leading-relaxed">
              We may update this policy to reflect changes in our practices or
              Indian law. We will notify you via WhatsApp, email, or our website
              (
              <Link
                href="https://qrmang.vercel.app"
                className="text-indigo-600 hover:underline"
              >
                qrmang.vercel.app
              </Link>
              ). Continued use of QRMang services implies acceptance of updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <Separator className="my-4" />
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Button
                variant="outline"
                className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
              >
                <Mail className="mr-2 h-4 w-4" />
                <Link href="mailto:support@qrmang.vercel.app">
                  support@qrmang.vercel.app
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
              >
                <Phone className="mr-2 h-4 w-4" />
                <Link href="tel:+919876543210">+91 98765 43210</Link>
              </Button>
            </div>
            <p className="mt-4 leading-relaxed">
              Grievance Officer:{" "}
              <Link
                href="mailto:grievance@qrmang.vercel.app"
                className="text-indigo-600 hover:underline"
              >
                grievance@qrmang.vercel.app
              </Link>
              <br />
              Address: QRMang Pvt. Ltd., 123 Tech Park, Bengaluru, Karnataka,
              India
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
