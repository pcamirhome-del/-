
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  MessageSquare, 
  ShoppingCart, 
  BarChart3, 
  Settings as SettingsIcon,
  Menu,
  X,
  Plus,
  Trash2,
  FileDown,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  PauseCircle,
  Smartphone,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Page, Product, ShippingRate, Order } from './types';
import { EGYPT_GOVERNORATES, STANDARD_SIZES } from './constants';
import Inventory from './components/Inventory';
import Shipping from './components/Shipping';
import AIChat from './components/AIChat';
import Orders from './components/Orders';
import Sales from './components/Sales';
import Settings from './components/Settings';

const STORAGE_KEYS = {
  INVENTORY: 'whatsapp_crm_inventory',
  SHIPPING: 'whatsapp_crm_shipping',
  ORDERS: 'whatsapp_crm_orders',
  APP_NAME: 'whatsapp_crm_name'
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [appName, setAppName] = useState(() => localStorage.getItem(STORAGE_KEYS.APP_NAME) || 'واتساب ذكي بلس');
  const [isWAConnected, setIsWAConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  
  // App Data State with LocalStorage Initialization
  const [inventory, setInventory] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (saved) return JSON.parse(saved);
    // Initial Sample Data
    return [
      { id: '1', code: 'TSH-001', name: 'تيشيرت صيفي قطن', price: 250, sizes: ['M', 'L', 'XL'], colors: ['أسود', 'أبيض'], isAvailable: true },
      { id: '2', code: 'PNTS-02', name: 'بنطلون جينز ليكرا', price: 450, sizes: ['32', '34', '36'], colors: ['أزرق'], isAvailable: true }
    ];
  });

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIPPING);
    if (saved) return JSON.parse(saved);
    return EGYPT_GOVERNORATES.map(gov => ({ 
      governorate: gov, 
      cost: gov === 'القاهرة' || gov === 'الجيزة' ? 50 : 65 
    }));
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(shippingRates));
  }, [shippingRates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_NAME, appName);
  }, [appName]);

  // Toggle Sidebar
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const checkConnection = () => {
    setIsCheckingConnection(true);
    // Simulate a network check to the WhatsApp API / AI Server
    setTimeout(() => {
      setIsCheckingConnection(false);
      if (!isWAConnected) setIsWAConnected(true);
    }, 1500);
  };

  // Render Page Content
  const renderContent = () => {
    switch (activePage) {
      case Page.DASHBOARD:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard 
                title="إجمالي الطلبات" 
                value={orders.length} 
                icon={<ShoppingCart className="w-8 h-8 text-blue-500" />} 
                color="bg-blue-50"
              />
              <DashboardCard 
                title="مبيعات اليوم" 
                value={`${orders.filter(o => o.status === 'approved' || o.status === 'delivered').reduce((acc, curr) => acc + curr.totalAmount, 0)} ج.م`} 
                icon={<BarChart3 className="w-8 h-8 text-green-500" />} 
                color="bg-green-50"
              />
              <DashboardCard 
                title="الأصناف المتوفرة" 
                value={inventory.filter(p => p.isAvailable).length} 
                icon={<Package className="w-8 h-8 text-purple-500" />} 
                color="bg-purple-50"
              />
              <DashboardCard 
                title="حالة النظام" 
                value={isWAConnected ? "متصل فعال" : "غير متصل"} 
                icon={isWAConnected ? <Wifi className="w-8 h-8 text-emerald-500" /> : <WifiOff className="w-8 h-8 text-red-500" />} 
                color={isWAConnected ? "bg-emerald-50" : "bg-red-50"}
              />
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold mb-4">اتصال النظام والذكاء الاصطناعي</h2>
              {!isWAConnected ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <Smartphone className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4 text-center">قم بربط حساب واتساب الخاص بك لتفعيل الردود الاحترافية</p>
                  <button 
                    onClick={() => setIsWAConnected(true)}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100"
                  >
                    تفعيل الربط الآن
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-emerald-50 rounded-2xl text-emerald-700 border border-emerald-100">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="relative">
                       <CheckCircle2 className="w-10 h-10" />
                       <span className="absolute -top-1 -right-1 flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                       </span>
                    </div>
                    <div>
                      <span className="font-bold text-lg block">النظام متصل وشغال 100%</span>
                      <span className="text-sm opacity-80">الذكاء الاصطناعي جاهز للرد على العملاء فوراً</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={checkConnection}
                      disabled={isCheckingConnection}
                      className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={18} className={isCheckingConnection ? "animate-spin" : ""} />
                      {isCheckingConnection ? "جاري الفحص..." : "فحص الاتصال"}
                    </button>
                    <button 
                      onClick={() => setIsWAConnected(false)}
                      className="text-red-600 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      قطع الاتصال
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case Page.INVENTORY:
        return <Inventory inventory={inventory} setInventory={setInventory} />;
      case Page.SHIPPING:
        return <Shipping rates={shippingRates} setRates={setShippingRates} />;
      case Page.AI_CHAT:
        return <AIChat inventory={inventory} shipping={shippingRates} orders={orders} setOrders={setOrders} />;
      case Page.ORDERS:
        return <Orders orders={orders} setOrders={setOrders} />;
      case Page.SALES:
        return <Sales orders={orders} />;
      case Page.SETTINGS:
        return <Settings appName={appName} setAppName={setAppName} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-l border-gray-200 transition-all duration-300 flex flex-col shadow-xl z-20`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
               <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">W</div>
               <span className="font-bold text-gray-800 text-lg truncate">{appName}</span>
            </div>
          )}
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard />} 
            label="الرئيسية" 
            active={activePage === Page.DASHBOARD} 
            onClick={() => setActivePage(Page.DASHBOARD)} 
            collapsed={!isSidebarOpen} 
          />
          <SidebarItem 
            icon={<Package />} 
            label="إدارة الأصناف" 
            active={activePage === Page.INVENTORY} 
            onClick={() => setActivePage(Page.INVENTORY)} 
            collapsed={!isSidebarOpen} 
          />
          <SidebarItem 
            icon={<Truck />} 
            label="أسعار الشحن" 
            active={activePage === Page.SHIPPING} 
            onClick={() => setActivePage(Page.SHIPPING)} 
            collapsed={!isSidebarOpen} 
          />
          <SidebarItem 
            icon={<MessageSquare />} 
            label="الذكاء الاصطناعي" 
            active={activePage === Page.AI_CHAT} 
            onClick={() => setActivePage(Page.AI_CHAT)} 
            collapsed={!isSidebarOpen} 
          />
          <SidebarItem 
            icon={<ShoppingCart />} 
            label="الطلبات" 
            active={activePage === Page.ORDERS} 
            onClick={() => setActivePage(Page.ORDERS)} 
            collapsed={!isSidebarOpen} 
          />
          <SidebarItem 
            icon={<BarChart3 />} 
            label="المبيعات" 
            active={activePage === Page.SALES} 
            onClick={() => setActivePage(Page.SALES)} 
            collapsed={!isSidebarOpen} 
          />
          <SidebarItem 
            icon={<SettingsIcon />} 
            label="الإعدادات" 
            active={activePage === Page.SETTINGS} 
            onClick={() => setActivePage(Page.SETTINGS)} 
            collapsed={!isSidebarOpen} 
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center px-6 justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            {activePage === Page.DASHBOARD && <LayoutDashboard className="text-emerald-500" size={20} />}
            {activePage === Page.INVENTORY && <Package className="text-emerald-500" size={20} />}
            {activePage === Page.SHIPPING && <Truck className="text-emerald-500" size={20} />}
            {activePage === Page.AI_CHAT && <MessageSquare className="text-emerald-500" size={20} />}
            {activePage === Page.ORDERS && <ShoppingCart className="text-emerald-500" size={20} />}
            {activePage === Page.SALES && <BarChart3 className="text-emerald-500" size={20} />}
            {activePage === Page.SETTINGS && <SettingsIcon className="text-emerald-500" size={20} />}
            <span className="hidden sm:inline">
              {activePage === Page.DASHBOARD && "الرئيسية"}
              {activePage === Page.INVENTORY && "إدارة الأصناف"}
              {activePage === Page.SHIPPING && "أسعار الشحن للمحافظات"}
              {activePage === Page.AI_CHAT && "مساعد الذكاء الاصطناعي"}
              {activePage === Page.ORDERS && "إدارة الطلبات والفواتير"}
              {activePage === Page.SALES && "إحصائيات المبيعات"}
              {activePage === Page.SETTINGS && "إعدادات البرنامج"}
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={checkConnection}
              disabled={isCheckingConnection}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"
              title="فحص حالة الاتصال"
            >
              <RefreshCw size={20} className={isCheckingConnection ? "animate-spin text-emerald-500" : ""} />
            </button>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${isWAConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              <span className={`w-2 h-2 rounded-full ${isWAConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isWAConnected ? 'النظام متصل' : 'النظام منفصل'}
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
      active 
        ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-gray-400'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 22 })}
    </div>
    {!collapsed && <span className="text-sm">{label}</span>}
  </button>
);

const DashboardCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 bg-white hover:shadow-md transition-shadow cursor-default`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default App;
