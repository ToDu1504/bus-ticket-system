import { useState, useEffect } from 'react';
import { getUsersApi, getRoutesApi, getVehiclesApi, getTripsApi } from '../../api/adminApi';
import { Users, Map, BusFront, CalendarDays, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, routes: 0, vehicles: 0, trips: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, routes, vehicles, trips] = await Promise.all([
          getUsersApi(), getRoutesApi(), getVehiclesApi(), getTripsApi()
        ]);
        setStats({
          users: users.length,
          routes: routes.length,
          vehicles: vehicles.length,
          trips: trips.length
        });
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { label: 'Tổng số Người dùng', value: stats.users, icon: <Users size={24}/>, bg: 'bg-primary/10', iconColor: 'text-primary' },
    { label: 'Tuyến đường khả dụng', value: stats.routes, icon: <Map size={24}/>, bg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Số lượng Đầu xe', value: stats.vehicles, icon: <BusFront size={24}/>, bg: 'bg-amber-100', iconColor: 'text-amber-600' },
    { label: 'Tổng các Chuyến đi', value: stats.trips, icon: <CalendarDays size={24}/>, bg: 'bg-rose-100', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Banner */}
      <div className="bg-primary text-on-primary rounded-3xl p-8 relative overflow-hidden card-lift">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container opacity-30 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-container opacity-20 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl" style={{background:'rgba(255,255,255,0.15)'}}>
                <Activity size={22} className="text-white"/>
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest" style={{color:'rgba(255,255,255,0.6)'}}>Trạng thái: Hoạt động tốt</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Chào mừng, Quản Trị Viên 👋</h2>
            <p className="max-w-xl font-medium" style={{color:'rgba(255,255,255,0.7)'}}>Hệ thống đang chạy ổn định. Quản lý doanh thu, chuyến xe và kiểm soát hệ thống từ bảng điều khiển này.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl flex-shrink-0" style={{background:'rgba(255,255,255,0.12)'}}>
            <TrendingUp size={20} className="text-white opacity-70"/>
            <span className="text-white font-bold text-sm">Hệ thống đang trực tuyến</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-10 text-center text-on-surface-variant font-bold animate-pulse">Hệ thống đang đồng bộ dữ liệu chỉ số...</div>
        ) : (
          metrics.map((metric, i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl ghost-border card-lift-hover flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-on-surface-variant mb-1">{metric.label}</p>
                <h3 className="text-4xl font-black text-on-surface">{metric.value}</h3>
              </div>
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${metric.bg} ${metric.iconColor} shadow-sm`}>
                {metric.icon}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
