import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
}

export function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">${price}</p>
      </div>
    </Link>
  )
}

