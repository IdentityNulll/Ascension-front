import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { username, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { username, password };
    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl glass">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest text-primary uppercase mb-2">Ascension</h1>
          <p className="text-slate-400">Create an account to begin</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Create a password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center"
          >
            {isLoading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Already ascending? <Link to="/login" className="text-secondary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
