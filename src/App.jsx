import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Heart,
  Menu,
  Moon,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { categories, formatPrice, products } from "./data";
import "./App.css";

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

function useStore() {
  const [cart, setCart] = useState(() => read("luma-cart", []));
  const [wishlist, setWishlist] = useState(() => read("luma-wishlist", []));
  const [recent, setRecent] = useState(() => read("luma-recent", []));
  const [dark, setDark] = useState(() => read("luma-dark", false));
  const [toast, setToast] = useState(null);
  useEffect(() => {
    localStorage.setItem("luma-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("luma-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem("luma-recent", JSON.stringify(recent));
  }, [recent]);
  useEffect(() => {
    localStorage.setItem("luma-dark", JSON.stringify(dark));
  }, [dark]);
  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };
  const addToCart = (product, quantity = 1) => {
    setCart((items) => {
      const match = items.find((item) => item.id === product.id);
      return match
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...items, { ...product, quantity }];
    });
    notify(`${product.name} added to your bag`);
  };
  const toggleWish = (product) => {
    setWishlist((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product],
    );
    notify(
      wishlist.some((item) => item.id === product.id)
        ? "Removed from wishlist"
        : "Saved to wishlist",
    );
  };
  const updateQuantity = (id, delta) =>
    setCart((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  const removeCart = (id) =>
    setCart((items) => items.filter((item) => item.id !== id));
  const addRecent = (product) =>
    setRecent((items) =>
      [product, ...items.filter((item) => item.id !== product.id)].slice(0, 4),
    );
  return {
    cart,
    wishlist,
    recent,
    dark,
    setDark,
    toast,
    addToCart,
    toggleWish,
    updateQuantity,
    removeCart,
    addRecent,
    notify,
  };
}

function App() {
  const store = useStore();
  return (
    <BrowserRouter>
      <div className={store.dark ? "app dark" : "app"}>
        <ScrollToTop />
        <Navbar {...store} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home {...store} />} />
            <Route path="/shop" element={<Shop {...store} />} />
            <Route path="/product/:id" element={<ProductDetail {...store} />} />
            <Route path="/cart" element={<Cart {...store} />} />
            <Route path="/checkout" element={<Checkout {...store} />} />
            <Route path="/wishlist" element={<Wishlist {...store} />} />
            <Route path="/account" element={<Account {...store} />} />
          </Routes>
        </AnimatePresence>
        <Assistant {...store} />
        <MobileNav cart={store.cart} />
        {store.toast && (
          <motion.div
            className="toast"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Check size={16} />
            {store.toast}
          </motion.div>
        )}
      </div>
    </BrowserRouter>
  );
}
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function Navbar({ cart, wishlist, dark, setDark }) {
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const matches = products
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);
  return (
    <header className="navbar">
      <div className="nav-inner">
        <button
          className="icon-btn mobile-only"
          onClick={() => setMenu(!menu)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link className="wordmark" to="/">
          <span className="mark">L</span>LUMA
        </Link>
        <nav className={menu ? "desktop-nav open" : "desktop-nav"}>
          <Link to="/shop">Shop</Link>
          <Link to="/shop?sort=new">New in</Link>
          <Link to="/shop?category=Footwear">Footwear</Link>
          <Link to="/shop?category=Home">Objects</Link>
        </nav>
        <div className="nav-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands..."
          />
          <span className="search-key">⌘ K</span>
          {query && (
            <div className="search-results">
              {matches.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  onClick={() => setQuery("")}
                >
                  <img src={product.image} alt="" />
                  <span>
                    <b>{product.name}</b>
                    <small>{formatPrice(product.price)}</small>
                  </span>
                  <ArrowRight size={15} />
                </Link>
              ))}
              {!matches.length && <p>No products found.</p>}
            </div>
          )}
        </div>
        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <Link className="nav-icon" to="/wishlist" aria-label="Wishlist">
            <Heart size={19} />
            <i>{wishlist.length}</i>
          </Link>
          <Link className="nav-icon" to="/cart" aria-label="Shopping bag">
            <ShoppingBag size={19} />
            <i>{cart.reduce((sum, item) => sum + item.quantity, 0)}</i>
          </Link>
          <Link className="account-link" to="/account" aria-label="Account">
            <CircleUserRound className="account-icon" size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
function Page({ children, className = "" }) {
  return (
    <motion.main
      className={`page ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.main>
  );
}
function SectionHeading({ eyebrow, title, link = "View all", to = "/shop" }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <Link className="text-link" to={to}>
        {link}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
function ProductCard({ product, toggleWish, wishlist, addToCart, onCompare }) {
  const saved = wishlist.some((item) => item.id === product.id);
  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="product-image">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} />
        </Link>
        <span className="product-badge">
          {product.isNew ? "New in" : `${product.discount}% off`}
        </span>
        <button
          className={saved ? "heart-btn saved" : "heart-btn"}
          onClick={() => toggleWish(product)}
          aria-label="Save product"
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
        {onCompare && (
          <button className="quick-view" onClick={() => onCompare(product)}>
            Compare
          </button>
        )}
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.brand}</span>
          <span className="rating">★ {product.rating}</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="price-row">
          <b>{formatPrice(product.price)}</b>
          <del>{formatPrice(product.originalPrice)}</del>
        </div>
        <div className="stock-row">
          <span className={product.stock === 0 ? "low-stock" : product.stock < 10 ? "low-stock" : ""}>
            {product.stock === 0 ? "Out of stock" : product.stock < 10 ? `Only ${product.stock} left` : "In stock"}
          </span>
          <button disabled={product.stock === 0} onClick={() => addToCart(product)} aria-label="Add to cart">
            <Plus size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
function ProductStrip({ title, eyebrow, items, ...store }) {
  return (
    <section className="container section">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="product-grid">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} {...store} />
        ))}
      </div>
    </section>
  );
}
function Home(store) {
  const trending = products.filter((p) => p.rating >= 4.7);
  const [finder, setFinder] = useState(0);
  const steps = [
    {
      q: "What are you looking for?",
      options: ["Everyday layers", "A new pair of shoes", "Objects for home"],
    },
    {
      q: "What is your ideal budget?",
      options: ["Under ₹2,000", "₹2,000 – ₹4,000", "Investment pieces"],
    },
    {
      q: "Choose your mood",
      options: [
        "Minimal & quiet",
        "Utility & outdoors",
        "Polished & considered",
      ],
    },
  ];
  return (
    <Page>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow light">The new everyday</span>
          <h1>
            Objects with
            <br />
            <em>intention.</em>
          </h1>
          <p>
            A considered collection of clothing, footwear and objects for the
            way you live now.
          </p>
          <div className="hero-actions">
            <Link className="button button-light" to="/shop">
              Explore collection <ArrowRight size={17} />
            </Link>
            <Link className="ghost-link" to="/shop?sort=new">
              See what's new
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-stamp">
            <span>LU</span>
            <small>EST. 2024</small>
          </div>
          <img src={products[6].image} alt="Model wearing the new collection" />
        </div>
        <div className="hero-note">
          <span>01 / 04</span>
          <span>
            Designed in India
            <br />
            Made for everywhere
          </span>
        </div>
      </section>
      <section className="container category-row">
        <div className="category-intro">
          <span className="eyebrow">Curated edits</span>
          <h2>
            Find your
            <br />
            <em>everyday.</em>
          </h2>
        </div>
        {categories.map((category) => (
          <Link
            className={`category-card ${category.accent}`}
            to={`/shop?category=${category.name}`}
            key={category.name}
          >
            <img src={category.image} alt="" />
            <div>
              <span>{category.label}</span>
              <b>{category.name}</b>
            </div>
            <ArrowRight size={17} />
          </Link>
        ))}
      </section>
      <ProductStrip
        eyebrow="Most wanted"
        title="The pieces people are talking about."
        items={trending}
        {...store}
      />
      <section className="feature-band">
        <div className="container feature-inner">
          <div>
            <span className="eyebrow">Limited release · 48 hours</span>
            <h2>
              Good things
              <br />
              <em>take time.</em>
            </h2>
            <p>
              Meet the Luma Studio edit: thoughtful forms, rich textures, and a
              little more room to breathe.
            </p>
            <Link className="button button-dark" to="/shop?sort=new">
              Shop the edit <ArrowRight size={17} />
            </Link>
          </div>
          <div className="feature-image">
            <img src={products[13].image} alt="Luma Studio lamp" />
            <span>Studio 03</span>
          </div>
          <div className="countdown">
            <small>Drop closes in</small>
            <div>
              <b>04</b>
              <span>:</span>
              <b>18</b>
              <span>:</span>
              <b>36</b>
            </div>
            <small>hours &nbsp; minutes &nbsp; seconds</small>
          </div>
        </div>
      </section>
      <ProductStrip
        eyebrow="New arrivals"
        title="Fresh perspective, just in."
        items={products.filter((p) => p.isNew)}
        {...store}
      />
      <section className="finder container">
        <div className="finder-copy">
          <span className="eyebrow">Personal shopper</span>
          <h2>
            A little help
            <br />
            <em>finding your thing.</em>
          </h2>
          <p>
            Answer three quick questions and we'll make a considered edit just
            for you.
          </p>
          <div className="finder-progress">
            <span
              style={{ width: `${((finder + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="finder-panel">
          <span className="step-count">0{finder + 1} / 03</span>
          <h3>{steps[finder].q}</h3>
          <div className="finder-options">
            {steps[finder].options.map((option) => (
              <button
                key={option}
                onClick={() => setFinder((finder + 1) % steps.length)}
              >
                {option}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="newsletter container">
        <Sparkles size={20} />
        <span className="eyebrow">The Luma letter</span>
        <h2>
          Good taste,
          <br />
          <em>delivered.</em>
        </h2>
        <p>New drops, thoughtful stories and 10% off your first order.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            store.notify("Welcome to the Luma letter");
          }}
        >
          <input required type="email" placeholder="Your email address" />
          <button className="button button-dark">
            Subscribe <ArrowRight size={16} />
          </button>
        </form>
      </section>
      <Footer />
    </Page>
  );
}
function Shop(store) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [sort, setSort] = useState(
    params.get("sort") === "new" ? "Newest" : "Popular",
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [compare, setCompare] = useState([]);
  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);
    setCategory(nextParams.get("category") || "All");
    setSort(nextParams.get("sort") === "new" ? "Newest" : "Popular");
  }, [location.search]);
  const filtered = useMemo(() => {
    const minimum = Number(minPrice) || 0;
    const maximum = Number(maxPrice) || Infinity;
    let list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.price >= minimum &&
        p.price <= maximum &&
        (!inStockOnly || p.stock > 0) &&
        (!newOnly || p.isNew) &&
        `${p.name} ${p.brand} ${p.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    if (sort === "Price low to high") list.sort((a, b) => a.price - b.price);
    if (sort === "Price high to low") list.sort((a, b) => b.price - a.price);
    if (sort === "Rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "Newest") list.sort((a, b) => b.id - a.id);
    return list;
  }, [category, inStockOnly, maxPrice, minPrice, newOnly, query, sort]);
  const onCompare = (product) =>
    setCompare((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : items.length < 4
          ? [...items, product]
          : items,
    );
  return (
    <Page>
      <div className="shop-head container">
        <div>
          <span className="eyebrow">The collection</span>
          <h1>
            Shop all <em>objects.</em>
          </h1>
          <p>Considered essentials, made to stay with you.</p>
        </div>
        <button className="filter-toggle">
          <Menu size={17} /> Filters
        </button>
      </div>
      <div className="shop-toolbar container">
        <div className="filter-tabs">
          {["All", "Apparel", "Footwear", "Accessories", "Home"].map((item) => (
            <button
              className={category === item ? "active" : ""}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="shop-controls">
          <label>
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collection"
            />
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Popular</option>
            <option>Newest</option>
            <option>Rating</option>
            <option>Price low to high</option>
            <option>Price high to low</option>
          </select>
        </div>
      </div>
      <div className="shop-layout container">
        <aside className="filter-sidebar">
          <span className="eyebrow">Refine by</span>
          <h3>Categories</h3>
          {["All", "Apparel", "Footwear", "Accessories", "Home"].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={category === item ? "selected" : ""}
            >
              {item}
              <span>
                {item === "All"
                  ? products.length
                  : products.filter((p) => p.category === item).length}
              </span>
            </button>
          ))}
          <hr />
          <h3>Availability</h3>
          <label className="check-label">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In stock <span>›</span>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={newOnly}
              onChange={(e) => setNewOnly(e.target.checked)}
            />
            New arrivals <span>›</span>
          </label>
          <hr />
          <h3>Price range</h3>
          <div className="price-inputs">
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="₹ Min"
              aria-label="Minimum price"
            />
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="₹ Max"
              aria-label="Maximum price"
            />
          </div>
        </aside>
        <div className="shop-content">
          <div className="results-line">
            <span>{filtered.length} pieces</span>
            <span>Free shipping over ₹3,000</span>
          </div>
          <div className="product-grid large">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                {...store}
                onCompare={onCompare}
              />
            ))}
          </div>
        </div>
      </div>
      {compare.length > 0 && (
        <CompareBar products={compare} onClear={() => setCompare([])} />
      )}
    </Page>
  );
}
function CompareBar({ products: items, onClear }) {
  return (
    <motion.div className="compare-bar" initial={{ y: 100 }} animate={{ y: 0 }}>
      <div>
        <span className="eyebrow">Compare selection</span>
        <b>{items.length} of 4 selected</b>
      </div>
      <div className="compare-thumbs">
        {items.map((item) => (
          <img key={item.id} src={item.image} alt="" />
        ))}
      </div>
      <button
        className="button button-dark"
        onClick={() =>
          alert(`Comparing ${items.map((item) => item.name).join(", ")}`)
        }
      >
        Compare now <ArrowRight size={16} />
      </button>
      <button className="icon-btn" onClick={onClear}>
        <X size={18} />
      </button>
    </motion.div>
  );
}
function ProductDetail({ ...store }) {
  const { id } = useParams();
  const product =
    products.find((item) => item.id === Number(id)) || products[0];
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes[0]);
  const [pin, setPin] = useState("");
  useEffect(() => {
    store.addRecent(product);
  }, [product.id]);
  return (
    <Page>
      <div className="breadcrumb container">
        <Link to="/shop">Shop</Link>
        <ChevronDown size={14} />
        <span>{product.category}</span>
        <ChevronDown size={14} />
        <b>{product.name}</b>
      </div>
      <section className="product-detail container">
        <div className="gallery">
          <div className="gallery-main">
            <img src={product.images[imageIndex]} alt={product.name} />
          </div>
          <div className="gallery-thumbs">
            {product.images.map((image, index) => (
              <button
                key={image}
                className={index === imageIndex ? "active" : ""}
                onClick={() => setImageIndex(index)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-copy">
          <div className="product-meta">
            <span>{product.brand}</span>
            <span className="rating">
              ★ {product.rating} · {product.reviews} reviews
            </span>
          </div>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">
            <b>{formatPrice(product.price)}</b>
            <del>{formatPrice(product.originalPrice)}</del>
            <span>{product.discount}% off</span>
          </div>
          <div className="detail-rule" />
          <div className="option-group">
            <div>
              <b>Colour</b>
              <span>{product.colors[0]}</span>
            </div>
            <div className="swatches">
              {product.colors.map((color, index) => (
                <button
                  key={color}
                  className={index === 0 ? "selected" : ""}
                  style={{ background: color.toLowerCase() }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          <div className="option-group">
            <div>
              <b>Size</b>
              <span>Size guide</span>
            </div>
            <div className="size-options">
              {product.sizes.map((item) => (
                <button
                  className={size === item ? "selected" : ""}
                  key={item}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="buy-row">
            <div className="quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button
              className="button button-dark grow"
              onClick={() => store.addToCart(product, quantity)}
            >
              Add to bag <ShoppingBag size={17} />
            </button>
            <button
              className="icon-btn outline"
              onClick={() => store.toggleWish(product)}
              aria-label="Save to wishlist"
            >
              <Heart size={19} />
            </button>
          </div>
          <div className="delivery-box">
            <div>
              <Clock3 size={18} />
              <span>
                <b>Check delivery</b>
                <small>Enter your PIN for estimated delivery</small>
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                store.notify(
                  pin.length === 6
                    ? `Delivery available to ${pin}`
                    : "Enter a valid 6-digit PIN",
                );
              }}
            >
              <input
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="PIN code"
              />
              <button>Check</button>
            </form>
          </div>
          <div className="specs">
            <span className="eyebrow">Details</span>
            <p>{product.specifications.join("  ·  ")}</p>
          </div>
        </div>
      </section>
      <ProductStrip
        eyebrow="You may also like"
        title="Pairs well with your style."
        items={products.filter(
          (item) =>
            item.category === product.category && item.id !== product.id,
        )}
        {...store}
      />
      <Footer />
    </Page>
  );
}
function Cart(store) {
  const subtotal = store.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 199;
  return (
    <Page>
      <div className="cart-page container">
        <div className="cart-heading">
          <div>
            <span className="eyebrow">Your selection</span>
            <h1>
              Shopping <em>bag.</em>
            </h1>
          </div>
          <span>{store.cart.length} items</span>
        </div>
        {store.cart.length ? (
          <div className="cart-layout">
            <div className="cart-items">
              {store.cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-copy">
                    <span className="eyebrow">{item.brand}</span>
                    <h3>{item.name}</h3>
                    <p>
                      Colour: {item.colors[0]} · Size: {item.sizes[0]}
                    </p>
                    <button
                      className="remove-link"
                      onClick={() => store.removeCart(item.id)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                  <div className="quantity">
                    <button onClick={() => store.updateQuantity(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => store.updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                  <b className="cart-price">
                    {formatPrice(item.price * item.quantity)}
                  </b>
                </div>
              ))}
              <div className="shipping-progress">
                <div>
                  <span>
                    You're {formatPrice(Math.max(0, 3000 - subtotal))} away from
                    free shipping
                  </span>
                  <span>{Math.min(100, Math.round(subtotal / 30))}%</span>
                </div>
                <span className="progress">
                  <i style={{ width: `${Math.min(100, subtotal / 30)}%` }} />
                </span>
              </div>
            </div>
            <aside className="summary">
              <span className="eyebrow">Order summary</span>
              <h2>Almost yours.</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <b>{formatPrice(subtotal)}</b>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <b>{shipping ? formatPrice(shipping) : "Free"}</b>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <b>{formatPrice(subtotal + shipping)}</b>
              </div>
              <Link className="button button-dark full" to="/checkout">
                Continue to checkout <ArrowRight size={16} />
              </Link>
              <p className="secure-note">
                <Check size={14} /> Secure checkout · Easy returns
              </p>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <ShoppingBag size={32} />
            <h2>Your bag is waiting.</h2>
            <p>
              Discover pieces that make everyday feel a little more considered.
            </p>
            <Link className="button button-dark" to="/shop">
              Explore the collection <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </Page>
  );
}
function Checkout({ cart }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const next = () => (step < 3 ? setStep(step + 1) : setDone(true));
  return (
    <Page>
      <div className="checkout container">
        <div className="checkout-header">
          <span className="eyebrow">Luma checkout</span>
          <h1>
            Make it <em>yours.</em>
          </h1>
          <div className="steps">
            {["Address", "Delivery", "Payment"].map((label, index) => (
              <div
                className={step > index ? "step active" : "step"}
                key={label}
              >
                <span>
                  {step > index + 1 ? <Check size={13} /> : index + 1}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
        {done ? (
          <div className="success-state">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="success-icon"
            >
              <Check size={32} />
            </motion.div>
            <span className="eyebrow">Order confirmed</span>
            <h2>
              It's on its way
              <br />
              <em>to becoming yours.</em>
            </h2>
            <p>
              Thanks for shopping with intention. Your confirmation is on its
              way to your inbox.
            </p>
            <Link className="button button-dark" to="/shop">
              Continue shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <form
              className="checkout-form"
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              <span className="eyebrow">Step 0{step}</span>
              <h2>
                {
                  [
                    "Where should we send it?",
                    "How would you like it?",
                    "Almost there.",
                  ][step - 1]
                }
              </h2>
              {step === 1 && (
                <div className="form-fields">
                  <input required placeholder="Full name" />
                  <input required type="tel" placeholder="Phone number" />
                  <input required placeholder="Address" className="wide" />
                  <input required placeholder="City" />
                  <input required placeholder="PIN code" />
                </div>
              )}
              {step === 2 && (
                <div className="delivery-options">
                  <label>
                    <input name="delivery" type="radio" defaultChecked />
                    <span>
                      <b>Standard delivery</b>
                      <small>Arrives in 3–5 business days</small>
                    </span>
                    <strong>Free</strong>
                  </label>
                  <label>
                    <input name="delivery" type="radio" />
                    <span>
                      <b>Express delivery</b>
                      <small>Arrives tomorrow</small>
                    </span>
                    <strong>₹199</strong>
                  </label>
                </div>
              )}
              {step === 3 && (
                <div className="form-fields">
                  <label className="wide field-label">
                    Card details
                    <input required placeholder="0000 0000 0000 0000" />
                  </label>
                  <input required placeholder="MM / YY" />
                  <input required placeholder="CVV" />
                  <label className="wide check-label">
                    <input type="checkbox" required /> Save details for next
                    time
                  </label>
                </div>
              )}
              <button className="button button-dark full" type="submit">
                {step === 3 ? "Place order" : "Continue"}{" "}
                <ArrowRight size={16} />
              </button>
            </form>
            <aside className="summary checkout-summary">
              <span className="eyebrow">Your order</span>
              {cart.slice(0, 3).map((item) => (
                <div className="mini-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <span>
                    {item.name}
                    <small>
                      {item.quantity} × {formatPrice(item.price)}
                    </small>
                  </span>
                </div>
              ))}
              <div className="summary-row total">
                <span>Total</span>
                <b>{formatPrice(subtotal)}</b>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Page>
  );
}
function Wishlist(store) {
  return (
    <Page>
      <div className="wishlist-page container">
        <span className="eyebrow">Saved for later</span>
        <h1>
          Your <em>wishlist.</em>
        </h1>
        {store.wishlist.length ? (
          <div className="product-grid large">
            {store.wishlist.map((product) => (
              <ProductCard key={product.id} product={product} {...store} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Heart size={32} />
            <h2>Keep the good things close.</h2>
            <p>Save pieces here while you decide.</p>
            <Link className="button button-dark" to="/shop">
              Explore the collection <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </Page>
  );
}
function Account({ cart, wishlist }) {
  return (
    <Page>
      <div className="account-page container">
        <span className="eyebrow">Your Luma account</span>
        <h1>
          Welcome <em>back.</em>
        </h1>
        <div className="account-grid">
          <section>
            <div className="account-avatar">LU</div>
            <h2>Guest shopper</h2>
            <p>
              Sign in to save your details, track orders and keep your edits
              synced.
            </p>
            <button
              className="button button-dark"
              onClick={() => alert("Demo sign-in flow")}
            >
              Sign in to continue <ArrowRight size={16} />
            </button>
          </section>
          <aside className="account-summary">
            <div>
              <span className="eyebrow">At a glance</span>
              <b>{wishlist.length} saved pieces</b>
            </div>
            <div>
              <span className="eyebrow">Your bag</span>
              <b>{cart.length} items ready</b>
            </div>
            <Link className="text-link" to="/wishlist">
              View wishlist <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </div>
      <Footer />
    </Page>
  );
}
const assistantSuggestions = [
  "Black casual shoes under ₹3000",
  "Minimal home objects",
  "New arrivals under ₹4000",
];

function parseAssistantQuery(query) {
  const lower = query.toLowerCase();
  const budgetMatches = [...lower.matchAll(/(?:under|below|less than|within)\s*₹?\s*(\d{3,5})/g)];
  const fallbackBudget = lower.match(/₹?\s*(\d{3,5})/);
  const budget = Number(budgetMatches.at(-1)?.[1] || fallbackBudget?.[1] || 0);
  const category = lower.includes("shoe") || lower.includes("footwear") || lower.includes("sandal") ? "Footwear" : lower.includes("home") || lower.includes("lamp") || lower.includes("ceramic") ? "Home" : lower.includes("bag") || lower.includes("watch") || lower.includes("sunglass") || lower.includes("accessor") ? "Accessories" : lower.includes("shirt") || lower.includes("trouser") || lower.includes("jacket") || lower.includes("apparel") || lower.includes("clothing") ? "Apparel" : "";
  const styles = ["casual", "formal", "minimal", "outdoor", "sport", "summer", "tailored", "work", "gift"];
  const colors = ["black", "white", "green", "sage", "tan", "brown", "cream", "olive", "moss", "sand"];
  return { lower, budget, category, style: styles.find((style) => lower.includes(style)) || "", color: colors.find((color) => lower.includes(color)) || "", newOnly: lower.includes("new") || lower.includes("latest"), inStockOnly: !lower.includes("out of stock") };
}

function Assistant({ addToCart }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [lastIntent, setLastIntent] = useState({});
  const [messages, setMessages] = useState([
    { role: "assistant", text: "I can help you find a considered edit in seconds." },
  ]);
  const search = (nextQuery = message) => {
    const query = nextQuery.trim();
    if (!query) return;
    const parsed = parseAssistantQuery(query);
    const intent = { ...lastIntent, ...Object.fromEntries(Object.entries(parsed).filter(([, value]) => value)) };
    const ranked = products
      .filter((product) => (!intent.budget || product.price <= intent.budget) && (!intent.category || product.category === intent.category) && (!intent.newOnly || product.isNew) && product.stock > 0)
      .map((product) => {
        const searchable = product.tags.concat(product.category, product.name, product.colors).join(" ").toLowerCase();
        const score = (intent.style && searchable.includes(intent.style) ? 3 : 0) + (intent.color && searchable.includes(intent.color) ? 3 : 0) + (intent.category && product.category === intent.category ? 2 : 0) + product.rating;
        return { product, score };
      }).sort((a, b) => b.score - a.score).slice(0, 3).map(({ product }) => product);
    const matches = ranked.length ? ranked : products.filter((product) => product.stock > 0).sort((a, b) => b.rating - a.rating).slice(0, 3);
    const qualifiers = [intent.color, intent.style, intent.category].filter(Boolean).join(" ");
    const reply = ranked.length ? `Here is a ${qualifiers || "considered"} edit${intent.budget ? ` under ${formatPrice(intent.budget)}` : ""}.` : "I could not find an exact match, so here are our highest-rated available pieces.";
    setMessages((current) => [...current, { role: "user", text: query }, { role: "assistant", text: reply, products: matches }]);
    setLastIntent(intent);
    setMessage("");
  };
  return (
    <>
      <button
        className="assistant-fab"
        onClick={() => setOpen(!open)}
        aria-label="Open shopping assistant"
      >
        <Bot size={21} />
        <span>Ask Luma</span>
      </button>
      {open && (
        <motion.div
          className="assistant-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="assistant-head">
            <div>
              <span className="eyebrow">Luma intelligence</span>
              <b>Your personal shopper</b>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)}>
              <X size={17} />
            </button>
          </div>
          <div className="assistant-chat" aria-live="polite">
            {messages.map((item, index) => <div className={`chat-message ${item.role}`} key={`${item.role}-${index}`}><span className="chat-bubble">{item.text}</span>{item.role === "assistant" && item.products && <div className="assistant-results">{item.products.map((product) => <div className="assistant-result" key={product.id}><Link to={`/product/${product.id}`} onClick={() => setOpen(false)}><img src={product.image} alt="" /><span>{product.name}<small>{formatPrice(product.price)} · ★ {product.rating}</small></span><ArrowRight size={14} /></Link><button onClick={() => addToCart(product)}>Add</button></div>)}</div>}</div>)}
          </div>
          {messages.length === 1 && <div className="assistant-chips">{assistantSuggestions.map((suggestion) => <button key={suggestion} onClick={() => search(suggestion)}>{suggestion}</button>)}</div>}
          <div className="assistant-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Ask for a recommendation..."
            />
            <button onClick={search}>
              <ArrowRight size={17} />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
function MobileNav({ cart }) {
  return (
    <nav className="mobile-nav">
      <Link to="/">
        <span>⌂</span>Home
      </Link>
      <Link to="/shop">
        <Search size={18} />
        Shop
      </Link>
      <Link to="/cart">
        <ShoppingBag size={18} />
        <i>{cart.length}</i>Bag
      </Link>
      <Link to="/wishlist">
        <Heart size={18} />
        Saved
      </Link>
    </nav>
  );
}
function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Link className="wordmark" to="/">
            <span className="mark">L</span>LUMA
          </Link>
          <p>
            Everyday objects,
            <br />
            considered carefully.
          </p>
          <form className="footer-signup" onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}>
            <span className="eyebrow">Join the Luma letter</span>
            {subscribed ? <b>You're on the list. Thank you.</b> : <div><input required type="email" placeholder="Your email address" aria-label="Email address" /><button aria-label="Subscribe"><ArrowRight size={16} /></button></div>}
          </form>
        </div>
        <div>
          <span className="eyebrow">Explore</span>
          <Link to="/shop">Shop all</Link>
          <Link to="/shop?sort=new">New in</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div>
          <span className="eyebrow">Customer care</span>
          <a href="#help">Shipping & delivery</a>
          <a href="#help">Returns & exchanges</a>
          <a href="#help">Help centre</a>
        </div>
        <div>
          <span className="eyebrow">About Luma</span>
          <a href="#journal">Our story</a>
          <a href="#journal">Journal</a>
          <a href="#journal">Contact</a>
        </div>
        <div>
          <span className="eyebrow">Follow along</span>
          <a href="#instagram">Instagram</a>
          <a href="#pinterest">Pinterest</a>
          <a href="#stores">Find a store</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Luma Studio</span>
        <span>Made with intention in India</span>
        <span>Privacy · Terms · Accessibility</span>
      </div>
    </footer>
  );
}
export default App;
