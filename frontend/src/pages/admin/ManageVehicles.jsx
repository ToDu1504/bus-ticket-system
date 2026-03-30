import { useState, useEffect } from 'react';
import { getVehiclesApi, createVehicleApi, deleteVehicleApi } from '../../api/adminApi';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ license_plate: '', vehicle_type: '', total_seats: '' });

  useEffect(() => { loadVehicles(); }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try { setVehicles(await getVehiclesApi()); }
    catch (e) { console.error('Lỗi tải xe', e); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createVehicleApi(formData);
      setFormData({ license_plate: '', vehicle_type: '', total_seats: '' });
      loadVehicles();
    } catch (e) { alert('Thêm xe thất bại'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa xe này vĩnh viễn?')) return;
    try {
      await deleteVehicleApi(id);
      loadVehicles();
    } catch (e) { alert('Xóa xe thất bại'); }
  };

  return (
    <div className="space-y-6 transition-opacity duration-500">
      <div className="bg-white/90 backdrop-blur border border-slate-100 p-6 rounded-2xl shadow-xl shadow-slate-200/50">
        <h2 className="text-xl font-bold text-slate-800 mb-4">✨ Cấp Biển - Đăng Ký Xe Mới</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-semibold text-slate-600 block mb-1">Biển Số Xe</label>
            <input type="text" required value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" placeholder="VD: 51H-123.45" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm font-semibold text-slate-600 block mb-1">Loại Xe</label>
            <input type="text" placeholder="Limousine, Giường Nằm..." value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm font-semibold text-slate-600 block mb-1">Số Lượng Ghế</label>
            <input type="number" required value={formData.total_seats} onChange={e => setFormData({...formData, total_seats: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition" />
          </div>
          <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white font-bold h-[46px] px-8 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5">
            + Lưu Thông Tin Xe
          </button>
        </form>
      </div>

      <div className="bg-white/90 backdrop-blur border border-slate-100 p-0 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="p-4 font-bold">Mã</th>
              <th className="p-4 font-bold">Biển Số Xe</th>
              <th className="p-4 font-bold">Dòng Xe</th>
              <th className="p-4 font-bold">Sức Chứa</th>
              <th className="p-4 font-bold text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan="5" className="p-8 text-center text-slate-400 font-semibold animate-pulse">Đang nạp dữ liệu gara...</td></tr> : 
              vehicles.length > 0 ? vehicles.map(v => (
              <tr key={v.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 text-slate-800 font-medium">#{v.id}</td>
                <td className="p-4">
                  <div className="inline-block bg-amber-100/80 border border-amber-300 text-amber-900 font-mono font-bold px-3 py-1 rounded-md shadow-sm">
                    {v.license_plate}
                  </div>
                </td>
                <td className="p-4 text-slate-600">{v.vehicle_type}</td>
                <td className="p-4 text-slate-800 font-bold">{v.total_seats} <span className="text-slate-400 text-xs font-normal">chỗ</span></td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg transition border border-red-100 shadow-sm">
                    Xóa Khỏi Gara
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="p-8 text-center text-slate-400">Không có xe nào. Hãy điền form bên trên để khởi tạo đội xe!</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageVehicles;
