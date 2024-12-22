export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-dark-50">Store</h3>
            <p className="text-dark-100">
              Your one-stop shop for all your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-dark-50">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-dark-100 hover:text-dark-50">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-dark-100 hover:text-dark-50">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-dark-100 hover:text-dark-50">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-dark-50 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-dark-100 hover:text-dark-50">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-dark-100 hover:text-dark-50">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-dark-50 mb-4">Newsletter</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-dark-100">
            © {new Date().getFullYear()} Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}