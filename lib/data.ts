import { Watch, User } from './types'

export const watches: Watch[] = [
  {
    id: '1',
    name: 'Royal Oak Chronograph',
    brand: 'Audemars Piguet',
    price: 2850000,
    originalPrice: 3200000,
    description: 'Культовые часы с восьмиугольным безелем и интегрированным браслетом. Механизм калибра 2385 обеспечивает точность хода и запас хода до 40 часов. Корпус из нержавеющей стали с сатинированной отделкой.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop',
    category: 'luxury',
    gender: 'men',
    mechanism: 'automatic',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 41,
    waterResistance: 50,
    warranty: 5,
    inStock: true,
    featured: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Submariner Date',
    brand: 'Rolex',
    price: 1450000,
    description: 'Легендарные дайверские часы с вращающимся безелем Cerachrom. Водонепроницаемость до 300 метров. Механизм калибра 3235 с запасом хода 70 часов.',
    image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600&h=600&fit=crop',
    category: 'sport',
    gender: 'men',
    mechanism: 'automatic',
    caseMaterial: 'Oystersteel',
    caseSize: 41,
    waterResistance: 300,
    warranty: 5,
    inStock: true,
    featured: true,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Nautilus 5711',
    brand: 'Patek Philippe',
    price: 4500000,
    description: 'Спортивные часы высочайшего класса с уникальным дизайном Джеральда Дженты. Калибр 26-330 S C с запасом хода 45 часов. Браслет с запатентованной застёжкой.',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop',
    category: 'luxury',
    gender: 'men',
    mechanism: 'automatic',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 40,
    waterResistance: 120,
    warranty: 2,
    inStock: false,
    featured: true,
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: 'Speedmaster Moonwatch',
    brand: 'Omega',
    price: 850000,
    description: 'Часы, побывавшие на Луне. Хронограф с ручным заводом и калибром 3861. Гесалитовое стекло и стальной корпус с чёрным циферблатом.',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop',
    category: 'classic',
    gender: 'men',
    mechanism: 'mechanical',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 42,
    waterResistance: 50,
    warranty: 5,
    inStock: true,
    featured: false,
    createdAt: '2024-03-05'
  },
  {
    id: '5',
    name: 'Tank Française',
    brand: 'Cartier',
    price: 720000,
    description: 'Элегантные часы с характерным прямоугольным корпусом. Кварцевый механизм обеспечивает точность хода. Браслет с скрытой застёжкой.',
    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop',
    category: 'classic',
    gender: 'women',
    mechanism: 'quartz',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 25,
    waterResistance: 30,
    warranty: 2,
    inStock: true,
    featured: true,
    createdAt: '2024-02-28'
  },
  {
    id: '6',
    name: 'Big Bang Unico',
    brand: 'Hublot',
    price: 1950000,
    description: 'Авангардный хронограф с мануфактурным механизмом UNICO. Корпус из титана с керамическим безелем. Колонное колесо и маховик видны через сапфировое стекло.',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop',
    category: 'sport',
    gender: 'men',
    mechanism: 'automatic',
    caseMaterial: 'Титан',
    caseSize: 44,
    waterResistance: 100,
    warranty: 2,
    inStock: true,
    featured: false,
    createdAt: '2024-01-25'
  },
  {
    id: '7',
    name: 'Portofino Automatic',
    brand: 'IWC',
    price: 650000,
    description: 'Классические часы с чистым циферблатом и элегантными пропорциями. Автоматический механизм 35111 с запасом хода 42 часа.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop',
    category: 'classic',
    gender: 'unisex',
    mechanism: 'automatic',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 40,
    waterResistance: 30,
    warranty: 2,
    inStock: true,
    featured: false,
    createdAt: '2024-03-10'
  },
  {
    id: '8',
    name: 'Happy Sport',
    brand: 'Chopard',
    price: 980000,
    originalPrice: 1100000,
    description: 'Игривые часы с танцующими бриллиантами между двумя сапфировыми стёклами. Кварцевый механизм и корпус из этичного золота.',
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop',
    category: 'luxury',
    gender: 'women',
    mechanism: 'quartz',
    caseMaterial: 'Розовое золото',
    caseSize: 36,
    waterResistance: 30,
    warranty: 2,
    inStock: true,
    featured: true,
    createdAt: '2024-02-15'
  },
  {
    id: '9',
    name: 'Santos de Cartier',
    brand: 'Cartier',
    price: 890000,
    description: 'Первые наручные часы в истории, созданные для авиатора Альберто Сантос-Дюмона. Автоматический механизм 1847 MC.',
    image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=600&h=600&fit=crop',
    category: 'classic',
    gender: 'men',
    mechanism: 'automatic',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 39,
    waterResistance: 100,
    warranty: 2,
    inStock: true,
    featured: false,
    createdAt: '2024-01-20'
  },
  {
    id: '10',
    name: 'Seamaster Planet Ocean',
    brand: 'Omega',
    price: 780000,
    description: 'Профессиональные дайверские часы с керамическим безелем и гелиевым клапаном. Калибр 8900 с сертификатом Master Chronometer.',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&h=600&fit=crop',
    category: 'sport',
    gender: 'men',
    mechanism: 'automatic',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 43,
    waterResistance: 600,
    warranty: 5,
    inStock: true,
    featured: false,
    createdAt: '2024-03-01'
  },
  {
    id: '11',
    name: 'Datejust 31',
    brand: 'Rolex',
    price: 1150000,
    description: 'Классические часы с функцией быстрой смены даты. Калибр 2236 с запасом хода 55 часов. Юбилейный браслет.',
    image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&h=600&fit=crop',
    category: 'classic',
    gender: 'women',
    mechanism: 'automatic',
    caseMaterial: 'Oystersteel',
    caseSize: 31,
    waterResistance: 100,
    warranty: 5,
    inStock: true,
    featured: false,
    createdAt: '2024-02-10'
  },
  {
    id: '12',
    name: 'Reverso Classic',
    brand: 'Jaeger-LeCoultre',
    price: 920000,
    description: 'Легендарные часы с поворотным корпусом, созданные для игроков в поло. Механизм ручного завода калибра 822.',
    image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600&h=600&fit=crop',
    category: 'classic',
    gender: 'unisex',
    mechanism: 'mechanical',
    caseMaterial: 'Нержавеющая сталь',
    caseSize: 45,
    waterResistance: 30,
    warranty: 2,
    inStock: false,
    featured: false,
    createdAt: '2024-01-05'
  }
]

export const users: User[] = [
  {
    id: '1',
    email: 'admin@timelux.ru',
    password: 'admin123',
    role: 'admin',
    name: 'Администратор'
  }
]

export const brands = [...new Set(watches.map(w => w.brand))].sort()
export const categories = ['luxury', 'sport', 'classic', 'smart'] as const
export const genders = ['men', 'women', 'unisex'] as const
export const mechanisms = ['automatic', 'quartz', 'mechanical'] as const

export const categoryLabels: Record<string, string> = {
  luxury: 'Люкс',
  sport: 'Спорт',
  classic: 'Классика',
  smart: 'Смарт'
}

export const genderLabels: Record<string, string> = {
  men: 'Мужские',
  women: 'Женские',
  unisex: 'Унисекс'
}

export const mechanismLabels: Record<string, string> = {
  automatic: 'Автоматический',
  quartz: 'Кварцевый',
  mechanical: 'Механический'
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price)
}
