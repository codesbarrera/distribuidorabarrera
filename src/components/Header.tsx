import React from 'react';
import { ShoppingCart, ShieldCheck, Truck, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  dataSource: 'api' | 'local';
  onToggleDataSource: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  dataSource,
  onToggleDataSource
}) => {
  return (
    <header className="bg-[#0f2a43] text-white sticky top-0 z-40 shadow-md">
      <div className="bg-[#091b2b] text-xs text-blue-200 py-1.5 px-4 text-center font-medium flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-emerald-400" /> Envíos rápidos en Bogotá y Soacha
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Mayorista desde 6 unidades
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Pago seguro por Nequi
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              ⚽ Distribuidora Barrera
            </h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
              Mayor y Detal
            </span>
          </div>
          <p className="text-sm text-blue-200 mt-0.5">
            Las mejores camisetas de fútbol de Bogotá y Soacha
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDataSource}
            className="text-xs bg-white/10 hover:bg-white/20 text-blue-100 px-3 py-2 rounded-lg transition border border-white/10 flex items-center gap-1.5"
            title="Cambiar origen de datos (Google Sheets o Catálogo Local)"
          >
            <span>Fuente: {dataSource === 'api' ? 'Google Sheets' : 'Local'}</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition border border-white/10 flex items-center gap-1.5 text-sm font-medium"
            title="Panel de Administración"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-900/30 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-extrabold border-2 border-[#0f2a43] animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
