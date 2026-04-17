import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecords } from '../store/slices/recordSlice';
import { getQuests } from '../store/slices/questSlice';
import { Activity, Target, Zap, CalendarDays } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { records } = useSelector((state) => state.records);
  const { quests } = useSelector((state) => state.quests);

  useEffect(() => {
    dispatch(getRecords());
    dispatch(getQuests());
  }, [dispatch]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-h-full">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-wider text-primary">DASHBOARD</h1>
        <p className="text-slate-400">Welcome back, <span className="font-bold text-white">{user?.username}</span>.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="glass p-6 rounded-2xl flex flex-col gap-4 border-t-4 border-t-secondary transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-400 font-medium">Total Experience</p>
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <Zap size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold">{user?.xp || 0} <span className="text-xl text-secondary">XP</span></p>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col gap-4 border-t-4 border-t-primary transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-400 font-medium">Active Quests</p>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Target size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold">{quests.length}</p>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col gap-4 border-t-4 border-t-warning transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-400 font-medium">Current Streak</p>
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <CalendarDays size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold">{user?.streak || 0} <span className="text-xl text-warning">Days</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass p-8 rounded-2xl flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Activity size={20} className="text-primary"/> 
            Recent Activity
          </h2>
          <div className="space-y-4 flex-1">
            {records.slice(0, 6).map(record => (
              <div key={record._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors gap-3">
                <p className="text-sm text-slate-200">{record.details}</p>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ${record.xpChange >= 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                  {record.xpChange >= 0 ? '+' : ''}{record.xpChange} XP
                </span>
              </div>
            ))}
            {records.length === 0 && <div className="text-slate-500 italic py-8 text-center text-sm border-2 border-dashed border-white/10 rounded-xl">No recent activity detected.</div>}
          </div>
        </div>

        {/* Current Quests Preview */}
        <div className="glass p-8 rounded-2xl flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Target size={20} className="text-primary"/> 
            Active Quests Snapshot
          </h2>
          <div className="space-y-4 flex-1">
            {quests.slice(0,5).map(quest => (
              <div key={quest._id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:border-primary/30 transition-colors">
                <div className="flex flex-col">
                  <p className="font-bold text-slate-200">{quest.title}</p>
                  <p className="text-xs text-primary font-medium mt-1 inline-block uppercase tracking-wider">{quest.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-400">Completed</span>
                  <span className="text-lg font-bold text-white">{quest.completedCount}x</span>
                </div>
              </div>
            ))}
            {quests.length === 0 && <div className="text-slate-500 italic py-8 text-center text-sm border-2 border-dashed border-white/10 rounded-xl">No active quests. Time to set some goals!</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
