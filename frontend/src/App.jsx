import AppRouter from './router/AppRouter';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import { BusFront, Shield, Briefcase, UserCircle, Ticket, LogOut, LogIn, UserPlus } from 'lucide-react';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <AppRouter />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <header className="glass-header sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="bg-primary p-2 rounded-xl text-on-primary group-hover:bg-primary-container transition-colors card-lift">
            <BusFront size={24} strokeWidth={2.5}/>
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight text-primary">
            BusGo
          </h1>
        </div>
        
        <nav className="flex items-center gap-6 font-medium text-sm">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              {user?.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors">
                  <Shield size={18} /> Quản Trị
                </Link>
              )}
              {user?.role === 'staff' && (
                <Link to="/staff" className="flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors">
                  <Briefcase size={18} /> Nhân Viên
                </Link>
              )}
              
              <Link to="/profile" className="flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors">
                <UserCircle size={18} /> {user?.full_name?.split(' ').pop()}
              </Link>
              
              {user?.role === 'customer' && (
                <Link to="/my-invoices" className="flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors">
                  <Ticket size={18} /> Vé của tôi
                </Link>
              )}
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors font-bold"
              >
                <LogOut size={18} /> Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-on-surface font-semibold hover:text-primary transition-colors whitespace-nowrap px-4 py-2 rounded-xl hover:bg-surface-container-low text-sm"
              >
                <LogIn size={16} /> Đăng nhập
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-2 btn-primary-gradient px-5 py-2.5 rounded-xl font-bold whitespace-nowrap text-sm shadow-md shadow-primary/15"
              >
                <UserPlus size={16} /> Đăng ký
              </Link>
            </div>
          )}
        </nav>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative">
        <AppRouter />
      </main>
      
      <footer className="mt-auto py-8 text-center text-sm font-medium text-on-surface-variant border-t border-outline-variant/20 bg-surface-container-lowest">
        © 2026 BusGo.
      </footer>
    </div>
  );
}

export default App;
