import { useState, useEffect, useMemo } from 'react';
import { C, ft, ftD } from './config/theme.js';
import { INIT_PRODS, FUNNELS_INIT, MSG_TEMPLATES, MSG_LOG_INIT, BUMPS, CROSS_ITEMS, LENS_OPTIONS_DEFAULT, EXTRA_TREATMENTS_DEFAULT, BANNERS_INIT } from './config/data.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider, useCart } from './context/CartContext.jsx';

// Store
import { PromoBar, StoreNav, Footer } from './store/Layout.jsx';
import { HomePage } from './store/HomePage.jsx';
import { CatalogPage } from './store/CatalogPage.jsx';
import { ProductPage } from './store/ProductPage.jsx';
import { CartDrawer } from './store/CartDrawer.jsx';
import { CheckoutPage } from './store/Checkout.jsx';
import { LeadPopup, AbandonNotif, UpsellModal, ConfirmPage, LoginModal } from './store/Modals.jsx';

// Admin
import { AdminLayout } from './admin/Layout.jsx';
import { DashboardPage } from './admin/DashboardPage.jsx';
import { ProductsPage } from './admin/ProductsPage.jsx';
import { FunnelsPage } from './admin/FunnelsPage.jsx';
import { MessagingPage } from './admin/MessagingPage.jsx';
import { FinancePage } from './admin/FinancePage.jsx';
import { IntelPage } from './admin/IntelPage.jsx';
import { BannersPage } from './admin/BannersPage.jsx';
import { OrdersPage } from './admin/OrdersPage.jsx';
import { UsersPage } from './admin/UsersPage.jsx';
import { SettingsPage } from './admin/SettingsPage.jsx';
import { OffersPage } from './admin/OffersPage.jsx';

function AppContent() {
  const { user } = useAuth();
  const { items, count, total, clear } = useCart();

  // Global
  const [mode, setMode] = useState('store');
  const [products, setProducts] = useState(INIT_PRODS);
  const [funnels, setFunnels] = useState(FUNNELS_INIT);
  const [orders, setOrders] = useState([]);
  const [templates] = useState(MSG_TEMPLATES);
  const [msgLog, setMsgLog] = useState(MSG_LOG_INIT);

  // Configurable Logic (Persisted)
  const [lensOptions, setLensOptions] = useState(() => JSON.parse(localStorage.getItem('elior_lens') || JSON.stringify(LENS_OPTIONS_DEFAULT)));
  const [treatments, setTreatments] = useState(() => JSON.parse(localStorage.getItem('elior_treatments') || JSON.stringify(EXTRA_TREATMENTS_DEFAULT)));
  const [bumpsCatalog, setBumpsCatalog] = useState(() => JSON.parse(localStorage.getItem('elior_bumps') || JSON.stringify(BUMPS)));
  const [crossCatalog, setCrossCatalog] = useState(() => JSON.parse(localStorage.getItem('elior_cross') || JSON.stringify(CROSS_ITEMS)));
  const [banners, setBanners] = useState(() => JSON.parse(localStorage.getItem('elior_banners') || JSON.stringify(BANNERS_INIT)));

  useEffect(() => {
    localStorage.setItem('elior_lens', JSON.stringify(lensOptions));
    localStorage.setItem('elior_treatments', JSON.stringify(treatments));
    localStorage.setItem('elior_bumps', JSON.stringify(bumpsCatalog));
    localStorage.setItem('elior_cross', JSON.stringify(crossCatalog));
    localStorage.setItem('elior_banners', JSON.stringify(banners));
  }, [lensOptions, treatments, bumpsCatalog, crossCatalog, banners]);


  // Store
  const [page, setPage] = useState('home');
  const [selProd, setSelProd] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupOff, setPopupOff] = useState(false);
  const [leadOk, setLeadOk] = useState(false);
  const [abandonN, setAbandonN] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [orderOk, setOrderOk] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [countdown, setCountdown] = useState(3599);

  // Admin
  const [sec, setSec] = useState('dashboard');

  // Sync mode with auth
  useEffect(() => { if (user && mode === 'store') setMode('admin'); }, [user]);

  // SEO Intelligence Effect
  useEffect(() => {
    if (mode === 'admin') {
      document.title = "Elior Admin | Gestão de Alta Performance";
      return;
    }
    
    let title = "Elior Eyewear | Óculos Premium e Estilo";
    let desc = "Elior Eyewear oferece óculos de luxo com tecnologia de lentes Zeno. Compre online com segurança e estilo.";

    if (page === 'catalog') {
      title = "Catálogo Elior | Encontre seu Estilo";
      desc = "Nossa coleção completa de óculos de grau e sol.";
    } else if (page === 'product' && selProd) {
      title = selProd.seoTitle || `${selProd.name} | Elior Eyewear`;
      desc = selProd.seoDesc || selProd.desc;
    } else if (page === 'checkout') {
      title = "Finalizar Pedido | Elior Eyewear";
    }

    document.title = title;
    const metaStr = document.querySelector('meta[name="description"]');
    if (metaStr) metaStr.setAttribute('content', desc);
  }, [page, selProd, mode]);

  // Effects
  useEffect(() => {
    const t = setInterval(() => setCountdown(p => p > 0 ? p - 1 : 3599), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!popupOff && !leadOk && mode === 'store') {
      const t = setTimeout(() => setShowPopup(true), 6000);
      return () => clearTimeout(t);
    }
  }, [popupOff, leadOk, mode]);

  useEffect(() => {
    if (count > 0 && !showCart && page !== 'checkout' && mode === 'store') {
      const t = setTimeout(() => setAbandonN(true), 20000);
      return () => clearTimeout(t);
    }
  }, [count, showCart, page, mode]);

  useEffect(() => {
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  }, [page, sec, mode]);

  // Computed
  const filteredProds = useMemo(() => {
    let ps = products.filter(p => p.status === 'active');
    if (filter !== 'all') ps = ps.filter(p => p.cat === filter);
    if (searchQ) ps = ps.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()));
    return ps;
  }, [products, filter, searchQ]);

  const recs = useMemo(() => selProd
    ? products.filter(p => p.id !== selProd.id && p.cat === selProd.cat && p.status === 'active').slice(0, 4)
    : [], [selProd, products]);

  const cH = String(Math.floor(countdown / 3600)).padStart(2, '0');
  const cM = String(Math.floor((countdown % 3600) / 60)).padStart(2, '0');
  const cS = String(countdown % 60).padStart(2, '0');

  const openProd = (p) => { setSelProd(p); setPage('product'); };

  const handleCheckoutComplete = (orderId, finalTotal) => {
    setOrders(prev => [...prev, {
      id: orderId || Date.now(),
      items: [...items],
      total: finalTotal || total,
      date: new Date().toISOString(),
      status: 'confirmed'
    }]);
    setOrderOk(true);
    setShowUpsell(true);
  };

  /* ═══ STORE ═══ */
  if (mode === 'store') {
    return (
      <div style={{fontFamily:ft,color:C.tx,minHeight:"100vh",background:C.wh}}>
        {page !== 'checkout' && <PromoBar cH={cH} cM={cM} cS={cS} />}
        {page !== 'checkout' && <StoreNav page={page} filter={filter} setPage={setPage} setFilter={setFilter} showCart={showCart} setShowCart={setShowCart} />}

        {page === 'home' && <HomePage products={products} setPage={setPage} setFilter={setFilter} openProd={openProd} cH={cH} cM={cM} cS={cS} banners={banners} />}
        {page === 'catalog' && <CatalogPage products={filteredProds} filter={filter} setFilter={setFilter} searchQ={searchQ} setSearchQ={setSearchQ} openProd={openProd} />}
        {page === 'product' && selProd && <ProductPage product={selProd} recommendations={recs} setPage={setPage} openProd={openProd} lensOptions={lensOptions} treatments={treatments} />}
        {page === 'checkout' && !orderOk && <CheckoutPage setPage={setPage} onComplete={handleCheckoutComplete} />}
        {page === 'checkout' && orderOk && showUpsell && <UpsellModal onDecline={() => setShowUpsell(false)} />}
        {page === 'checkout' && orderOk && !showUpsell && <ConfirmPage onContinue={() => { setPage('home'); clear(); setOrderOk(false); }} />}

        {page !== 'checkout' && <Footer onLoginClick={() => setShowLogin(true)} />}

        {showCart && <CartDrawer onClose={() => setShowCart(false)} onCheckout={() => setPage('checkout')} />}
        {showPopup && <LeadPopup onClose={() => { setShowPopup(false); setPopupOff(true); }} onSubmit={() => setLeadOk(true)} />}
        {abandonN && <AbandonNotif onClose={() => setAbandonN(false)} onBack={() => { setShowCart(true); setAbandonN(false); }} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => { setShowLogin(false); setMode('admin'); }} />}
      </div>
    );
  }

  /* ═══ ADMIN ═══ */
  return (
    <AdminLayout sec={sec} setSec={setSec} onStoreClick={() => setMode('store')}>
      {sec === 'dashboard' && <DashboardPage products={products} />}
      {sec === 'products' && <ProductsPage products={products} setProducts={setProducts} />}
      {sec === 'funnels' && <FunnelsPage funnels={funnels} setFunnels={setFunnels} />}
      {sec === 'messaging' && <MessagingPage templates={templates} msgLog={msgLog} setMsgLog={setMsgLog} />}
      {sec === 'finance' && <FinancePage products={products} />}
      {sec === 'intel' && <IntelPage />}
      {sec === 'banners' && <BannersPage banners={banners} setBanners={setBanners} />}
      {sec === 'orders' && <OrdersPage orders={orders} onGoToStore={() => setMode('store')} />}
      {sec === 'offers' && <OffersPage 
        lensOptions={lensOptions} setLensOptions={setLensOptions} 
        treatments={treatments} setTreatments={setTreatments}
        bumps={bumpsCatalog} setBumps={setBumpsCatalog}
        crossItems={crossCatalog} setCrossItems={setCrossCatalog}
      />}
      {sec === 'users' && <UsersPage />}
      {sec === 'settings' && <SettingsPage />}
    </AdminLayout>
  );
}
export default function App() {
  const { bumpsCatalog, crossCatalog } = useAppContent();
  return (
    <AuthProvider>
      <CartProvider bumpsCatalog={bumpsCatalog} crossCatalog={crossCatalog}>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

// Helper to provide catalogs to CartProvider which is outside AppContent
function useAppContent() {
  const [bc] = useState(() => JSON.parse(localStorage.getItem('elior_bumps') || JSON.stringify(BUMPS)));
  const [cc] = useState(() => JSON.parse(localStorage.getItem('elior_cross') || JSON.stringify(CROSS_ITEMS)));
  return { bumpsCatalog: bc, crossCatalog: cc };
}
