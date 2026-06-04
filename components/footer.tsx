import Link from 'next/link'
import { Watch } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Watch className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-semibold">TimeLux</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Эксклюзивная коллекция премиальных часов от ведущих мировых брендов с гарантией подлинности.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Каталог</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/catalog?category=luxury" className="hover:text-foreground transition-colors">Люкс</Link></li>
              <li><Link href="/catalog?category=sport" className="hover:text-foreground transition-colors">Спорт</Link></li>
              <li><Link href="/catalog?category=classic" className="hover:text-foreground transition-colors">Классика</Link></li>
              <li><Link href="/catalog?gender=men" className="hover:text-foreground transition-colors">Мужские</Link></li>
              <li><Link href="/catalog?gender=women" className="hover:text-foreground transition-colors">Женские</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Бренды</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/catalog?brand=Rolex" className="hover:text-foreground transition-colors">Rolex</Link></li>
              <li><Link href="/catalog?brand=Patek Philippe" className="hover:text-foreground transition-colors">Patek Philippe</Link></li>
              <li><Link href="/catalog?brand=Audemars Piguet" className="hover:text-foreground transition-colors">Audemars Piguet</Link></li>
              <li><Link href="/catalog?brand=Omega" className="hover:text-foreground transition-colors">Omega</Link></li>
              <li><Link href="/catalog?brand=Cartier" className="hover:text-foreground transition-colors">Cartier</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Москва, ул. Тверская, 1</li>
              <li>+7 (495) 123-45-67</li>
              <li>info@timelux.ru</li>
              <li className="pt-2">Пн-Вс: 10:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            2024 TimeLux. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Политика конфиденциальности</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
