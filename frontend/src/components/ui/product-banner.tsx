import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface ProductBannerProps {
  title: string
  tagline: string
  imageUrl: string
}

export function ProductBanner({ title, tagline, imageUrl }: ProductBannerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden rounded-lg bg-rose-50">
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <span className="text-sm font-medium tracking-wider text-gray-600">
          — {tagline}
        </span>
        <h1 className="mt-4 text-4xl font-serif">{title}</h1>
        <Button
          asChild
          className="mt-8 w-fit"
        >
          <Link href="/products">
            SHOP NOW
          </Link>
        </Button>
      </div>
      <div className="relative aspect-square lg:aspect-auto">
        <Image
          src={imageUrl}
          alt="Latest collection banner"
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    </div>
  )
}

