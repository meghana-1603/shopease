import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  Heart,
  ArrowRight,
  Check,
  Sparkles,
  Package,
  LogOut,
  Plus,
  Minus,
  Trash2,
  X,
  ShieldCheck
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const demoProducts = [
  {
    _id: 'demo-1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 1499,
    oldPrice: 2999,
    rating: 4.5,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85'
  },
  {
    _id: 'demo-2',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 2199,
    oldPrice: 4999,
    rating: 4.3,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85'
  },
  {
    _id: 'demo-3',
    name: 'Casual Backpack',
    category: 'Accessories',
    price: 999,
    oldPrice: 1999,
    rating: 4.4,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85'
  },
  {
    _id: 'demo-4',
    name: 'Running Shoes',
    category: 'Fashion',
    price: 1799,
    oldPrice: 3499,
    rating: 4.6,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85'
  },
  {
    _id: 'demo-5',
    name: 'Classic Sunglasses',
    category: 'Fashion',
    price: 699,
    oldPrice: 1499,
    rating: 4.2,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85'
  },
  {
    _id: 'demo-6',
    name: 'Ceramic Coffee Mug',
    category: 'Home & Living',
    price: 299,
    oldPrice: 599,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85'
  },
  {
    _id: 'demo-7',
    name: 'Everyday Tote Bag',
    category: 'Accessories',
    price: 799,
    oldPrice: 1299,
    rating: 4.4,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85'
  },
  {
    _id: 'demo-8',
    name: 'Minimal Desk Lamp',
    category: 'Home & Living',
    price: 899,
    oldPrice: 1599,
    rating: 4.5,
    reviews: 43,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85'
  }
];

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Accessories'
];

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function App() {
  const [products, setProducts] = useState(demoProducts);
  const [demoMode, setDemoMode] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopease_cart') || '[]');
    } catch {
      return [];
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem('shopease_token') || ''
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopease_user') || 'null');
    } catch {
      return null;
    }
  });

  const [view, setView] = useState('home');
  const [authMode, setAuthMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [shipping, setShipping] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const [adminForm, setAdminForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    oldPrice: '',
    image: '',
    stock: '10',
    description: ''
  });

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
          ) &&
          (category === 'All' || p.category === category)
      ),
    [products, search, category]
  );

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
  }

  async function loadProducts() {
    try {
      const data = await request('/products');

      if (Array.isArray(data.products) && data.products.length) {
        setProducts(data.products);
        setDemoMode(false);
      } else {
        setProducts([]);
        setDemoMode(false);
      }
    } catch {
      setProducts(demoProducts);
      setDemoMode(true);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('shopease_token', token);
      localStorage.setItem('shopease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopease_token');
      localStorage.removeItem('shopease_user');
    }
  }, [token, user]);

  function addToCart(product) {
    if (String(product._id).startsWith('demo-')) {
      notify(
        'Demo catalog: connect the database and seed products to place real orders.'
      );
    }

    setCart((old) => {
      const existing = old.find(
        (item) => item.productId === product._id
      );

      return existing
        ? old.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...old,
            {
              productId: product._id,
              name: product.name,
              image: product.image,
              category: product.category,
              price: product.price,
              quantity: 1
            }
          ];
    });

    if (!String(product._id).startsWith('demo-')) {
      notify(`${product.name} added to your cart`);
    }
  }

  function changeQuantity(id, amount) {
    setCart((old) =>
      old
        .map((item) =>
          item.productId === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function logout() {
    setToken('');
    setUser(null);
    setView('home');
    setOrders([]);
    notify('You have been logged out.');
  }

  async function submitAuth(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const data = await request(`/auth/${authMode}`, {
        method: 'POST',
        body: JSON.stringify(form)
      });

      setToken(data.token);
      setUser(data.user);
      setForm({ name: '', email: '', password: '' });
      setView(data.user.role === 'admin' ? 'admin' : 'home');

      notify(`Welcome${data.user.name ? `, ${data.user.name}` : ''}!`);
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (!token) {
      setAuthMode('login');
      setView('auth');
      notify('Please log in before placing an order.');
      return;
    }

    if (cart.some((item) => String(item.productId).startsWith('demo-'))) {
      notify('Connect MongoDB and seed the product catalog before checkout.');
      return;
    }

    setBusy(true);

    try {
      const data = await request('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          shippingAddress: shipping
        })
      });

      setCart([]);
      setView('orders');
      notify(`Order placed! Order ID: ${data.order._id}`);
      await loadOrders();
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function loadOrders() {
    try {
      const data = await request(
        user?.role === 'admin' ? '/orders' : '/orders/mine'
      );

      setOrders(data.orders || []);
    } catch (error) {
      notify(error.message);
    }
  }

  async function showOrders() {
    if (!token) {
      setAuthMode('login');
      setView('auth');
      notify('Please log in to view orders.');
      return;
    }

    setView('orders');
    await loadOrders();
  }

  async function createProduct(event) {
    event.preventDefault();
    setBusy(true);

    try {
      await request('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...adminForm,
          price: Number(adminForm.price),
          oldPrice: Number(adminForm.oldPrice || 0),
          stock: Number(adminForm.stock)
        })
      });

      setAdminForm({
        name: '',
        category: 'Electronics',
        price: '',
        oldPrice: '',
        image: '',
        stock: '10',
        description: ''
      });

      await loadProducts();
      notify('Product created successfully.');
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(id) {
    try {
      await request(`/products/${id}`, { method: 'DELETE' });
      await loadProducts();
      notify('Product deleted.');
    } catch (error) {
      notify(error.message);
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      await request(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });

      await loadOrders();
      notify('Order status updated.');
    } catch (error) {
      notify(error.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="header">
        <a
          className="logo"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setView('home');
          }}
        >
          <span className="logo-mark">
            <ShoppingBag size={24} />
          </span>
          <span>
            Shop<span className="logo-accent">Ease</span>
          </span>
        </a>

        <label className="search-box">
          <Search size={19} />
          <input
            value={search}
            placeholder="Search products, categories and more..."
            onChange={(e) => {
              setSearch(e.target.value);
              setView('home');
            }}
          />
          <span className="search-hint">Search</span>
        </label>

        <nav className="nav">
          <button
            className={view === 'home' ? 'nav-item current' : 'nav-item'}
            onClick={() => setView('home')}
          >
            Home
          </button>

          <button
            className="nav-item"
            onClick={() => {
              setView('home');
              document
                .getElementById('products')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Products
          </button>

          <button
            className={view === 'cart' ? 'nav-item current' : 'nav-item'}
            onClick={() => setView('cart')}
          >
            <ShoppingCart size={18} />
            Cart <span className="count">{cartCount}</span>
          </button>

          {user ? (
            <button
              className="nav-item"
              onClick={() =>
                setView(user.role === 'admin' ? 'admin' : 'account')
              }
            >
              <UserRound size={17} />
              {user.name.split(' ')[0]}
            </button>
          ) : (
            <button
              className="nav-item"
              onClick={() => {
                setAuthMode('login');
                setView('auth');
              }}
            >
              <UserRound size={17} />
              Login
            </button>
          )}
        </nav>
      </header>

      {demoMode && (
        <div className="mode-notice">
          <span>Preview mode</span>
          Showing sample products because the API/database is not connected.
          Catalog, login and checkout require the backend and MongoDB to be
          available.
        </div>
      )}

      {view === 'home' && (
        <main>
          <section className="hero" id="home">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={14} />
                YOUR EVERYDAY SHOPPING DESTINATION
              </span>

              <p className="sale-pill">
                A LITTLE SOMETHING FOR YOU · UP TO 50% OFF
              </p>

              <h1>
                Find your next
                <br />
                <span>favorite thing.</span>
              </h1>

              <p className="hero-desc">
                Good finds. Great prices. Delivered with care. Discover
                everyday essentials you'll love.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById('products')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Explore the collection <ArrowRight size={17} />
              </button>

              <div className="trust-row">
                <span><Check size={14} /> Quality picks</span>
                <span><Check size={14} /> Great prices</span>
                <span><Check size={14} /> Easy shopping</span>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-circle circle-a" />
              <div className="hero-circle circle-b" />

              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1100&q=85"
                alt="Beautifully curated retail shopping space"
              />

              <div className="float-note">
                <span className="float-spark">✦</span>
                <div>
                  <strong>Little things, big joy.</strong>
                  <p>Your next find is waiting.</p>
                </div>
              </div>
            </div>

            <span className="hero-spark spark-a">✳</span>
            <span className="hero-spark spark-b">✦</span>
          </section>

          <section className="benefits">
            <div className="benefit">
              <span className="benefit-icon lilac">
                <Sparkles size={20} />
              </span>
              <div>
                <strong>Curated for you</strong>
                <p>Everyday favorites</p>
              </div>
            </div>

            <div className="benefit">
              <span className="benefit-icon mint">
                <ShieldCheck size={20} />
              </span>
              <div>
                <strong>Quality first</strong>
                <p>Worth every rupee</p>
              </div>
            </div>

            <div className="benefit">
              <span className="benefit-icon peach">
                <Heart size={20} />
              </span>
              <div>
                <strong>Shopping made easy</strong>
                <p>Simple from start to finish</p>
              </div>
            </div>
          </section>

          <section className="catalog" id="products">
            <div className="section-title">
              <div>
                <span className="kicker">THE GOOD STUFF</span>
                <h2>Find your favorites<span>.</span></h2>
                <p>Thoughtful picks for your everyday life.</p>
              </div>

              <span className="catalog-count">
                {filtered.length} products <ArrowRight size={15} />
              </span>
            </div>

            <div className="categories">
              {categories.map((name, i) => (
                <button
                  key={name}
                  className={`category-chip ${
                    category === name ? 'selected' : ''
                  }`}
                  onClick={() => setCategory(name)}
                >
                  <span>{['✦', '▣', '♧', '⌂', '◇'][i]}</span>
                  {name}
                </button>
              ))}
            </div>

            <div className="toolbar">
              <span>
                {search || category !== 'All'
                  ? `Showing ${filtered.length} matching items`
                  : 'Handpicked just for you'}
              </span>

              <button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                }}
              >
                Clear filters ×
              </button>
            </div>

            {filtered.length ? (
              <div className="product-grid">
                {filtered.map((p, i) => (
                  <article className="product-card" key={p._id}>
                    <div className="product-image">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading={i > 3 ? 'lazy' : 'eager'}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://placehold.co/600x500/f4f1ff/6847e8?text=ShopEase';
                        }}
                      />

                      <span className="discount">
                        {p.oldPrice > p.price
                          ? `${Math.round(
                              ((p.oldPrice - p.price) / p.oldPrice) * 100
                            )}% OFF`
                          : 'GREAT FIND'}
                      </span>

                      <button
                        className="favorite"
                        aria-label="Favorite product"
                        onClick={() =>
                          notify('Favorites will be available in a future update.')
                        }
                      >
                        <Heart size={17} />
                      </button>
                    </div>

                    <div className="product-info">
                      <span className="product-category">{p.category}</span>
                      <h3>{p.name}</h3>

                      <div className="rating">
                        <span>★</span> {p.rating || '4.5'}
                        <span className="reviews">
                          ({p.reviews || 0} reviews)
                        </span>
                      </div>

                      <div className="price-row">
                        <strong>{money(p.price)}</strong>
                        {p.oldPrice > p.price && <del>{money(p.oldPrice)}</del>}
                      </div>

                      <button
                        className="add-button"
                        onClick={() => addToCart(p)}
                      >
                        <ShoppingCart size={16} /> Add to cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty">
                <h3>No products found</h3>
                <p>Try a different search or category.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setSearch('');
                    setCategory('All');
                  }}
                >
                  Show all products
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {view === 'cart' && (
        <main className="page-section">
          <div className="section-title">
            <div>
              <span className="kicker">YOUR BAG</span>
              <h2>Your shopping cart<span>.</span></h2>
              <p>{cartCount} items in your cart</p>
            </div>
            <button className="subtle-button" onClick={() => setView('home')}>
              ← Continue shopping
            </button>
          </div>

          {!cart.length ? (
            <div className="empty">
              <div className="empty-icon"><ShoppingBag size={30} /></div>
              <h3>Your cart is taking a little break.</h3>
              <p>Find something lovely and add it to your bag.</p>
              <button className="primary-button" onClick={() => setView('home')}>
                Explore products <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {cart.map((item) => (
                  <article className="cart-row" key={item.productId}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-product">
                      <span>{item.category}</span>
                      <h3>{item.name}</h3>
                      <strong>{money(item.price)}</strong>
                    </div>

                    <div className="quantity">
                      <button
                        onClick={() => changeQuantity(item.productId, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => changeQuantity(item.productId, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        setCart((old) =>
                          old.filter((x) => x.productId !== item.productId)
                        )
                      }
                      aria-label="Remove item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </article>
                ))}
              </div>

              <aside className="summary">
                <h3>Order summary</h3>
                <div><span>Subtotal</span><strong>{money(total)}</strong></div>
                <div>
                  <span>Delivery</span>
                  <strong>Calculated at checkout</strong>
                </div>
                <div className="grand-total">
                  <span>Total</span><strong>{money(total)}</strong>
                </div>

                <button
                  className="primary-button full-button"
                  onClick={() => {
                    if (!token) {
                      setAuthMode('login');
                      setView('auth');
                      notify('Please log in before checkout.');
                    } else {
                      setView('checkout');
                    }
                  }}
                >
                  Proceed to checkout <ArrowRight size={16} />
                </button>

                <p>Secure checkout · Your order details are handled safely.</p>
              </aside>
            </div>
          )}
        </main>
      )}

      {view === 'auth' && (
        <main className="page-section">
          <section className="auth-card">
            <div className="auth-visual">
              <ShoppingBag size={38} />
              <h2>A little joy<br />starts here.</h2>
              <p>Sign in to keep your favorites close and track your orders.</p>
            </div>

            <form className="auth-form" onSubmit={submitAuth}>
              <span className="kicker">WELCOME TO SHOP EASE</span>
              <h2>
                {authMode === 'login'
                  ? 'Welcome back'
                  : 'Create your account'}
                <span>.</span>
              </h2>
              <p>
                {authMode === 'login'
                  ? 'Enter your details to sign in.'
                  : 'It only takes a moment to get started.'}
              </p>

              {authMode === 'register' && (
                <label>
                  Full name
                  <input
                    required
                    minLength="2"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your name"
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Password
                <input
                  required
                  minLength="8"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="At least 8 characters"
                />
              </label>

              <button className="primary-button full-button" disabled={busy}>
                {busy
                  ? 'Please wait...'
                  : authMode === 'login'
                    ? 'Sign in'
                    : 'Create account'}
                <ArrowRight size={16} />
              </button>

              <p className="switch-auth">
                {authMode === 'login'
                  ? 'New to ShopEase?'
                  : 'Already have an account?'}
                {' '}
                <button
                  type="button"
                  onClick={() =>
                    setAuthMode(
                      authMode === 'login' ? 'register' : 'login'
                    )
                  }
                >
                  {authMode === 'login' ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </form>
          </section>
        </main>
      )}

      {view === 'checkout' && (
        <main className="page-section">
          <div className="section-title">
            <div>
              <span className="kicker">ALMOST YOURS</span>
              <h2>Delivery details<span>.</span></h2>
              <p>Where should we send your order?</p>
            </div>
            <button className="subtle-button" onClick={() => setView('cart')}>
              ← Back to cart
            </button>
          </div>

          <form className="checkout-form" onSubmit={placeOrder}>
            <div className="form-fields">
              {[
                ['fullName', 'Full name'],
                ['phone', 'Phone number'],
                ['address', 'Street address'],
                ['city', 'City'],
                ['pincode', 'PIN code']
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    required
                    value={shipping[key]}
                    onChange={(e) =>
                      setShipping({ ...shipping, [key]: e.target.value })
                    }
                    placeholder={label}
                    pattern={
                      key === 'phone'
                        ? '[0-9+() -]{8,16}'
                        : key === 'pincode'
                          ? '[0-9]{6}'
                          : undefined
                    }
                  />
                </label>
              ))}
            </div>

            <aside className="summary">
              <h3>Order summary</h3>
              {cart.map((item) => (
                <div key={item.productId}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div className="grand-total">
                <span>Total</span><strong>{money(total)}</strong>
              </div>
              <button
                className="primary-button full-button"
                disabled={busy}
              >
                {busy ? 'Placing order...' : 'Place order'}
                <ArrowRight size={16} />
              </button>
              <p>Payment gateway integration can be added separately.</p>
            </aside>
          </form>
        </main>
      )}

      {view === 'orders' && (
        <main className="page-section">
          <div className="section-title">
            <div>
              <span className="kicker">ORDER HISTORY</span>
              <h2>
                {user?.role === 'admin'
                  ? 'All customer orders'
                  : 'Your orders'}
                <span>.</span>
              </h2>
              <p>See the latest updates for your orders.</p>
            </div>
            <button className="subtle-button" onClick={() => setView('home')}>
              ← Continue shopping
            </button>
          </div>

          {!orders.length ? (
            <div className="empty">
              <Package size={35} />
              <h3>No orders yet</h3>
              <p>Your placed orders will appear here.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-card" key={order._id}>
                  <div className="order-top">
                    <div>
                      <span>ORDER ID</span>
                      <strong>{order._id}</strong>
                    </div>
                    <span className="status">{order.status}</span>
                  </div>

                  {user?.role === 'admin' && (
                    <p>
                      Customer: {order.user?.name || 'Customer'} (
                      {order.user?.email || '—'})
                    </p>
                  )}

                  <div className="order-bottom">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      {' · '}
                      {order.items?.length || 0} product types
                    </span>
                    <strong>{money(order.total)}</strong>
                  </div>

                  {user?.role === 'admin' && (
                    <label className="status-select">
                      Update status
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                      >
                        {[
                          'Placed',
                          'Processing',
                          'Shipped',
                          'Delivered',
                          'Cancelled'
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {view === 'admin' && user?.role === 'admin' && (
        <main className="page-section">
          
<div className="section-title">
  <div>
    <span className="kicker">STORE MANAGEMENT</span>
    <h2>Admin dashboard<span>.</span></h2>
    <p>Add products, manage the catalog, and review orders.</p>
  </div>

  <div className="account-actions">
    <button className="subtle-button" onClick={showOrders}>
      View all orders →
    </button>
    <button className="subtle-button" onClick={logout}>
      <LogOut size={16} /> Log out
    </button>
  </div>
</div>

          <div className="admin-layout">
            <form className="admin-form" onSubmit={createProduct}>
              <h3>Add a product</h3>

              <label>
                Product name
                <input
                  required
                  value={adminForm.name}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, name: e.target.value })
                  }
                />
              </label>

              <label>
                Category
                <select
                  value={adminForm.category}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, category: e.target.value })
                  }
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <div className="form-fields">
                <label>
                  Price (₹)
                  <input
                    required
                    type="number"
                    min="0"
                    value={adminForm.price}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, price: e.target.value })
                    }
                  />
                </label>

                <label>
                  Original price (₹)
                  <input
                    type="number"
                    min="0"
                    value={adminForm.oldPrice}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, oldPrice: e.target.value })
                    }
                  />
                </label>

                <label>
                  Stock
                  <input
                    type="number"
                    min="0"
                    value={adminForm.stock}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, stock: e.target.value })
                    }
                  />
                </label>
              </div>

              <label>
                Image URL
                <input
                  type="url"
                  value={adminForm.image}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </label>

              <label>
                Description
                <textarea
                  value={adminForm.description}
                  onChange={(e) =>
                    setAdminForm({
                      ...adminForm,
                      description: e.target.value
                    })
                  }
                />
              </label>

              <button
                className="primary-button full-button"
                disabled={busy}
              >
                Add product <Plus size={16} />
              </button>
            </form>

            <section className="admin-products">
              <h3>Catalog ({products.length})</h3>

              {products.map((p) => (
                <div className="admin-product" key={p._id}>
                  <img src={p.image} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <span>{money(p.price)} · {p.category}</span>
                  </div>

                  {!String(p._id).startsWith('demo-') && (
                    <button
                      onClick={() => deleteProduct(p._id)}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </section>
          </div>
        </main>
      )}

      {view === 'account' && user && (
        <main className="page-section">
          <div className="section-title">
            <div>
              <span className="kicker">YOUR ACCOUNT</span>
              <h2>Hello, {user.name.split(' ')[0]}<span>.</span></h2>
              <p>
                {user.email} ·{' '}
                {user.role === 'admin' ? 'Administrator' : 'Customer'}
              </p>
            </div>
          </div>

          <div className="account-actions">
            <button className="primary-button" onClick={showOrders}>
              View my orders <ArrowRight size={16} />
            </button>
            <button className="subtle-button" onClick={logout}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        </main>
      )}

      <footer className="footer">
        <a
          className="logo"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setView('home');
          }}
        >
          <span className="logo-mark"><ShoppingBag size={20} /></span>
          <span>
            Shop<span className="logo-accent">Ease</span>
          </span>
        </a>

        <p>Little things. Lovely finds. Everyday joy.</p>
        <span>© 2026 ShopEase · Built with React</span>
      </footer>

      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
          <button
            onClick={() => setNotice('')}
            aria-label="Dismiss message"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
