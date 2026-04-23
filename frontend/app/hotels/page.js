'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';

const STARS = [1, 2, 3, 4, 5];

function HotelForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '', address: '', city: '', country: 'Spain',
    stars: 3, contactEmail: '', contactPhone: '', isActive: true,
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, stars: Number(form.stars) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Nombre del hotel</label>
        <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Ciudad</label>
          <input className="input" required value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <label className="label">País</label>
          <input className="input" required value={form.country} onChange={e => set('country', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Dirección</label>
        <input className="input" required value={form.address} onChange={e => set('address', e.target.value)} />
      </div>
      <div>
        <label className="label">Categoría</label>
        <select className="input" value={form.stars} onChange={e => set('stars', e.target.value)}>
          {STARS.map(s => <option key={s} value={s}>{s} estrella{s > 1 ? 's' : ''}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Email de contacto</label>
          <input className="input" type="email" required value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} />
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input className="input" required value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Crear hotel'}
        </button>
      </div>
    </form>
  );
}

export default function HotelsPage() {
  const [data, setData] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.hotels.list({ search, page, pageSize: 10 });
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (hotelData) => {
    setSaving(true);
    try {
      await api.hotels.create(hotelData);
      setShowModal(false);
      load();
    } catch (e) {
      alert('Error al crear el hotel');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Hoteles"
        description="Gestión del catálogo de propiedades hoteleras"
        action={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo hotel
          </button>
        }
      />

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="input pl-9"
              placeholder="Buscar por nombre o ciudad..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <span className="text-sm text-gray-500">{data.total} hoteles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Hotel', 'Ciudad', 'País', 'Categoría', 'Contacto', 'Estado'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Cargando...</td></tr>
              ) : data.data.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No se encontraron hoteles</td></tr>
              ) : data.data.map(h => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.address}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{h.city}</td>
                  <td className="px-6 py-4 text-gray-600">{h.country}</td>
                  <td className="px-6 py-4">
                    <span className="text-amber-500">{'★'.repeat(h.stars)}</span>
                    <span className="text-gray-200">{'★'.repeat(5 - h.stars)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{h.contactEmail}</p>
                    <p className="text-xs text-gray-400">{h.contactPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${h.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {h.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {data.page} de {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
              <button className="btn-secondary" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
            </div>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Hotel">
        <HotelForm onSubmit={handleCreate} loading={saving} />
      </Modal>
    </div>
  );
}
