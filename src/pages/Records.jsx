import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecords, clearRecords } from '../store/slices/recordSlice';
import { History, Trash2, Filter, Search } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';
import ActionLoader from '../components/ui/ActionLoader';

const Records = () => {
  const dispatch = useDispatch();
  const { records, isLoading, isError, message } = useSelector((state) => state.records);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(getRecords());
  }, [dispatch]);

  const filters = ['all', 'positve', 'negative'];

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchSearch = record.details.toLowerCase().includes(searchQuery.toLowerCase());
      let matchFilter = true;
      if (activeFilter === 'positive') matchFilter = record.xpChange > 0;
      if (activeFilter === 'negative') matchFilter = record.xpChange < 0;
      return matchSearch && matchFilter;
    });
  }, [records, searchQuery, activeFilter]);

  const handleClear = () => {
    dispatch(clearRecords());
  };

  if (isLoading && records.length === 0) return <div className="text-center p-8 flex justify-center"><ActionLoader size={40} className="text-white"/></div>;
  if (isError) return <div className="text-center p-8 text-danger">{message}</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-wider text-slate-200 uppercase drop-shadow-md">Audit Log</h1>
          <p className="text-slate-400 mt-2">Immutable history of your existence.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
           {/* Search Bar */}
           <div className="relative w-full md:w-64 shrink-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/80 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-inner"
            />
          </div>

          <button
            onClick={() => setConfirmOpen(true)}
            disabled={records.length === 0}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger px-6 py-2.5 rounded-full font-bold transition-all disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-danger"
          >
            <Trash2 size={18} /> Clear Log
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
        <Filter size={18} className="text-slate-500 shrink-0 mr-1" />
        {['all', 'positive', 'negative'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all focus:outline-none focus:ring-2 focus:ring-white/30 ${
              activeFilter === f 
                ? 'bg-white text-background shadow-lg shadow-white/10 scale-105' 
                : 'bg-surface/50 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass p-6 md:p-10 rounded-3xl">
        <div className="space-y-4">
          {filteredRecords.map(record => (
            <div key={record._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-background/50 rounded-2xl border border-white/5 hover:border-white/20 transition-all gap-4 shadow-inner group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${record.xpChange >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                   <History size={20} />
                </div>
                <div>
                  <p className="text-slate-200 font-medium">{record.details}</p>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(record.createdAt).toLocaleString(undefined, {
                       dateStyle: 'medium',
                       timeStyle: 'short'
                    })}
                  </span>
                </div>
              </div>
              <span className={`text-sm font-black px-4 py-2 rounded-xl whitespace-nowrap shadow-sm border border-white/5 ${
                record.xpChange >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {record.xpChange >= 0 ? '+' : ''}{record.xpChange} XP
              </span>
            </div>
          ))}
          {filteredRecords.length === 0 && (
            <div className="col-span-full p-12 flex flex-col items-center justify-center text-slate-400 glass rounded-2xl border-2 border-dashed border-white/10">
               <div className="bg-surface/50 p-6 rounded-full mb-6">
                 <Search size={40} className="text-slate-500" />
              </div>
              <p className="text-lg font-bold text-white mb-1">No auditory events match.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleClear}
        title="Wipe Local Audit DB?"
        message="Are you certain you want to erase all of your action history? This cannot be undone."
        confirmText="Wipe Clean"
      />
    </div>
  );
};

export default Records;
