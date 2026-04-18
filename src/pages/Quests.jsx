import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuests, incrementQuest, decrementQuest, resetQuest, deleteQuest } from '../store/slices/questSlice';
import { Plus, Minus, RotateCcw, Trash2, Filter, Search } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';
import ActionLoader from '../components/ui/ActionLoader';

const Quests = () => {
  const dispatch = useDispatch();
  const { quests, isLoading, pendingActions } = useSelector((state) => state.quests);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [confirmState, setConfirmState] = useState({ isOpen: false, questId: null });

  useEffect(() => {
    dispatch(getQuests());
  }, [dispatch]);

  const categories = useMemo(() => {
    const cats = new Set(quests.map(q => q.category?.toLowerCase() || 'other'));
    return ['all', ...Array.from(cats)].sort();
  }, [quests]);

  const filteredQuests = useMemo(() => {
    return quests.filter(q => {
      const matchesCategory = activeFilter === 'all' || (q.category?.toLowerCase() || 'other') === activeFilter;
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [quests, activeFilter, searchQuery]);

  // Helper to check if a specific action on a specific quest is pending
  const isPending = (id, type) => pendingActions.some(action => action.id === id && action.type === type);

  const confirmDelete = () => {
    if (confirmState.questId) {
      dispatch(deleteQuest(confirmState.questId));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <h1 className="text-4xl font-black tracking-wider text-primary uppercase drop-shadow-md">Quests</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search quests..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/80 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter size={18} className="text-slate-500 shrink-0 mr-1 hidden md:block" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
                  activeFilter === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-surface/50 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {isLoading && quests.length === 0 ? (
        <div className="flex justify-center p-12">
          <ActionLoader size={40} className="text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map(quest => (
            <div key={quest._id} className="relative glass rounded-2xl flex flex-col overflow-hidden border border-white/5 hover:border-primary/40 focus-within:border-primary/40 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/5 group">
              
              <div className="p-6 flex-1 relative z-10">
                 <button 
                    onClick={() => setConfirmState({ isOpen: true, questId: quest._id })}
                    disabled={isPending(quest._id, 'delete')}
                    className="absolute top-5 right-5 text-slate-500 hover:text-danger hover:bg-danger/10 focus:ring-2 focus:ring-danger p-2 rounded-xl transition-all md:opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    aria-label="Delete Quest"
                  >
                    {isPending(quest._id, 'delete') ? <ActionLoader size={16}/> : <Trash2 size={16} />}
                  </button>

                <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-md text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">
                  {quest.category || 'Other'}
                </div>
                
                <h3 className="font-bold text-xl mb-6 text-white pr-10 leading-tight">{quest.title}</h3>
                
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="bg-background/80 border border-white/5 px-4 py-3 rounded-xl flex-1 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">Completed</span>
                    <span className="text-white font-black text-2xl leading-none">{quest.completedCount}</span>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 px-4 py-3 rounded-xl flex-1 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-[10px] uppercase tracking-wider font-bold mb-1 text-primary opacity-70">Reward</span>
                    <span className="text-primary font-black text-xl leading-none">+{quest.xpReward} XP</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-surface/50 z-10 relative">
                <button
                  onClick={() => dispatch(decrementQuest(quest._id))}
                  disabled={quest.completedCount === 0 || isPending(quest._id, 'decrement')}
                  className="py-4 flex justify-center items-center text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all focus:outline-none focus:bg-white/5"
                  aria-label="Decrease Completion"
                >
                  {isPending(quest._id, 'decrement') ? <ActionLoader /> : <Minus size={20} />}
                </button>
                <button
                  onClick={() => dispatch(resetQuest(quest._id))}
                  disabled={quest.completedCount === 0 || isPending(quest._id, 'reset')}
                  className="py-4 flex justify-center items-center text-slate-400 hover:text-warning hover:bg-warning/10 disabled:opacity-30 transition-all focus:outline-none focus:bg-warning/10"
                  aria-label="Reset to Zero"
                >
                  {isPending(quest._id, 'reset') ? <ActionLoader size={18}/> : <RotateCcw size={18} />}
                </button>
                <button
                  onClick={() => dispatch(incrementQuest(quest._id))}
                  disabled={isPending(quest._id, 'increment')}
                  className="py-4 flex justify-center items-center text-primary font-bold bg-primary/10 hover:bg-primary hover:text-white transition-all disabled:opacity-50 focus:outline-none focus:bg-primary focus:text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-none"
                  aria-label="Increase Completion"
                >
                  {isPending(quest._id, 'increment') ? <ActionLoader size={24}/> : <Plus size={24} />}
                </button>
              </div>

              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}

          {filteredQuests.length === 0 && (
            <div className="col-span-full p-16 flex flex-col items-center justify-center text-slate-400 glass rounded-3xl border-2 border-dashed border-white/10 animate-in zoom-in-95">
              <div className="bg-surface/50 p-6 rounded-full mb-6">
                 <Search size={40} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-2">No quests found.</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, questId: null })}
        onConfirm={confirmDelete}
        title="Obliterate Quest"
        message="Are you sure you want to permanently delete this quest? Your progress tracking for this item will be lost."
        confirmText="Obliterate"
      />
    </div>
  );
};

export default Quests;
