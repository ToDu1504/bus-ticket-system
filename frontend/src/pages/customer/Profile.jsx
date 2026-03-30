import { useState, useEffect } from 'react';
import { getProfileApi, updateProfileApi, changePasswordApi } from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { UserCircle, PenLine, Lock, Mail, User, Phone, Save, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({ full_name: '', phone: '' });
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
  
  const dispatch = useDispatch();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfileApi();
      setUser(data);
      setProfileData({ full_name: data.full_name, phone: data.phone || '' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfileApi(profileData);
      alert('Cập nhật hồ sơ thành công!');
      
      const currentToken = localStorage.getItem('token');
      dispatch(loginSuccess({ token: currentToken, user: res.user }));
      
      loadProfile();
    } catch (e) { alert(e.response?.data?.message || 'Cập nhật thất bại'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwdData.oldPassword || !pwdData.newPassword) return;
    try {
      await changePasswordApi(pwdData);
      alert('Đổi mật khẩu thành công!');
      setPwdData({ oldPassword: '', newPassword: '' });
    } catch (e) { alert(e.response?.data?.message || 'Đổi mật khẩu thất bại'); }
  };

  if (loading) return <div className="text-center p-10 font-bold animate-pulse text-outline-variant">Đang tải hồ sơ...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up mt-8 pb-12">
      <div className="bg-primary rounded-3xl p-8 md:p-12 text-on-primary card-lift relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-30 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="bg-primary-container/20 p-4 rounded-full border-4 border-primary-container/30">
            <UserCircle size={64} className="text-on-primary"/>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-1">Hồ sơ cá nhân</h2>
            <p className="opacity-90 font-medium">Quản lý thông tin cá nhân và tài khoản bảo mật của bạn.</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-on-primary/10 backdrop-blur px-4 py-1.5 rounded-full text-sm border border-on-primary/20">
              <span className="opacity-80">Vai trò:</span> 
              <span className="font-bold uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Update */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl ghost-border card-lift">
          <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/20 pb-4 flex items-center gap-2">
            <PenLine size={20} className="text-primary"/> Cập nhật Hồ Sơ
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface block flex items-center gap-1.5"><Mail size={16} className="text-outline"/> Địa chỉ Email <span className="text-outline font-normal">(Chỉ xem)</span></label>
              <input type="email" readOnly value={user?.email} className="w-full border border-outline-variant bg-surface-container-high p-4 rounded-xl text-on-surface-variant cursor-not-allowed outline-none font-medium" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface block flex items-center gap-1.5"><User size={16} className="text-outline"/> Họ và Tên</label>
              <input type="text" required value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full border border-outline-variant bg-surface-container-high focus:bg-surface-container-lowest p-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface block flex items-center gap-1.5"><Phone size={16} className="text-outline"/> Số điện thoại</label>
              <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full border border-outline-variant bg-surface-container-high focus:bg-surface-container-lowest p-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" />
            </div>
            
            <button type="submit" className="w-full btn-primary-gradient py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-primary/20 mt-4">
              <Save size={20}/> Lưu Thay Đổi
            </button>
          </form>
        </div>

        {/* Password Update */}
        <div className="bg-surface-container-highest p-8 rounded-3xl border border-outline/10 card-lift relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-tertiary rounded-full blur-[60px] opacity-20" />
          
          <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/50 pb-4 relative z-10 flex items-center gap-2">
            <Lock size={20} className="text-tertiary-container"/> Mật Khẩu Đăng Nhập
          </h3>
          
          <form onSubmit={handleChangePassword} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant block">Mật khẩu hiện tại</label>
              <input type="password" required placeholder="••••••••" value={pwdData.oldPassword} onChange={e => setPwdData({...pwdData, oldPassword: e.target.value})} className="w-full border border-outline-variant/60 bg-surface p-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-outline-variant" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant block">Mật khẩu mới</label>
              <input type="password" required placeholder="••••••••" value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} className="w-full border border-outline-variant/60 bg-surface p-4 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-outline-variant" />
            </div>
            
            <button type="submit" className="w-full bg-tertiary text-on-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container font-bold py-4 rounded-xl shadow-lg shadow-tertiary/20 flex justify-center items-center gap-2 transition-all duration-300 mt-4">
              <ShieldCheck size={20}/> Cập Nhật Bảo Mật
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
