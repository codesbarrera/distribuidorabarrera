import React, { useState } from 'react';
import { Product } from '../types';
import { X, Plus, Trash2, Edit2, Save, Package, Lock, Unlock } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product, index: number) => void;
  onDeleteProduct: (index: number) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Product>({
    nombre: '',
    equipo: '',
    tipo: 'Fútbol Colombiano',
    precio_detal: 70000,
    precio_mayorista: 65000,
    imagen: '',
    tallas: ['S', 'M', 'L', 'XL'],
    stock: 10,
    descripcion: ''
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PIN is 2026 (or owner PIN)
    if (pin === '2026' || pin === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.equipo) {
      alert('Nombre y equipo son obligatorios.');
      return;
    }

    if (editingIndex !== null) {
      onUpdateProduct(formData, editingIndex);
      setEditingIndex(null);
    } else {
      onAddProduct(formData);
    }

    setFormData({
      nombre: '',
      equipo: '',
      tipo: 'Fútbol Colombiano',
      precio_detal: 70000,
      precio_mayorista: 65000,
      imagen: '',
      tallas: ['S', 'M', 'L', 'XL'],
      stock: 10,
      descripcion: ''
    });
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(products[index]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl relative animate-in fade-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f2a43] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg">Panel de Administración - Distribuidora Barrera</h2>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPin('');
              onClose();
            }}
            className="bg-white/15 hover:bg-white/25 p-2 rounded-full transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center my-auto">
            <div className="inline-flex bg-[#0f2a43]/10 text-[#0f2a43] p-4 rounded-full mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Acceso Restringido</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Ingresa el PIN de Administrador para gestionar el inventario y precios. (PIN por defecto: <strong>2026</strong>)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Ingresa el PIN (ej: 2026)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                className="w-full text-center tracking-widest text-lg p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2a43] focus:outline-none"
                maxLength={6}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-600 font-bold">PIN incorrecto. Inténtalo de nuevo (Prueba con 2026).</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#0f2a43] hover:bg-[#183d61] text-white py-3 rounded-xl font-bold text-sm shadow-lg transition"
              >
                Desbloquear Administrador 🔓
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-fit">
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                {editingIndex !== null ? '✏️ Editar Camiseta' : '➕ Agregar Nueva Camiseta'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nombre del Producto</label>
                  <input
                    type="text"
                    placeholder="Ej: Camiseta Millonarios Local"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Equipo / Selección</label>
                  <input
                    type="text"
                    placeholder="Ej: Millonarios"
                    value={formData.equipo}
                    onChange={(e) => setFormData({ ...formData, equipo: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tipo / Categoría</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Camiseta">Camiseta</option>
                      <option value="Buso">Buso</option>
                      <option value="Sudadera">Sudadera</option>
                      <option value="Polo">Polo</option>
                      <option value="Musculosa">Musculosa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Precio Detal ($COP)</label>
                    <input
                      type="number"
                      value={formData.precio_detal}
                      onChange={(e) => setFormData({ ...formData, precio_detal: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Precio Mayorista</label>
                    <input
                      type="number"
                      value={formData.precio_mayorista || 0}
                      onChange={(e) => setFormData({ ...formData, precio_mayorista: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">URL de Imagen</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Descripción</label>
                  <textarea
                    placeholder="Detalles de la camiseta..."
                    value={formData.descripcion || ''}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={2}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setFormData({
                          nombre: '',
                          equipo: '',
                          tipo: 'Camiseta',
                          precio_detal: 70000,
                          precio_mayorista: 65000,
                          imagen: '',
                          tallas: ['S', 'M', 'L', 'XL'],
                          stock: 10,
                          descripcion: ''
                        });
                      }}
                      className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> {editingIndex !== null ? 'Actualizar' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>

            {/* Products List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">
                📋 Inventario Actual ({products.length} productos)
              </h3>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {products.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imagen || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=200&q=80'}
                        alt={p.nombre}
                        className="w-12 h-14 object-cover rounded-lg bg-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{p.nombre}</h4>
                        <div className="text-[11px] text-slate-500">
                          {p.equipo} · Stock: <span className="font-bold text-slate-800">{p.stock}</span> · Detal: <span className="font-bold text-emerald-700">${Number(p.precio_detal).toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startEdit(idx)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(idx)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
