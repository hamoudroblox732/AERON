import { Language } from "./i18n";

export type AERONMessage = { id: string; role: "user" | "assistant"; text: string };

// Supabase anon is a public client key. Keep service_role and OpenAI keys server-side only.
const SUPABASE_URL = "https://cezeunjaurhfdevuaidp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlemV1bmphdXJoZmRldnVhaWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NTczNjMsImV4cCI6MjEwOTEzMzM2M30.N_Vd4cOWNJwP5VUcglJaZz3hJhtAKZa-zkHTIVRzOf4";

export function isAeronConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function askAeron(messages: AERONMessage[], language: Language): Promise<string> {
  if (!isAeronConfigured()) {
    throw new Error("خدمة aeron غير مضبوطة. تحقق من إعدادات الاتصال.");
  }

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
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "تعذر الاتصال بـ aeron. حاول مرة ثانية.");
  }
  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("وصل رد غير مفهوم من الخادم. حاول مرة ثانية.");
  }
  return data.reply.trim();
}
