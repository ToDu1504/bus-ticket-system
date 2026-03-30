import { useState, useEffect } from 'react';
import { getUsersApi, updateUserRoleApi, deleteUserApi } from '../../api/adminApi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setUsers(await getUsersApi()); }
    catch (e) { console.error('Failed to load users', e); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRoleApi(id, newRole);
      load();
    } catch (e) { alert('Sự cố: Không thể đổi quyền'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cảnh báo rủi ro: Xóa vĩnh viễn người dùng này khỏi hệ thống? Dữ liệu con có thể bị mất mát.')) return;
    try { await deleteUserApi(id); load(); }
    catch (e) { alert('Xóa tài khoản thất bại do bảo vệ dữ liệu'); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white/90 backdrop-blur border border-slate-100 p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">👥 Quản Lý Người Dùng & Chức Vụ</h2>
          <p className="text-slate-500 text-sm mt-1">Nâng quyền nhân viên hoặc kỷ luật xóa tài khoản vi phạm chính sách.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg font-bold text-indigo-700 shadow-sm shrink-0">
          Tổng số tài khoản: {users.length}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur border border-slate-100 p-0 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="p-4 font-bold">Thành Viên</th>
              <th className="p-4 font-bold">Liên Hệ Giao Dịch</th>
              <th className="p-4 font-bold">Phân Quyền Định Danh</th>
              <th className="p-4 font-bold text-center">Tình Trạng</th>
              <th className="p-4 font-bold text-right">Can Thiệp Ngay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan="5" className="p-8 text-center text-slate-400 font-semibold animate-pulse">Đang định vị thông tin người dùng trong CSDL...</td></tr> : 
              users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-800 text-lg">{u.full_name}</div>
                  <div className="text-xs text-slate-400">UID: #{u.id}</div>
                </td>
                <td className="p-4 text-slate-600 text-sm">
                  <div className="font-semibold">{u.email}</div>
                  <div className="text-slate-500">SĐT: {u.phone || 'Chưa cung cấp'}</div>
                </td>
                <td className="p-4">
                  <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="border border-slate-200 bg-slate-50 hover:bg-white px-3 py-1.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm font-bold text-indigo-700 uppercase cursor-pointer">
                    <option value="customer">KHÁCH HÀNG</option>
                    <option value="staff">NHÂN VIÊN</option>
                    <option value="admin">QUẢN TRỊ</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider ${u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {u.is_active ? 'TỐT' : 'KHÓA'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg transition border border-red-100 shadow-sm">
                    Trục Xuất 🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
