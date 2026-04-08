import { useState, useEffect } from 'react';
import { 
  getStatsOverviewApi, 
  getRevenueByMonthApi, 
  getTopRoutesApi, 
  getBookingStatusApi, 
  getRecentInvoicesApi 
} from '../../api/adminApi';
import { 
  TrendingUp, 
  DollarSign, 
  Ticket, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  ArrowRight,
  Download,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ManageStats = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({});
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [timeRange, setTimeRange] = useState('all'); // all, 7d, 30d, custom
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (timeRange !== 'all') {
        const now = new Date();
        let start = new Date();
        if (timeRange === '7d') start.setDate(now.getDate() - 7);
        if (timeRange === '30d') start.setDate(now.getDate() - 30);
        
        if (timeRange === 'custom' && customRange.start) {
          params.startDate = customRange.start;
          params.endDate = customRange.end || new Date().toISOString().split('T')[0];
        } else if (timeRange !== 'custom') {
          params.startDate = start.toISOString().split('T')[0];
          params.endDate = now.toISOString().split('T')[0];
        }
      }

      const [ov, md, tr, bs, ri] = await Promise.all([
        getStatsOverviewApi(params),
        getRevenueByMonthApi(), // Monthly trend always shows 12 months for context
        getTopRoutesApi(params),
        getBookingStatusApi(params),
        getRecentInvoicesApi()
      ]);
      setOverview(ov);
      setMonthlyData(md);
      setTopRoutes(tr);
      setBookingStatus(bs);
      setRecentInvoices(ri);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const handleExportCSV = () => {
    const headers = ['Tuyến đường', 'Lượt đặt', 'Doanh thu'];
    const rows = topRoutes.map(r => [r.route, r.bookings, r.revenue]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bao-cao-thong-ke-${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const revenueChartData = {
    labels: monthlyData.map(d => d.label),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: monthlyData.map(d => d.revenue),
        backgroundColor: 'rgba(0, 38, 83, 0.8)',
        borderColor: '#002653',
        borderWidth: 1,
        borderRadius: 8,
      }
    ],
  };

  const statusChartData = {
    labels: ['Thành công', 'Đang chờ', 'Đã hủy'],
    datasets: [
      {
        data: [bookingStatus.booked || 0, bookingStatus.pending || 0, bookingStatus.cancelled || 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, font: { weight: '600' } } },
      tooltip: { padding: 12, cornerRadius: 8 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-3xl ghost-border card-lift">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Thống Kê Hệ Thống</h2>
          <p className="text-on-surface-variant font-medium">Báo cáo tình hình kinh doanh thời gian thực.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: '7d', label: '7 ngày qua' },
              { id: '30d', label: '30 ngày qua' },
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  timeRange === range.id ? 'bg-white shadow-md text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-3 bg-white ghost-border rounded-xl font-bold text-sm hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <Download size={18} /> Xuất CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl ghost-border card-lift flex flex-col justify-between border-b-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-green-50 text-green-600"><DollarSign size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface-variant mb-1">Doanh thu xác nhận</p>
            <h3 className="text-2xl font-black text-on-surface">{formatCurrency(overview.confirmedRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl ghost-border card-lift flex flex-col justify-between border-b-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-primary/5 text-primary"><Ticket size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface-variant mb-1">Tổng lượt đặt vé</p>
            <h3 className="text-2xl font-black text-on-surface">{overview.totalBookings}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl ghost-border card-lift flex flex-col justify-between border-b-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600"><AlertCircle size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface-variant mb-1">Vé đang chờ</p>
            <h3 className="text-2xl font-black text-on-surface">{overview.pendingBookings}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl ghost-border card-lift flex flex-col justify-between border-b-4 border-rose-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600"><XCircle size={24} /></div>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface-variant mb-1">Vé đã hủy</p>
            <h3 className="text-2xl font-black text-on-surface">{overview.cancelledBookings}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl ghost-border card-lift">
          <h4 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-8">
            <TrendingUp size={22} className="text-primary" /> Doanh thu 12 tháng gần đây
          </h4>
          <div className="h-80 w-full">
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl ghost-border card-lift">
          <h4 className="text-xl font-bold text-on-surface mb-8 italic text-on-surface-variant">Phân bổ trạng thái</h4>
          <div className="h-64 relative">
            <Doughnut data={statusChartData} options={{...chartOptions, scales:{}}} />
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-on-surface-variant">
                   <div className="w-3 h-3 rounded-full bg-green-500"></div> Thành công
                </span>
                <span className="font-bold">{overview.totalBookings ? Math.round((bookingStatus.booked / overview.totalBookings) * 100) : 0}%</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-on-surface-variant">
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div> Chờ xác nhận
                </span>
                <span className="font-bold">{overview.totalBookings ? Math.round((bookingStatus.pending / overview.totalBookings) * 100) : 0}%</span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-on-surface-variant">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div> Đã hủy
                </span>
                <span className="font-bold">{overview.totalBookings ? Math.round((bookingStatus.cancelled / overview.totalBookings) * 100) : 0}%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl ghost-border card-lift overflow-hidden">
          <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-primary/5">
            <div>
              <h4 className="text-xl font-bold text-on-surface">Top 5 Tuyến Đường Hiệu Quả</h4>
              <p className="text-xs text-on-surface-variant font-bold uppercase mt-1">Dữ liệu đã được tổng hợp theo tuyến</p>
            </div>
          </div>
          <div className="p-0 overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-8 py-4">Tuyến đường</th>
                    <th className="px-8 py-4 text-center">Vé bán</th>
                    <th className="px-8 py-4 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {topRoutes.map((route, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-black text-primary">{route.route}</div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="font-bold">{route.bookings}</span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-on-surface">
                        {formatCurrency(route.revenue)}
                      </td>
                    </tr>
                  ))}
                  {topRoutes.length === 0 && (
                    <tr><td colSpan="3" className="px-8 py-10 text-center text-on-surface-variant italic">Không có dữ liệu trong khoảng thời gian này</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl ghost-border card-lift overflow-hidden flex flex-col">
           <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between">
              <h4 className="text-xl font-bold text-on-surface">Giao Dịch Mới Nhất</h4>
              <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                 Xem tất cả <ArrowRight size={16} />
              </button>
           </div>
           <div className="divide-y divide-outline-variant/5 flex-1 overflow-auto max-h-[400px]">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                         inv.booking_status === 'booked' ? 'bg-green-500' :
                         inv.booking_status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                         {inv.User?.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                         <p className="font-bold text-sm text-on-surface">{inv.User?.full_name || 'Khách lẻ'}</p>
                         <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-tighter">
                            {inv.Trip?.Route ? `${inv.Trip.Route.origin} → ${inv.Trip.Route.destination}` : 'Chuyến đi'}
                         </p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-sm text-on-surface">{formatCurrency(inv.total_price)}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold">{new Date(inv.created_at).toLocaleDateString('vi-VN')}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStats;
