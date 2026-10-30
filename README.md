# 🍔 Hamburger Rapid - Primera Versión Comercial

Plataforma comercial completa para negocio de comida rápida gourmet **Hamburger Rapid**, construida bajo una arquitectura full-stack monorepo de alto rendimiento con **paleta clara premium** (tonos marfil cálido, terracota brasa, oro ámbar y carbón espresso).

---

## 🏛️ Arquitectura del Sistema

```text
scaffold_base/
├── apps/
│   ├── ecommerce/     # Landing page moderna en Astro con catálogo de 10 variantes y modal de detalles
│   ├── pwa/           # Aplicación móvil interactiva en React con 4 pestañas (Menú, Ofertas, Órdenes, Perfil)
│   └── admin/         # Dashboard administrativo en React con métricas de consumo y monitor de BD
├── server/            # API REST en Node.js/Express, orquestador de estáticos y soporte MySQL / In-Memory
│   ├── public/        # Artefactos sincronizados (/ecommerce, /pwa, /admin)
│   └── src/           # Rutas API, lógica de base de datos y simulaciones
└── package.json       # Monorepo scripts (build:all, install:all, etc.)
```

---

## 🚀 Módulos Implementados

### 1. `apps/ecommerce` (Landing Page Comercial)
- **Catálogo de 10 Variantes Destacadas:**
  - 👑 **Rey de las Burgers** ($14.90) - *Especialidad Leyenda (Nivel Máximo)*
  - ⭐ **Burger Real Clásica** ($9.50) - *Especialidad Clásica Real*
  - 🔥 **Burger Real Doble** ($12.80) - *Especialidad Doble Carne*
  - ⚡ **Burger Doble Especial** ($13.50) - *Especialidad Chef Gourmet*
  - 🍗 **Burger Crispy Smoke BBQ** ($10.90) - *Nivel Crunchy Master*
  - 💎 **Burger Trufa & Queso Suizo** ($14.20) - *Nivel Alta Cocina*
  - 🌶️ **Burger Jalapeño Flame** ($11.20) - *Nivel Fuego Extremo*
  - 🥓 **Burger Bacon Master Deluxe** ($12.50) - *Nivel Carnívoro Oro*
  - 🌱 **Burger Portobello Melt Veggie** ($10.50) - *Nivel Verde Gourmet*
  - 🎯 **Burger Cuarto de Libra Supreme** ($8.90) - *Nivel Clásico Favorito*
- **Filtros por Categoría:** Especiales de Autor, Clásicas Maestras, Pollo & Crispy, Picantes al Fuego, Vegetarianas.
- **Modal Interactivo "Ver Detalles":** Muestra ingredientes seleccionados, calorías, proteínas, tiempo de cocción, maridaje sugerido y enlace directo a la PWA.
- **Estilo Visual:** Paleta clara premium (`#faf9f6`, `#ffffff`, bordes `#e7e2d9`, acentos `#c2410c` y `#d97706`).

### 2. `apps/pwa` (Aplicación Móvil Progresiva)
- **Barra de Navegación Inferior (4 Pestañas):**
  - 🍔 **Menú:** Exploración con buscador en tiempo real, filtros por categoría, tarjetas con badge de especialidad y botón `+ Agregar`.
  - 🏷️ **Ofertas:** Combos exclusivos ("Combo Dupla Real", "Noche de Smash & Chela", "Banquete Rey de las Burgers") y cupones de descuento (RAPID25).
  - 📋 **Órdenes:** Stepper de seguimiento de pedidos en vivo (*1. Recibido → 2. A la Brasa → 3. En camino → 4. Entregado*) con tiempo estimado (ETA) e histórico de compras.
  - 👤 **Perfil:** Balance de lealtad RapidPoints (780 pts), estadísticas de consumo personal, selección de dirección y método de pago.
- **Simulador de Compra:** Drawer interactivo de carrito, selección de método de pago (RapidPay, Tarjeta, Efectivo) y confirmación que impacta en el backend y dashboard admin.

### 3. `apps/admin` (Dashboard de Control & Métricas)
- **Catálogo de Hamburguesas:** Listado completo con stock, precios, nivel de especialidad y toggles para pausar/reactivar disponibilidad o dar de alta nuevas variantes.
- **Métricas de Consumidores según Consumo:**
  - Segmentación: **VIP Gold** (> $100), **Recurrentes Silver** ($40-$100) y **Ocasionales Bronce** (< $40).
  - Indicadores clave: Volumen total vendido, ticket promedio por cliente, porcentaje de retención (98.6%).
  - Tabla de Top Consumidores con desglose de gasto acumulado, número de pedidos y hamburguesa favorita.
- **Monitor de Estado de la Base de Datos:**
  - Verificación de motor activo (**MySQL Cloud** vs **In-Memory**).
  - Host, puerto, pool de conexiones, latencia ping (< 3 ms) e inspector del endpoint `/api/health`.
  - Botón de restablecimiento de datos de fábrica (`POST /api/reset`).

---

## 🛠️ Comandos de Ejecución

```bash
# 1. Instalar dependencias en todos los paquetes
npm run install:all

# 2. Compilar los 3 frontends y sincronizarlos con server/public
npm run build:all

# 3. Iniciar el servidor backend unificado
npm run start
```

### URLs de Acceso:
- **E-commerce Landing:** `http://localhost:3000/`
- **PWA Mobile:** `http://localhost:3000/app`
- **Panel Admin:** `http://localhost:3000/admin`
- **API Health:** `http://localhost:3000/api/health`
- **API Catálogo:** `http://localhost:3000/api/products`
- **API Métricas:** `http://localhost:3000/api/metrics`
