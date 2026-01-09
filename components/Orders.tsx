
import React, { useState } from 'react';
import { Eye, FileDown, Trash2, CheckCircle, Clock, PauseCircle, Phone, MapPin, Package, ShoppingCart } from 'lucide-react';
import { Order } from '../types';

interface OrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const Orders: React.FC<OrdersProps> = ({ orders, setOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    if (selectedOrder?.id === id) setSelectedOrder(null);
  };

  const statusMap = {
    pending: { label: 'قيد المراجعة', color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} /> },
    approved: { label: 'تمت الموافقة', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={14} /> },
    delivered: { label: 'تم التسليم', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={14} /> },
    suspended: { label: 'معلق', color: 'bg-red-100 text-red-700', icon: <PauseCircle size={14} /> }
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
      {/* List */}
      <div className="w-full md:w-1/2 lg:w-1/3 overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-700">جميع الطلبات ({orders.length})</div>
        <div className="flex-1 overflow-y-auto">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">لا يوجد طلبات حالياً</div>
          ) : (
            orders.map(order => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedOrder?.id === order.id ? 'bg-emerald-50 border-emerald-100' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800">{order.customerName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-medium ${statusMap[order.status].color}`}>
                    {statusMap[order.status].icon}
                    {statusMap[order.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Phone size={12} /> {order.customerPhone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Package size={12} /> {order.items[0]?.productName} ({order.items[0]?.size})
                </div>
                <div className="mt-2 text-sm font-bold text-emerald-600">{order.totalAmount} ج.م</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invoice Detail */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-y-auto flex flex-col">
        {selectedOrder ? (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">تفاصيل الفاتورة</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">Order ID: #{selectedOrder.id}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"><FileDown size={20} /></button>
                <button onClick={() => deleteOrder(selectedOrder.id)} className="p-2 bg-white border border-gray-200 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={20} /></button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">بيانات العميل</h4>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{selectedOrder.customerName}</p>
                    <p className="text-gray-600 flex items-center gap-2"><Phone size={14} /> {selectedOrder.customerPhone}</p>
                    <p className="text-gray-600 flex items-center gap-2"><MapPin size={14} /> {selectedOrder.address}</p>
                    <p className="text-gray-500 text-sm">{selectedOrder.governorate}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">حالة الطلب</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(statusMap) as Array<Order['status']>).map(s => (
                      <button 
                        key={s}
                        onClick={() => updateStatus(selectedOrder.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedOrder.status === s ? statusMap[s].color + ' ring-2 ring-offset-2 ring-emerald-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {statusMap[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">الأصناف المطلوبة</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500">
                      <tr>
                        <th className="px-4 py-3">الصنف</th>
                        <th className="px-4 py-3">المقاس/اللون</th>
                        <th className="px-4 py-3 text-left">السعر</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-50">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-semibold">{item.productName} ({item.productCode})</td>
                          <td className="px-4 py-3">{item.size} / {item.color}</td>
                          <td className="px-4 py-3 text-left">{item.price} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{selectedOrder.totalAmount - selectedOrder.shippingCost} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>مصاريف الشحن ({selectedOrder.governorate})</span>
                  <span>{selectedOrder.shippingCost} ج.م</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-xl text-emerald-700">
                  <span>الإجمالي الكلي</span>
                  <span>{selectedOrder.totalAmount} ج.م</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
                  حفظ الطلب
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <ShoppingCart size={64} className="mb-4 text-gray-200" />
            <p>اختر طلباً من القائمة لعرض تفاصيل الفاتورة وتعديلها</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
