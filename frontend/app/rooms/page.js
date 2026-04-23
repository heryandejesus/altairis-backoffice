'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';

function RoomTypeForm({ hotels, onSubmit, loading }) {
  const [form, setForm] = useState({
    hotelId: hotels[0]?.id || '',
    name: '', description: '', capacity: 2, basePrice: 100, totalRooms: 10, isActive: true,
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      hotelId: Number(form.hotelId),
      capacity: Number(form.capacity),
      basePrice: Number(form.basePrice),
      totalRooms: Number(form.totalRooms),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Hotel</label>
        <select className="input" required value={form.hotelId} onChange={e => set('hotelId', e.target.value)}>
          {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Nombre del tipo</label>
        <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Suite Presidencial" />
      </div>
      <div>
        <label className="label">Descripción</label>
        <textarea className="input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Capacidad</label>
          <input className="input" type="number" min={1} required value={form.capacity} onChange={e => set('capacity', e.target.value)} />
        </div>
        <div>
          <label className="label">Precio base (€)</label>
          <input className="input" type="number" min={0} step={0.01} required value={form.basePrice} onChange={e => set('basePrice', e.target.value)} />
        </div>
        <div>
          <label className="label">Total habitaciones</label>
          <input className="input" type="number" min={1} required value={form.totalRooms} onChange={e => set('totalRooms', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Crear tipo'}
        </button>
      </div>
    </form>
  );
}

export default function RoomsPage() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.hotels.list({ pageSize: 100 })
      .then(res => {
        setHotels(res.data || []);
        if (res.data?.length > 0) setSelectedHotel(res.data[0].id);
      })
      .catch(console.error);
  }, []);

  const loadRoomTypes = useCallback(async () => {
    if (!selectedHotel) return;
    setLoading(true);
    try {
      const data = await api.hotels.roomTypes(selectedHotel);
      setRoomTypes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedHotel]);

  useEffect(() => { loadRoomTypes(); }, [loadRoomTypes]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await api.hotels.createRoomType(data.hotelId, data);
      setShowModal(false);
      if (data.hotelId === Number(selectedHotel)) loadRoomTypes();
    } catch {
      alert('Error al crear el tipo de habitación');
    } finally {
      setSaving(false);
    }
  };

  const selectedHotelName = hotels.find(h => h.id === Number(selectedHotel))?.name || '';

  return (
    <div>
      <PageHeader
        title="Habitaciones"
        description="Tipos de habitación por propiedad hotelera"
        action={
          hotels.length > 0 && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo tipo
            </button>
          )
        }
      />

      <div className="mb-5">
        <select
          className="input max-w-xs"
          value={selectedHotel}
          onChange={e => setSelectedHotel(e.target.value)}
        >
          {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      <div className="card">
        {selectedHotelName && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">{selectedHotelName}</h2>
            <p className="text-xs text-gray-400">{roomTypes.length} tipos de habitación</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Tipo', 'Descripción', 'Capacidad', 'Precio base', 'Total habitaciones', 'Estado'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Cargando...</td></tr>
              ) : roomTypes.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No hay tipos de habitación para este hotel</td></tr>
              ) : roomTypes.map(rt => (
                <tr key={rt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{rt.name}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{rt.description}</td>
                  <td className="px-6 py-4 text-gray-600">{rt.capacity} pers.</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    €{rt.basePrice?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{rt.totalRooms}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${rt.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {rt.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Tipo de Habitación">
        {hotels.length > 0 && <RoomTypeForm hotels={hotels} onSubmit={handleCreate} loading={saving} />}
      </Modal>
    </div>
  );
}
