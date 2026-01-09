
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
  WifiOff,
  Database,
  AlertCircle
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
  INVENTORY: 'whatsapp_crm_inventory_v3', // Changed version to force fresh load
  SHIPPING: 'whatsapp_crm_shipping_v3',
  ORDERS: 'whatsapp_crm_orders_v3',
  APP_NAME: 'whatsapp_crm_name_v3'
};

const SAMPLE_INVENTORY: Product[] = [
  { id: '1', code: 'TSH-001', name: 'تيشيرت صيفي قطن مصري فاخر', price: 250, sizes: ['M', 'L', 'XL'], colors: ['أسود', 'أبيض'], isAvailable: true },
  { id: '2', code: 'PNTS-02', name: 'بنطلون جينز ليكرا أزرق غامق', price: 450, sizes: ['32', '34', '36'], colors: ['أزرق'], isAvailable: true },
  { id: '3', code: 'SH-05', name: 'قميص كتان بيج كاجوال', price: 380, sizes: ['L', 'XL', 'XXL'], colors: ['بيج'], isAvailable: true }
];

const DEFAULT_SHIPPING = EGYPT_GOVERNORATES.map(gov => ({ 
  governorate: gov, 
  cost: gov === 'القاهرة' || gov === 'الجيزة' ? 50 : 65 
}));

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [appName, setAppName] = useState('واتساب ذكي بلس');
  const [isWAConnected, setIsWAConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  
  // Data State with initial empty arrays
  const [inventory, setInventory] = useState<Product[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initial Data Hydration from LocalStorage with Fallbacks
  useEffect(() => {
    try {
      // 1. App Name
      const savedName = localStorage.getItem(STORAGE_KEYS.APP_NAME);
      if (savedName) setAppName(savedName);

      // 2. Inventory
      const savedInv = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (savedInv) {
        const parsed = JSON.parse(savedInv);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInventory(parsed);
        } else {
          setInventory(SAMPLE_INVENTORY);
        }
      } else {
        setInventory(SAMPLE_INVENTORY);
      }

      // 3. Shipping
      const savedShipping = localStorage.getItem(STORAGE_KEYS.SHIPPING);
      if (savedShipping) {
        const parsed = JSON.parse(savedShipping);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setShippingRates(parsed);
        } else {
          setShippingRates(DEFAULT_SHIPPING);
        }
      } else {
        setShippingRates(DEFAULT_SHIPPING);
      }

      // 4. Orders
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) setOrders(parsed);
      }
    } catch (e) {
      console.error("Critical error loading data:", e);
      // Absolute fallback if everything fails
      setInventory(SAMPLE_INVENTORY);
      setShippingRates(DEFAULT_SHIPPING);
    }
  }, []);

  // Persist data on every change
  useEffect(() => {
    if (inventory.length > 0) localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    if (shippingRates.length > 0) localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(shippingRates));
  }, [shippingRates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_NAME, appName);
  }, [appName]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  const resetAllData = () => {
    if (window.confirm("هل أنت متأكد من مسح جميع البيانات واستعادة الإعدادات الافتراضية؟")) {
      localStorage.clear();
      setInventory(SAMPLE_INVENTORY);
      setShippingRates(DEFAULT_SHIPPING);
      setOrders([]);
      alert("تمت استعادة البيانات بنجاح");
      window.location.reload();
    }
  };

  const checkConnection = () => {
    setIsCheckingConnection(true);
    setTimeout(() => {
      setIsCheckingConnection(false);
      setIsWAConnected(true);
    }, 1200);
  };

  const renderContent = () => {
    // Safety check for empty or undefined data
    const safeInventory = inventory || [];
    const safeShipping = shippingRates || [];
    const safeOrders = orders || [];

    switch (activePage) {
      case Page.DASHBOARD:
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">لوحة التحكم</h1>
              <button 
                onClick={resetAllData}
                className="text-xs text-red-500 flex items-center gap-1 hover:underline bg-red-50 px-3 py-1.5 rounded-lg"
              >
                <Database size={12} /> تصفير البيانات وإصلاح النظام
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard 
                title="إجمالي الطلبات" 
                value={safeOrders.length} 
                icon={<ShoppingCart className="w-8 h-8 text-blue-500" />} 
                color="bg-blue-50"
              />
              <DashboardCard 
                title="مبيعات اليوم" 
                value={`${safeOrders.filter(o => o.status === 'approved' || o.status === 'delivered').reduce((acc, curr) => acc + curr.totalAmount, 0)} ج.م`} 
                icon={<BarChart3 className="w-8 h-8 text-green-500" />} 
                color="bg-green-50"
              />
              <DashboardCard 
                title="الأصناف المتوفرة" 
                value={safeInventory.filter(p => p.isAvailable).length} 
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

            {safeInventory.length === 0 && (
              <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 animate-pulse">
                <AlertCircle />
                <p className="text-sm font-bold">تنبيه: لا توجد أصناف ظاهرة حالياً. يرجى الضغط على زر "تصفير البيانات" بالأعلى لإظهار البيانات التجريبية.</p>
              </div>
            )}
            
            <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold mb-4">اتصال حساب واتساب</h2>
              {!isWAConnected ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <Smartphone className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4 text-center">اربط حسابك لتفعيل الرد التلقائي الذكي على العملاء</p>
                  <button 
                    onClick={() => setIsWAConnected(true)}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg"
                  >
                    تفعيل الربط الآن
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-emerald-50 rounded-2xl text-emerald-700 border border-emerald-100">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-10 h-10" />
                    <div>
                      <span className="font-bold text-lg block">النظام متصل (Online)</span>
                      <span className="text-sm opacity-80">الذكاء الاصطناعي يراقب الدردشات الآن</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={checkConnection} className="bg-white text-emerald-600 px-4 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-100">
                      تحديث الحالة
                    </button>
                    <button onClick={() => setIsWAConnected(false)} className="text-red-500 px-4 py-2 hover:bg-red-50 rounded-lg">
                      فصل الربط
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case Page.INVENTORY:
        return <Inventory inventory={safeInventory} setInventory={setInventory} />;
      case Page.SHIPPING:
        return <Shipping rates={safeShipping} setRates={setShippingRates} />;
      case Page.AI_CHAT:
        return <AIChat inventory={safeInventory} shipping={safeShipping} orders={safeOrders} setOrders={setOrders} />;
      case Page.ORDERS:
        return <Orders orders={safeOrders} setOrders={setOrders} />;
      case Page.SALES:
        return <Sales orders={safeOrders} />;
      case Page.SETTINGS:
        return <Settings appName={appName} setAppName={setAppName} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">
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
          <SidebarItem icon={<LayoutDashboard />} label="الرئيسية" active={activePage === Page.DASHBOARD} onClick={() => setActivePage(Page.DASHBOARD)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<Package />} label="إدارة الأصناف" active={activePage === Page.INVENTORY} onClick={() => setActivePage(Page.INVENTORY)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<Truck />} label="أسعار الشحن" active={activePage === Page.SHIPPING} onClick={() => setActivePage(Page.SHIPPING)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<MessageSquare />} label="الذكاء الاصطناعي" active={activePage === Page.AI_CHAT} onClick={() => setActivePage(Page.AI_CHAT)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<ShoppingCart />} label="الطلبات" active={activePage === Page.ORDERS} onClick={() => setActivePage(Page.ORDERS)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<BarChart3 />} label="المبيعات" active={activePage === Page.SALES} onClick={() => setActivePage(Page.SALES)} collapsed={!isSidebarOpen} />
          <SidebarItem icon={<SettingsIcon />} label="الإعدادات" active={activePage === Page.SETTINGS} onClick={() => setActivePage(Page.SETTINGS)} collapsed={!isSidebarOpen} />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center px-6 justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-700">
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
            <button onClick={checkConnection} disabled={isCheckingConnection} className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw size={20} className={isCheckingConnection ? "animate-spin text-emerald-500" : "text-gray-400"} />
            </button>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${isWAConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              <span className={`w-2 h-2 rounded-full ${isWAConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isWAConnected ? 'متصل' : 'منفصل'}
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

interface SidebarItemProps { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; collapsed: boolean; }
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, collapsed }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-emerald-600 text-white font-bold shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
    <div className={`${active ? 'text-white' : 'text-gray-400'}`}>{React.cloneElement(icon as React.ReactElement, { size: 22 })}</div>
    {!collapsed && <span className="text-sm">{label}</span>}
  </button>
);

const DashboardCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 bg-white hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default App;
