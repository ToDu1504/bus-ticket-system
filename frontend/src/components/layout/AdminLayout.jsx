import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { LayoutDashboard, BusFront, Map, CalendarDays, Users, LogOut, Settings, BusIcon } from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const navItems = [
    { to: '/admin', label: 'Bảng Điều Khiển', icon: <LayoutDashboard size={20} />, end: true },
    { to: '/admin/vehicles', label: 'Quản Lý Gara Xe', icon: <BusIcon size={20} /> },
    { to: '/admin/routes', label: 'Quản Lý Tuyến Đường', icon: <Map size={20} /> },
    { to: '/admin/trips', label: 'Quản Lý Chuyến Đi', icon: <CalendarDays size={20} /> },
    { to: '/admin/users', label: 'Quản Lý Thành Viên', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen font-sans overflow-hidden" style={{background:'var(--color-surface)'}}>
      {/* Sidebar */}
      <aside className="w-72 flex flex-col shadow-2xl relative z-10 flex-shrink-0" style={{background:'var(--color-primary)'}}>
        {/* Logo */}
        <div className="px-6 py-8 border-b" style={{borderColor:'rgba(255,255,255,0.08)'}}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{background:'rgba(255,255,255,0.12)'}}>
              <BusFront size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">BusGo Admin</h2>
              <p className="text-xs font-medium mt-0.5" style={{color:'rgba(255,255,255,0.5)'}}>Bảng điều khiển hệ thống</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? 'text-white font-bold shadow-lg'
                    : 'hover:text-white'
                }`
              }
              style={({ isActive }) => isActive 
                ? {background:'rgba(255,255,255,0.16)', color:'white'} 
                : {color:'rgba(255,255,255,0.55)'}
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t" style={{borderColor:'rgba(255,255,255,0.08)'}}>
          <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl" style={{background:'rgba(255,255,255,0.06)'}}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-primary text-sm flex-shrink-0" style={{background:'rgba(255,255,255,0.9)'}}>
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.full_name || 'Quản Trị Viên'}</p>
              <p className="text-xs truncate" style={{color:'rgba(255,255,255,0.4)'}}>Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm"
            style={{color:'rgba(255,120,120,0.9)', background:'rgba(186,26,26,0.12)'}}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(186,26,26,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(186,26,26,0.12)'; }}
          >
            <LogOut size={18} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-outline-variant/20 shadow-sm flex-shrink-0">
          <h1 className="text-lg font-bold text-on-surface tracking-tight">Khu Vực Hệ Thống</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-on-surface">{user?.full_name || 'Quản Trị Viên'}</p>
              <p className="text-xs text-on-surface-variant">Đang hoạt động</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
