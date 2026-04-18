import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShopItems, buyItem, deleteShopItem } from '../store/slices/shopSlice';
import { ShoppingCart, Trash2, Package, Search } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';
import ActionLoader from '../components/ui/ActionLoader';

const Shop = () => {
  const dispatch = useDispatch();
  const { items, isLoading, pendingActions } = useSelector((state) => state.shop);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [confirmState, setConfirmState] = useState({ isOpen: false, itemId: null });

  useEffect(() => {
    dispatch(getShopItems());
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [items, searchQuery]);

  const isPending = (id, type) => pendingActions.some(action => action.id === id && action.type === type);

  const confirmDelete = () => {
    if (confirmState.itemId) {
      dispatch(deleteShopItem(confirmState.itemId));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-wider text-secondary uppercase drop-shadow-md">Black Market</h1>
          <p className="text-slate-400 mt-2">Spend XP to acquire infinite rewards.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           {/* Search Bar */}
           <div className="relative w-full sm:w-64 shrink-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/80 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all shadow-inner"
            />
          </div>

          <div className="bg-surface/80 backdrop-blur border border-secondary/30 px-6 py-2.5 rounded-full flex items-center justify-center gap-3 w-full sm:w-auto shadow-inner">
            <span className="text-slate-400 font-medium text-sm">Available</span>
            <span className="text-secondary font-bold tracking-wider text-lg">{user?.xp || 0} XP</span>
          </div>
        </div>
      </header>

      {isLoading && items.length === 0 ? (
        <div className="flex justify-center p-12">
          <ActionLoader size={40} className="text-secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item._id} className="relative glass p-6 rounded-2xl border border-white/5 hover:border-secondary/40 focus-within:border-secondary/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/5 flex flex-col group overflow-hidden z-10">
              
              {/* Background Art */}
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                 <Package size={140} />
              </div>

              <div className="flex justify-between items-start mb-6 z-10 relative">
                <h3 className="font-bold text-xl text-white pr-6 leading-tight">{item.name}</h3>
                <button 
                  onClick={() => setConfirmState({ isOpen: true, itemId: item._id })}
                  disabled={isPending(item._id, 'delete')}
                  className="text-slate-500 hover:text-danger bg-surface hover:bg-danger/10 border border-white/5 p-2.5 rounded-xl transition-all md:opacity-0 group-hover:opacity-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-danger"
                  aria-label="Delete Item"
                >
                  {isPending(item._id, 'delete') ? <ActionLoader size={16} /> : <Trash2 size={16} />}
                </button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center py-8 bg-background/50 rounded-xl border border-white/5 mb-6 z-10 relative shadow-inner">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Cost</span>
                <span className="text-secondary font-black text-4xl drop-shadow-md">{item.price} <span className="text-xl">XP</span></span>
              </div>

              <button
                onClick={() => dispatch(buyItem(item._id))}
                disabled={(user?.xp || 0) < item.price || isPending(item._id, 'buy')}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all z-10 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface ${
                  (user?.xp || 0) < item.price
                    ? 'bg-surface border border-white/5 text-slate-500 cursor-not-allowed opacity-70'
                    : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white border border-secondary/30 shadow-lg shadow-secondary/5 hover:shadow-secondary/20 focus:ring-secondary'
                }`}
                aria-label={`Buy ${item.name}`}
              >
                {isPending(item._id, 'buy') ? (
                  <ActionLoader size={20} />
                ) : (
                  <>
                    <ShoppingCart size={20} /> 
                    {(user?.xp || 0) < item.price ? 'Insufficient XP' : 'Acquire Module'}
                  </>
                )}
              </button>

              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full p-16 flex flex-col items-center justify-center text-slate-400 glass rounded-3xl border-2 border-dashed border-white/10">
              <div className="bg-surface/50 p-6 rounded-full mb-6">
                 <Search size={40} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-2">No inventory detected.</p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, itemId: null })}
        onConfirm={confirmDelete}
        title="Remove Inventory"
        message="Are you sure you want to delete this specific reward from your market?"
        confirmText="Remove"
      />
    </div>
  );
};

export default Shop;
