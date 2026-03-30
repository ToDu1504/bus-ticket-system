import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../../api/authApi';
import { loginSuccess } from '../../store/authSlice';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginApi({ email, password });
      dispatch(loginSuccess(data));
      
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'staff') navigate('/staff');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-surface-container-lowest rounded-2xl ghost-border card-lift">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Đăng nhập tài khoản</h2>
        <p className="text-on-surface-variant font-medium text-sm">Chào mừng bạn quay lại hệ thống BusGo</p>
      </div>
      
      {error && <div className="bg-error-container text-on-error-container font-bold p-3 mb-6 rounded-xl text-center text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">Địa chỉ Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-outline" />
            </div>
            <input 
              type="email" required placeholder="vidu@gmail.com" 
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">Mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-outline" />
            </div>
            <input 
              type="password" required placeholder="••••••••" 
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
            />
          </div>
        </div>
        
        <button type="submit" className="w-full btn-primary-gradient py-3.5 rounded-xl font-bold text-lg flex justify-center items-center gap-2 mt-4">
          <LogIn size={20} /> Đăng Nhập
        </button>
      </form>
      
      <p className="mt-8 text-center text-on-surface-variant font-medium text-sm">
        Chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:text-primary-container hover:underline transition-colors">Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default Login;
