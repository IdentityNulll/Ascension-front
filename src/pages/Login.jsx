import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';
import ActionLoader from '../components/ui/ActionLoader';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }
    return () => dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass p-10 rounded-3xl w-full max-w-md shadow-[0_8px_32px_rgb(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
        
        {/* Aesthetic Gradients */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <header className="mb-8 text-center text-slate-200">
            <h1 className="text-4xl font-black mb-2 tracking-widest uppercase text-white drop-shadow-md">Login</h1>
            <p className="text-slate-400">Continue your ascension.</p>
          </header>

          {isError && (
             <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
               <AlertCircle size={18} />
               {message}
             </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold tracking-widest uppercase text-slate-400">Designation</label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={onChange}
                placeholder="Enter Username"
                required
                className="w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold tracking-widest uppercase text-slate-400">Access Array</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={onChange}
                placeholder="Enter Password"
                required
                className="w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner placeholder:text-slate-600"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-background font-black uppercase tracking-wider py-4 rounded-xl hover:bg-slate-200 transition-all focus:outline-none focus:ring-4 focus:ring-white/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <ActionLoader size={20} className="text-background"/> : 'Authenticate'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-sm">
            Not registered? <Link to="/register" className="text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:underline rounded px-1">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
