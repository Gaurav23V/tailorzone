import Image from 'next/image'
import { NewsletterSection } from '@/components/ui/newsletter-section'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="https://res.cloudinary.com/dnjbvrono/image/upload/v1734940026/tailorvision/bnprhmlyqi3rern5yoh3.png?height=800&width=800"
                alt="Lifestyle product arrangement"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <h1 className="text-2xl font-medium">
                ABOUT <span className="font-serif">US</span> —
              </h1>

              <div className="space-y-6 text-gray-600">
                <p>
                  Forever Was Born Out Of A Passion For Innovation And A Desire To Revolutionize The Way People Shop Online. Our Journey Began With A Simple Idea: To Provide A Platform Where Customers Can Easily Discover, Explore, And Purchase A Wide Range Of Products From The Comfort Of Their Homes.
                </p>

                <p>
                  Since Our Inception, We&apos;ve Worked Tirelessly To Curate A Diverse Selection Of High-Quality Products That Cater To Every Taste And Preference. From Fashion And Beauty To Electronics And Home Essentials, We Offer An Extensive Collection Sourced From Trusted Brands And Suppliers.
                </p>

                <div className="pt-4">
                  <h2 className="text-lg font-medium text-black mb-4">Our Mission</h2>
                  <p>
                    Our Mission At Forever Is To Empower Customers With Choice, Convenience, And Confidence. We&apos;re Dedicated To Providing A Seamless Shopping Experience That Exceeds Expectations, From Browsing And Ordering To Delivery And Beyond.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 border-t">
          <h2 className="text-2xl font-medium text-center mb-12">
            WHY <span className="font-serif">CHOOSE US</span> —
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Quality Assurance */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">QUALITY ASSURANCE</h3>
              <p className="text-gray-600">
                We Meticulously Select And Vet Each Product To Ensure It Meets Our Stringent Quality Standards.
              </p>
            </div>

            {/* Convenience */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">CONVENIENCE</h3>
              <p className="text-gray-600">
                With Our User-Friendly Interface And Hassle-Free Ordering Process, Shopping Has Never Been Easier.
              </p>
            </div>

            {/* Customer Service */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">EXCEPTIONAL CUSTOMER SERVICE</h3>
              <p className="text-gray-600">
                Our Team Of Dedicated Professionals Is Here To Assist You The Way, Ensuring Your Satisfaction Is Our Top Priority.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </main>
  )
}

