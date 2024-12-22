'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-dark-50">
              Store
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link href="/products" className="text-dark-100 hover:text-dark-50">
              Products
            </Link>
            <Link href="/categories" className="text-dark-100 hover:text-dark-50">
              Categories
            </Link>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="text-dark-100 hover:text-dark-50">
                <ShoppingCartIcon className="h-6 w-6" />
              </Link>
              <Link href="/account" className="text-dark-100 hover:text-dark-50">
                <UserIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-dark-100 hover:text-dark-50"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, height: 'auto' },
          closed: { opacity: 0, height: 0 }
        }}
        className="sm:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/products"
            className="block px-3 py-2 text-dark-100 hover:text-dark-50"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="block px-3 py-2 text-dark-100 hover:text-dark-50"
          >
            Categories
          </Link>
          <Link
            href="/cart"
            className="block px-3 py-2 text-dark-100 hover:text-dark-50"
          >
            Cart
          </Link>
          <Link
            href="/account"
            className="block px-3 py-2 text-dark-100 hover:text-dark-50"
          >
            Account
          </Link>
        </div>
      </motion.div>
    </nav>
  )
}