
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BrainCircuit, Sparkles, Loader2, Wifi, MessageCircle } from 'lucide-react';
import { Product, ShippingRate, Order, ChatMessage } from '../types';
import { aiService } from '../services/geminiService';

interface AIChatProps {
  inventory: Product[];
  shipping: ShippingRate[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AIChat: React.FC<AIChatProps> = ({ inventory, shipping, orders, setOrders }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call AI
    const responseText = await aiService.generateResponse(messages, inventory, shipping, input);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);

    // Try to extract order if user seems to be providing details
    if (input.length > 10) {
      const extracted = await aiService.extractOrderData([...messages, userMsg].map(m => m.parts[0].text).join("\n"));
      if (extracted && extracted.customerPhone && extracted.address) {
        // Find product price
        const product = inventory.find(p => p.code === extracted.productCode);
        const shipCost = shipping.find(s => s.governorate === extracted.governorate)?.cost || 50;
        const total = (product?.price || 0) + shipCost;

        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          customerName: extracted.customerName || "عميل واتساب",
          customerPhone: extracted.customerPhone!,
          address: extracted.address!,
          governorate: extracted.governorate || "غير محدد",
          items: [{
            productCode: extracted.productCode!,
            productName: product?.name || extracted.productCode!,
            size: extracted.size || "M",
            color: extracted.color || "غير محدد",
            price: product?.price || 0
          }],
          shippingCost: shipCost,
          totalAmount: total,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        setOrders(prev => [...prev, newOrder]);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col bg-gray-50/50">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">المساعد الذكي (Smart Bot)</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">الذكاء الاصطناعي متصل</p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Wifi size={14} className="text-emerald-500" />
          <span>حالة الاتصال: ممتازة</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 mb-4 px-2 custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
               <MessageCircle size={40} className="text-emerald-200" />
            </div>
            <div>
              <p className="text-gray-500 font-bold">ابدأ محاكاة المحادثة الآن!</p>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">تخيل أنك العميل وارسل استفساراً عن منتج أو اطلب أوردر لتشاهد كيف يرد المساعد الذكي.</p>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl relative shadow-sm ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tl-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-tr-none'
            }`}>
              <div className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-emerald-600" />}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] opacity-60 font-bold uppercase tracking-tighter">
                    {m.role === 'user' ? 'العميل' : 'المساعد الذكي'}
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.parts[0].text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={16} />
              </div>
              <span className="text-xs font-bold text-gray-400">جاري كتابة الرد الاحترافي...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-5 group-focus-within:opacity-10 transition-opacity"></div>
        <div className="relative bg-white border border-gray-200 rounded-2xl p-2 flex items-center shadow-lg shadow-gray-200/50">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالة العميل (مثلاً: عايز تيشيرت مقاس XL)..."
            className="flex-1 bg-transparent border-none px-4 py-3 outline-none text-gray-700 placeholder:text-gray-300"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all disabled:bg-gray-100 disabled:text-gray-300 shadow-md shadow-emerald-100"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-400 mt-4">
        هذا الجزء مخصص لمحاكاة ردود واتساب. جميع الردود يتم إنشاؤها بواسطة الذكاء الاصطناعي (Gemini).
      </p>
    </div>
  );
};

export default AIChat;
