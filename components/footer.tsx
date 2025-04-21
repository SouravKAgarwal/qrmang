import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t py-8">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-xl font-bold">qrmang</h3>
          <p className="text-sm">
            Create, manage, and share QR codes seamlessly with qrmang. Connect
            with us via WhatsApp for instant support and updates.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold">Get in Touch</h4>
          <p className="mb-2 text-sm">
            Email:{" "}
            <a href="mailto:support@qrmang.com" >
              support@qrmang.com
            </a>
          </p>
          <p className="mb-4 text-sm">
            Phone:{" "}
            <a href="tel:+1234567890" >
              +1 (234) 567-890
            </a>
          </p>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/qrmang"
              target="_blank"
              rel="noopener noreferrer"
              
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/qrmang"
              target="_blank"
              rel="noopener noreferrer"
              
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t pt-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} qrmang. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
