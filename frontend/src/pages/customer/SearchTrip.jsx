import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { MapPin, Calendar, Search, ArrowRight, Clock, Star, Users, CheckCircle, Ticket } from 'lucide-react';

const SearchTrip = () => {
  const [trips, setTrips] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { handleSearch(new Event('init')); }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/trips/search', {
        params: { origin, destination, date }
      });
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 animate-fade-in-up pb-12">
      {/* Hero Banner Banner */}
      <div className="bg-primary text-on-primary rounded-3xl p-10 pt-16 text-center relative overflow-hidden card-lift">
        <div className="absolute top-0 right-10 w-96 h-96 bg-primary-container opacity-50 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto mb-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Nhà Xe Eleven</h2>
          <p className="text-primary-fixed-dim text-xl font-medium">Hàng triệu chuyến đi an toàn, dễ dàng đặt vé vượt mọi giới hạn khoảng cách.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-surface-container-lowest/10 p-4 rounded-2xl backdrop-blur-xl border border-outline-variant/30 max-w-4xl mx-auto relative z-10 shadow-2xl">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim" size={20} />
            <input type="text" placeholder="Điểm Đi (VD: Ha Noi)" value={origin} onChange={e => setOrigin(e.target.value)}
                   className="w-full pl-12 pr-4 py-4 rounded-xl text-on-surface bg-surface-container-lowest font-bold outline-none border border-transparent focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all placeholder:text-outline" />
          </div>
          
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim" size={20} />
            <input type="text" placeholder="Điểm Đến (VD: Sai Gon)" value={destination} onChange={e => setDestination(e.target.value)}
                   className="w-full pl-12 pr-4 py-4 rounded-xl text-on-surface bg-surface-container-lowest font-bold outline-none border border-transparent focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all placeholder:text-outline" />
          </div>

          <div className="flex-1 relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed-dim" size={20} />
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                   className="w-full pl-12 pr-4 py-4 rounded-xl text-on-surface bg-surface-container-lowest font-bold outline-none border border-transparent focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all" />
          </div>

          <button type="submit" className="bg-tertiary hover:bg-tertiary-container text-on-tertiary rounded-xl px-8 flex items-center justify-center gap-2 font-bold transition-colors shadow-lg shadow-tertiary/20 py-4 md:py-0">
            <Search size={20}/> Tìm Xe
          </button>
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-3xl font-black text-on-surface tracking-tight">Các Chuyến Đang Mở Bán</h3>
          <span className="text-on-surface-variant font-medium text-sm">{trips.length} kết quả</span>
        </div>

        {loading ? (
          <div className="text-center p-20 font-bold text-outline-variant animate-pulse text-xl">Đang tải dữ liệu chuyến đi...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.length > 0 ? trips.map((t) => (
              <div key={t.id} className="bg-surface-container-lowest rounded-2xl p-6 ghost-border card-lift-hover flex flex-col h-full relative overflow-hidden group">
                {/* Accent Decorator */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-primary-container/10 text-primary-container px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider">
                    #{t.Route?.id || 'BusGo'}
                  </div>
                  <div className="text-tertiary-container font-black text-3xl tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
                  <span className="truncate">{t.Route?.origin}</span>
                  <ArrowRight size={18} className="text-outline flex-shrink-0" />
                  <span className="truncate">{t.Route?.destination}</span>
                </h4>
                
                <div className="space-y-3 text-sm mb-8 bg-primary p-5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-on-primary-container flex-shrink-0" />
                    <div className="flex-1 flex justify-between">
                      <span className="font-semibold text-on-primary/70">Khởi hành:</span>
                      <span className="font-bold text-on-primary">{new Date(t.departure_time).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month: '2-digit', year: 'numeric'})}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Star size={16} className="text-on-primary-container flex-shrink-0" />
                    <div className="flex-1 flex justify-between">
                      <span className="font-semibold text-on-primary/70">Loại xe:</span>
                      <span className="font-bold text-on-primary">{t.Vehicle?.vehicle_type || 'Limousine 34 Giường'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className={t.status === 'scheduled' ? 'text-green-400' : 'text-on-primary/40'} />
                    <div className="flex-1 flex justify-between">
                      <span className="font-semibold text-on-primary/70">Trạng thái:</span>
                      <span className="uppercase text-xs font-black bg-on-primary/15 text-on-primary border border-on-primary/20 px-2 py-0.5 rounded-lg">{t.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-3 mt-1 border-t border-on-primary/20">
                    <Users size={16} className="text-on-primary-container flex-shrink-0" />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-semibold text-on-primary/70">Ghế trống:</span>
                      <span className="font-black text-on-primary text-lg">{t.available_seats} <span className="text-xs text-on-primary/50 font-medium">/ {t.Vehicle?.total_seats || 34}</span></span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/book?tripId=${t.id}`)}
                  className="mt-auto w-full btn-primary-gradient py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
                >
                  <Ticket size={20} /> Đặt Vé Ngay
                </button>
              </div>
            )) : (
              <div className="col-span-full text-center p-24 bg-surface-container-lowest rounded-3xl ghost-border border-dashed">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-outline" />
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Chưa tìm thấy chuyến đi</h3>
                <p className="text-on-surface-variant font-medium text-lg max-w-md mx-auto">Thử thay đổi điểm đi, điểm đến hoặc ngày khởi hành để xem các chuyến xe khác.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTrip;
