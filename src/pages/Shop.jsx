import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getShopItems,
  buyItem,
  deleteShopItem,
} from "../store/slices/shopSlice";
import { ShoppingCart, Trash2, Package } from "lucide-react";

const Shop = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.shop);
  const { user } = useSelector((state) => state.auth);

  if (isLoading && items.length === 0)
    return (
      <div className="text-center p-8 text-secondary font-medium animate-pulse">
        Loading Shop...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-wider text-secondary uppercase">
            Black Market
          </h1>
          <p className="text-slate-400 mt-2">
            Spend XP to acquire infinite rewards.
          </p>
        </div>
        <div className="bg-surface/80 backdrop-blur border border-secondary/30 px-6 py-3 rounded-xl flex items-center gap-3">
          <span className="text-slate-400 font-medium text-sm">Available</span>
          <span className="text-secondary font-bold tracking-wider text-xl">
            {user?.xp || 0} XP
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="glass p-6 rounded-2xl border border-white/5 hover:border-secondary/30 transition-all hover:-translate-y-1 flex flex-col group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Package size={80} />
            </div>

            <div className="flex justify-between items-start mb-6 z-10">
              <h3 className="font-bold text-xl text-white pr-6">{item.name}</h3>
              <button
                onClick={() =>
                  window.confirm("Remove item from shop?") &&
                  dispatch(deleteShopItem(item._id))
                }
                className="text-slate-500 hover:text-danger bg-white/5 hover:bg-danger/10 p-2 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
                title="Delete Item"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 bg-surface/50 rounded-xl border border-white/5 mb-6 z-10">
              <span className="text-sm font-medium text-slate-400 mb-1">
                Cost
              </span>
              <span className="text-secondary font-black text-3xl">
                {item.price} XP
              </span>
            </div>

            <button
              onClick={() => dispatch(buyItem(item._id))}
              disabled={(user?.xp || 0) < item.price}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all z-10 ${
                (user?.xp || 0) < item.price
                  ? "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                  : "bg-secondary/10 text-secondary hover:bg-secondary hover:text-white border border-secondary/30 shadow-lg shadow-secondary/5 hover:shadow-secondary/20"
              }`}
            >
              <ShoppingCart size={18} />
              {(user?.xp || 0) < item.price ? "Lock: Need More XP" : "Acquire"}
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full p-12 flex flex-col items-center justify-center text-slate-400 glass rounded-2xl border-2 border-dashed border-white/10">
            <Package size={48} className="mb-4 opacity-50" />
            <p className="text-lg">Shop is empty.</p>
            <p className="text-sm opacity-70">
              Add infinite rewards in the Create page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
