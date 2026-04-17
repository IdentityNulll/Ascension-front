import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecords } from '../store/slices/recordSlice';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

const Records = () => {
  const dispatch = useDispatch();
  const { records, isLoading } = useSelector((state) => state.records);

  useEffect(() => {
    dispatch(getRecords());
  }, [dispatch]);

  if (isLoading) return <div className="text-center p-8 text-slate-400">Loading Records...</div>;

  return (
    <div className="space-y-6 max-h-full flex flex-col">
      <h1 className="text-3xl font-bold tracking-wider text-slate-300">RECORDS</h1>
      
      <div className="glass flex-1 rounded-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-white/10 bg-white/5 flex gap-2 items-center text-slate-300 font-bold">
          <History size={20} /> History Log
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {records.map(record => (
            <div key={record._id} className="flex items-center justify-between p-4 bg-surface/50 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${record.xpChange >= 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                  {record.xpChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-medium text-slate-200">{record.details}</p>
                  <p className="text-xs text-slate-500">{new Date(record.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className={`font-bold text-lg ${record.xpChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {record.xpChange >= 0 ? '+' : ''}{record.xpChange} XP
              </div>
            </div>
          ))}

          {records.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Your history is empty. Time to start ascending!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Records;
