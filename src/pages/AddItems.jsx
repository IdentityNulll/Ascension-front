import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createQuest } from '../store/slices/questSlice';
import { createShopItem } from '../store/slices/shopSlice';
import { createTax } from '../store/slices/taxSlice';
import { createRule } from '../store/slices/ruleSlice';
import { PlusSquare, Target, ShoppingBag, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';

const defaultFormState = {
  itemType: 'quest',
  title: '',
  category: 'coding', // default preset
  customCategory: '',
  xpReward: 10,
  price: 50,
  punishment: 10
};

const predefinedCategories = ['coding', 'study', 'life skills', 'fitness', 'other'];

const AddItems = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(defaultFormState);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const clearForm = () => setFormData({ ...defaultFormState, itemType: formData.itemType });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { itemType, title, category, customCategory, xpReward, price, punishment } = formData;

    if (!title.trim()) return setMsg({ text: 'Title/Name is required!', type: 'error' });

    try {
      if (itemType === 'quest') {
        const finalCat = category === 'other' ? customCategory.trim() : category;
        dispatch(createQuest({ title, xpReward, category: finalCat || 'other' }));
      }
      if (itemType === 'shop') dispatch(createShopItem({ name: title, price }));
      if (itemType === 'tax') dispatch(createTax({ title, punishment }));
      if (itemType === 'rule') dispatch(createRule({ title, punishment }));
      
      setMsg({ text: `${itemType.toUpperCase()} initialized into the matrix.`, type: 'success' });
      clearForm();
      setTimeout(() => setMsg({text: '', type: ''}), 3000);
    } catch (err) {
      setMsg({ text: "Error creating entity.", type: 'error' });
    }
  };

  const types = [
    { id: 'quest', label: 'Quest', icon: <Target size={20} />, color: 'text-primary border-primary bg-primary/10 hover:bg-primary/20' },
    { id: 'shop', label: 'Reward', icon: <ShoppingBag size={20} />, color: 'text-secondary border-secondary bg-secondary/10 hover:bg-secondary/20' },
    { id: 'tax', label: 'Tax', icon: <AlertTriangle size={20} />, color: 'text-danger border-danger bg-danger/10 hover:bg-danger/20' },
    { id: 'rule', label: 'Rule', icon: <Scale size={20} />, color: 'text-warning border-warning bg-warning/10 hover:bg-warning/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-wider text-slate-200">SYSTEM ARCHITECT</h1>
        <p className="text-slate-400">Initialize new tracking modules.</p>
      </header>

      <div className="glass p-8 md:p-10 rounded-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => { clearForm(); setFormData(prev => ({ ...prev, itemType: type.id })) }}
              className={`p-4 rounded-xl flex flex-col items-center justify-center gap-3 border transition-all ${
                formData.itemType === type.id ? type.color + ' ring-2 ring-white/20 scale-105 shadow-xl' : 'border-white/10 hover:bg-white/5 text-slate-400 bg-surface/50'
              }`}
            >
              {type.icon}
              <span className="text-sm font-bold uppercase tracking-wide">{type.label}</span>
            </button>
          ))}
        </div>

        {msg.text && (
          <div className={`mb-8 p-4 border rounded-xl flex items-center gap-3 font-medium animate-in slide-in-from-top-2 ${
            msg.type === 'error' ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-success/10 border-success/20 text-success'
          }`}>
            {msg.type === 'success' && <CheckCircle2 size={20} />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-surface/30 p-6 md:p-8 rounded-2xl border border-white/5">
          <div className="space-y-1">
            <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">
              {formData.itemType === 'shop' ? 'Reward Designation' : 'Title / Directive'}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
              placeholder={formData.itemType === 'shop' ? 'e.g. 1 Hour Video Games' : 'e.g. Read 10 Pages'}
              required
            />
          </div>

          {formData.itemType === 'quest' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-sm font-bold tracking-wide text-primary uppercase">XP Yield</label>
                <input
                  type="number"
                  name="xpReward"
                  value={formData.xpReward}
                  onChange={handleChange}
                  className="w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  min="1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold tracking-wide text-slate-300 uppercase">Categorization</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none capitalize"
                >
                  {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {formData.category === 'other' && (
                   <input
                    type="text"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    className="w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 mt-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter custom category"
                    required
                  />
                )}
              </div>
            </div>
          )}

          {formData.itemType === 'shop' && (
            <div className="space-y-1 w-full md:w-1/2">
              <label className="text-sm font-bold tracking-wide text-secondary uppercase">XP Cost</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                min="1"
              />
            </div>
          )}

          {(formData.itemType === 'tax' || formData.itemType === 'rule') && (
            <div className="space-y-1 w-full md:w-1/2">
              <label className={`text-sm font-bold tracking-wide uppercase ${formData.itemType === 'tax' ? 'text-danger' : 'text-warning'}`}>
                XP Penalty
              </label>
              <input
                type="number"
                name="punishment"
                value={formData.punishment}
                onChange={handleChange}
                className={`w-full bg-surface/80 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 transition-all ${
                  formData.itemType === 'tax' ? 'focus:ring-danger/50' : 'focus:ring-warning/50'
                }`}
                min="1"
              />
            </div>
          )}

           <div className="pt-6">
            <button
              type="submit"
              className="w-full md:w-auto bg-white text-background font-black uppercase tracking-wider py-4 px-10 rounded-xl transition-transform hover:scale-105 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-white/20 active:scale-95 flex items-center justify-center gap-3"
            >
              <PlusSquare size={20} />
              Deploy {formData.itemType}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItems;
