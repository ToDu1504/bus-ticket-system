import { useState, useEffect } from 'react';
import { getMyInvoicesApi, cancelInvoiceApi } from '../../api/invoiceApi';
import { Ticket, FileText, Navigation, Clock, Hash, CreditCard, XCircle, CheckCircle } from 'lucide-react';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setInvoices(await getMyInvoicesApi()); }
    catch (e) { console.error('Lỗi tải vé', e); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé này không? Hành động này sẽ không thể hoàn tác.')) return;
    try {
      await cancelInvoiceApi(id);
      alert('Đã hủy vé thành công.');
      load();
    } catch (e) { alert(e.response?.data?.message || 'Hủy vé thất bại'); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8 pb-12 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-surface-container-lowest p-8 rounded-3xl ghost-border card-lift">
        <div className="bg-primary/10 p-4 rounded-2xl text-primary">
          <Ticket size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Lịch sử giao dịch</h2>
          <p className="text-on-surface-variant font-medium mt-1">Quản lý và theo dõi tất cả các chuyến đi của bạn</p>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-20 font-bold animate-pulse text-outline-variant text-xl">Đang đồng bộ dữ liệu vé...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center p-20 bg-surface-container-lowest rounded-3xl ghost-border border-dashed flex flex-col items-center">
          <div className="w-24 h-24 bg-surface-container-low rounded-full flex justify-center items-center mb-6">
            <FileText size={40} className="text-outline" />
          </div>
          <p className="font-bold text-on-surface text-xl">Bạn chưa có giao dịch nào</p>
          <p className="text-on-surface-variant font-medium mt-2">Hãy đặt chuyến đi đầu tiên để trải nghiệm dịch vụ của BusGo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map(inv => (
            <div key={inv.id} className="relative bg-surface-container-lowest rounded-2xl p-6 ghost-border card-lift-hover flex flex-col group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className={`absolute top-6 right-6 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 ${
                inv.booking_status === 'booked' ? 'bg-green-100 text-green-700' : 
                inv.booking_status === 'pending' ? 'bg-primary-container text-on-primary-container' : 
                'bg-error-container text-on-error-container'
              }`}>
                {inv.booking_status === 'booked' && <CheckCircle size={14}/>}
                {inv.booking_status === 'pending' && <Clock size={14}/>}
                {inv.booking_status === 'cancelled' && <XCircle size={14}/>}
                {inv.booking_status === 'pending' ? 'ĐANG CHỜ' : inv.booking_status}
              </div>
              
              <h3 className="text-lg font-bold text-on-surface pr-24 mb-6 flex items-center gap-2">
                <Navigation size={18} className="text-primary flex-shrink-0"/>
                <span className="truncate">{inv.Trip?.Route?.origin}</span>
                <span className="text-outline">➔</span>
                <span className="truncate">{inv.Trip?.Route?.destination}</span>
              </h3>
              
              <div className="bg-surface-container-high p-5 rounded-xl space-y-3.5 text-sm border border-outline-variant/40 mb-6 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface font-semibold flex items-center gap-2"><Clock size={16} className="text-primary"/> Khởi hành</span>
                  <span className="font-bold text-on-surface">{new Date(inv.Trip?.departure_time).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month: '2-digit', year: 'numeric'})}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface font-semibold flex items-center gap-2"><Hash size={16} className="text-primary"/> Mã vé</span>
                  <span className="font-mono font-bold text-on-surface bg-surface-container-lowest border border-outline-variant/30 px-2 py-0.5 rounded-lg">#{inv.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface font-semibold flex items-center gap-2"><Ticket size={16} className="text-primary"/> Số ghế</span>
                  <span className="font-black text-primary text-xl bg-primary/10 px-3 py-0.5 rounded-lg">{inv.seat_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface font-semibold flex items-center gap-2"><CreditCard size={16} className="text-primary"/> Thanh toán</span>
                  <span className="uppercase font-bold text-on-surface">{inv.payment_method}</span>
                </div>
                
                <div className="flex justify-between items-center pt-3.5 mt-1 border-t border-outline-variant/40">
                  <span className="text-on-surface font-bold text-base">Tổng tiền</span>
                  <span className="font-black text-on-surface text-xl">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inv.total_price)}</span>
                </div>
              </div>

              {(inv.booking_status === 'booked' || inv.booking_status === 'pending') && (
                <button 
                  onClick={() => handleCancel(inv.id)} 
                  className="w-full mt-auto bg-error/10 text-error font-bold py-3 rounded-xl border border-error/20 hover:bg-error hover:text-on-error transition-colors duration-300 flex justify-center items-center gap-2"
                >
                  <XCircle size={18} /> Yêu Cầu Hủy Vé
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;
