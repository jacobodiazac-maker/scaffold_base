import React, { useState, useEffect } from 'react';

const BURGERS_DATA = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    price: 14.90,
    specialtyLevel: '👑 Especialidad Leyenda',
    badgeType: 'amber',
    rating: 4.9,
    prepTime: '12-15 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Triple medallón Angus (450g), triple cheddar ahumado, tocino crujiente, cebolla al oporto y salsa secreta King.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    price: 9.50,
    specialtyLevel: '⭐ Especialidad Clásica Real',
    badgeType: 'emerald',
    rating: 4.8,
    prepTime: '8-10 min',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón prime de 180g, queso cheddar fundido, lechuga romana fresca, tomate, pepinillos y aderezo Imperial.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Especiales',
    price: 12.80,
    specialtyLevel: '🔥 Especialidad Doble Carne',
    badgeType: 'orange',
    rating: 4.9,
    prepTime: '10-12 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Doble smash caramelizado (360g), doble cheddar, panceta glaseada en maple y salsa BBQ leña.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    price: 13.50,
    specialtyLevel: '⚡ Especialidad Chef Gourmet',
    badgeType: 'purple',
    rating: 4.9,
    prepTime: '12-14 min',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    description: 'Doble carne a la brasa (360g), gouda trufado fundido, setas Portobello al tomillo y alioli de ajo negro.'
  },
  {
    id: 5,
    name: 'Burger Crispy Smoke BBQ',
    category: 'Pollo & Crispy',
    price: 10.90,
    specialtyLevel: '🍗 Nivel Crunchy Master',
    badgeType: 'red',
    rating: 4.7,
    prepTime: '10-12 min',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada 24h con 11 especias, rebozado ultra crujiente, coleslaw de manzana y sweet BBQ.'
  },
  {
    id: 6,
    name: 'Burger Trufa & Queso Suizo',
    category: 'Especiales',
    price: 14.20,
    specialtyLevel: '💎 Nivel Alta Cocina',
    badgeType: 'indigo',
    rating: 4.9,
    prepTime: '12-15 min',
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=600&auto=format&fit=crop&q=80',
    description: 'Black Angus con mantequilla de trufa negra, queso suizo Emmental, rúcula silvestre y balsámico Módena.'
  },
  {
    id: 7,
    name: 'Burger Jalapeño Flame',
    category: 'Picantes',
    price: 11.20,
    specialtyLevel: '🌶️ Nivel Fuego Extremo',
    badgeType: 'rose',
    rating: 4.6,
    prepTime: '9-11 min',
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&auto=format&fit=crop&q=80',
    description: 'Carne cajún, queso Pepper Jack fundido, jalapeños asados al fuego, cebolla crispy y chipotle mayo.'
  },
  {
    id: 8,
    name: 'Burger Bacon Master Deluxe',
    category: 'Clásicas',
    price: 12.50,
    specialtyLevel: '🥓 Nivel Carnívoro Oro',
    badgeType: 'amber',
    rating: 4.8,
    prepTime: '9-11 min',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
    description: 'Cuatro lonchas gruesas de tocino ahumado en manzano, doble cheddar, relish agridulce y salsa de la casa.'
  },
  {
    id: 9,
    name: 'Burger Portobello Melt Veggie',
    category: 'Vegetarianas',
    price: 10.50,
    specialtyLevel: '🌱 Nivel Verde Gourmet',
    badgeType: 'emerald',
    rating: 4.7,
    prepTime: '10-12 min',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=80',
    description: 'Sombrero de Portobello entero a las brasas, queso provolone ahumado, pimientos rojos y pesto genovés.'
  },
  {
    id: 10,
    name: 'Burger Cuarto de Libra Supreme',
    category: 'Clásicas',
    price: 8.90,
    specialtyLevel: '🎯 Nivel Clásico Favorito',
    badgeType: 'slate',
    rating: 4.8,
    prepTime: '7-9 min',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',
    description: 'Carne fresca 115g, cebolla brunoise, pepinillos encurtidos, mostaza antigua, kétchup y doble queso.'
  }
];

const PROMOS_DATA = [
  {
    id: 'promo-1',
    title: 'Combo Dupla Real 👑',
    tag: 'Ahorro $6.10',
    description: '2x Burger Real Clásica + 1 Porción Papas Rústicas + 2 Bebidas Artesanales.',
    price: 19.90,
    originalPrice: 26.00,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Burger Real Clásica', quantity: 2, price: 8.00 },
      { name: 'Papas Rústicas', quantity: 1, price: 2.00 },
      { name: 'Bebidas Artesanales', quantity: 2, price: 1.90 }
    ]
  },
  {
    id: 'promo-2',
    title: 'Noche de Smash & Chela 🔥',
    tag: 'Especial Noche',
    description: '1x Burger Real Doble + 1 Cerveza Artesanal Golden Ale bien fría.',
    price: 14.50,
    originalPrice: 17.80,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Burger Real Doble', quantity: 1, price: 11.50 },
      { name: 'Cerveza Artesanal Golden Ale', quantity: 1, price: 3.00 }
    ]
  },
  {
    id: 'promo-3',
    title: 'Banquete Rey de las Burgers 🏆',
    tag: '20% OFF Cupón',
    description: '1x Rey de las Burgers + Aros de cebolla crocantes + Malteada de Vainilla Bourbon.',
    price: 17.20,
    originalPrice: 21.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Rey de las Burgers', quantity: 1, price: 12.00 },
      { name: 'Aros de Cebolla Crocantes', quantity: 1, price: 2.50 },
      { name: 'Malteada Vainilla Bourbon', quantity: 1, price: 2.70 }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'offers' | 'orders' | 'profile'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selected burger for detail modal
  const [detailBurger, setDetailBurger] = useState(null);

  // Orders list
  const [orders, setOrders] = useState([
    {
      id: 'ORD-7201',
      customerName: 'Pablo Valdivia',
      date: 'Hoy, 20:30',
      total: 24.40,
      status: 'En camino',
      step: 3, // 1: Recibido, 2: En parrilla, 3: En camino, 4: Entregado
      eta: '8 minutos',
      items: [
        { name: 'Rey de las Burgers', quantity: 1, price: 14.90 },
        { name: 'Burger Real Clásica', quantity: 1, price: 9.50 }
      ]
    },
    {
      id: 'ORD-6819',
      customerName: 'Pablo Valdivia',
      date: 'Ayer, 14:15',
      total: 13.50,
      status: 'Entregado',
      step: 4,
      eta: 'Entregado',
      items: [
        { name: 'Burger Doble Especial', quantity: 1, price: 13.50 }
      ]
    }
  ]);

  // Checkout modal
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Av. Reforma 402, Depto 5B');
  const [paymentMethod, setPaymentMethod] = useState('RapidPay');
  const [orderSuccessAlert, setOrderSuccessAlert] = useState(null);

  // PWA install prompt handler
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handlePrompt);
    };
  }, []);

  // Check URL params for preselected burger
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const burgerId = params.get('burgerId');
    if (burgerId) {
      const found = BURGERS_DATA.find(b => b.id === parseInt(burgerId, 10));
      if (found) setDetailBurger(found);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar Hamburger Rapid: toca el menú de tu navegador y elige "Agregar a pantalla de inicio"');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Cart operations
  const addToCart = (burger, extraNotes = '') => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === burger.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [...prev, { ...burger, quantity: 1, extraNotes }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Simulate Order Creation
  const handleSimulateOrder = async () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Pablo Valdivia',
      date: 'Ahora mismo',
      total: parseFloat((cartTotal + 2.50).toFixed(2)),
      status: 'Preparando',
      step: 2,
      eta: '16 minutos',
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      deliveryAddress,
      paymentMethod
    };

    // Attempt to notify backend
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newOrder.customerName,
          items: newOrder.items,
          total: newOrder.total,
          paymentMethod: newOrder.paymentMethod
        })
      });
    } catch (e) {
      console.log('Simulación en memoria:', e);
    }

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCheckingOut(false);
    setIsCartOpen(false);
    setOrderSuccessAlert(`¡Tu orden #${newOrder.id} está en la brasa!`);
    setActiveTab('orders');

    setTimeout(() => {
      setOrderSuccessAlert(null);
    }, 6000);
  };

  // Filter burgers
  const filteredBurgers = BURGERS_DATA.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--surface-border)',
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            background: 'linear-gradient(135deg, #c2410c, #ea580c)',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: 'white',
            boxShadow: '0 2px 8px rgba(194, 65, 12, 0.25)'
          }}>
            🍔
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem', lineHeight: '1.1', color: '#1c1917' }}>Hamburger Rapid</div>
            <div style={{ fontSize: '0.68rem', color: '#c2410c', fontWeight: '700', letterSpacing: '0.04em' }}>APP MÓVIL OFICIAL</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '0.7rem',
            padding: '3px 8px',
            borderRadius: '10px',
            fontWeight: '700',
            background: isOnline ? '#d1fae5' : '#fee2e2',
            color: isOnline ? '#065f46' : '#991b1b',
            border: isOnline ? '1px solid #a7f3d0' : '1px solid #fecaca'
          }}>
            {isOnline ? '🟢 Conectado' : '🔴 Offline'}
          </span>

          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              style={{
                background: '#c2410c',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              📲 Instalar
            </button>
          )}

          {/* Cart button in header */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: '#f4efe6',
              border: '1px solid var(--surface-border)',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: '#1c1917'
            }}
          >
            🛒
            {cartItemCount > 0 && (
              <span style={{
                background: '#c2410c',
                color: 'white',
                borderRadius: '999px',
                padding: '1px 6px',
                fontSize: '0.7rem',
                fontWeight: '800'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Success Notification Alert */}
      {orderSuccessAlert && (
        <div style={{
          background: '#ecfdf5',
          borderBottom: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '10px 16px',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.25s'
        }}>
          <span>🎉</span> {orderSuccessAlert}
        </div>
      )}

      {/* Main Content Area (Scrollable) */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }}>
        {/* TAB 1: MENÚ */}
        {activeTab === 'menu' && (
          <div className="fade-in" style={{ padding: '16px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Buscar hamburguesa o ingrediente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--surface-border)',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#1c1917',
                  fontFamily: 'inherit'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#78716c',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '16px',
              scrollbarWidth: 'none'
            }}>
              {['Todas', 'Especiales', 'Clásicas', 'Pollo & Crispy', 'Picantes', 'Vegetarianas'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? '#1c1917' : 'var(--surface-border)',
                    background: selectedCategory === cat ? '#1c1917' : '#ffffff',
                    color: selectedCategory === cat ? '#ffffff' : '#78716c',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured Highlight Banner */}
            {selectedCategory === 'Todas' && !searchQuery && (
              <div style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                border: '1px solid #fed7aa',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '18px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <img
                  src={BURGERS_DATA[0].image}
                  alt={BURGERS_DATA[0].name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#c2410c', textTransform: 'uppercase' }}>
                    👑 La Más Pedida
                  </span>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1c1917' }}>Rey de las Burgers</div>
                  <div style={{ fontSize: '0.78rem', color: '#78716c' }}>$14.90 &bull; Nivel Leyenda</div>
                </div>
                <button
                  onClick={() => addToCart(BURGERS_DATA[0])}
                  style={{
                    background: '#c2410c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  + Pedir
                </button>
              </div>
            )}

            {/* List of Burgers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredBurgers.map(burger => (
                <div
                  key={burger.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '18px',
                    padding: '12px',
                    display: 'flex',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.15s'
                  }}
                >
                  <div
                    onClick={() => setDetailBurger(burger)}
                    style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0, cursor: 'pointer' }}
                  >
                    <img
                      src={burger.image}
                      alt={burger.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      background: 'rgba(255,255,255,0.92)',
                      padding: '2px 5px',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      color: '#1c1917'
                    }}>
                      ⭐ {burger.rating}
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.65rem',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: '#fff7ed',
                          color: '#c2410c',
                          marginBottom: '4px'
                        }}>
                          {burger.specialtyLevel}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#a8a29e', fontWeight: '600' }}>
                          ⏱️ {burger.prepTime}
                        </span>
                      </div>

                      <div
                        onClick={() => setDetailBurger(burger)}
                        style={{ fontWeight: '800', fontSize: '0.98rem', color: '#1c1917', lineHeight: '1.2', cursor: 'pointer' }}
                      >
                        {burger.name}
                      </div>

                      <div style={{
                        fontSize: '0.78rem',
                        color: '#78716c',
                        lineHeight: '1.35',
                        marginTop: '3px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {burger.description}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1c1917' }}>
                        ${burger.price.toFixed(2)}
                      </span>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setDetailBurger(burger)}
                          style={{
                            background: '#f4efe6',
                            border: '1px solid var(--surface-border)',
                            color: '#1c1917',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Detalles
                        </button>
                        <button
                          onClick={() => addToCart(burger)}
                          style={{
                            background: '#c2410c',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(194, 65, 12, 0.25)'
                          }}
                        >
                          + Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OFERTAS */}
        {activeTab === 'offers' && (
          <div className="fade-in" style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1c1917' }}>Ofertas & Combos Exclusivos</div>
              <div style={{ fontSize: '0.85rem', color: '#78716c' }}>Descuentos especiales disponibles solo desde la App Móvil</div>
            </div>

            {/* Coupons Card */}
            <div style={{
              background: '#fef3c7',
              border: '1.5px dashed #d97706',
              borderRadius: '16px',
              padding: '14px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#92400e', textTransform: 'uppercase' }}>CUPÓN ACTIVO</span>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#92400e' }}>RAPID25 &bull; 25% OFF</div>
                <div style={{ fontSize: '0.75rem', color: '#b45309' }}>Válido en tu primera compra con tarjeta</div>
              </div>
              <button
                onClick={() => alert('¡Cupón RAPID25 aplicado a tu cuenta!')}
                style={{
                  background: '#d97706',
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Copiar
              </button>
            </div>

            {/* Combos list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {PROMOS_DATA.map(promo => (
                <div
                  key={promo.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ position: 'relative', height: '140px' }}>
                    <img
                      src={promo.image}
                      alt={promo.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: '#c2410c',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: '800'
                    }}>
                      {promo.tag}
                    </div>
                  </div>

                  <div style={{ padding: '14px' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1c1917', marginBottom: '4px' }}>
                      {promo.title}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#78716c', marginBottom: '12px' }}>
                      {promo.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: '#a8a29e', marginRight: '6px' }}>
                          ${promo.originalPrice.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#c2410c' }}>
                          ${promo.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart({
                            id: Date.now(),
                            name: promo.title,
                            category: 'Combo',
                            price: promo.price,
                            specialtyLevel: promo.tag,
                            image: promo.image
                          });
                          setIsCartOpen(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #c2410c, #ea580c)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: '0 3px 8px rgba(194, 65, 12, 0.25)'
                        }}
                      >
                        ⚡ Pedir Combo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ÓRDENES */}
        {activeTab === 'orders' && (
          <div className="fade-in" style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1c1917' }}>Tus Órdenes en Vivo</div>
              <div style={{ fontSize: '0.85rem', color: '#78716c' }}>Seguimiento en tiempo real de tu cocina y despacho</div>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🍔</div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '4px' }}>No tienes órdenes activas</div>
                <p style={{ color: '#78716c', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Explora nuestro menú y simula tu primera compra para ver el seguimiento en vivo.
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: '#c2410c',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Ir al Menú
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--surface-border)',
                      borderRadius: '18px',
                      padding: '16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: '#1c1917' }}>{order.id}</div>
                        <div style={{ fontSize: '0.75rem', color: '#78716c' }}>{order.date} &bull; {order.customerName}</div>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        background: order.status === 'Entregado' ? '#ecfdf5' : '#fff7ed',
                        color: order.status === 'Entregado' ? '#065f46' : '#c2410c',
                        border: order.status === 'Entregado' ? '1px solid #a7f3d0' : '1px solid #fed7aa'
                      }}>
                        {order.status === 'Entregado' ? '🏁 Entregado' : `🛵 ${order.status}`}
                      </span>
                    </div>

                    {/* Progress Stepper */}
                    {order.status !== 'Entregado' && (
                      <div style={{ background: '#faf7f2', padding: '12px', borderRadius: '12px', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '700', color: '#78716c', marginBottom: '8px' }}>
                          <span style={{ color: order.step >= 1 ? '#c2410c' : '#a8a29e' }}>1. Recibido</span>
                          <span style={{ color: order.step >= 2 ? '#c2410c' : '#a8a29e' }}>2. A la Brasa</span>
                          <span style={{ color: order.step >= 3 ? '#c2410c' : '#a8a29e' }}>3. En camino</span>
                          <span style={{ color: order.step >= 4 ? '#c2410c' : '#a8a29e' }}>4. Listo</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e7e2d9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${(order.step / 4) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #c2410c, #ea580c)',
                            borderRadius: '999px',
                            transition: 'width 0.4s'
                          }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: '700', marginTop: '6px', textAlign: 'right' }}>
                          ⏱️ ETA: {order.eta}
                        </div>
                      </div>
                    )}

                    {/* Items list */}
                    <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '10px', marginBottom: '10px' }}>
                      {order.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                          <span style={{ color: '#1c1917' }}>{it.quantity}x {it.name}</span>
                          <span style={{ color: '#78716c', fontWeight: '600' }}>${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#78716c' }}>Total Pagado</span>
                      <span style={{ fontWeight: '800', fontSize: '1.15rem', color: '#1c1917' }}>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PERFIL */}
        {activeTab === 'profile' && (
          <div className="fade-in" style={{ padding: '16px' }}>
            {/* User Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--surface-border)',
              borderRadius: '20px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '68px',
                height: '68px',
                background: '#ffedd5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 10px',
                border: '2px solid #fdba74'
              }}>
                👨💼
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1c1917' }}>Pablo Valdivia</div>
              <span style={{
                display: 'inline-block',
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a',
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                marginTop: '4px'
              }}>
                👑 Cliente VIP Gold
              </span>
            </div>

            {/* RapidPoints Balance */}
            <div style={{
              background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
              color: 'white',
              borderRadius: '18px',
              padding: '16px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#fed7aa', fontWeight: '700', textTransform: 'uppercase' }}>PROGRAMA DE LEALTAD</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fbbf24' }}>780 Puntos</div>
                <div style={{ fontSize: '0.75rem', color: '#d6d3d1' }}>¡Tienes 1 Burger Real Clásica gratis!</div>
              </div>
              <button
                onClick={() => alert('¡Puntos canjeados por una Burger Real Clásica en tu carrito!')}
                style={{
                  background: '#fbbf24',
                  color: '#1c1917',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Canjear
              </button>
            </div>

            {/* Consumption Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{ background: '#ffffff', border: '1px solid var(--surface-border)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1c1917' }}>18</div>
                <div style={{ fontSize: '0.7rem', color: '#78716c' }}>Burgers Pedidas</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid var(--surface-border)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>$42.50</div>
                <div style={{ fontSize: '0.7rem', color: '#78716c' }}>Ahorro Cupones</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid var(--surface-border)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#c2410c' }}>Top 5%</div>
                <div style={{ fontSize: '0.7rem', color: '#78716c' }}>Consumidor VIP</div>
              </div>
            </div>

            {/* Preferences & Quick Links */}
            <div style={{ background: '#ffffff', border: '1px solid var(--surface-border)', borderRadius: '18px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>📍 Dirección de Entrega</div>
                  <div style={{ fontSize: '0.75rem', color: '#78716c' }}>{deliveryAddress}</div>
                </div>
                <button
                  onClick={() => {
                    const next = prompt('Editar dirección:', deliveryAddress);
                    if (next) setDeliveryAddress(next);
                  }}
                  style={{ background: 'none', border: 'none', color: '#c2410c', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Cambiar
                </button>
              </div>

              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>💳 Método de Pago</div>
                  <div style={{ fontSize: '0.75rem', color: '#78716c' }}>{paymentMethod} (Predeterminado)</div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>Activo</span>
              </div>

              <a
                href="/"
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#1c1917',
                  borderBottom: '1px solid var(--surface-border)',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                <span>🌐 Volver a Landing E-commerce</span>
                <span>→</span>
              </a>

              <a
                href="/admin"
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#c2410c',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}
              >
                <span>⚙️ Abrir Panel Admin de Métricas</span>
                <span>→</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (if items in cart and modal closed) */}
      {cartItemCount > 0 && !isCartOpen && (
        <div style={{
          position: 'fixed',
          bottom: '76px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '428px',
          background: '#1c1917',
          color: 'white',
          padding: '12px 18px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 40,
          cursor: 'pointer'
        }}
        onClick={() => setIsCartOpen(true)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#c2410c',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: '800',
              fontSize: '0.8rem'
            }}>
              {cartItemCount}
            </span>
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Ver mi Pedido</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#fbbf24' }}>
              ${cartTotal.toFixed(2)}
            </span>
            <span>→</span>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--surface-border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '8px 0',
        zIndex: 50,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)'
      }}>
        {[
          { key: 'menu', label: 'Menú', icon: '🍔' },
          { key: 'offers', label: 'Ofertas', icon: '🏷️' },
          { key: 'orders', label: 'Órdenes', icon: '📋', badge: orders.filter(o => o.status !== 'Entregado').length },
          { key: 'profile', label: 'Perfil', icon: '👤' }
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                color: isActive ? '#c2410c' : '#78716c',
                transition: 'color 0.15s',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '1.35rem', transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.15s' }}>
                {tab.icon}
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: isActive ? '800' : '600' }}>
                {tab.label}
              </span>
              {tab.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '25%',
                  background: '#c2410c',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '1px 5px',
                  fontSize: '0.62rem',
                  fontWeight: '800'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* BURGER DETAIL MODAL */}
      {detailBurger && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 25, 23, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 60
        }}
        onClick={() => setDetailBurger(null)}
        >
          <div
            style={{
              background: '#ffffff',
              width: '100%',
              maxWidth: '460px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '20px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{
                background: '#fff7ed',
                color: '#c2410c',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}>
                {detailBurger.specialtyLevel}
              </span>
              <button
                onClick={() => setDetailBurger(null)}
                style={{
                  background: '#f4efe6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: '700'
                }}
              >
                ✕
              </button>
            </div>

            <img
              src={detailBurger.image}
              alt={detailBurger.name}
              style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '16px', marginBottom: '14px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1c1917' }}>{detailBurger.name}</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#c2410c' }}>${detailBurger.price.toFixed(2)}</div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#78716c', lineHeight: '1.5', marginBottom: '16px' }}>
              {detailBurger.description}
            </p>

            <div style={{
              background: '#faf7f2',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: '700' }}>Cocción</div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>A la Brasa</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--surface-border)' }} />
              <div>
                <div style={{ fontSize: '0.68rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: '700' }}>Tiempo</div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{detailBurger.prepTime}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--surface-border)' }} />
              <div>
                <div style={{ fontSize: '0.68rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: '700' }}>Calificación</div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>⭐ {detailBurger.rating}</div>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(detailBurger);
                setDetailBurger(null);
                setIsCartOpen(true);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #c2410c, #ea580c)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(194, 65, 12, 0.28)'
              }}
            >
              Agregar al Pedido &bull; ${detailBurger.price.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* SHOPPING CART & CHECKOUT DRAWER */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 25, 23, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 70
        }}
        onClick={() => {
          setIsCartOpen(false);
          setIsCheckingOut(false);
        }}
        >
          <div
            style={{
              background: '#ffffff',
              width: '100%',
              maxWidth: '460px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '20px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1c1917' }}>
                {isCheckingOut ? '💳 Confirmar Simulación' : '🛒 Tu Pedido Actual'}
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                }}
                style={{
                  background: '#f4efe6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: '700'
                }}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🛒</div>
                <div style={{ fontWeight: '700', color: '#78716c' }}>Tu carrito está vacío</div>
                <p style={{ fontSize: '0.8rem', color: '#a8a29e', marginTop: '4px' }}>
                  Elige tus hamburguesas favoritas del menú para simular la compra.
                </p>
              </div>
            ) : !isCheckingOut ? (
              <div>
                {/* Cart Items list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {cart.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#faf7f2',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1px solid var(--surface-border)'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1c1917' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: '600' }}>
                          ${item.price.toFixed(2)} c/u
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: '1px solid var(--surface-border)',
                            background: '#ffffff',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: '1px solid var(--surface-border)',
                            background: '#ffffff',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div style={{ background: '#faf7f2', padding: '12px', borderRadius: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: '#78716c' }}>Subtotal productos</span>
                    <span style={{ fontWeight: '700' }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: '#78716c' }}>Envío Express Rapid (18 min)</span>
                    <span style={{ color: '#059669', fontWeight: '700' }}>$2.50</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    borderTop: '1px solid var(--surface-border)',
                    paddingTop: '8px',
                    marginTop: '6px'
                  }}>
                    <span>Total estimado</span>
                    <span style={{ color: '#c2410c' }}>${(cartTotal + 2.50).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #c2410c, #ea580c)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(194, 65, 12, 0.3)'
                  }}
                >
                  Continuar al Pago &bull; ${(cartTotal + 2.50).toFixed(2)}
                </button>
              </div>
            ) : (
              /* Checkout Form */
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--surface-border)',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Método de Pago
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['RapidPay', 'Tarjeta', 'Efectivo'].map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        style={{
                          padding: '10px 6px',
                          borderRadius: '10px',
                          border: '1.5px solid',
                          borderColor: paymentMethod === method ? '#c2410c' : 'var(--surface-border)',
                          background: paymentMethod === method ? '#fff7ed' : '#ffffff',
                          color: paymentMethod === method ? '#c2410c' : '#1c1917',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {method === 'RapidPay' ? '⚡ RapidPay' : method === 'Tarjeta' ? '💳 Tarjeta' : '💵 Efectivo'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  color: '#92400e',
                  marginBottom: '20px'
                }}>
                  ℹ️ <strong>Modo Simulación:</strong> Al confirmar, se creará un pedido real en el backend, sumará consumo a tu perfil y podrás monitorearlo en el Dashboard Admin.
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setIsCheckingOut(false)}
                    style={{
                      flex: 1,
                      background: '#f4efe6',
                      border: '1px solid var(--surface-border)',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleSimulateOrder}
                    style={{
                      flex: 2,
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    🚀 Confirmar y Simular Pedido
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
