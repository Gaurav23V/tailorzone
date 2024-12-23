import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { NewsletterSection } from '@/components/ui/newsletter-section'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-16 text-center">
          <h1 className="text-2xl font-medium">
            CONTACT <span className="font-serif">US</span> —
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src="https://res.cloudinary.com/dnjbvrono/image/upload/v1734940367/tailorvision/tcqf64qgjz5wcr3bkeqj.png?height=800&width=800"
              alt="Workspace with laptop and coffee"
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-12">
            {/* Store Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">OUR STORE</h2>
              <div className="space-y-2 text-gray-600">
                <p>54709 Willms Station</p>
                <p>Suite 350, Washington, USA</p>
                <p>Tel: (415) 555-0132</p>
                <p>Email: greatstackdev@gmail.com</p>
              </div>
            </div>

            {/* Careers Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">CAREERS AT FOREVER</h2>
              <p className="text-gray-600">
                Learn more about our teams and job openings.
              </p>
              <Button
                variant="outline"
                asChild
              >
                <Link href="/careers">
                  Explore Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </main>
  )
}

