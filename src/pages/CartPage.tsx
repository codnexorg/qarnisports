import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useCartStore } from '../store/cartStore';
import type { CartItem } from '../store/cartStore';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = total() > 3000 ? 0 : 250;
  const discount = promoApplied ? Math.round(total() * 0.1) : 0;
  const grandTotal = total() + shipping - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'QARNI10') setPromoApplied(true);
  };

  return (
    <div className="min-h-screen bg-[#07070c] pt-20">
      <div className={`${CONTAINER} pb-20`}>
        {/* Header */}
        <div className="py-10 border-b border-[rgba(196,168,79,0.1)] mb-8">
          <div className="flex items-center gap-1.5 text-[11px] text-white/25 mb-4">
            <Link to="/" className="hover:text-[#c4a84f] transition-colors">Home</Link>
            <Icon name="arrow-right" size="xs" />
            <span className="text-[#c4a84f]">Shopping Cart</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Shopping <span className="text-gold-gradient">Cart</span>
          </h1>
          <p className="text-white/35 text-sm mt-1.5">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-5 text-white/15">
              <Icon name="cart" size="lg" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
            <p className="text-white/35 text-sm mb-7">Add some premium sports gear to get started</p>
            <Link
              to="/sports"
              className="btn-gold px-9 py-3.5 rounded-sm text-xs font-black tracking-widest inline-flex items-center gap-2"
            >
              Start Shopping <Icon name="arrow-right" size="xs" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Items */}
            <div className="space-y-3">
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 pb-3">
                {['Product', 'Price', 'Qty', 'Total'].map((h) => (
                  <span key={h} className={`text-[9px] tracking-[0.25em] uppercase text-white/25 font-black ${h === 'Total' ? 'text-right' : h !== 'Product' ? 'text-center' : ''}`}>
                    {h}
                  </span>
                ))}
              </div>
              <div className="h-px bg-gradient-to-r from-[rgba(196,168,79,0.2)] to-transparent" />

              {items.map((item: CartItem, i: number) => (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-4 border border-white/5 hover:border-[rgba(196,168,79,0.12)] transition-all animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center">
                    {/* Product */}
                    <div className="flex items-center gap-3">
                      <div className="w-18 h-18 min-w-[72px] h-[72px] rounded-lg overflow-hidden bg-[#13131e] border border-white/5 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-[#c4a84f]/55 font-black capitalize">{item.sport}</p>
                        <h3 className="text-white font-bold text-sm leading-snug truncate">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-[10px] text-white/20 hover:text-red-400 transition-colors mt-1"
                        >
                          <Icon name="delete" size="xs" /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <span className="text-sm font-bold text-white/60">${item.price.toLocaleString()}</span>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center justify-center gap-2.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-white/12 flex items-center justify-center text-white/45 hover:border-[#c4a84f] hover:text-[#c4a84f] transition-all font-bold text-sm"
                      >
                        −
                      </button>
                      <span className="text-white font-black w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-white/12 flex items-center justify-center text-white/45 hover:border-[#c4a84f] hover:text-[#c4a84f] transition-all font-bold text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <span className="text-base font-black text-gold-gradient">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs text-white/25 hover:text-red-400 transition-colors"
                >
                  <Icon name="delete" size="xs" /> Clear Cart
                </button>
                <Link
                  to="/sports"
                  className="flex items-center gap-1.5 text-xs text-white/35 hover:text-[#c4a84f] transition-colors"
                >
                  <Icon name="arrow-left" size="xs" /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-6 border border-[rgba(196,168,79,0.1)]">
                <h3 className="text-sm font-black tracking-widest uppercase text-white mb-5 pb-4 border-b border-[rgba(196,168,79,0.1)]">
                  Order Summary
                </h3>

                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/45">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-white font-bold">${total().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/45">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400 font-bold' : 'text-white'}>
                      {shipping === 0 ? 'FREE' : `$${shipping}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Promo Discount</span>
                      <span className="text-green-400 font-bold">-${discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {shipping > 0 && (
                  <div className="py-2.5 px-3 rounded-lg bg-[#c4a84f]/8 border border-[#c4a84f]/20 mb-4">
                    <p className="text-[11px] text-[#c4a84f]">
                      Add ${(3000 - total()).toLocaleString()} more for free shipping
                    </p>
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-[rgba(196,168,79,0.3)] to-transparent mb-4" />
                <div className="flex justify-between items-center mb-5">
                  <span className="font-black uppercase tracking-widest text-xs text-white">Total</span>
                  <span className="text-xl font-black text-gold-gradient">${grandTotal.toLocaleString()}</span>
                </div>

                {/* Promo */}
                <div className="mb-5">
                  <p className="text-[9px] text-white/25 uppercase tracking-widest mb-2">Promo Code</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-transparent border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c4a84f]/50"
                      disabled={promoApplied}
                    />
                    <button
                      onClick={applyPromo}
                      disabled={promoApplied}
                      className={`px-4 py-2 rounded-sm text-[10px] font-black tracking-wider uppercase transition-all ${
                        promoApplied
                          ? 'bg-green-500/15 border border-green-500/40 text-green-400'
                          : 'btn-outline-gold'
                      }`}
                    >
                      {promoApplied ? <Icon name="check" size="xs" /> : 'Apply'}
                    </button>
                  </div>
                  {promoApplied
                    ? <p className="text-[10px] text-green-400 mt-1.5">✓ 10% discount applied!</p>
                    : <p className="text-[9px] text-white/15 mt-1.5">Try: QARNI10</p>
                  }
                </div>

                <button className="btn-gold w-full py-4 rounded-sm text-xs font-black tracking-widest flex items-center justify-center gap-2">
                  <Icon name="cart" size="xs" />
                  Proceed to Checkout
                </button>
              </div>

              {/* Trust */}
              <div className="glass-card rounded-xl p-4 border border-white/5">
                {([
                  ['shield', '100% Authentic Products'],
                  ['refresh', '30-Day Easy Returns'],
                  ['truck', 'Fast Nationwide Delivery'],
                ] as const).map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                    <span className="text-[#c4a84f]/50"><Icon name={icon} size="xs" /></span>
                    <span className="text-xs text-white/35">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
