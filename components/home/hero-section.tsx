import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Award, Clock } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1920&h=1080&fit=crop)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      
      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium uppercase tracking-widest">Премиальные часы</span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
            Время <span className="text-primary">роскоши</span> на вашем запястье
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Эксклюзивная коллекция швейцарских часов от ведущих мировых брендов. 
            Каждый экземпляр - произведение искусства с гарантией подлинности.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/catalog">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Смотреть каталог
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/catalog?category=luxury">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Коллекция Люкс
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 pt-8 border-t border-border/50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Гарантия подлинности</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm">Официальный дилер</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm">Сервис 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
