
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Upload, FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { STANDARD_SIZES } from '../constants';

interface InventoryProps {
  inventory: Product[];
  setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, setInventory }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    code: '',
    name: '',
    price: 0,
    sizes: [],
    colors: [],
    isAvailable: true
  });

  const handleAddProduct = () => {
    if (!newProduct.code || !newProduct.name) {
      alert("يرجى إدخال الكود واسم الصنف");
      return;
    }
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      code: newProduct.code!,
      name: newProduct.name!,
      price: Number(newProduct.price) || 0,
      sizes: newProduct.sizes || [],
      colors: newProduct.colors || [],
      isAvailable: !!newProduct.isAvailable
    };
    setInventory([...(inventory || []), product]);
    setShowAddForm(false);
    setNewProduct({ code: '', name: '', price: 0, sizes: [], colors: [], isAvailable: true });
  };

  const deleteProduct = (id: string) => {
    if (window.confirm("هل تريد حذف هذا الصنف؟")) {
      setInventory((inventory || []).filter(p => p.id !== id));
    }
  };

  const toggleSize = (size: string) => {
    const current = newProduct.sizes || [];
    if (current.includes(size)) {
      setNewProduct({ ...newProduct, sizes: current.filter(s => s !== size) });
    } else {
      setNewProduct({ ...newProduct, sizes: [...current, size] });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate reading file
      setTimeout(() => {
        alert("تم استيراد البيانات من الملف بنجاح!");
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">إدارة الأصناف</h1>
          <p className="text-gray-500 text-sm">أضف، عدل أو استورد منتجاتك بسهولة</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md"
          >
            <Plus size={18} />
            إضافة صنف جديد
          </button>
          <label className={`bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={18} className={isUploading ? 'animate-bounce' : ''} />
            {isUploading ? 'جاري الاستيراد...' : 'رفع ملف Excel/Word'}
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".csv,.xlsx,.xls,.docx,.doc" />
          </label>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-emerald-700">
            <Plus size={20} /> بيانات الصنف الجديد
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">كود الصنف</label>
              <input 
                type="text" 
                value={newProduct.code}
                onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="مثال: TSH-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">اسم الصنف</label>
              <input 
                type="text" 
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="اسم المنتج"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">السعر</label>
              <input 
                type="number" 
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">الحالة</label>
              <select 
                value={newProduct.isAvailable ? "yes" : "no"}
                onChange={(e) => setNewProduct({...newProduct, isAvailable: e.target.value === "yes"})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="yes">متوفر ✅</option>
                <option value="no">غير متوفر ❌</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-tight">المقاسات (اختر المتوفر)</label>
            <div className="flex flex-wrap gap-2">
              {(STANDARD_SIZES || []).map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    newProduct.sizes?.includes(size) 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowAddForm(false)} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg transition-all">إلغاء</button>
            <button onClick={handleAddProduct} className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">حفظ الصنف</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">كود الصنف</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">اسم الصنف</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">المقاسات</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-left">السعر</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">الحالة</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(!inventory || inventory.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText size={48} className="mb-2 opacity-20" />
                      <p className="font-bold">لا توجد أصناف ظاهرة حالياً</p>
                      <p className="text-xs">جرب إضافة صنف جديد أو رفع ملف البيانات</p>
                    </div>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">{item.code}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(item.sizes || []).map(s => (
                          <span key={s} className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded font-bold">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700 text-left">{item.price} ج.م</td>
                    <td className="px-6 py-4">
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                          <CheckCircle size={10} /> متوفر
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-full text-[10px] font-bold border border-red-100">
                          <AlertTriangle size={10} /> غير متوفر
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => deleteProduct(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
