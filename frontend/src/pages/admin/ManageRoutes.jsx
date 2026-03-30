import { useState, useEffect } from 'react';
import { getRoutesApi, createRouteApi, deleteRouteApi } from '../../api/adminApi';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ origin: '', destination: '', distance_km: '', duration_min: '', base_price: '' });

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    try { setRoutes(await getRoutesApi()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createRouteApi(formData);
      setFormData({ origin: '', destination: '', distance_km: '', duration_min: '', base_price: '' });
      load();
    } catch (e) { alert('Thêm tuyến đường thất bại'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa điểm tuyến này?')) return;
    try { await deleteRouteApi(id); load(); } catch (e) { alert('Lỗi: Cần phải xóa các chuyến đi liên đới trước.'); }
  };

  return (
    <div className="space-y-6 transition-opacity duration-500">
      <div className="bg-white/90 backdrop-blur border border-slate-100 p-6 rounded-2xl shadow-xl shadow-slate-200/50">
        <h2 className="text-xl font-bold text-slate-800 mb-4">✨ Khai Báo Tuyến Đường Mới</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Điểm Xuất Phát (Khu vực)</label>
            <input type="text" required value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" placeholder="VD: TP Hồ Chí Minh" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Điểm Đến</label>
            <input type="text" required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" placeholder="VD: Đà Lạt" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Giá Mặc Định ($)</label>
            <input type="number" required value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Cự ly Tuyến (km)</label>
            <input type="number" value={formData.distance_km} onChange={e => setFormData({...formData, distance_km: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Thời gian di chuyển (Phút)</label>
            <input type="number" value={formData.duration_min} onChange={e => setFormData({...formData, duration_min: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold h-[46px] rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5">
              + Thiết Lập Tuyến
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/90 backdrop-blur border border-slate-100 p-0 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="p-4 font-bold">Hành Trình Di Chuyển</th>
              <th className="p-4 font-bold">Cước Cơ Bản</th>
              <th className="p-4 font-bold hidden md:table-cell">Thông Số Khoảng Cách</th>
              <th className="p-4 font-bold text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-semibold animate-pulse">Đang phân tích biểu đồ tuyến...</td></tr> : 
              routes.length > 0 ? routes.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition group">
                <td className="p-4 font-bold text-slate-800 text-lg">
                  {r.origin} <span className="text-indigo-300 px-2 group-hover:text-indigo-500 transition">➔</span> {r.destination}
                </td>
                <td className="p-4 text-emerald-600 font-bold text-xl">${r.base_price}</td>
                <td className="p-4 text-slate-500 text-sm hidden md:table-cell">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">📏 {r.distance_km || '?'} km</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">⏱️ {r.duration_min || '?'} phút</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg transition border border-red-100 shadow-sm">
                    Xóa Tuyến
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="4" className="p-8 text-center text-slate-400">Không có tuyến đường nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageRoutes;
