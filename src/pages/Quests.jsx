import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuests, incrementQuest, decrementQuest, resetQuest, deleteQuest } from '../store/slices/questSlice';
import { Plus, Minus, RotateCcw, Trash2, Filter } from 'lucide-react';

const Quests = () => {
  const dispatch = useDispatch();
  const { quests, isLoading } = useSelector((state) => state.quests);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    dispatch(getQuests());
  }, [dispatch]);

  const categories = useMemo(() => {
    const cats = new Set(quests.map(q => q.category?.toLowerCase() || 'other'));
    return ['all', ...Array.from(cats)].sort();
  }, [quests]);

  const filteredQuests = useMemo(() => {
    if (activeFilter === 'all') return quests;
    return quests.filter(q => (q.category?.toLowerCase() || 'other') === activeFilter);
  }, [quests, activeFilter]);

  if (isLoading && quests.length === 0) return <div className="text-center p-8 text-primary font-medium animate-pulse">Loading Quests...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-black tracking-wider text-primary uppercase">Quests</h1>
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter size={18} className="text-slate-500 shrink-0 mr-2" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-colors ${
                activeFilter === cat 
                  ? 'bg-primary text-white' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map(quest => (
          <div key={quest._id} className="glass rounded-2xl flex flex-col overflow-hidden border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1 group">
            
            <div className="p-5 flex-1 relative">
               {/* Delete Button (appears on hover or always on mobile) */}
               <button 
                  onClick={() => window.confirm('Delete this quest?') && dispatch(deleteQuest(quest._id))}
                  className="absolute top-4 right-4 text-slate-500 hover:text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                  title="Delete Quest"
                >
                  <Trash2 size={16} />
                </button>

              <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-md text-[10px] font-black tracking-widest uppercase mb-3">
                {quest.category || 'Other'}
              </div>
              
              <h3 className="font-bold text-xl mb-2 text-slate-100 pr-8">{quest.title}</h3>
              
              <div className="flex items-center gap-2 mt-4 text-slate-400">
                <div className="bg-surface/50 border border-white/5 px-4 py-2 rounded-lg flex-1 text-center font-medium">
                  Completed: <span className="text-white font-bold text-lg ml-1">{quest.completedCount}</span>
                </div>
                <div className="bg-surface/50 border border-white/5 px-4 py-2 rounded-lg text-center font-medium">
                  <span className="text-secondary font-bold">+{quest.xpReward} XP</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-white/5">
              <button
                onClick={() => dispatch(decrementQuest(quest._id))}
                disabled={quest.completedCount === 0}
                className="py-3 flex justify-center items-center text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                title="Decrease Completion"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={() => dispatch(resetQuest(quest._id))}
                disabled={quest.completedCount === 0}
                className="py-3 flex justify-center items-center text-slate-400 hover:text-warning hover:bg-warning/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                title="Reset to Zero"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => dispatch(incrementQuest(quest._id))}
                className="py-3 flex justify-center items-center text-primary font-bold bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                title="Increase Completion & Earn XP"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        ))}

        {filteredQuests.length === 0 && (
          <div className="col-span-full p-12 flex flex-col items-center justify-center text-slate-400 glass rounded-2xl border-2 border-dashed border-white/10">
            <Target size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No quests found for this category.</p>
            <p className="text-sm opacity-70">Focus your path by creating one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quests;
