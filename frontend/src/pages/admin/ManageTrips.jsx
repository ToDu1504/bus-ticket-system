import { useState, useEffect } from 'react';
import { getTripsApi, createTripApi, deleteTripApi, getRoutesApi, getVehiclesApi } from '../../api/adminApi';

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ route_id: '', vehicle_id: '', departure_time: '', available_seats: '', price: '' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [tripsData, routesData, vehiclesData] = await Promise.all([
        getTripsApi(), getRoutesApi(), getVehiclesApi()
      ]);
      setTrips(tripsData); setRoutes(routesData); setVehicles(vehiclesData);
    } catch (e) { console.error('Lỗi tải dữ liệu chuyến xe', e); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createTripApi(formData);
      setFormData({ route_id: '', vehicle_id: '', departure_time: '', available_seats: '', price: '' });
      loadAll();
    } catch (e) { alert('Mở bán chuyến xe thất bại'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hủy bỏ lịch trình chuyến xe này? Lịch sử vé đã mua sẽ bị ảnh hưởng.')) return;
    try { await deleteTripApi(id); loadAll(); } catch (e) { alert('Hủy chuyến thất bại'); }
  };

  return (
    <div className="space-y-6 transition-opacity duration-500">
      <div className="bg-white/90 backdrop-blur border border-slate-100 p-6 rounded-2xl shadow-xl shadow-slate-200/50">
        <h2 className="text-xl font-bold text-slate-800 mb-4">✨ Xếp Lịch & Mở Bán Chuyến Mới</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Chọn Tuyến Đường</label>
            <select required value={formData.route_id} onChange={e => setFormData({...formData, route_id: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition">
              <option value="" disabled>-- Vui lòng chọn tuyến --</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.origin} ➔ {r.destination}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Phân Công Xe Khách</label>
            <select required value={formData.vehicle_id} onChange={e => setFormData({...formData, vehicle_id: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition">
              <option value="" disabled>-- Điều động xe --</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.license_plate} ({v.total_seats} chỗ)</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Thời Gian Khởi Hành</label>
            <input type="datetime-local" required value={formData.departure_time} onChange={e => setFormData({...formData, departure_time: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Giá Vé Mở Bán ($)</label>
            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Khởi Tạo Số Ghế Trống</label>
            <input type="number" required value={formData.available_seats} onChange={e => setFormData({...formData, available_seats: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" placeholder="Bắt đầu bằng tổng số ghế xe" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold h-[46px] rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5">
              + Công Bố Chuyến Đi
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/90 backdrop-blur border border-slate-100 p-0 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="p-4 font-bold hidden md:table-cell">Mã Chuyến</th>
              <th className="p-4 font-bold">Hành Trình Giao Dịch</th>
              <th className="p-4 font-bold">Lịch Trình Tàu Xe</th>
              <th className="p-4 font-bold">Giám Sát Định Vị Xe</th>
              <th className="p-4 font-bold">Trạng Thái Bán</th>
              <th className="p-4 font-bold text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan="6" className="p-8 text-center text-slate-400 font-semibold animate-pulse">Đang đồng bộ dữ liệu hệ thống bán vé...</td></tr> : 
              trips.length > 0 ? trips.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 text-slate-400 text-sm hidden md:table-cell">#{t.id}</td>
                <td className="p-4 font-bold text-slate-800 text-lg">
                  {t.Route?.origin || '?'} <span className="text-indigo-300 px-1">➔</span> {t.Route?.destination || '?'}
                </td>
                <td className="p-4 text-slate-600 text-sm">
                  <div className="font-semibold">{new Date(t.departure_time).toLocaleString()}</div>
                  <div className="text-emerald-600 font-bold mt-1">${t.price} / Vé</div>
                </td>
                <td className="p-4 text-slate-600 text-sm">
                  <span className="bg-amber-100/80 border border-amber-300 text-amber-900 px-2 py-0.5 rounded font-bold font-mono text-xs">Biển số: {t.Vehicle?.license_plate || '?'}</span>
                  <div className="mt-1 font-medium">{t.available_seats} <span className="text-slate-400 font-normal">chỗ trống</span></div>
                </td>
                <td className="p-4">
                  <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {t.status === 'scheduled' ? 'Đã lên lịch' : t.status === 'completed' ? 'Hoàn thành' : t.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg transition border border-red-100 shadow-sm">
                    Gỡ Bỏ Lịch
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="p-8 text-center text-slate-400">Không có chuyến đi nào được công bố.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageTrips;
