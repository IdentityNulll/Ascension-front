import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTaxes,
  deleteTax,
  applyTax,
  resetTax,
} from "../store/slices/taxSlice";
import { AlertTriangle, Trash2, Search, RotateCcw } from "lucide-react";
import ConfirmModal from "../components/ui/ConfirmModal";
import ActionLoader from "../components/ui/ActionLoader";

const Taxes = () => {
  const dispatch = useDispatch();
  const { taxes, isLoading, pendingActions } = useSelector(
    (state) => state.taxes,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    taxId: null,
    type: null,
  });

  useEffect(() => {
    dispatch(getTaxes());
  }, [dispatch]);

  const filteredTaxes = useMemo(() => {
    return taxes.filter((tax) =>
      tax.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [taxes, searchQuery]);

  const isPending = (id, type) =>
    pendingActions.some((action) => action.id === id && action.type === type);

  const handleConfirm = () => {
    if (confirmState.type === "delete" && confirmState.taxId) {
      dispatch(deleteTax(confirmState.taxId));
    } else if (confirmState.type === "apply" && confirmState.taxId) {
      dispatch(applyTax(confirmState.taxId));
    } else if (confirmState.type === "reset" && confirmState.taxId) {
      dispatch(resetTax(confirmState.taxId));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-wider text-danger uppercase drop-shadow-md">
            Taxes & Penalties
          </h1>
          <p className="text-slate-400 mt-2">
            Daily punishments that drain your XP.
          </p>
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search penalties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/80 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-danger/50 transition-all shadow-inner"
          />
        </div>
      </header>

      {isLoading && taxes.length === 0 ? (
        <div className="flex justify-center p-12">
          <ActionLoader size={40} className="text-danger" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTaxes.map((tax) => (
            <div
              key={tax._id}
              className="relative glass p-6 rounded-2xl border border-danger/20 flex flex-col hover:-translate-y-1 transition-transform group hover:shadow-lg hover:shadow-danger/10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-danger/50 to-danger shadow-sm"></div>

              <div className="flex justify-between items-start mb-6 relative z-10 pt-2">
                <div className="flex items-start gap-4 pr-2">
                  <div className="bg-danger/10 p-3 rounded-xl text-danger shadow-inner shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-white leading-snug">
                    {tax.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 mb-6 relative z-10">
                <div className="bg-background/80 border border-white/5 p-5 rounded-xl text-center shadow-inner">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    Cost
                  </span>
                  <span className="text-3xl font-black text-danger drop-shadow-md">
                    -{tax.punishment} XP
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface/60 border border-white/5 p-4 rounded-xl text-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      Today
                    </span>
                    <span className="text-white text-2xl font-black">
                      {tax.appliedCount || 0}
                    </span>
                  </div>

                  <div className="bg-surface/60 border border-white/5 p-4 rounded-xl text-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      Total
                    </span>
                    <span className="text-white text-2xl font-black">
                      {tax.totalApplied || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-auto relative z-10">
                <button
                  onClick={() =>
                    setConfirmState({
                      isOpen: true,
                      taxId: tax._id,
                      type: "apply",
                    })
                  }
                  disabled={isPending(tax._id, "apply")}
                  className="flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface bg-white text-background hover:bg-slate-200 focus:ring-white border border-transparent shadow-lg shadow-white/10 disabled:opacity-50"
                >
                  {isPending(tax._id, "apply") ? (
                    <ActionLoader size={18} />
                  ) : (
                    "Apply tax"
                  )}
                </button>

                <button
                  onClick={() =>
                    setConfirmState({
                      isOpen: true,
                      taxId: tax._id,
                      type: "reset",
                    })
                  }
                  disabled={
                    (tax.appliedCount || 0) === 0 || isPending(tax._id, "reset")
                  }
                  className="p-3.5 text-slate-400 bg-surface border border-white/5 hover:text-warning hover:bg-warning/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-warning disabled:opacity-40"
                  aria-label="Reset Tax Count"
                >
                  {isPending(tax._id, "reset") ? (
                    <ActionLoader size={18} />
                  ) : (
                    <RotateCcw size={18} />
                  )}
                </button>

                <button
                  onClick={() =>
                    setConfirmState({
                      isOpen: true,
                      taxId: tax._id,
                      type: "delete",
                    })
                  }
                  disabled={isPending(tax._id, "delete")}
                  className="p-3.5 text-slate-500 bg-surface border border-white/5 hover:text-danger hover:bg-danger/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-danger disabled:opacity-50"
                  aria-label="Delete Tax"
                >
                  {isPending(tax._id, "delete") ? (
                    <ActionLoader size={20} />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-danger/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}

          {filteredTaxes.length === 0 && (
            <div className="col-span-full p-16 flex flex-col items-center justify-center text-slate-400 glass rounded-3xl border-2 border-dashed border-white/10">
              <div className="bg-surface/50 p-6 rounded-full mb-6">
                <Search size={40} className="text-slate-500" />
              </div>
              <p className="text-xl font-bold text-white mb-2">
                No taxes found.
              </p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() =>
          setConfirmState({ isOpen: false, taxId: null, type: null })
        }
        onConfirm={handleConfirm}
        title={
          confirmState.type === "apply"
            ? "Apply Tax"
            : confirmState.type === "reset"
              ? "Reset Daily Count"
              : "Delete Tax"
        }
        message={
          confirmState.type === "apply"
            ? "Are you sure you want to apply this tax? XP will be deducted."
            : confirmState.type === "reset"
              ? "Reset today’s applied count for this tax?"
              : "Are you sure you want to permanently delete this tax?"
        }
        confirmText={
          confirmState.type === "apply"
            ? "Apply"
            : confirmState.type === "reset"
              ? "Reset"
              : "Delete"
        }
        danger={confirmState.type === "apply" || confirmState.type === "delete"}
      />
    </div>
  );
};

export default Taxes;
