import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMe } from './store/slices/authSlice';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import Shop from './pages/Shop';
import Taxes from './pages/Taxes';
import Rules from './pages/Rules';
import Records from './pages/Records';
import Profile from './pages/Profile';
import AddItems from './pages/AddItems';
import Layout from './components/Layout';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={token ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="quests" element={<Quests />} />
          <Route path="shop" element={<Shop />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="rules" element={<Rules />} />
          <Route path="records" element={<Records />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create" element={<AddItems />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
