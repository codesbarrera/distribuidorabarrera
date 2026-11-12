import React from 'react';
import { X, QrCode, Copy, Check } from 'lucide-react';

interface NequiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NequiModal: React.FC<NequiModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const nequiNumber = '3028345744';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(nequiNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex bg-pink-100 text-[#e00063] p-3 rounded-full mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900">Pago por Nequi</h3>
        <p className="text-xs text-slate-500 mt-1">
          Distribuidora Barrera · Pagos Nequi
        </p>

        <div className="my-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <img
            src="https://i.postimg.cc/QdS4mvtH/qr-nequi.jpg"
            alt="QR Nequi Distribuidora Barrera"
            className="w-52 h-52 object-cover rounded-lg mx-auto shadow border border-slate-200"
          />
        </div>

        <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl mb-4">
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Número Nequi (Pagos)</div>
            <div className="font-mono font-extrabold text-slate-900 text-sm">302 834 5744</div>
          </div>
          <button
            onClick={handleCopy}
            className="bg-[#0f2a43] hover:bg-[#183d61] text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Realiza tu pago al Nequi <strong>302 834 5744</strong> y envía tu comprobante junto con el pedido por WhatsApp al <strong>300 517 7418</strong>.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-[#0f2a43] hover:bg-[#183d61] text-white py-3 rounded-xl font-bold text-sm transition"
        >
          Entendido, Volver al Carrito
        </button>
      </div>
    </div>
  );
};
