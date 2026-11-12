import React, { useState } from 'react';
import { Product } from '../types';
import { FALLBACK_IMAGE } from '../data/mockProducts';
import { X, ShoppingBag, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (talla: string, custom?: { nombre: string; numero: string }) => void;
}

const formatCOP = (n: number) => '$' + Number(n).toLocaleString('es-CO');

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const tallas = product.tallas && product.tallas.length ? product.tallas : ['S', 'M', 'L', 'XL'];
  const [selectedTalla, setSelectedTalla] = useState(tallas[0]);
  const [addCustom, setAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');

  const handleAdd = () => {
    onAddToCart(
      selectedTalla,
      addCustom && (customName || customNumber)
        ? { nombre: customName.toUpperCase(), numero: customNumber }
        : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-slate-100 relative aspect-[4/5] md:aspect-auto">
            <img
              src={product.imagen || FALLBACK_IMAGE}
              alt={product.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
            <div className="absolute top-3 left-3 bg-[#0f2a43] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {product.equipo}
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                {product.tipo || 'Fútbol'}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {product.nombre}
              </h2>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[#0f2a43]">
                  {formatCOP(product.precio_detal)}
                </span>
                <span className="text-xs text-slate-500 font-medium">Precio Detal</span>
              </div>

              {product.precio_mayorista && (
                <div className="mt-1 text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  🔥 Precio Mayorista (6+ unid.): {formatCOP(product.precio_mayorista)} c/u
                </div>
              )}

              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {product.descripcion || 'Camiseta de alta calidad con telas transpirables, escudos bordados y acabados profesionales.'}
              </p>

              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Selecciona tu Talla:
                </label>
                <div className="flex gap-2 flex-wrap">
                  {tallas.map((t) => {
                    const cleanT = t.trim();
                    const isSelected = cleanT === selectedTalla;
                    return (
                      <button
                        key={cleanT}
                        type="button"
                        onClick={() => setSelectedTalla(cleanT)}
                        className={`px-3.5 py-2 rounded-lg font-bold text-sm border transition ${
                          isSelected
                            ? 'bg-[#0f2a43] text-white border-[#0f2a43] shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {cleanT}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addCustom}
                    onChange={(e) => setAddCustom(e.target.checked)}
                    className="w-4 h-4 text-[#0f2a43] rounded border-slate-300 focus:ring-[#0f2a43]"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" /> Añadir Estampado Personalizado (+ $10.000)
                  </span>
                </label>

                {addCustom && (
                  <div className="mt-3 grid grid-cols-2 gap-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      placeholder="Nombre (Ej: BARRERA)"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 rounded-lg uppercase"
                      maxLength={12}
                    />
                    <input
                      type="text"
                      placeholder="Número (Ej: 10)"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value)}
                      className="text-xs p-2.5 border border-slate-200 rounded-lg"
                      maxLength={2}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
              >
                Seguir Viendo
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0f2a43] hover:bg-[#183d61] text-white font-bold text-sm shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
