'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';

function AvailabilityForm({ hotels, onSubmit, loading }) {
  const [hotelId, setHotelId] = useState(hotels[0]?.id || '');
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState({ roomTypeId: '', date: '', availableRooms: 1, price: 100 });

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
      hotelId: Number(hotelId),
      roomTypeId: Number(form.roomTypeId),
      date: form.date,
      availableRooms: Number(form.availableRooms),
      price: Number(form.price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div>
        <label className="label">Fecha</label>
        <input className="input" type="date" required value={form.date} onChange={e => set('date', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Habitaciones disponibles</label>
          <input className="input" type="number" min={0} required value={form.availableRooms} onChange={e => set('availableRooms', e.target.value)} />
        </div>
        <div>
          <label className="label">Precio (€)</label>
          <input className="input" type="number" min={0} step={0.01} required value={form.price} onChange={e => set('price', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Guardar disponibilidad'}
        </button>
      </div>
    </form>
  );
}

export default function AvailabilityPage() {
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({ hotelId: '', date: '' });
  const [availabilities, setAvailabilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.hotels.list({ pageSize: 100 }).then(res => setHotels(res.data || [])).catch(console.error);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.hotelId) params.hotelId = filters.hotelId;
      if (filters.date) params.date = filters.date;
      const data = await api.availability.list(params);
      setAvailabilities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await api.availability.create(data);
      setShowModal(false);
      load();
    } catch {
      alert('Error al guardar la disponibilidad');
    } finally {
      setSaving(false);
    }
  };

  const setFilter = (k, v) => setFilters(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader
        title="Disponibilidad"
        description="Consulta y gestión de disponibilidad por fecha y propiedad"
        action={
          hotels.length > 0 && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Registrar disponibilidad
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
          <input
            className="input max-w-[180px]"
            type="date"
            value={filters.date}
            onChange={e => setFilter('date', e.target.value)}
          />
          {(filters.hotelId || filters.date) && (
            <button className="btn-secondary" onClick={() => setFilters({ hotelId: '', date: '' })}>
              Limpiar filtros
            </button>
          )}
          <span className="text-sm text-gray-500">{availabilities.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Hotel', 'Tipo de habitación', 'Fecha', 'Disponibles', 'Precio'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Cargando...</td></tr>
              ) : availabilities.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay registros de disponibilidad</td></tr>
              ) : availabilities.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700">{a.hotelName}</td>
                  <td className="px-6 py-4 text-gray-600">{a.roomTypeName}</td>
                  <td className="px-6 py-4 text-gray-600">{a.date}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      a.availableRooms === 0
                        ? 'bg-red-50 text-red-700'
                        : a.availableRooms <= 3
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {a.availableRooms} hab.
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    €{Number(a.price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Registrar Disponibilidad">
        {hotels.length > 0 && <AvailabilityForm hotels={hotels} onSubmit={handleCreate} loading={saving} />}
      </Modal>
    </div>
  );
}
