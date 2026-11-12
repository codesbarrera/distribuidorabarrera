/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, CustomerData } from './types';
import { INITIAL_PRODUCTS, GOOGLE_SCRIPT_URL } from './data/mockProducts';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartSidebar } from './components/CartSidebar';
import { NequiModal } from './components/NequiModal';
import { Footer } from './components/Footer';
import { Search, AlertCircle, Loader2, Sparkles, ShoppingBag, CheckCircle2, Trophy, Flame, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedEquipo, setSelectedEquipo] = useState('');

  const [tallasSeleccionadas, setTallasSeleccionadas] = useState<{ [key: number]: string }>({});
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('db_carrito');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customer, setCustomer] = useState<CustomerData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cedula: '',
    direccion: '',
    barrio: '',
    ciudad: 'Soacha',
    notas: ''
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNequiOpen, setIsNequiOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [orderSuccessBanner, setOrderSuccessBanner] = useState<string | null>(null);

  // Fetch products from Google Sheets API by default
  useEffect(() => {
    fetchProductsFromApi();
  }, []);

  const fetchProductsFromApi = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const data = await res.json();
      if (data.ok && Array.isArray(data.productos)) {
        const mapped: Product[] = data.productos.map((p: any) => ({
          nombre: p.nombre || p.Nombre || 'Camiseta',
          equipo: p.equipo || p.Equipo || 'General',
          tipo: p.tipo || p.Tipo || 'Fútbol',
          precio_detal: Number(p.precio_detal || p.precio || p.Precio || 70000),
          precio_mayorista: Number(p.precio_mayorista || p.precio_mayor || 65000),
          imagen: p.imagen || p.Imagen || '',
          tallas: Array.isArray(p.tallas) ? p.tallas : (typeof p.tallas === 'string' ? p.tallas.split(',') : ['S', 'M', 'L', 'XL']),
          stock: Number(p.stock !== undefined ? p.stock : 10),
          descripcion: p.descripcion || p.Descripcion || ''
        }));
        setProducts(mapped);
      } else {
        setErrorMsg('No se pudieron cargar los datos de Google Sheets. Usando catálogo guardado.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Error de conexión con Google Sheets. Usando catálogo por defecto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('db_carrito', JSON.stringify(cart));
  }, [cart]);

  const handleSelectTalla = (productIndex: number, talla: string) => {
    setTallasSeleccionadas((prev) => ({ ...prev, [productIndex]: talla }));
  };

  const handleAddToCart = (product: Product, index: number, customTalla?: string, custom?: { nombre: string; numero: string }) => {
    const tallas = product.tallas && product.tallas.length ? product.tallas : ['S', 'M', 'L', 'XL'];
    const talla = customTalla || tallasSeleccionadas[index] || tallas[0];
    const key = `${product.nombre}-${product.equipo}-${talla}${custom ? `-${custom.nombre}-${custom.numero}` : ''}`.trim();

    const existing = cart.find((i) => i.key === key);
    if (existing) {
      setCart(cart.map((i) => (i.key === key ? { ...i, cantidad: i.cantidad + 1 } : i)));
    } else {
      setCart([
        ...cart,
        {
          key,
          nombre: product.nombre,
          equipo: product.equipo,
          precio: product.precio_detal,
          imagen: product.imagen,
          talla: talla.trim(),
          cantidad: 1,
          personalizacion: custom
        }
      ]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.key === key) {
            const newQty = item.cantidad + delta;
            return newQty > 0 ? { ...item, cantidad: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (key: string) => {
    setCart(cart.filter((item) => item.key !== key));
  };

  const handleCustomerChange = (field: keyof CustomerData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOrder = (emailStatus: string) => {
    const WHATSAPP_NUMBER = '573005177418';
    let msg = '📋 *NUEVO PEDIDO - DISTRIBUIDORA BARRERA*\n\n';
    msg += `👤 *Cliente:* ${customer.nombre} ${customer.apellido}\n`;
    msg += `📧 *Correo:* ${customer.email}\n`;
    msg += `📱 *Teléfono:* ${customer.telefono}\n`;
    if (customer.cedula) msg += `🆔 *Cédula/NIT:* ${customer.cedula}\n\n`;

    msg += `📍 *ENVÍO:*\n`;
    msg += `• Dirección: ${customer.direccion} (${customer.barrio})\n`;
    msg += `• Ciudad: ${customer.ciudad}\n`;
    if (customer.notas) msg += `• Notas: ${customer.notas}\n\n`;

    msg += `🛍️ *PRODUCTOS SELECCIONADOS:*\n`;
    let subtotal = 0;
    let totalUnidades = 0;
    cart.forEach((item) => {
      const sub = item.precio * item.cantidad;
      subtotal += sub;
      totalUnidades += item.cantidad;
      msg += `• *${item.cantidad}x* ${item.nombre} (${item.equipo}) [Talla: ${item.talla}]`;
      if (item.personalizacion) {
        msg += ` (Estampado: ${item.personalizacion.nombre} #${item.personalizacion.numero})`;
      }
      msg += ` - $${sub.toLocaleString('es-CO')}\n`;
    });

    const isMayorista = totalUnidades >= 6;
    const discount = isMayorista ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    if (isMayorista) {
      msg += `\n🔥 *(Lleva ${totalUnidades} unidades - Aplica 10% Descuento Mayorista)*\n`;
    }

    msg += `\n💰 *TOTAL A PAGAR: $${total.toLocaleString('es-CO')}*\n`;
    msg += `\n💜 *PAGO NEQUI (302 834 5744):* Ya realicé la transferencia al Nequi y adjunto mi comprobante.`;

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });

    setOrderSuccessBanner(`¡Pedido procesado con éxito! ${emailStatus}. Abriendo WhatsApp...`);
    setTimeout(() => {
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(msg);
      window.open(url, '_blank');
      setIsCartOpen(false);
    }, 1500);
  };

  const equiposDisponibles = Array.from(new Set(products.map((p) => p.equipo).filter(Boolean)));
  const tiposDisponibles = Array.from(new Set(products.map((p) => p.tipo).filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.nombre + ' ' + p.equipo).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = !selectedTipo || p.tipo === selectedTipo;
    const matchesEquipo = !selectedEquipo || p.equipo === selectedEquipo;
    return matchesSearch && matchesTipo && matchesEquipo;
  });

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-slate-950 selection:bg-[#0f2a43] selection:text-white">
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onRefreshSheet={fetchProductsFromApi}
        loadingApi={loading}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <AnimatePresence>
          {orderSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs md:text-sm flex items-center gap-3 shadow-lg"
            >
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-600 animate-bounce" />
              <span className="font-bold">{orderSuccessBanner}</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs flex items-center gap-2 shadow"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-[#0f2a43] via-[#153452] to-[#1f4a75] rounded-3xl text-white p-6 md:p-12 mb-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border border-white/10"
        >
          <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none">
            <Trophy className="w-96 h-96 text-white" />
          </div>
          <div className="max-w-xl z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-md">
              <Flame className="w-4 h-4 text-emerald-400 animate-pulse" /> Sincronizado Directo con Google Sheets
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Camisetas de Fútbol <span className="text-emerald-400">Mayor y Detal</span>
            </h2>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Actualiza precios, stock y nuevos equipos directamente en tu Google Sheet y presiona <strong className="text-white">"Actualizar Sheet"</strong> en la parte superior. Envíos en Bogotá y Soacha.
            </p>
          </div>
          <div className="z-10 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center flex flex-col gap-3 min-w-[220px] shadow-2xl">
            <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">Descuento Mayorista</span>
            <span className="text-2xl font-black text-emerald-400">¡10% OFF!</span>
            <span className="text-xs text-blue-100 font-medium">Llevando 6 o más unidades surtidas</span>
          </div>
        </motion.div>

        {/* Interactive Equipment / Team Quick Filter Pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedEquipo('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-sm ${
              !selectedEquipo
                ? 'bg-[#0f2a43] text-white shadow-md scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
            }`}
          >
            ⚽ Todos los Equipos
          </button>
          {equiposDisponibles.map((eq) => (
            <button
              key={eq}
              onClick={() => setSelectedEquipo(eq === selectedEquipo ? '' : eq)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-sm ${
                selectedEquipo === eq
                  ? 'bg-[#0f2a43] text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
              }`}
            >
              {eq.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search & Category Filters */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por nombre, equipo, buso o sudadera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f2a43] transition"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="text-xs md:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f2a43] transition cursor-pointer"
            >
              <option value="">Todas las prendas (Camisetas, Busos, Polos...)</option>
              {tiposDisponibles.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#0f2a43] animate-spin" />
            <p className="text-sm font-bold text-slate-600">Sincronizando catálogo desde Google Sheets...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm"
          >
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-2 animate-pulse" />
            <p className="font-extrabold text-slate-800 text-base">No se encontraron prendas</p>
            <p className="text-xs text-slate-500 mt-1">Prueba limpiando los filtros o buscando otro término</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || index}
                product={product}
                index={index}
                selectedTalla={tallasSeleccionadas[index] || product.tallas?.[0] || 'M'}
                onSelectTalla={(talla) => handleSelectTalla(index, talla)}
                onAddToCart={() => handleAddToCart(product, index)}
                onOpenDetail={() => setModalProduct(product)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Floating Mobile Cart Bar if items exist */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 inset-x-4 md:hidden z-40 bg-[#0f2a43] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10"
          >
            <div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                {cartCount} {cartCount === 1 ? 'prenda' : 'prendas'} en carrito
              </div>
              <div className="text-base font-black">${cartTotal.toLocaleString('es-CO')}</div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
            >
              Ver Carrito <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals & Slide-overs */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        customer={customer}
        onChangeCustomer={handleCustomerChange}
        onOpenNequiModal={() => setIsNequiOpen(true)}
        onSendOrder={handleSendOrder}
      />

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={(talla, custom) => handleAddToCart(modalProduct, 0, talla, custom)}
        />
      )}

      <NequiModal isOpen={isNequiOpen} onClose={() => setIsNequiOpen(false)} />
    </div>
  );
}
