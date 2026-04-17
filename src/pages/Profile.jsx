import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword } from '../store/slices/authSlice';
import { User as UserIcon, Activity, Zap, Lock, ScanLine } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ username: user?.username || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });

  const onProfileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onPassChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const onProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setProfileMsg('Identity synchronized.');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const onPassSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPassMsg({ text: 'New passwords do not match.', type: 'error' });
    }
    
    const res = await dispatch(changePassword({ 
      currentPassword: passwordData.currentPassword, 
      newPassword: passwordData.newPassword 
    }));
    
    if (res.meta.requestStatus === 'fulfilled') {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPassMsg({ text: 'Access codes updated securely.', type: 'success' });
    } else {
      setPassMsg({ text: res.payload || 'Failed to update access codes.', type: 'error' });
    }
    setTimeout(() => setPassMsg({text:'', type:''}), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black tracking-wider text-slate-200">ASCENDANT IDENTITY</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-4 glass p-8 rounded-3xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent"></div>
          
          <div className="w-32 h-32 bg-background/50 backdrop-blur-xl rounded-full flex items-center justify-center text-primary border-4 border-primary/20 shadow-2xl relative z-10 p-6">
            <ScanLine size={48} className="opacity-80" />
          </div>
          
          <div className="relative z-10 w-full">
            <h2 className="text-3xl font-black text-white tracking-wide">{user?.username}</h2>
            <p className="text-primary font-medium tracking-widest text-sm uppercase mt-1">System User</p>
          </div>
          
          <div className="w-full pt-6 border-t border-white/10 space-y-3 relative z-10">
            <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-xl">
              <span className="flex items-center gap-2 text-slate-400 font-medium"><Zap size={18} className="text-secondary"/> Experience</span>
              <span className="font-bold text-white text-xl">{user?.xp || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-xl">
              <span className="flex items-center gap-2 text-slate-400 font-medium"><Activity size={18} className="text-warning"/> Streak</span>
              <span className="font-bold text-white text-xl">{user?.streak || 0} d</span>
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Identity Update */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <UserIcon size={24} className="text-primary" /> Modify Designation
            </h2>
            
            <form onSubmit={onProfileSubmit} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={onProfileChange}
                    className="w-full bg-surface/50 border border-white/10 rounded-xl pl-4 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
                >
                  Synchronize
                </button>
                {profileMsg && <span className="text-success text-sm font-bold animate-pulse">{profileMsg}</span>}
              </div>
            </form>
          </div>

          {/* Security Update */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Lock size={24} className="text-slate-400" /> Security Override
            </h2>
            
            <form onSubmit={onPassSubmit} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Authentication Array</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={onPassChange}
                  required
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">New Pattern</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={onPassChange}
                    required
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Verify Pattern</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={onPassChange}
                    required
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all border border-white/10 disabled:opacity-50"
                >
                  Encrypt New
                </button>
                {passMsg.text && (
                  <span className={`text-sm font-bold ${passMsg.type === 'error' ? 'text-danger' : 'text-success'}`}>
                    {passMsg.text}
                  </span>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
