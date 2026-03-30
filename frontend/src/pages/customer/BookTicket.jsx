import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createInvoiceApi } from '../../api/invoiceApi';
import axiosInstance from '../../api/axiosInstance';
import { BusFront, Clock, Ticket, Banknote, CreditCard, Smartphone, CheckCircle, Navigation } from 'lucide-react';

const BookTicket = () => {
  const query = new URLSearchParams(useLocation().search);
  const tripId = query.get('tripId');
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatNumber, setSeatNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    if (tripId) loadTrip();
    else { alert('Không tìm thấy chuyến xe nào!'); navigate('/'); }
  }, [tripId, navigate]);

  const loadTrip = async () => {
    try {
      const { data } = await axiosInstance.get(`/trips/${tripId}`);
      setTrip(data);
    } catch (e) {
      console.error(e);
      alert('Chuyến xe không khả dụng. Vui lòng thử lại.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!seatNumber) return alert('Vui lòng nhập hoặc chọn 1 số ghế.');
    try {
      await createInvoiceApi({
        trip_id: tripId,
        seat_number: seatNumber,
        total_price: trip.price,
        payment_method: paymentMethod
      });
      alert('Mua vé thành công! Chúc bạn có một hành trình an toàn.');
      navigate('/my-invoices'); 
    } catch (e) {
      alert(e.response?.data?.message || 'Có lỗi xảy ra trên hệ thống thanh toán.');
    }
  };

  if (loading) return <div className="text-center p-20 text-on-surface-variant font-bold animate-pulse text-lg">Đang tải biểu mẫu mua vé...</div>;
  if (!trip) return null;

  return (
    <div className="max-w-5xl mx-auto p-8 md:p-12 mb-12 bg-surface-container-lowest shadow-2xl rounded-3xl mt-10 ghost-border transition-all animate-fade-in-up">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary p-3 rounded-xl text-on-primary">
          <Ticket size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Thanh toán vé xe</h2>
          <p className="text-on-surface-variant font-medium text-sm mt-1">Hoàn tất thủ tục đặt vé nhanh chóng và an toàn</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Summary — navy dark panel */}
        <div className="bg-primary rounded-[1.5rem] p-8 relative overflow-hidden flex flex-col shadow-xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container opacity-30 rounded-full blur-[60px]" />
          
          <h3 className="text-lg font-bold text-on-primary mb-6 border-b border-on-primary/20 pb-4 relative z-10 flex items-center gap-2">
            <BusFront size={20} className="text-on-primary-container" /> Chi tiết hành trình
          </h3>
          
          <div className="space-y-3 relative z-10 flex-1">
            <div className="flex justify-between items-center bg-on-primary/10 p-4 rounded-xl border border-on-primary/10">
              <span className="font-semibold text-on-primary/70 flex items-center gap-2"><Navigation size={16}/> Tuyến đường</span>
              <span className="font-bold text-on-primary text-right max-w-[55%] truncate">{trip.Route?.origin} ➔ {trip.Route?.destination}</span>
            </div>
            <div className="flex justify-between items-center bg-on-primary/10 p-4 rounded-xl border border-on-primary/10">
              <span className="font-semibold text-on-primary/70 flex items-center gap-2"><Clock size={16}/> Khởi hành</span>
              <span className="font-bold text-on-primary">{new Date(trip.departure_time).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month: '2-digit', year: 'numeric'})}</span>
            </div>
            <div className="flex justify-between items-center bg-on-primary/10 p-4 rounded-xl border border-on-primary/10">
              <span className="font-semibold text-on-primary/70 flex items-center gap-2"><BusFront size={16}/> Biển số xe</span>
              <span className="font-bold text-on-primary uppercase font-mono">{trip.Vehicle?.license_plate}</span>
            </div>
          </div>

          <div className="flex justify-between items-end pt-6 mt-6 border-t border-on-primary/20 relative z-10">
            <span className="text-on-primary/70 font-bold text-base">Tổng thanh toán</span>
            <span className="text-4xl font-black text-on-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(trip.price)}</span>
          </div>
        </div>

        {/* Right Side: Inputs */}
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <label className="text-sm font-bold text-on-surface block mb-3 flex items-center gap-2">
              Chọn số ghế <span className="text-outline text-xs font-normal">(Từ 1 - {Math.max(1, trip.Vehicle?.total_seats || 50)})</span>
            </label>
            <input 
              type="number" min="1" max={trip.Vehicle?.total_seats || 50} required 
              value={seatNumber} onChange={e => setSeatNumber(e.target.value)} 
              className="w-full border-2 border-outline-variant bg-surface-container-high focus:bg-surface-container-lowest p-4 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-2xl font-black text-center text-primary transition-all placeholder:text-outline-variant/60 placeholder:font-medium" 
              placeholder="VD: 12" 
            />
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface block mb-3">Kênh Thanh Toán</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'cash', label: 'Tiền mặt', icon: <Banknote size={22}/> },
                { id: 'banking', label: 'Chuyển khoản', icon: <CreditCard size={22}/> },
                { id: 'momo', label: 'Ví Momo', icon: <Smartphone size={22}/> }
              ].map(method => (
                <button 
                  key={method.id} 
                  onClick={() => setPaymentMethod(method.id)} 
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 ${
                    paymentMethod === method.id 
                    ? 'border-2 border-primary bg-primary text-on-primary shadow-lg shadow-primary/30' 
                    : 'border-2 border-outline-variant text-on-surface bg-surface-container-high hover:border-primary/50 hover:bg-surface-container-low'
                  }`}
                >
                  {method.icon}
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleBook} 
            className="w-full btn-primary-gradient text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 flex justify-center items-center gap-3"
          >
            <CheckCircle size={22} /> XÁC NHẬN ĐẶT VÉ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
