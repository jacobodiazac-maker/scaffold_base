import React, { useState, useEffect } from 'react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const auth = localStorage.getItem('rapid_admin_auth');
      return auth ? JSON.parse(auth).authenticated === true : false;
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const auth = localStorage.getItem('rapid_admin_auth');
      return auth ? JSON.parse(auth).user : { username: 'admin', name: 'Administrador General' };
    } catch {
      return { username: 'admin', name: 'Administrador General' };
    }
  });

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard Tabs & Data
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'consumers' | 'database'
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New burger modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'Especiales',
    price: '',
    stock: '',
    specialtyLevel: '⭐ Especialidad Chef',
    prepTime: '10-12 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // 1. Fetch products
      const pRes = await fetch('/api/products');
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData.data || []);
      }

      // 2. Fetch metrics
      const mRes = await fetch('/api/metrics');
      if (mRes.ok) {
        const mData = await mRes.json();
        setMetrics(mData.data || null);
      }

      // 3. Fetch database status / health
      const hRes = await fetch('/api/health');
      if (hRes.ok) {
        const hData = await hRes.json();
        setDbStatus(hData.database || null);
      }
    } catch (err) {
      console.warn('Usando datos de respaldo locales:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      // Try backend authentication endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const authData = {
          authenticated: true,
          token: data.token,
          user: data.user,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('rapid_admin_auth', JSON.stringify(authData));
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        showToast('¡Bienvenido al Panel de Control de Hamburger Rapid!');
      } else {
        // Fallback validation for offline / strict match
        if (usernameInput === 'admin' && passwordInput === 'admin') {
          const authData = {
            authenticated: true,
            token: 'rapid-admin-local',
            user: { username: 'admin', name: 'Administrador General', role: 'SuperAdmin' },
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('rapid_admin_auth', JSON.stringify(authData));
          setCurrentUser(authData.user);
          setIsAuthenticated(true);
          showToast('¡Bienvenido al Panel de Control de Hamburger Rapid!');
        } else {
          setLoginError(data.error || 'Credenciales inválidas. Recuerda que el usuario y clave son "admin".');
        }
      }
    } catch (err) {
      // Fallback if backend network issue
      if (usernameInput === 'admin' && passwordInput === 'admin') {
        const authData = {
          authenticated: true,
          token: 'rapid-admin-local',
          user: { username: 'admin', name: 'Administrador General', role: 'SuperAdmin' },
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('rapid_admin_auth', JSON.stringify(authData));
        setCurrentUser(authData.user);
        setIsAuthenticated(true);
        showToast('¡Bienvenido al Panel de Control de Hamburger Rapid!');
      } else {
        setLoginError('Credenciales incorrectas. Utiliza usuario: "admin" y clave: "admin".');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('rapid_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setLoginError('');
    showToast('Sesión cerrada correctamente.');
  };

  // Toggle burger availability
  const toggleAvailability = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, available: nextStatus } : p));

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: nextStatus })
      });
      showToast(`Disponibilidad de hamburguesa #${id} actualizada.`);
    } catch (e) {
      console.error(e);
    }
  };

  // Add new burger
  const handleAddBurger = async (e) => {
    e.preventDefault();
    if (!newBurger.name || !newBurger.price) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBurger)
      });
      if (res.ok) {
        showToast(`Hamburguesa "${newBurger.name}" agregada.`);
        setIsAddModalOpen(false);
        setNewBurger({
          name: '',
          category: 'Especiales',
          price: '',
          stock: '',
          specialtyLevel: '⭐ Especialidad Chef',
          prepTime: '10-12 min',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
          description: ''
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset demo data
  const handleResetData = async () => {
    if (!confirm('¿Restablecer el menú inicial de las 10 hamburguesas y métricas demo?')) return;
    try {
      await fetch('/api/reset', { method: 'POST' });
      showToast('Menú y métricas de clientes restablecidos con éxito.');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // =========================================================================
  // VIEW 1: AUTHENTICATION FORM (LOGIN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f6eedb 0%, #faedd6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: 'var(--text)'
      }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#1c1917',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            fontSize: '0.88rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>ℹ️</span> {toastMessage}
          </div>
        )}

        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '28px',
          padding: '40px 36px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 45px rgba(28, 25, 23, 0.08)',
          textAlign: 'center'
        }}>
          {/* Logo & Brand Header */}
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #b91c1c, #991b1b)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'white',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(185, 28, 28, 0.28)'
          }}>
            🍔
          </div>

          <div style={{
            display: 'inline-block',
            background: '#fff7ed',
            color: '#c2410c',
            border: '1px solid #fed7aa',
            padding: '3px 12px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px'
          }}>
            Panel de Seguridad
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#1c1917', marginBottom: '6px' }}>
            Hamburger Rapid
          </h2>
          <p style={{ color: '#78716c', fontSize: '0.88rem', marginBottom: '24px' }}>
            Ingresa tus credenciales autorizadas para acceder a la administración.
          </p>

          {/* Error Banner */}
          {loginError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: '700',
              marginBottom: '20px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span> {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase', marginBottom: '6px' }}>
                Usuario Administrador
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }}>
                  👤
                </span>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    fontSize: '0.92rem',
                    color: '#1c1917',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase', marginBottom: '6px' }}>
                Clave de Acceso
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }}>
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="admin"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 36px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    fontSize: '0.92rem',
                    color: '#1c1917',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Default Credentials Helper */}
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '0.8rem',
              color: '#92400e',
              lineHeight: '1.45'
            }}>
              <div style={{ fontWeight: '800', marginBottom: '3px' }}>🔑 Credenciales Predeterminadas:</div>
              <div>&bull; <strong>Usuario:</strong> <code>admin</code></div>
              <div>&bull; <strong>Clave:</strong> <code>admin</code></div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #b91c1c, #991b1b)',
                color: '#ffffff',
                border: 'none',
                padding: '13px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(185, 28, 28, 0.3)',
                marginTop: '4px',
                transition: 'transform 0.15s'
              }}
            >
              {isSubmitting ? 'Verificando...' : 'Iniciar Sesión →'}
            </button>
          </form>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <a
              href="/"
              style={{
                color: '#78716c',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ← Volver al sitio web comercial
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#1c1917',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          fontSize: '0.88rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✅</span> {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside style={{
        width: '270px',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          {/* Brand header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #c2410c, #ea580c)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              color: 'white',
              boxShadow: '0 4px 10px rgba(194, 65, 12, 0.25)'
            }}>
              🍔
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#1c1917' }}>Hamburger Rapid</div>
              <div style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: '800', letterSpacing: '0.04em' }}>ADMIN DASHBOARD</div>
            </div>
          </div>

          {/* User Status Card */}
          <div style={{
            background: '#faf7f2',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#ffedd5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                👨💼
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#1c1917' }}>
                  {currentUser?.username || 'admin'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '700' }}>
                  ● Autenticado
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{
                background: '#fee2e2',
                border: 'none',
                color: '#991b1b',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Salir
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'inventory', label: 'Hamburguesas Disponibles', icon: '🍔', count: products.length },
              { id: 'consumers', label: 'Consumidores & Métricas', icon: '👥', count: metrics?.summary?.totalCustomers || 6 },
              { id: 'database', label: 'Estado de la Base de Datos', icon: '🗄️', statusBadge: dbStatus?.connected ? 'Online' : 'Mem' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? '#fff7ed' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? '#fed7aa' : 'transparent',
                    color: isActive ? '#c2410c' : '#78716c',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span style={{
                      background: isActive ? '#c2410c' : '#f4efe6',
                      color: isActive ? '#ffffff' : '#78716c',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: '800'
                    }}>
                      {tab.count}
                    </span>
                  )}
                  {tab.statusBadge && (
                    <span style={{
                      background: dbStatus?.connected ? '#ecfdf5' : '#fffbeb',
                      color: dbStatus?.connected ? '#065f46' : '#b45309',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: '800'
                    }}>
                      {tab.statusBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer shortcuts */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px' }}>
            Accesos Rápidos
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#1c1917',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              <span>🌐</span> Ver E-commerce Web
            </a>
            <a
              href="/app"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#c2410c',
                textDecoration: 'none',
                fontWeight: '700'
              }}
            >
              <span>📱</span> Abrir App Móvil PWA
            </a>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#991b1b',
                background: 'none',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '4px 0',
                textAlign: 'left'
              }}
            >
              <span>🚪</span> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 36px' }}>
        {/* Top Header Bar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px'
        }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1c1917', lineHeight: '1.2' }}>
              {activeTab === 'inventory' && 'Catálogo de Hamburguesas Disponibles'}
              {activeTab === 'consumers' && 'Métricas de Consumidores por Nivel de Consumo'}
              {activeTab === 'database' && 'Monitor de Conexión a Base de Datos'}
            </h1>
            <p style={{ color: '#78716c', fontSize: '0.9rem' }}>
              Sesión activa como <strong>{currentUser?.username || 'admin'}</strong> &bull; Permisos de administración total.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={fetchData}
              disabled={refreshing}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                color: '#1c1917',
                padding: '9px 16px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ display: 'inline-block', transform: refreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s' }}>
                🔄
              </span>
              {refreshing ? 'Actualizando...' : 'Refrescar'}
            </button>

            {activeTab === 'inventory' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #c2410c, #ea580c)',
                  color: 'white',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(194, 65, 12, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                + Nueva Hamburguesa
              </button>
            )}
          </div>
        </header>

        {/* Global KPI Cards Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '18px',
          marginBottom: '28px'
        }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '6px' }}>
              Hamburguesas Activas
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1c1917' }}>
              {products.filter(p => p.available !== false).length} <span style={{ fontSize: '1rem', color: '#a8a29e', fontWeight: '600' }}>/ {products.length}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
              ● Catálogo 100% Operativo
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '6px' }}>
              Consumo Total Clientes
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#c2410c' }}>
              ${metrics?.summary?.totalRevenue || '487.60'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: '600', marginTop: '4px' }}>
              Ticket Promedio: ${metrics?.summary?.avgTicket || '81.27'}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '6px' }}>
              Consumidores VIP / Recurrentes
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#d97706' }}>
              {metrics?.segments?.[0]?.count + (metrics?.segments?.[1]?.count || 0) || 4}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: '600', marginTop: '4px' }}>
              67% del consumo total
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '6px' }}>
              Motor de Base de Datos
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: dbStatus?.connected ? '#059669' : '#d97706' }}>
              {dbStatus?.mode === 'mysql' ? '🐬 MySQL Cloud' : '⚡ In-Memory'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: '600', marginTop: '4px' }}>
              {dbStatus?.database || 'hamburger_rapid_db'} &bull; Latencia: &lt;5ms
            </div>
          </div>
        </div>

        {/* TAB 1: INVENTARIO DE HAMBURGUESAS */}
        {activeTab === 'inventory' && (
          <div>
            {/* Search and Category Filter Toolbar */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Buscar por nombre o categoría..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Todas', 'Especiales', 'Clásicas', 'Pollo & Crispy', 'Picantes', 'Vegetarianas'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: categoryFilter === cat ? '#1c1917' : 'var(--border)',
                      background: categoryFilter === cat ? '#1c1917' : '#ffffff',
                      color: categoryFilter === cat ? '#ffffff' : '#78716c',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Hamburgers Table */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#faf7f2', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>
                      Hamburguesa
                    </th>
                    <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>
                      Categoría
                    </th>
                    <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>
                      Nivel Especialidad
                    </th>
                    <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>
                      Precio
                    </th>
                    <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>
                      Stock
                    </th>
                    <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>
                      Disponibilidad
                    </th>
                    <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(burger => (
                    <tr
                      key={burger.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: burger.available ? 'transparent' : '#fcfbf9',
                        opacity: burger.available ? 1 : 0.65
                      }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={burger.image}
                            alt={burger.name}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px' }}
                          />
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1c1917' }}>{burger.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#78716c' }}>⏱️ {burger.prepTime || '10 min'} &bull; ⭐ {burger.rating || 4.8}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          background: '#f4efe6',
                          color: '#1c1917',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {burger.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          background: '#fff7ed',
                          color: '#c2410c',
                          border: '1px solid #fed7aa',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '800'
                        }}>
                          {burger.specialtyLevel || '⭐ Especial'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: '800', fontSize: '1.05rem', color: '#1c1917' }}>
                        ${burger.price.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>{burger.stock || 40} uds</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          background: burger.available ? '#ecfdf5' : '#fef2f2',
                          color: burger.available ? '#065f46' : '#991b1b',
                          border: burger.available ? '1px solid #a7f3d0' : '1px solid #fecaca'
                        }}>
                          {burger.available ? '🟢 Disponible' : '🔴 Agotada'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => toggleAvailability(burger.id, burger.available)}
                          style={{
                            background: burger.available ? '#f4efe6' : '#059669',
                            color: burger.available ? '#1c1917' : '#ffffff',
                            border: '1px solid var(--border)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {burger.available ? 'Pausar' : 'Reactivar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CONSUMIDORES & MÉTRICAS SEGÚN CONSUMO */}
        {activeTab === 'consumers' && (
          <div>
            {/* Consumer Segmentation Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '18px',
              marginBottom: '28px'
            }}>
              <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#92400e', textTransform: 'uppercase' }}>
                    NIVEL ALTO CONSUMO
                  </span>
                  <span style={{ fontSize: '1.4rem' }}>👑</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#92400e' }}>
                  VIP Gold (&gt; $100)
                </div>
                <div style={{ fontSize: '0.85rem', color: '#b45309', marginTop: '6px', fontWeight: '600' }}>
                  2 Clientes &bull; 62% del volumen total de ventas
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                    NIVEL MEDIO CONSUMO
                  </span>
                  <span style={{ fontSize: '1.4rem' }}>⭐</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#334155' }}>
                  Recurrente Silver ($40-$100)
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: '600' }}>
                  2 Clientes &bull; 26% del volumen total de ventas
                </div>
              </div>

              <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#9a3412', textTransform: 'uppercase' }}>
                    NIVEL INICIAL / OCASIONAL
                  </span>
                  <span style={{ fontSize: '1.4rem' }}>🌱</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#c2410c' }}>
                  Bronce Ocasional (&lt; $40)
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ea580c', marginTop: '6px', fontWeight: '600' }}>
                  2 Clientes &bull; Nuevos consumidores en proceso de retención
                </div>
              </div>
            </div>

            {/* Top Customers Breakdown Table */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '28px'
            }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1c1917' }}>Ranking de Consumidores por Gasto Total</h3>
                  <p style={{ fontSize: '0.82rem', color: '#78716c' }}>Segmentación calculada automáticamente con base en el historial de pedidos y ticket promedio.</p>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '999px' }}>
                  Retención: 98.6%
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#faf7f2', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>Consumidor</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>Nivel de Consumo</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>Total Gastado</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>Órdenes</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>Hamburguesa Favorita</th>
                    <th style={{ padding: '12px 20px', fontSize: '0.75rem', fontWeight: '800', color: '#78716c', textTransform: 'uppercase' }}>Última Actividad</th>
                  </tr>
                </thead>
                <tbody>
                  {(metrics?.topCustomers || []).map((c, i) => (
                    <tr key={c.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.5rem' }}>{c.avatar || '👤'}</span>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1c1917' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#78716c' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          background: c.tier.includes('VIP') ? '#fef3c7' : c.tier.includes('Silver') ? '#f1f5f9' : '#fff7ed',
                          color: c.tier.includes('VIP') ? '#92400e' : c.tier.includes('Silver') ? '#334155' : '#9a3412',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}>
                          {c.tier}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: '800', fontSize: '1.05rem', color: '#1c1917' }}>
                        ${c.totalSpent.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.9rem' }}>
                        {c.orderCount} compras
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: '600', color: '#c2410c' }}>
                        🍔 {c.favoriteBurger}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: '#78716c' }}>
                        {c.lastOrder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ESTADO DE LA BASE DE DATOS */}
        {activeTab === 'database' && (
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: dbStatus?.connected ? '#ecfdf5' : '#fffbeb',
                    color: dbStatus?.connected ? '#059669' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem'
                  }}>
                    🗄️
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1c1917' }}>
                      {dbStatus?.mode === 'mysql' ? 'Motor Relacional MySQL Activo' : 'Almacenamiento Temporal In-Memory'}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#78716c' }}>
                      {dbStatus?.connected
                        ? 'Conexión verificada con pooling automático y tolerancia a fallos.'
                        : 'El sistema opera en modo memoria persistente local para pruebas y desarrollo.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetData}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Restablecer Datos Demo
                </button>
              </div>

              {/* Specs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                background: '#faf7f2',
                padding: '18px',
                borderRadius: '14px',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#78716c', fontWeight: '700', textTransform: 'uppercase' }}>Host Servidor</div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1c1917', marginTop: '2px' }}>{dbStatus?.host || 'Local Storage'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#78716c', fontWeight: '700', textTransform: 'uppercase' }}>Nombre Base de Datos</div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1c1917', marginTop: '2px' }}>{dbStatus?.database || 'hamburger_rapid_db'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#78716c', fontWeight: '700', textTransform: 'uppercase' }}>Puerto DB</div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1c1917', marginTop: '2px' }}>{dbStatus?.port || 3306}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#78716c', fontWeight: '700', textTransform: 'uppercase' }}>Pool Conexiones</div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#059669', marginTop: '2px' }}>
                    {dbStatus?.activePoolConnections || 1} Conexión activa
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#78716c', fontWeight: '700', textTransform: 'uppercase' }}>Hamburguesas Registradas</div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1c1917', marginTop: '2px' }}>
                    {products.length} Variantes
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#78716c', fontWeight: '700', textTransform: 'uppercase' }}>Latencia Ping</div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#059669', marginTop: '2px' }}>
                    &lt; 3 ms (Instantáneo)
                  </div>
                </div>
              </div>
            </div>

            {/* Health JSON Inspector */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1c1917', marginBottom: '8px' }}>
                Respuesta del Endpoint /api/health
              </div>
              <pre style={{
                background: '#faf7f2',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                color: '#334155'
              }}>
                {JSON.stringify({ status: 'healthy', database: dbStatus, metricsSummary: metrics?.summary }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* CREATE BURGER MODAL */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 25, 23, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1c1917' }}>Nueva Hamburguesa</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: '#f4efe6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: '700' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBurger} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Nombre de la Hamburguesa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Burger Monster Trufada"
                  value={newBurger.name}
                  onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Categoría
                  </label>
                  <select
                    value={newBurger.category}
                    onChange={(e) => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                  >
                    <option value="Especiales">Especiales</option>
                    <option value="Clásicas">Clásicas</option>
                    <option value="Pollo & Crispy">Pollo & Crispy</option>
                    <option value="Picantes">Picantes</option>
                    <option value="Vegetarianas">Vegetarianas</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Precio ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="12.50"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Nivel Especialidad (Badge)
                  </label>
                  <input
                    type="text"
                    value={newBurger.specialtyLevel}
                    onChange={(e) => setNewBurger({ ...newBurger, specialtyLevel: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    placeholder="40"
                    value={newBurger.stock}
                    onChange={(e) => setNewBurger({ ...newBurger, stock: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#78716c', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Descripción de Sabores e Ingredientes
                </label>
                <textarea
                  rows="3"
                  placeholder="Detalla los cortes de carne, quesos y aderezos..."
                  value={newBurger.description}
                  onChange={(e) => setNewBurger({ ...newBurger, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f4efe6', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #c2410c, #ea580c)', color: 'white', fontWeight: '800', cursor: 'pointer' }}
                >
                  Guardar Hamburguesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
