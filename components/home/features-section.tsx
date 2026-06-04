import { Shield, Truck, RefreshCw, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Гарантия подлинности',
    description: 'Каждые часы проходят экспертизу и сопровождаются сертификатом аутентичности'
  },
  {
    icon: Truck,
    title: 'Бесплатная доставка',
    description: 'Доставка по всей России курьерской службой с полной страховкой'
  },
  {
    icon: RefreshCw,
    title: 'Обмен и возврат',
    description: '14 дней на возврат или обмен товара надлежащего качества'
  },
  {
    icon: Headphones,
    title: 'Поддержка 24/7',
    description: 'Консультации экспертов и сервисное обслуживание круглосуточно'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
