import React, { useState } from 'react';
import { CartItem, CustomerData } from '../types';
import { FALLBACK_IMAGE } from '../data/mockProducts';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, QrCode, ShieldCheck, Sparkles, Mail, Loader2, CheckCircle2 } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  customer: CustomerData;
  onChangeCustomer: (field: keyof CustomerData, value: string) => void;
  onOpenNequiModal: () => void;
  onSendOrder: (emailStatus: string) => void;
}

const formatCOP = (n: number) => '$' + Number(n).toLocaleString('es-CO');

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  customer,
  onChangeCustomer,
  onOpenNequiModal,
  onSendOrder,
}) => {
  const [sendingEmail, setSendingEmail] = useState(false);

  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const isMayorista = totalItems >= 6;
  const discount = isMayorista ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    if (!customer.nombre || !customer.telefono || !customer.direccion || !customer.email) {
      alert('Por favor completa los campos obligatorios: Nombre, Correo, Celular y Dirección.');
      return;
    }

    setSendingEmail(true);
    setTimeout(() => {
      setSendingEmail(false);
      onSendOrder('Correo de confirmación enviado a ' + customer.email + ' y notificación enviada a codesbarrera@gmail.com');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-[#0f2a43] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-lg">Tu Carrito y Pedido</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Items list */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Camisetas Seleccionadas ({totalItems})
                </span>
                {isMayorista && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> ¡Precio Mayorista Aplicado! (-10%)
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Tu carrito está vacío</p>
                  <p className="text-xs text-slate-400 mt-1">Elige tus camisetas favoritas del catálogo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 relative group"
                    >
                      <img
                        src={item.imagen || FALLBACK_IMAGE}
                        alt={item.nombre}
                        className="w-14 h-16 object-cover rounded-lg bg-white border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{item.nombre}</h4>
                        <div className="text-[11px] text-slate-500">
                          {item.equipo} · Talla: <span className="font-bold text-slate-800">{item.talla}</span>
                        </div>
                        {item.personalizacion && (
                          <div className="text-[10px] text-pink-700 font-semibold mt-0.5 bg-pink-50 px-1.5 py-0.5 rounded w-fit">
                            Estampado: {item.personalizacion.nombre} #{item.personalizacion.numero}
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.key, -1)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5 text-slate-800">{item.cantidad}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.key, 1)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-extrabold text-xs text-[#0f2a43]">
                            {formatCOP(item.precio * item.cantidad)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.key)}
                        className="text-slate-400 hover:text-red-600 p-1.5 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Data Form */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Datos de Envío y Correo (Bogotá y Soacha)
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre *"
                    value={customer.nombre}
                    onChange={(e) => onChangeCustomer('nombre', e.target.value)}
                    className="text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Apellidos"
                    value={customer.apellido}
                    onChange={(e) => onChangeCustomer('apellido', e.target.value)}
                    className="text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Correo electrónico para confirmación *"
                      value={customer.email}
                      onChange={(e) => onChangeCustomer('email', e.target.value)}
                      className="text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Celular de contacto *"
                    value={customer.telefono}
                    onChange={(e) => onChangeCustomer('telefono', e.target.value)}
                    className="text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Cédula o NIT"
                    value={customer.cedula}
                    onChange={(e) => onChangeCustomer('cedula', e.target.value)}
                    className="text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Dirección exacta (Calle, Carrera, No.) *"
                  value={customer.direccion}
                  onChange={(e) => onChangeCustomer('direccion', e.target.value)}
                  className="text-xs p-2.5 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Barrio / Localidad"
                    value={customer.barrio}
                    onChange={(e) => onChangeCustomer('barrio', e.target.value)}
                    className="text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                  />
                  <select
                    value={customer.ciudad}
                    onChange={(e) => onChangeCustomer('ciudad', e.target.value)}
                    className="text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-[#0f2a43] focus:outline-none font-medium text-slate-800"
                  >
                    <option value="Soacha">Soacha</option>
                    <option value="Bogotá">Bogotá D.C.</option>
                    <option value="Cundinamarca">Cundinamarca (Otros)</option>
                  </select>
                </div>

                <textarea
                  placeholder="Notas adicionales (Ej: Color específico, indicaciones de entrega, nombre para estampar)"
                  value={customer.notas}
                  onChange={(e) => onChangeCustomer('notas', e.target.value)}
                  rows={2}
                  className="text-xs p-2.5 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#0f2a43] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Nequi Payment Box */}
            <div className="bg-[#fff0f5] border border-dashed border-[#ffb3cc] p-4 rounded-xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-[#e00063] font-bold text-xs mb-2">
                <QrCode className="w-4 h-4" /> Pagos Nequi: 302 834 5744
              </div>
              <img
                src="https://i.postimg.cc/QdS4mvtH/qr-nequi.jpg"
                alt="QR Nequi"
                className="w-28 h-28 object-cover rounded-lg mx-auto shadow-md mb-2 cursor-pointer hover:scale-105 transition"
                onClick={onOpenNequiModal}
                title="Ampliar QR Nequi"
              />
              <p className="text-[11px] text-slate-600">
                Realiza tu pago al Nequi <strong className="text-slate-900">302 834 5744</strong>. Recibirás tu confirmación de correo y WhatsApp.
              </p>
            </div>
          </div>

          {/* Footer Pricing & WhatsApp CTA */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatCOP(subtotal)}</span>
              </div>
              {isMayorista && (
                <div className="flex justify-between text-emerald-700">
                  <span>Descuento Mayorista (10%)</span>
                  <span className="font-bold">-{formatCOP(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío (Bogotá / Soacha)</span>
                <span className="text-emerald-600 font-semibold">Por coordinar</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#0f2a43] pt-2 border-t border-slate-200">
                <span>Total a Pagar</span>
                <span className="text-base">{formatCOP(total)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={cart.length === 0 || sendingEmail}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                cart.length === 0 || sendingEmail
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#25d366] hover:bg-[#22bf5b] text-white shadow-emerald-900/20 active:scale-95'
              }`}
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando confirmación...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Pedido y Correo 📱 (WhatsApp 300 517 7418)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
