
import React from 'react';
import { Truck, Save } from 'lucide-react';
import { ShippingRate } from '../types';

interface ShippingProps {
  rates: ShippingRate[];
  setRates: React.Dispatch<React.SetStateAction<ShippingRate[]>>;
}

const Shipping: React.FC<ShippingProps> = ({ rates, setRates }) => {
  const updateRate = (gov: string, value: number) => {
    setRates(rates.map(r => r.governorate === gov ? { ...r, cost: value } : r));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">تكلفة الشحن للمحافظات</h1>
          <p className="text-gray-500 text-sm">حدد سعر التوصيل لكل محافظة في مصر</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-sm">
          <Save size={18} />
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rates.map((rate) => (
          <div key={rate.governorate} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Truck size={20} />
              </div>
              <span className="font-semibold text-gray-700">{rate.governorate}</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={rate.cost}
                onChange={(e) => updateRate(rate.governorate, Number(e.target.value))}
                className="w-20 border border-gray-300 rounded px-2 py-1 text-center font-bold outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-gray-400">ج.م</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shipping;
