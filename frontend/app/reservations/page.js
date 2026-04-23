'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';

const STATUS_OPTIONS = ['Confirmed', 'Pending', 'Cancelled'];

function ReservationForm({ hotels, onSubmit, loading }) {
  const [hotelId, setHotelId] = useState(hotels[0]?.id || '');
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({
    roomTypeId: '', guestName: '', guestEmail: '', guestPhone: '',
    checkIn: '', checkOut: '', rooms: 1, totalPrice: 0, status: 'Confirmed', notes: '',
  });

  useEffect(() => {
    if (!hotelId) return;
    api.hotels.roomTypes(hotelId).then(data => {
      setRoomTypes(data);
      setForm(prev => ({ ...prev, roomTypeId: data[0]?.id || '' }));
    }).catch(console.error);
  }, [hotelId]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      hotelId: Number(hotelId),
      roomTypeId: Number(form.roomTypeId),
      rooms: Number(form.rooms),
      totalPrice: Number(form.totalPrice),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Hotel</label>
          <select className="input" required value={hotelId} onChange={e => setHotelId(e.target.value)}>
            {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Tipo de habitación</label>
          <select className="input" required value={form.roomTypeId} onChange={e => set('roomTypeId', e.target.value)}>
            {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Nombre del huésped</label>
        <input className="input" required value={form.guestName} onChange={e => set('guestName', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} />
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input className="input" required value={form.guestPhone} onChange={e => set('guestPhone', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Check-in</label>
          <input className="input" type="date" required value={form.checkIn} onChange={e => set('checkIn', e.target.value)} />
        </div>
        <div>
          <label className="label">Check-out</label>
          <input className="input" type="date" required value={form.checkOut} onChange={e => set('checkOut', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Habitaciones</label>
          <input className="input" type="number" min={1} required value={form.rooms} onChange={e => set('rooms', e.target.value)} />
        </div>
        <div>
          <label className="label">Precio total (€)</label>
          <input className="input" type="number" min={0} step={0.01} required value={form.totalPrice} onChange={e => set('totalPrice', e.target.value)} />
        </div>
        <div>
          <label className="label">Estado</label>
          <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Notas (opcional)</label>
        <textarea className="input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Crear reserva'}
        </button>
      </div>
    </form>
  );
}

const STATUS_STYLES = {
  Confirmed: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
  Confirmed: 'Confirmada',
  Pending: 'Pendiente',
  Cancelled: 'Cancelada',
};

export default function ReservationsPage() {
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({ hotelId: '', status: '' });
  const [data, setData] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.hotels.list({ pageSize: 100 }).then(res => setHotels(res.data || [])).catch(console.error);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 10 };
      if (filters.hotelId) params.hotelId = filters.hotelId;
      if (filters.status) params.status = filters.status;
      const res = await api.reservations.list(params);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (formData) => {
    setSaving(true);
    try {
      await api.reservations.create(formData);
      setShowModal(false);
      load();
    } catch {
      alert('Error al crear la reserva');
    } finally {
      setSaving(false);
    }
  };

  const setFilter = (k, v) => { setFilters(prev => ({ ...prev, [k]: v })); setPage(1); };

  return (
    <div>
      <PageHeader
        title="Reservas"
        description="Gestión y seguimiento de todas las reservas"
        action={
          hotels.length > 0 && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva reserva
            </button>
          )
        }
      />

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4 flex-wrap">
          <select className="input max-w-xs" value={filters.hotelId} onChange={e => setFilter('hotelId', e.target.value)}>
            <option value="">Todos los hoteles</option>
            {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          <select className="input max-w-[160px]" value={filters.status} onChange={e => setFilter('status', e.target.value)}>
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          {(filters.hotelId || filters.status) && (
            <button className="btn-secondary" onClick={() => setFilters({ hotelId: '', status: '' })}>
              Limpiar
            </button>
          )}
          <span className="text-sm text-gray-500">{data.total} reservas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Huésped', 'Hotel / Habitación', 'Check-in', 'Check-out', 'Hab.', 'Total', 'Estado'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Cargando...</td></tr>
              ) : data.data.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No hay reservas</td></tr>
              ) : data.data.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{r.guestName}</p>
                    <p className="text-xs text-gray-400">{r.guestEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{r.hotelName}</p>
                    <p className="text-xs text-gray-400">{r.roomTypeName}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{r.checkIn}</td>
                  <td className="px-6 py-4 text-gray-600">{r.checkOut}</td>
                  <td className="px-6 py-4 text-gray-600">{r.rooms}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    €{Number(r.totalPrice).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-500'}`}>
                      {STATUS_LABELS[r.status] || r.status}
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
              Página {data.page} de {data.totalPages} · {data.total} reservas
            </p>
            <div className="flex gap-2">
              <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
              <button className="btn-secondary" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
            </div>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva Reserva">
        {hotels.length > 0 && <ReservationForm hotels={hotels} onSubmit={handleCreate} loading={saving} />}
      </Modal>
    </div>
  );
}
