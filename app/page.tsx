import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedWatches } from '@/components/home/featured-watches'
import { BrandsSection } from '@/components/home/brands-section'
import { FeaturesSection } from '@/components/home/features-section'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedWatches />
        <BrandsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
