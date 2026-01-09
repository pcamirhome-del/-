
import { GoogleGenAI, Type } from "@google/genai";
import { Product, ShippingRate, Order } from "../types";

interface ExtractedOrderData {
  customerName?: string;
  customerPhone?: string;
  address?: string;
  governorate?: string;
  productCode?: string;
  size?: string;
  color?: string;
}

export class AIService {
  private ai: GoogleGenAI | null = null;
  private model = "gemini-3-flash-preview";

  constructor() {
    try {
      if (process.env.API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      }
    } catch (e) {
      console.warn("AI Initialization warning:", e);
    }
  }

  async generateResponse(
    history: any[],
    inventory: Product[],
    shipping: ShippingRate[],
    currentMessage: string
  ): Promise<string> {
    if (!this.ai) return "عذراً، نظام الذكاء الاصطناعي غير جاهز حالياً. يرجى التأكد من مفتاح الربط. 🌸";

    const inventoryInfo = (inventory || [])
      .map(p => `كود: ${p.code}, الاسم: ${p.name}, السعر: ${p.price} ج.م, المقاسات: ${(p.sizes || []).join(",")}, الحالة: ${p.isAvailable ? 'متوفر' : 'غير متوفر حالياً'}`)
      .join("\n");
    
    const shippingInfo = (shipping || [])
      .map(s => `${s.governorate}: ${s.cost} ج.م`)
      .join("\n");

    const systemInstruction = `
      أنت مساعد مبيعات ذكي ومحترف لخدمة العملاء عبر واتساب.
      الأسلوب: ودود (Friendly)، احترافي (Professional)، يستخدم الرموز التعبيرية (Emojis).

      المعلومات المتاحة لك:
      المنتجات:\n${inventoryInfo || "لا توجد منتجات حالياً"}
      الشحن:\n${shippingInfo || "الشحن 50 لجميع المحافظات"}

      الخطوات:
      1. رحب بالعميل.
      2. إذا سأل عن منتج، اعطه سعره وتفاصيله.
      3. إذا طلب شحن، اسأله عن المحافظة واعطه السعر.
      4. اطلب البيانات (تليفون، عنوان، كود، مقاس، لون).
      5. احسب الإجمالي وأكد عليه أن المبيعات ستتواصل معه.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: currentMessage }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.8,
        }
      });
      return response.text || "أهلاً بك! كيف يمكنني مساعدتك اليوم؟ ✨";
    } catch (error) {
      console.error("AI Error:", error);
      return "أهلاً بك يا فندم! براجع البيانات وهرد على حضرتك حالاً. 🌸";
    }
  }

  async extractOrderData(chatHistory: string): Promise<ExtractedOrderData | null> {
    if (!this.ai) return null;
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Extract order details from this chat in JSON format: ${chatHistory}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              customerName: { type: Type.STRING },
              customerPhone: { type: Type.STRING },
              address: { type: Type.STRING },
              governorate: { type: Type.STRING },
              productCode: { type: Type.STRING },
              size: { type: Type.STRING },
              color: { type: Type.STRING },
            },
            required: ["customerPhone", "address", "productCode"]
          }
        }
      });
      
      const text = response.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Extraction Error:", error);
      return null;
    }
  }
}

export const aiService = new AIService();
