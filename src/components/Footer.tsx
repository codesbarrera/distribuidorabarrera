import React from 'react';
import { ShieldCheck, Truck, Sparkles, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#091b2b] text-white py-12 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            ⚽ Distribuidora Barrera
          </h2>
          <p className="text-xs text-blue-200 mt-2 leading-relaxed">
            Especialistas en la comercialización de camisetas de fútbol al por mayor y detal con entregas garantizadas en Bogotá, Soacha y toda Cundinamarca.
          </p>
          <div className="mt-4">
            <a
              href="/distribuidorabarrera.zip"
              download
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg transition active:scale-95"
            >
              <Download className="w-4 h-4" /> Descargar Proyecto (.zip) para GitHub
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider mb-3">
            Beneficios Mayoristas
          </h3>
          <ul className="text-xs text-blue-200 space-y-2">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Precios especiales desde 6 unidades.
            </li>
            <li className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" /> Despachos rápidos y seguros a domicilio.
            </li>
            <li className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" /> Personalización con nombres y números.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider mb-3">
            Contacto y Pedidos
          </h3>
          <p className="text-xs text-blue-200 leading-relaxed mb-2">
            WhatsApp de Ventas: <strong className="text-white">+57 300 517 7418</strong>
          </p>
          <p className="text-xs text-blue-200">
            Pagos Nequi (302 834 5744) y transferencias bancarias.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Distribuidora Barrera · Todos los derechos reservados.
      </div>
    </footer>
  );
};
