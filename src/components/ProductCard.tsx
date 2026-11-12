import React from 'react';
import { Product } from '../types';
import { FALLBACK_IMAGE } from '../data/mockProducts';
import { ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  index: number;
  selectedTalla: string;
  onSelectTalla: (talla: string) => void;
  onAddToCart: () => void;
  onOpenDetail: () => void;
}

const formatCOP = (n: number) => '$' + Number(n).toLocaleString('es-CO');

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  selectedTalla,
  onSelectTalla,
  onAddToCart,
  onOpenDetail,
}) => {
  const tallas = product.tallas && product.tallas.length ? product.tallas : ['S', 'M', 'L', 'XL'];
  const agotado = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group ${
        agotado ? 'opacity-60' : ''
      }`}
    >
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer" onClick={onOpenDetail}>
        <motion.img
          src={product.imagen || FALLBACK_IMAGE}
          alt={product.nombre}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <span className="bg-[#0f2a43]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wide">
            {product.equipo}
          </span>
          {product.precio_mayorista && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md">
              Mayor: {formatCOP(product.precio_mayorista)}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail();
          }}
          className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100 z-10"
          title="Ver detalle"
        >
          <Eye className="w-4 h-4" />
        </motion.button>

        {agotado && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between bg-gradient-to-b from-white to-slate-50/50">
        <div>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            {product.tipo || 'Fútbol'} · {product.calidad || 'AAA'}
          </span>
          <h3
            className="font-extrabold text-slate-900 text-sm mt-1 line-clamp-1 cursor-pointer hover:text-[#0f2a43] transition"
            onClick={onOpenDetail}
          >
            {product.nombre}
          </h3>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base font-black text-[#0f2a43]">
              {formatCOP(product.precio_detal)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Precio Detal</span>
          </div>

          <div className="mt-3">
            <div className="text-[11px] text-slate-500 mb-1.5 font-semibold">Tallas disponibles:</div>
            <div className="flex gap-1.5 flex-wrap">
              {tallas.map((t) => {
                const cleanT = t.trim();
                const isSelected = cleanT === selectedTalla;
                return (
                  <button
                    key={cleanT}
                    type="button"
                    onClick={() => onSelectTalla(cleanT)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                      isSelected
                        ? 'bg-[#0f2a43] text-white shadow-md scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {cleanT}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={agotado}
          onClick={onAddToCart}
          className={`mt-4 w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-md ${
            agotado
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#0f2a43] hover:bg-[#183d61] text-white shadow-blue-900/20'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {agotado ? 'Agotado' : 'Agregar al Carrito'}
        </motion.button>
      </div>
    </motion.div>
  );
};
