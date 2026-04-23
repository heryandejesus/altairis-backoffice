import { api } from '../lib/api';

async function getStats() {
  try {
    return await api.reservations.stats();
  } catch {
    return { totalHotels: 0, todayCheckIns: 0, activeReservations: 0, occupancyRate: 0, monthRevenue: 0 };
  }
}

async function getRecentReservations() {
  try {
    const res = await api.reservations.list({ pageSize: 5 });
    return res.data || [];
  } catch {
    return [];
  }
}

function StatCard({ title, value, subtitle, color, icon }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const [stats, reservations] = await Promise.all([getStats(), getRecentReservations()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen de operaciones en tiempo real</p>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-8 xl:grid-cols-4">
        <StatCard
          title="Total Hoteles"
          value={stats.totalHotels}
          subtitle="Propiedades activas"
          color="text-brand-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          title="Check-ins Hoy"
          value={stats.todayCheckIns}
          subtitle="Llegadas previstas"
          color="text-emerald-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          title="Ocupación"
          value={`${stats.occupancyRate}%`}
          subtitle="Reservas activas"
          color="text-amber-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          title="Ingresos Mes"
          value={`€${stats.monthRevenue?.toLocaleString('es-ES', { maximumFractionDigits: 0 }) ?? 0}`}
          subtitle="Mes en curso"
          color="text-purple-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Últimas Reservas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Huésped</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No hay reservas disponibles
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{r.guestName}</p>
                        <p className="text-xs text-gray-400">{r.guestEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{r.hotelName}</td>
                    <td className="px-6 py-4 text-gray-600">{r.checkIn}</td>
                    <td className="px-6 py-4 text-gray-600">{r.checkOut}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      €{r.totalPrice?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        r.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status === 'Confirmed' ? 'Confirmada' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
