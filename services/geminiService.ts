
import { GoogleGenAI, Type } from "@google/genai";
import { Product, ShippingRate, Order } from "../types";

// Adding an interface to handle extracted data properties that don't map directly to the Order interface structure
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
  private ai: GoogleGenAI;
  private model = "gemini-3-flash-preview";

  constructor() {
    // API key must be obtained exclusively from process.env.API_KEY using named parameter
    // The environment handles the actual key provided by the user.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async generateResponse(
    history: any[],
    inventory: Product[],
    shipping: ShippingRate[],
    currentMessage: string
  ) {
    const inventoryInfo = inventory
      .map(p => `كود: ${p.code}, الاسم: ${p.name}, السعر: ${p.price} ج.م, المقاسات: ${p.sizes.join(",")}, الحالة: ${p.isAvailable ? 'متوفر' : 'غير متوفر حالياً'}`)
      .join("\n");
    
    const shippingInfo = shipping
      .map(s => `${s.governorate}: ${s.cost} ج.م`)
      .join("\n");

    const systemInstruction = `
      أنت مساعد مبيعات ذكي ومحترف لخدمة العملاء عبر واتساب.
      يجب أن يكون أسلوبك:
      - ودود للغاية (Friendly) ومرحب بالعملاء وكأنك صديق لهم.
      - احترافي ومنظم (Professional) في عرض الأسعار والتفاصيل.
      - استخدم إيموجي (Emojis) مناسبة (مثل 🌸، ✨، 🚚، 🛍️) لجعل المحادثة حيوية وودودة.
      - تحدث بالعامية المصرية المهذبة أو العربية الفصحى البسيطة.

      مهامك الأساسية:
      1. الرد على استفسارات المنتجات بناءً على هذه القائمة:
      ${inventoryInfo}
      2. إذا سأل العميل عن الشحن، اطلب منه المحافظة وأخبره بالتكلفة من القائمة التالية:
      ${shippingInfo}
      3. اطلب من العميل البيانات التالية لإتمام الطلب: (رقم الهاتف، العنوان بالتفصيل، كود الصنف أو اسمه، المقاس، واللون).
      4. بمجرد استلام البيانات، قم بحساب الإجمالي (سعر المنتج + الشحن) وأكد للعميل أنه سيتم التواصل معه هاتفياً للتأكيد النهائي.
      5. اجعل رسائلك قصيرة ومنسقة لتناسب تطبيق واتساب.
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
      return response.text || "أهلاً بك! نعتذر عن هذا الخطأ البسيط، هل يمكنك إعادة إرسال طلبك؟ ✨";
    } catch (error) {
      console.error("AI Error:", error);
      return "عذراً يا فندم، حصل ضغط على النظام حالياً. ثواني وهكون مع حضرتك! 🌸";
    }
  }

  async extractOrderData(chatHistory: string): Promise<ExtractedOrderData | null> {
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
      if (text) {
        return JSON.parse(text) as ExtractedOrderData;
      }
    } catch (error) {
      console.error("Extraction Error:", error);
    }
    return null;
  }
}

export const aiService = new AIService();
