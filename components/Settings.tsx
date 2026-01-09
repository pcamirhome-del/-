
import React, { useState } from 'react';
import { Save, Lock, Code2, AlertTriangle, MessageCircle } from 'lucide-react';

interface SettingsProps {
  appName: string;
  setAppName: (name: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ appName, setAppName }) => {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [code, setCode] = useState('// اكتب الكود البرمجي هنا للتعديل المباشر على البرنامج\n\nfunction onUpdate() {\n  console.log("App Updated!");\n}');
  const [whatsappContact, setWhatsappContact] = useState('201000000000');

  const handleAdminLogin = () => {
    if (password === 'admin') {
      setIsAdmin(true);
      setPassword('');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleApplyCode = () => {
    // In a real sandbox, we would safely eval or inject. 
    // Here we simulate the process.
    alert('تم تطبيق التعديلات البرمجية بنجاح!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">إعدادات البرنامج</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> إعدادات عامة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">اسم البرنامج</label>
              <input 
                type="text" 
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">رقم واتساب للتواصل</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={whatsappContact}
                  onChange={(e) => setWhatsappContact(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-2 outline-none focus:border-emerald-500"
                />
                <MessageCircle size={18} className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button className="bg-emerald-600 text-white px-8 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2">
              <Save size={18} /> حفظ الإعدادات
            </button>
          </div>
        </section>

        {/* Developer Mode */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <Code2 className="w-5 h-5" /> وضع المطور (حقن كود)
            </h2>
            {!isAdmin && (
              <span className="bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded font-bold uppercase">محمي</span>
            )}
          </div>

          {!isAdmin ? (
            <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Lock className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4 text-sm">أدخل كلمة مرور المسؤول للوصول لهذه المنطقة</p>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-center outline-none"
                />
                <button 
                  onClick={handleAdminLogin}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
                >
                  دخول
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-700 text-sm">
                <AlertTriangle className="shrink-0" />
                <p>تنبيه: التعديلات في هذا القسم قد تؤدي إلى توقف البرنامج عن العمل إذا تمت كتابتها بشكل خاطئ.</p>
              </div>
              <textarea 
                dir="ltr"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-xl outline-none"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsAdmin(false)} className="text-gray-500 px-4">خروج من وضع المطور</button>
                <button 
                  onClick={handleApplyCode}
                  className="bg-gray-900 text-white px-8 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition-all"
                >
                  تطبيق التعديلات البرمجية
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;
