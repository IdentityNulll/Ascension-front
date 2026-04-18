import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRules, deleteRule, breakRule } from "../store/slices/ruleSlice";
import { Scale, Trash2, ShieldAlert } from "lucide-react";

const Rules = () => {
  const dispatch = useDispatch();
  const { rules, isLoading } = useSelector((state) => state.rules);

  if (isLoading && rules.length === 0)
    return (
      <div className="text-center p-8 text-warning font-medium animate-pulse">
        Loading Rules...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-wider text-warning uppercase">
          LAWS & RULES
        </h1>
        <p className="text-slate-400">
          Strict consequences keep you on the path.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <div
            key={rule._id}
            className="glass p-6 rounded-2xl border-l-4 border-l-warning flex flex-col hover:-translate-y-1 transition-transform border border-white/5 hover:border-warning/30 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-lg text-warning">
                  <Scale size={20} />
                </div>
                <h3 className="font-bold text-lg text-white">{rule.title}</h3>
              </div>
            </div>

            <div className="bg-surface/50 border border-white/5 p-4 rounded-xl mb-6 mx-auto w-full text-center">
              <span className="text-sm font-medium text-slate-400 block mb-1">
                Violation Cost
              </span>
              <span className="text-xl font-bold text-danger">
                -{rule.punishment} XP
              </span>
            </div>

            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() =>
                  window.confirm(
                    "Are you committing to breaking this rule? XP will be deducted.",
                  ) && dispatch(breakRule(rule._id))
                }
                className="flex-1 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 hover:border-danger flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold transition-all"
              >
                <ShieldAlert size={18} /> Break Rule
              </button>

              <button
                onClick={() =>
                  window.confirm("Delete this rule permanently?") &&
                  dispatch(deleteRule(rule._id))
                }
                className="p-3 text-slate-500 hover:text-danger hover:bg-danger/10 bg-white/5 border border-white/5 rounded-xl transition-all"
                title="Delete Rule"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="col-span-full p-12 flex flex-col items-center justify-center text-slate-400 glass rounded-2xl border-2 border-dashed border-white/10">
            <Scale size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No rules defined.</p>
            <p className="text-sm opacity-70">
              Add constraints in the Create page to solidify your discipline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rules;
