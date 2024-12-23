'use client'

import Link from 'next/link'

export default function Footer() {
  const companyLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About us' },
    { href: '/delivery', label: 'Delivery' },
    { href: '/privacy', label: 'Privacy policy' },
  ]

  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column - Logo and Description */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="text-xl font-semibold">FOREVER</span>
            <span className="text-rose-500">.</span>
          </Link>
          <p className="text-gray-600 text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Middle Column - Company Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm tracking-wider uppercase">
            Company
          </h3>
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm tracking-wider uppercase">
            Get in Touch
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="tel:+1-212-456-7890"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                aria-label="Call us"
              >
                +1-212-456-7890
              </Link>
            </li>
            <li>
              <Link
                href="mailto:greatstackdev@gmail.com"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                aria-label="Email us"
              >
                greatstackdev@gmail.com
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section with Separator and Copyright */}
      <div className="mt-12">
        <div className="border-t border-gray-200" />
        <p className="mt-8 text-center text-sm text-gray-500">
          Copyright 2024 © GreatStack.dev - All Right Reserved.
        </p>
      </div>
    </footer>
  )
}

