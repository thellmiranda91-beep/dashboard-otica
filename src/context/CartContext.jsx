import { createContext, useContext, useState } from 'react';
import { BUMPS, CROSS_ITEMS } from '../config/data.js';
import { api } from '../config/api.js';

const CartCtx = createContext(null);
const FREE_SHIPPING_THRESHOLD = 300;

export function CartProvider({ children, bumpsCatalog = BUMPS, crossCatalog = CROSS_ITEMS }) {
  const [items, setItems] = useState([]);
  const [bumps, setBumps] = useState({});
  const [cross, setCross] = useState({});
  const [shipping, setShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  // ... (keeping addItem, removeItem, updateQty, toggleBump, toggleCross, clear, calcShipping as they are)
  const addItem = (product, color, config = {}) => {
    setItems(prev => {
      const configStr = config ? JSON.stringify(config) : '';
      const uniqueId = `${product.id}-${color || 'default'}-${configStr}`;
      const ex = prev.find(i => i.uniqueId === uniqueId);
      if (ex) return prev.map(i => i.uniqueId === uniqueId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, uniqueId, qty: 1, color: color || product.colors?.[0], config }];
    });
  };

  const removeItem = (uniqueId) => setItems(p => p.filter(i => i.uniqueId !== uniqueId));
  const updateQty = (uniqueId, delta) => setItems(p => p.map(i => i.uniqueId === uniqueId ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const toggleBump = (id) => setBumps(p => ({ ...p, [id]: !p[id] }));
  const toggleCross = (id) => setCross(p => ({ ...p, [id]: !p[id] }));

  const clear = () => {
    setItems([]);
    setBumps({});
    setCross({});
    setShipping(null);
  };

  const calcShipping = async (cep) => {
    setShippingLoading(true);
    try {
      const data = await api.calculateShipping(cep, items.length);
      setShipping(data);
      return data;
    } catch (e) {
      setShipping({ success: true, options: [{ service: 'PAC', price: 0, days: 8, free: true }, { service: 'SEDEX', price: 0, days: 3, free: true }] });
    } finally {
      setShippingLoading(false);
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const bumpsTotal = Object.entries(bumps).reduce((s, [k, v]) => v ? s + (bumpsCatalog.find(b => b.id === k)?.price || 0) : s, 0);
  const crossTotal = Object.entries(cross).reduce((s, [k, v]) => v ? s + (crossCatalog.find(c => c.id === k)?.price || 0) : s, 0);
  
  const tempTotalForShipping = subtotal + bumpsTotal + crossTotal;
  const isFreeShipping = tempTotalForShipping >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : (shipping?.options?.[0]?.price || 0);
  
  const total = tempTotalForShipping + shippingCost;
  const count = items.reduce((s, i) => s + i.qty, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - tempTotalForShipping);

  const activeBumps = Object.entries(bumps).filter(([_, v]) => v).map(([k]) => bumpsCatalog.find(b => b.id === k)).filter(Boolean);
  const activeCross = Object.entries(cross).filter(([_, v]) => v).map(([k]) => crossCatalog.find(c => c.id === k)).filter(Boolean);

  return (
    <CartCtx.Provider value={{
      items, addItem, removeItem, updateQty, clear,
      bumps, toggleBump, cross, toggleCross,
      shipping, calcShipping, shippingLoading,
      subtotal, bumpsTotal, crossTotal, shippingCost, total, count,
      activeBumps, activeCross,
      remainingForFreeShipping, freeShippingThreshold: FREE_SHIPPING_THRESHOLD, isFreeShipping,
      bumpsCatalog, crossCatalog
    }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
