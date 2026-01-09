
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Upload, FileText, Download } from 'lucide-react';
import { Product } from '../types';
import { STANDARD_SIZES } from '../constants';

interface InventoryProps {
  inventory: Product[];
  setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, setInventory }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    code: '',
    name: '',
    price: 0,
    sizes: [],
    colors: [],
    isAvailable: true
  });

  const handleAddProduct = () => {
    if (!newProduct.code || !newProduct.name) return;
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      code: newProduct.code!,
      name: newProduct.name!,
      price: Number(newProduct.price) || 0,
      sizes: newProduct.sizes || [],
      colors: newProduct.colors || [],
      isAvailable: !!newProduct.isAvailable
    };
    setInventory([...inventory, product]);
    setShowAddForm(false);
    setNewProduct({ code: '', name: '', price: 0, sizes: [], colors: [], isAvailable: true });
  };

  const deleteProduct = (id: string) => {
    setInventory(inventory.filter(p => p.id !== id));
  };

  const toggleSize = (size: string) => {
    const current = newProduct.sizes || [];
    if (current.includes(size)) {
      setNewProduct({ ...newProduct, sizes: current.filter(s => s !== size) });
    } else {
      setNewProduct({ ...newProduct, sizes: [...current, size] });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">إدارة الأصناف</h1>
          <p className="text-gray-500 text-sm">أضف، عدل أو احذف منتجات متجرك</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
          >
            <Plus size={18} />
            إضافة صنف جديد
          </button>
          <label className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-50">
            <Upload size={18} />
            رفع ملف Excel/Word
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="font-bold mb-4">بيانات الصنف الجديد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كود الصنف</label>
              <input 
                type="text" 
                value={newProduct.code}
                onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="مثال: ABC-123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الصنف</label>
              <input 
                type="text" 
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="تيشيرت قطن"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ج.م)</label>
              <input 
                type="number" 
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التوفر</label>
              <select 
                value={newProduct.isAvailable ? "yes" : "no"}
                onChange={(e) => setNewProduct({...newProduct, isAvailable: e.target.value === "yes"})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="yes">متوفر</option>
                <option value="no">غير متوفر</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">المقاسات المتاحة</label>
            <div className="flex flex-wrap gap-2">
              {STANDARD_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    newProduct.sizes?.includes(size) 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600">إلغاء</button>
            <button onClick={handleAddProduct} className="bg-emerald-600 text-white px-6 py-2 rounded-lg">حفظ الصنف</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">كود الصنف</th>
              <th className="px-6 py-4 font-semibold text-gray-700">اسم الصنف</th>
              <th className="px-6 py-4 font-semibold text-gray-700">المقاسات</th>
              <th className="px-6 py-4 font-semibold text-gray-700">السعر</th>
              <th className="px-6 py-4 font-semibold text-gray-700">الحالة</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">لا يوجد أصناف حالياً</td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm">{item.code}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.sizes.map(s => <span key={s} className="bg-gray-100 text-[10px] px-1.5 py-0.5 rounded uppercase">{s}</span>)}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-700">{item.price} ج.م</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isAvailable ? 'متوفر' : 'نفذت الكمية'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit3 size={16} /></button>
                      <button onClick={() => deleteProduct(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
