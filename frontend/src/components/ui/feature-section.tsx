import { ArrowLeftRight, Clock, Headphones } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: ArrowLeftRight,
      title: 'Easy Exchange Policy',
      description: 'We offer hassle free exchange policy'
    },
    {
      icon: Clock,
      title: '7 Days Return Policy',
      description: 'We provide 7 days free return policy'
    },
    {
      icon: Headphones,
      title: 'Best Customer Support',
      description: 'We provide 24/7 customer support'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
      {features.map((feature) => (
        <div key={feature.title} className="text-center">
          <feature.icon className="mx-auto h-8 w-8" />
          <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
          <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

