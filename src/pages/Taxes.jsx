import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTaxes, applyTax, deleteTax } from "../store/slices/taxSlice";
import { AlertOctagon, Trash2 } from "lucide-react";

const Taxes = () => {
  const dispatch = useDispatch();
  const { taxes, isLoading } = useSelector((state) => state.taxes);

  if (isLoading)
    return <div className="text-center p-8 text-danger">Loading Taxes...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-wider text-danger">TAXES</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {taxes.map((tax) => (
          <div
            key={tax._id}
            className="glass p-6 rounded-xl border-l-4 border-l-danger flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg mb-1">{tax.title}</h3>
              <p className="text-danger font-medium text-sm">
                Penalty: -{tax.punishment} XP
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(applyTax(tax._id))}
                className="bg-danger/20 hover:bg-danger text-danger hover:text-white border border-danger/30 py-2 px-4 rounded-lg font-bold flex items-center gap-2 transition-colors"
                title="Apply Tax (Deduct XP)"
              >
                <AlertOctagon size={18} /> Apply
              </button>

              <button
                onClick={() => dispatch(deleteTax(tax._id))}
                className="text-slate-500 hover:text-danger p-2 bg-white/5 rounded-lg transition-colors"
                title="Delete Tax"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {taxes.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400 glass rounded-xl">
            No taxes defined. Create one from the Add Items page!
          </div>
        )}
      </div>
    </div>
  );
};

export default Taxes;
