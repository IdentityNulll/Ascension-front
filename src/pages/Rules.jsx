import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRules, deleteRule, breakRule } from '../store/slices/ruleSlice';
import { Scale, Trash2, ShieldAlert, Search } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';
import ActionLoader from '../components/ui/ActionLoader';

const Rules = () => {
  const dispatch = useDispatch();
  const { rules, isLoading, pendingActions } = useSelector((state) => state.rules);

  const [searchQuery, setSearchQuery] = useState('');
  const [confirmState, setConfirmState] = useState({ isOpen: false, ruleId: null, type: null });

  useEffect(() => {
    dispatch(getRules());
  }, [dispatch]);

  const filteredRules = useMemo(() => {
    return rules.filter(rule => rule.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [rules, searchQuery]);

  const isPending = (id, type) => pendingActions.some(action => action.id === id && action.type === type);

  const handleConfirm = () => {
    if (confirmState.type === 'delete' && confirmState.ruleId) {
      dispatch(deleteRule(confirmState.ruleId));
    } else if (confirmState.type === 'break' && confirmState.ruleId) {
      dispatch(breakRule(confirmState.ruleId));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-wider text-warning uppercase drop-shadow-md">Laws & Rules</h1>
          <p className="text-slate-400 mt-2">Strict consequences keep you on the path.</p>
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search directives..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/80 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-warning/50 transition-all shadow-inner"
          />
        </div>
      </header>
      
      {isLoading && rules.length === 0 ? (
        <div className="flex justify-center p-12">
          <ActionLoader size={40} className="text-warning" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRules.map(rule => (
            <div key={rule._id} className="relative glass p-6 rounded-2xl border-l-4 border-l-warning flex flex-col hover:-translate-y-1 transition-transform border-y border-r border-white/5 hover:border-r-warning/30 hover:border-y-warning/30 hover:shadow-xl hover:shadow-warning/10 group overflow-hidden">
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-start gap-4 pr-4">
                  <div className="bg-warning/10 p-3 rounded-xl text-warning shadow-inner shrink-0">
                    <Scale size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-white leading-snug">{rule.title}</h3>
                </div>
              </div>

              <div className="bg-background/80 border border-white/5 p-6 rounded-xl mb-6 mx-auto w-full text-center relative z-10 shadow-inner">
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block mb-2">Violation Cost</span>
                <span className="text-3xl font-black text-danger drop-shadow-md">-{rule.punishment} XP</span>
              </div>
              
              <div className="flex items-center gap-3 mt-auto relative z-10">
                <button
                  onClick={() => setConfirmState({ isOpen: true, ruleId: rule._id, type: 'break' })}
                  disabled={isPending(rule._id, 'break')}
                  className="flex-1 bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 hover:border-danger flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-danger"
                  aria-label="Break Rule"
                >
                  {isPending(rule._id, 'break') ? <ActionLoader size={18} /> : (
                    <>
                      <ShieldAlert size={18} /> Break Rule
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => setConfirmState({ isOpen: true, ruleId: rule._id, type: 'delete' })}
                  disabled={isPending(rule._id, 'delete')}
                  className="p-3.5 text-slate-500 hover:text-danger bg-surface hover:bg-danger/10 border border-white/5 rounded-xl transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-danger"
                  aria-label="Delete Rule"
                >
                  {isPending(rule._id, 'delete') ? <ActionLoader size={20} /> : <Trash2 size={20} />}
                </button>
              </div>

               {/* Ambient Glow */}
               <div className="absolute inset-0 bg-gradient-to-tr from-warning/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}

          {filteredRules.length === 0 && (
            <div className="col-span-full p-16 flex flex-col items-center justify-center text-slate-400 glass rounded-3xl border-2 border-dashed border-white/10">
               <div className="bg-surface/50 p-6 rounded-full mb-6">
                 <Search size={40} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-2">No rules found.</p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, ruleId: null, type: null })}
        onConfirm={handleConfirm}
        title={confirmState.type === 'break' ? 'Acknowledge Violation' : 'Repeal Law'}
        message={confirmState.type === 'break' 
          ? 'Are you committing to breaking this rule? The punishment XP will be deeply deducted from your balance.' 
          : 'Are you sure you want to permanently delete this rule from the system?'
        }
        confirmText={confirmState.type === 'break' ? 'Accept Punishment' : 'Delete'}
        danger={confirmState.type === 'break' || confirmState.type === 'delete'}
      />
    </div>
  );
};

export default Rules;
