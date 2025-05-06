import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import {
  QrCode,
  Clock,
  Utensils,
  ShoppingCart,
  Calendar,
  HeartPulse,
  Scan,
  Smartphone,
  Contact,
  FileText,
  CreditCard,
  BarChart2,
} from "lucide-react";
import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "QR Code Solutions for Modern Businesses",
  description:
    "Streamline operations and enhance customer engagement with intelligent QR technology",
};

export default function Home() {
  return (
    <div >
      <Navbar />
      <section className="relative flex w-full flex-col items-center justify-center gap-8 px-4 pt-40 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-white" />

        <div className="hidden items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary sm:flex">
          <Scan className="h-4 w-4" />
          <span>Transform Business Operations with QR Technology</span>
        </div>

        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          The Smarter Way to{" "}
          <span className="text-primary">Run Your Business</span>
        </h1>

        <p className="max-w-2xl text-center text-lg text-gray-600">
          Replace outdated processes with dynamic QR solutions that save time,
          reduce costs, and create seamless customer experiences.
        </p>

        <div className="mt-12 w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-xl border shadow-lg">
              <Image
                src="/images/qr-food.jpg"
                alt="QR code menu in restaurant"
                width={800}
                height={500}
                className="h-[350px] w-full object-center"
                priority
              />
            </div>
            <div className="overflow-hidden rounded-xl border shadow-lg">
              <Image
                src="/images/qr-event.png"
                alt="QR code event check-in"
                width={800}
                height={500}
                className="h-[350px] w-full object-center"
                priority
              />
            </div>
            <div className="overflow-hidden rounded-xl border shadow-lg">
              <Image
                src="/images/qr-health.jpg"
                alt="QR code event check-in"
                width={800}
                height={500}
                className="h-[350px] w-full object-center"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Solve Everyday Business Challenges
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              QR technology addresses common pain points across industries
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                title: "Reduce Wait Times",
                description:
                  "Customers scan to access menus, forms, or info instantly",
              },
              {
                icon: <CreditCard className="h-8 w-8 text-primary" />,
                title: "Contactless Payments",
                description:
                  "Secure transactions without physical cards or cash",
              },
              {
                icon: <FileText className="h-8 w-8 text-primary" />,
                title: "Paperless Operations",
                description: "Eliminate printed menus, forms, and brochures",
              },
              {
                icon: <Contact className="h-8 w-8 text-primary" />,
                title: "Digital Contact Tracing",
                description: "Track visitor check-ins for safety and analytics",
              },
              {
                icon: <Smartphone className="h-8 w-8 text-primary" />,
                title: "Mobile Engagement",
                description: "Connect directly with customers' smartphones",
              },
              {
                icon: <BarChart2 className="h-8 w-8 text-primary" />,
                title: "Real-time Analytics",
                description: "Track usage patterns and customer behavior",
              },
            ].map((item, index) => (
              <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Tailored Solutions for Your Industry
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See how different sectors benefit from QR technology
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            {[
              {
                name: "Restaurants",
                icon: <Utensils className="h-6 w-6" />,
                uses: [
                  "Digital menus",
                  "Contactless ordering",
                  "Feedback collection",
                ],
              },
              {
                name: "Retail",
                icon: <ShoppingCart className="h-6 w-6" />,
                uses: ["Product info", "Mobile coupons", "Loyalty programs"],
              },
              {
                name: "Events",
                icon: <Calendar className="h-6 w-6" />,
                uses: ["Ticket scanning", "Session check-ins", "Networking"],
              },
              {
                name: "Healthcare",
                icon: <HeartPulse className="h-6 w-6" />,
                uses: [
                  "Patient check-in",
                  "Info access",
                  "Prescription tracking",
                ],
              },
            ].map((industry, index) => (
              <div
                key={index}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {industry.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium">{industry.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {industry.uses.map((use, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-primary/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Simple Implementation
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started with QR solutions in just a few steps
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create Your Code",
                description: "Customize design and connect to your content",
                icon: <QrCode className="h-8 w-8" />,
              },
              {
                step: "2",
                title: "Deploy in Your Business",
                description: "Print, display digitally, or embed in systems",
                icon: <Smartphone className="h-8 w-8" />,
              },
              {
                step: "3",
                title: "Monitor & Optimize",
                description: "Track performance and update content anytime",
                icon: <BarChart2 className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  {item.icon}
                </div>
                <div className="mt-6">
                  <span className="text-sm font-semibold text-primary">
                    STEP {item.step}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="text-primary-100 mt-4 text-lg">
              Join thousands of businesses using QR codes to streamline
              operations
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
