import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CatalogContent } from '@/components/catalog/catalog-content'
import { Suspense } from 'react'

export default function CatalogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Каталог часов
            </h1>
            <p className="text-muted-foreground">
              Эксклюзивная коллекция премиальных часов от ведущих мировых брендов
            </p>
          </div>
          <Suspense fallback={<div>Загрузка...</div>}>
            <CatalogContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
