import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import SportPage from './pages/SportPage';
import AllSportsPage from './pages/AllSportsPage';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import AdminPage from './pages/AdminPage';
import ServicesPage from './pages/ServicesPage';
import CataloguesPage from './pages/CataloguesPage';
import CatalogueDetailPage from './pages/CatalogueDetailPage';
import CategoryGroupPage from './pages/CategoryGroupPage';
import SamplesPage from './pages/SamplesPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen bg-[#07070c]">
              <Header />
              <CartDrawer />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/catalogues" element={<CataloguesPage />} />
                  <Route path="/catalogues/:id" element={<CatalogueDetailPage />} />
                  <Route path="/group/:id" element={<CategoryGroupPage />} />
                  <Route path="/sport/:slug" element={<SportPage />} />
                  <Route path="/samples" element={<SamplesPage />} />
                  <Route path="/sports" element={<AllSportsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
