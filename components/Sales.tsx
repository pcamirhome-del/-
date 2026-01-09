
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Order } from '../types';
import { CheckCircle2, Package, TrendingUp, AlertCircle } from 'lucide-react';

interface SalesProps {
  orders: Order[];
}

const Sales: React.FC<SalesProps> = ({ orders }) => {
  const approvedOrders = orders.filter(o => o.status === 'approved' || o.status === 'delivered');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalSales = approvedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const data = [
    { name: 'قيد المراجعة', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'الموافق عليها', value: orders.filter(o => o.status === 'approved').length, color: '#3b82f6' },
    { name: 'تم التسليم', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { name: 'المعلقة', value: orders.filter(o => o.status === 'suspended').length, color: '#ef4444' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">إحصائيات المبيعات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="إجمالي المبيعات" value={`${totalSales} ج.م`} icon={<TrendingUp />} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="الطلبات المقبولة" value={approvedOrders.length} icon={<CheckCircle2 />} color="bg-blue-50 text-blue-600" />
        <StatCard title="الطلبات المسلمة" value={deliveredOrders.length} icon={<Package />} color="bg-purple-50 text-purple-600" />
        <StatCard title="طلبات بانتظار الرد" value={orders.filter(o => o.status === 'pending').length} icon={<AlertCircle />} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-8">توزيع الطلبات حسب الحالة</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8f9fa' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: any; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

export default Sales;
