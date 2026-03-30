import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../../api/authApi';
import { User, Phone, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ full_name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerApi(formData);
      alert('Đăng ký tài khoản thành công! Vui lòng Đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-surface-container-lowest rounded-2xl ghost-border card-lift">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Tạo tài khoản mới</h2>
        <p className="text-on-surface-variant font-medium text-sm">Gia nhập trạm xe BusGo ngay hôm nay</p>
      </div>

      {error && <div className="bg-error-container text-on-error-container font-bold p-3 mb-6 rounded-xl text-center text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">Họ và Tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-outline" />
            </div>
            <input 
              type="text" required placeholder="Nguyễn Văn A" 
              value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">Số điện thoại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-outline" />
            </div>
            <input 
              type="text" required placeholder="0901234567" 
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">Địa chỉ Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-outline" />
            </div>
            <input 
              type="email" required placeholder="vidu@gmail.com" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
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
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
            />
          </div>
        </div>
        
        <button type="submit" className="w-full btn-primary-gradient py-3.5 rounded-xl font-bold text-lg flex justify-center items-center gap-2 mt-6">
          <UserPlus size={20} /> Đăng Ký Ngay
        </button>
      </form>
      
      <p className="mt-8 text-center text-on-surface-variant font-medium text-sm">
        Đã có tài khoản? <Link to="/login" className="text-primary font-bold hover:text-primary-container hover:underline transition-colors">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default Register;
