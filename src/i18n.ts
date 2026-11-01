export type Language = "ar" | "en" | "tr";

export const translations = {
  ar: {
    greeting: "أهلاً، أنا AERON", subtitle: "مساعدك الذكي، بلغتك وبطريقتك.",
    prompt: "وش تبي نسوي اليوم؟", chat: "المحادثة", learn: "تعلم التركية",
    settings: "الإعدادات", typeMessage: "اكتب رسالتك...", send: "إرسال",
    comingSoon: "هذه الميزة بنوصلها في المرحلة القادمة.",
    lessonTitle: "درس تركي سريع", lessonHint: "كلمات تركية ومعانيها",
    language: "لغة التطبيق", home: "الرئيسية", assistantReady: "جاهز للمساعدة"
  },
  en: {
    greeting: "Hello, I'm AERON", subtitle: "Your intelligent assistant, your way.",
    prompt: "What shall we do today?", chat: "Chat", learn: "Learn Turkish",
    settings: "Settings", typeMessage: "Type your message...", send: "Send",
    comingSoon: "This feature will be connected in a later stage.",
    lessonTitle: "Quick Turkish lesson", lessonHint: "Turkish words and meanings",
    language: "App language", home: "Home", assistantReady: "Ready to help"
  },
  tr: {
    greeting: "Merhaba, ben AERON", subtitle: "Akıllı yardımcın, senin tarzın.",
    prompt: "Bugün ne yapalım?", chat: "Sohbet", learn: "Türkçe öğren",
    settings: "Ayarlar", typeMessage: "Mesajını yaz...", send: "Gönder",
    comingSoon: "Bu özellik sonraki aşamada eklenecek.",
    lessonTitle: "Kısa Türkçe dersi", lessonHint: "Türkçe kelimeler ve anlamları",
    language: "Uygulama dili", home: "Ana sayfa", assistantReady: "Yardım için hazır"
  }
} as const;
