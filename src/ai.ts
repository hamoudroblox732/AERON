import { Language } from "./i18n";

export type AERONMessage = { id: string; role: "user" | "assistant"; text: string };

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isAeronConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function askAeron(messages: AERONMessage[], language: Language): Promise<string> {
  if (!isAeronConfigured()) {
    throw new Error("الخادم غير مربوط. نحتاج إعداد Supabase أولاً قبل تشغيل الذكاء الاصطناعي.");
  }

  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/aeron-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      language,
      messages: messages.slice(-16).map(({ role, text }) => ({ role, content: text }))
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "تعذر الاتصال بـ AERON. تحقق من إعداد الخادم.");
  }
  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("وصل رد غير مفهوم من الخادم. حاول مرة ثانية.");
  }
  return data.reply.trim();
}
