const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  hotels: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/api/hotels${q ? '?' + q : ''}`);
    },
    get: (id) => apiFetch(`/api/hotels/${id}`),
    create: (data) => apiFetch('/api/hotels', { method: 'POST', body: JSON.stringify(data) }),
    roomTypes: (hotelId) => apiFetch(`/api/hotels/${hotelId}/room-types`),
    createRoomType: (hotelId, data) =>
      apiFetch(`/api/hotels/${hotelId}/room-types`, { method: 'POST', body: JSON.stringify(data) }),
  },
  availability: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/api/availability${q ? '?' + q : ''}`);
    },
    create: (data) => apiFetch('/api/availability', { method: 'POST', body: JSON.stringify(data) }),
  },
  reservations: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiFetch(`/api/reservations${q ? '?' + q : ''}`);
    },
    create: (data) => apiFetch('/api/reservations', { method: 'POST', body: JSON.stringify(data) }),
    stats: () => apiFetch('/api/reservations/stats'),
  },
};
