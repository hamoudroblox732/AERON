import { Language } from "./i18n";

export type AERONMessage = { id: string; role: "user" | "assistant"; text: string };

const SUPABASE_URL = "https://cezeunjaurhfdevuaidp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXAiLCJyZWYiOiJjZXpldW5qYXVy aGZkZXZ1YWlkcCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzkzNTU3MzYzLCJleHAiOjIxMDkxMzM2MzN9.N_Vd4cOWNJwP5VUcglJaZz3hJhtAKZa-zkHTIVRzOf4".replace(/\s/g, "");

export function isAeronConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function askAeron(messages: AERONMessage[], language: Language): Promise<string> {
  if (!isAeronConfigured()) {
    throw new Error("خدمة AERON غير مضبوطة. تحقق من إعدادات الاتصال.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/aeron-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        language,
        messages: messages.slice(-16).map(({ role, text }) => ({ role, content: text }))
      }),
      signal: controller.signal
    });

    const raw = await response.text();
    let data: { reply?: unknown; error?: unknown } = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { /* handled below */ }

    if (!response.ok) {
      const detail = typeof data.error === "string" ? data.error : "";
      throw new Error(detail || `تعذر الاتصال بالخادم (HTTP ${response.status}).`);
    }
    if (typeof data.reply !== "string" || !data.reply.trim()) {
      throw new Error("الخادم لم يرجع ردًا مفهومًا. جرّب مرة ثانية.");
    }
    return data.reply.trim();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("تأخر الرد أكثر من 25 ثانية. تحقق من الاتصال وحاول مرة ثانية.");
    }
    if (error instanceof TypeError) {
      throw new Error("تعذر الوصول إلى خادم AERON. تحقق من الإنترنت وحاول مجددًا.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
