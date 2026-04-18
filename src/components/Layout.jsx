import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  LayoutDashboard,
  Target,
  ShoppingBag,
  AlertTriangle,
  Scale,
  History,
  User,
  LogOut,
  PlusSquare,
} from "lucide-react";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Quests", icon: <Target size={20} />, path: "/quests" },
    { name: "Shop", icon: <ShoppingBag size={20} />, path: "/shop" },
    { name: "Taxes", icon: <AlertTriangle size={20} />, path: "/taxes" },
    { name: "Rules", icon: <Scale size={20} />, path: "/rules" },
    { name: "Records", icon: <History size={20} />, path: "/records" },
    { name: "Create", icon: <PlusSquare size={20} />, path: "/create" },
  ];

  return (
    <div className="flex h-screen bg-background text-slate-200 overflow-hidden">
      {/* Mobile Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-20 flex-col border-r border-white/10 glass md:hidden">
        <div className="flex h-16 items-center justify-center border-b border-white/10 shrink-0">
          <h1 className="text-xs font-bold tracking-widest text-primary uppercase">
            Asc
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {link.icon}
                <span className="text-[10px] font-medium text-center leading-tight">
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-2 border-t border-white/10 p-2">
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 transition-colors ${
              location.pathname === "/profile"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <User size={20} />
            <span className="text-[10px] font-medium text-center leading-tight">
              Profile
            </span>
          </Link>

          <button
            onClick={onLogout}
            className="flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-slate-400 transition-colors hover:bg-danger/20 hover:text-danger"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-medium text-center leading-tight">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 glass md:flex md:flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <h1 className="text-xl font-bold tracking-widest text-primary uppercase">
            Ascension
          </h1>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === "/profile"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </Link>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-slate-400 hover:bg-danger/20 hover:text-danger hover:border hover:border-danger/30 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative ml-20 md:ml-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/10 glass z-10 shrink-0">
          <div className="md:hidden text-lg font-bold text-primary tracking-widest uppercase">
            Ascension
          </div>
          <div className="hidden md:block"></div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                  <span className="text-primary font-bold">
                    {user.xp || 0} XP
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
