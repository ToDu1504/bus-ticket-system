import { useState, useEffect } from 'react';
import { getAllInvoicesApi, cancelInvoiceApi, confirmInvoiceApi } from '../../api/invoiceApi';
import { getTripsApi } from '../../api/adminApi';
import { ClipboardList, Armchair, Hash, CheckCircle, XCircle, Clock, Users, Ticket, TrendingUp, CheckCheck } from 'lucide-react';

const StaffDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try { 
      const [invData, tripData] = await Promise.all([
        getAllInvoicesApi(),
        getTripsApi()
      ]);
      setInvoices(invData);
      setTrips(tripData);
    }
    catch (e) { console.error('Lỗi tải dữ liệu Staff', e); }
    finally { setLoading(false); }
  };

  const handleConfirmInvoice = async (id) => {
    try {
      await confirmInvoiceApi(id);
      loadData();
      alert('Đã xác nhận vé thành công!');
    } catch (e) {
      alert(e.response?.data?.message || 'Xác nhận vé thất bại');
    }
  };

  const handleCancelInvoice = async (id) => {
    if (!window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn hủy (Revoke) hóa đơn của khách hàng này không? Hành động này sẽ không thể hoàn tác.')) return;
    try {
      await cancelInvoiceApi(id);
      loadData(); 
      alert('Đã hủy vé của khách hàng thành công!');
    } catch (e) {
      alert(e.response?.data?.message || 'Hủy vé thất bại');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans p-4 pb-12 animate-fade-in-up">
      {/* Hero Header */}
      <div className="bg-primary text-on-primary rounded-3xl p-8 relative overflow-hidden card-lift">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container opacity-30 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">Trung Tâm Xử Lý Nghiệp Vụ</h2>
            <p className="max-w-2xl font-medium" style={{color:'rgba(255,255,255,0.7)'}}>Xác nhận vé đang chờ, kiểm soát chỗ ngồi và tra cứu hệ thống hóa đơn toàn bộ chuyến xe.</p>
          </div>
          <div className="flex gap-2 p-1.5 rounded-xl flex-shrink-0" style={{background:'rgba(255,255,255,0.12)'}}>
            <button 
              onClick={() => setActiveTab('invoices')} 
              className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
              style={activeTab === 'invoices' ? {background:'white', color:'var(--color-primary)'} : {color:'rgba(255,255,255,0.7)'}}
            >
              <ClipboardList size={18}/> Hóa Đơn
            </button>
            <button 
              onClick={() => setActiveTab('seats')} 
              className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
              style={activeTab === 'seats' ? {background:'white', color:'var(--color-primary)'} : {color:'rgba(255,255,255,0.7)'}}
            >
              <Armchair size={18}/> Tình Trạng Ghế
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'invoices' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border card-lift flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Ticket size={26}/></div>
              <div>
                <h3 className="text-4xl font-black text-on-surface">{invoices.length}</h3>
                <p className="text-on-surface-variant font-semibold text-sm uppercase tracking-widest mt-1">Tổng Giao Dịch</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border card-lift flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600"><Clock size={26}/></div>
              <div>
                <h3 className="text-4xl font-black text-on-surface">{invoices.filter(i => i.booking_status === 'pending').length}</h3>
                <p className="text-on-surface-variant font-semibold text-sm uppercase tracking-widest mt-1">Đang Chờ Xác Nhận</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border card-lift flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600"><TrendingUp size={26}/></div>
              <div>
                <h3 className="text-4xl font-black text-on-surface">
                  {new Intl.NumberFormat('vi-VN', { notation: 'compact', style: 'currency', currency: 'VND' }).format(
                    invoices.reduce((a, b) => a + Number(b.total_price), 0)
                  )}
                </h3>
                <p className="text-on-surface-variant font-semibold text-sm uppercase tracking-widest mt-1">Tổng Doanh Thu</p>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="bg-surface-container-lowest rounded-2xl ghost-border overflow-hidden card-lift">
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center gap-3">
              <ClipboardList size={20} className="text-primary"/>
              <h3 className="text-lg font-bold text-on-surface">Danh sách giao dịch mua vé</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold hidden md:table-cell">Mã Đơn</th>
                    <th className="px-6 py-4 font-bold">Người Đặt Vé</th>
                    <th className="px-6 py-4 font-bold">Chuyến Đi</th>
                    <th className="px-6 py-4 font-bold text-center">Ghế</th>
                    <th className="px-6 py-4 font-bold">Giao Dịch</th>
                    <th className="px-6 py-4 font-bold text-right">Trạng thái / Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading ? (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant font-semibold animate-pulse">Đang tải danh sách vé...</td></tr>
                  ) : invoices.length > 0 ? invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-on-surface-variant text-sm hidden md:table-cell">
                        #{inv.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-on-surface">{inv.User?.full_name || 'Khách vãng lai'}</div>
                        <div className="text-xs font-medium text-on-surface-variant">{inv.User?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-bold text-on-surface bg-primary/10 text-primary inline-block px-2 py-0.5 rounded-lg mb-1 text-xs">Chuyến #{inv.trip_id}</div>
                        <div className="text-xs font-medium text-on-surface-variant">{new Date(inv.created_at).toLocaleString('vi-VN')}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-primary text-2xl">{inv.seat_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-black text-on-surface text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inv.total_price)}</div>
                        <div className="text-xs uppercase font-bold text-on-surface-variant tracking-wider mt-0.5">
                          {inv.payment_method === 'cash' ? 'Tiền mặt' : inv.payment_method === 'banking' ? 'Chuyển khoản' : 'Ví Momo'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-y-2">
                        <span className={`px-3 py-1 mb-2 text-xs font-bold rounded-lg uppercase tracking-wide inline-flex items-center gap-1.5 ${
                          inv.booking_status === 'booked' ? 'bg-green-100 text-green-700' : 
                          inv.booking_status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-error-container text-on-error-container'
                        }`}>
                          {inv.booking_status === 'booked' && <CheckCircle size={12}/>}
                          {inv.booking_status === 'pending' && <Clock size={12}/>}
                          {inv.booking_status === 'pending' ? 'ĐANG CHỜ' : inv.booking_status}
                        </span>
                        
                        {inv.booking_status === 'pending' && (
                          <button 
                            onClick={() => handleConfirmInvoice(inv.id)} 
                            className="block w-full bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCheck size={14}/> Xác Nhận
                          </button>
                        )}
                        {(inv.booking_status === 'booked' || inv.booking_status === 'pending') && (
                          <button 
                            onClick={() => handleCancelInvoice(inv.id)} 
                            className="block w-full bg-error/10 text-error hover:bg-error hover:text-on-error border border-error/20 px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-1.5"
                          >
                            <XCircle size={14}/> Hủy Vé
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="px-6 py-12 text-center font-medium text-on-surface-variant">Không tìm thấy bất kỳ giao dịch nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'seats' && (
        <div className="bg-surface-container-lowest rounded-2xl ghost-border overflow-hidden card-lift">
          <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center gap-3">
            <Armchair size={20} className="text-primary"/>
            <h3 className="text-lg font-bold text-on-surface">Tình trạng chỗ ngồi các chuyến xe</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold hidden md:table-cell">Mã Chuyến</th>
                  <th className="px-6 py-4 font-bold">Tuyến Đường</th>
                  <th className="px-6 py-4 font-bold hidden lg:table-cell">Thời Gian</th>
                  <th className="px-6 py-4 font-bold">Xe Phân Công</th>
                  <th className="px-6 py-4 font-bold text-right">Ghế Trống / Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant font-semibold animate-pulse">Đang kiểm tra khoang xe...</td></tr>
                ) : trips.length > 0 ? trips.map(t => {
                  const totalSeats = t.Vehicle?.total_seats || 0;
                  const availableSeats = t.available_seats || 0;
                  const percentFull = totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;
                  
                  return (
                    <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-on-surface-variant text-sm hidden md:table-cell">#{t.id}</td>
                      <td className="px-6 py-4 font-bold text-on-surface">
                        {t.Route?.origin} <span className="text-outline mx-1">➔</span> {t.Route?.destination}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant hidden lg:table-cell font-medium">
                        {new Date(t.departure_time).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-surface-container-high border border-outline-variant/30 text-on-surface px-3 py-1 rounded-lg font-mono font-bold text-sm inline-block">
                          {t.Vehicle?.license_plate}
                        </span>
                        <div className="text-xs text-on-surface-variant mt-1 font-medium">{t.Vehicle?.vehicle_type}</div>
                      </td>
                      <td className="px-6 py-4 text-right w-56">
                        <div className="flex justify-end items-baseline gap-2 mb-2">
                          <span className={`text-3xl font-black ${
                            availableSeats === 0 ? 'text-error' : availableSeats <= 5 ? 'text-amber-500' : 'text-green-600'
                          }`}>{availableSeats}</span>
                          <span className="text-on-surface-variant font-bold">/ {totalSeats}</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              percentFull === 100 ? 'bg-error' : percentFull >= 80 ? 'bg-amber-400' : 'bg-green-500'
                            }`} 
                            style={{ width: `${Math.min(100, Math.max(0, percentFull))}%` }}
                          />
                        </div>
                        <div className="text-xs text-on-surface-variant font-medium text-right mt-1.5 uppercase tracking-wide">
                          {percentFull === 100 ? 'Hết vé' : percentFull >= 80 ? 'Sắp Đầy' : 'Còn Chỗ'}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="5" className="px-6 py-12 text-center font-medium text-on-surface-variant">Không có chuyến xe nào đang hoạt động.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default StaffDashboard;
