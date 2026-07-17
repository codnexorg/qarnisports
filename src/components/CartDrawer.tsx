import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useCartStore } from '../store/cartStore';
import type { CartItem } from '../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && toggleCart();
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, toggleCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[70] bg-[#0d0d14] border-l border-[rgba(196,168,79,0.2)] shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transition: 'transform 0.45s cubic-bezier(0.25,0.1,0.25,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(196,168,79,0.15)]">
          <div>
            <h2 className="text-base font-black tracking-widest uppercase text-white">Your Cart</h2>
            <p className="text-xs text-white/35 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={toggleCart}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:border-[#c4a84f]/50 transition-all hover:bg-[#c4a84f]/10 text-white/60 hover:text-white"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4 text-white/20">
                <Icon name="cart" size="lg" />
              </div>
              <p className="text-white/35 text-sm">Your cart is empty</p>
              <button
                onClick={toggleCart}
                className="mt-5 btn-outline-gold px-5 py-2.5 text-xs rounded-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item: CartItem) => (
              <div key={item.id} className="glass-card rounded-lg p-4 flex gap-3">
                <div className="w-18 h-18 min-w-[72px] rounded-md overflow-hidden bg-[#1a1a24] border border-white/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#c4a84f]/60 font-bold capitalize">{item.sport}</p>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5">{item.name}</h4>
                  <p className="text-[#c4a84f] font-black text-sm mt-1">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2.5 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded border border-white/15 flex items-center justify-center text-white/50 hover:border-[#c4a84f] hover:text-[#c4a84f] transition-all text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-white/15 flex items-center justify-center text-white/50 hover:border-[#c4a84f] hover:text-[#c4a84f] transition-all text-sm font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Icon name="delete" size="xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-[rgba(196,168,79,0.15)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/45 text-xs uppercase tracking-widest">Subtotal</span>
              <span className="text-xl font-black text-gold-gradient">${total().toLocaleString()}</span>
            </div>
            <div className="section-divider" />
            <Link
              to="/cart"
              onClick={toggleCart}
              className="btn-gold flex items-center justify-center gap-2 w-full py-4 rounded-sm text-xs font-black tracking-widest"
            >
              View Cart & Checkout
              <Icon name="arrow-right" size="xs" />
            </Link>
            <button
              onClick={toggleCart}
              className="btn-outline-gold w-full py-3 rounded-sm text-xs tracking-widest"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
