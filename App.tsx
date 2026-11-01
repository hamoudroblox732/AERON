import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Orb } from "./src/components/Orb";
import { Language, translations } from "./src/i18n";
import { colors, spacing } from "./src/theme";
import { askAeron, isAeronConfigured } from "./src/ai";

type Tab = "home" | "chat" | "learn" | "settings";
type ChatMessage = { id: string; role: "user" | "assistant"; text: string };
const CHAT_STORAGE_KEY = "aeron.chat.v1";
const LANGUAGE_STORAGE_KEY = "aeron.language.v1";
const quizQuestions = [
  { question: "وش معنى Merhaba؟", options: ["مع السلامة", "مرحباً", "شكراً"], answer: 1, explanation: "Merhaba تعني مرحباً." },
  { question: "كيف تقول شكراً بالتركي؟", options: ["Teşekkür ederim", "Lütfen", "Görüşürüz"], answer: 0, explanation: "Teşekkür ederim تعني شكراً لك." },
  { question: "وش معنى Nasılsın؟", options: ["أين أنت؟", "كم عمرك؟", "كيف حالك؟"], answer: 2, explanation: "Nasılsın تعني كيف حالك؟" },
  { question: "وش معنى Lütfen؟", options: ["من فضلك", "صباح الخير", "لا أفهم"], answer: 0, explanation: "Lütfen تعني من فضلك." },
  { question: "كيف تقول أراك لاحقاً؟", options: ["Merhaba", "Görüşürüz", "Anlamadım"], answer: 1, explanation: "Görüşürüz تعني أراك لاحقاً." }
];


const words = [
  { tr: "Merhaba", ar: "مرحباً", en: "Hello" },
  { tr: "Nasılsın?", ar: "كيف حالك؟", en: "How are you?" },
  { tr: "Teşekkür ederim", ar: "شكراً لك", en: "Thank you" },
  { tr: "Görüşürüz", ar: "أراك لاحقاً", en: "See you" },
  { tr: "Lütfen", ar: "من فضلك", en: "Please" },
  { tr: "Anlamadım", ar: "لم أفهم", en: "I didn't understand" }
];

export default function App() {
  const [language, setLanguage] = useState<Language>("ar");
  const [tab, setTab] = useState<Tab>("home");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const t = useMemo(() => translations[language], [language]);
  const rtl = language === "ar";

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [savedChat, savedLanguage] = await Promise.all([
          AsyncStorage.getItem(CHAT_STORAGE_KEY),
          AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
        ]);
        if (!active) return;
        if (savedChat) {
          const parsed = JSON.parse(savedChat);
          if (Array.isArray(parsed)) setMessages(parsed.filter((item) =>
            item && typeof item.id === "string" &&
            (item.role === "user" || item.role === "assistant") &&
            typeof item.text === "string"
          ));
        }
        if (savedLanguage === "ar" || savedLanguage === "en" || savedLanguage === "tr") {
          setLanguage(savedLanguage);
        }
      } catch {
        if (active) setError("تعذر تحميل المحادثة المحفوظة.");
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages)).catch(() => {
      setError("تعذر حفظ المحادثة على الجهاز.");
    });
  }, [messages, loaded]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language).catch(() => {});
  }, [language, loaded]);

  const sendMessage = async () => {
    const clean = message.trim();
    if (!clean || busy || !loaded) return;
    const userMessage: ChatMessage = { id: String(Date.now()), role: "user", text: clean };
    const next = [...messages, userMessage];
    setMessages(next);
    setMessage("");
    setError("");
    setBusy(true);
    try {
      const reply = await askAeron(next, language);
      setMessages((current) => [...current, {
        id: String(Date.now() + 1), role: "assistant", text: reply
      }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "صار خطأ غير متوقع. حاول مرة ثانية.");
    } finally {
      setBusy(false);
    }
  };

  const clearChat = () => {
    Alert.alert("مسح المحادثة", "هل تبي تمسح كل رسائل AERON المحفوظة على هذا الجهاز؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "مسح", style: "destructive", onPress: () => {
        setMessages([]);
        setError("");
      }}
    ]);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: t.home }, { id: "chat", label: t.chat },
    { id: "learn", label: t.learn }, { id: "settings", label: t.settings }
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View><Text style={styles.brand}>aeron</Text><Text style={styles.eyebrow}>PERSONAL AI</Text></View>
          <View style={styles.status}><View style={styles.dot} /><Text style={styles.statusText}>{t.assistantReady}</Text></View>
        </View>
        <View style={styles.nav}>
          {tabs.map((item) => <Pressable key={item.id} onPress={() => setTab(item.id)} style={[styles.navItem, tab === item.id && styles.navActive]}>
            <Text style={[styles.navText, tab === item.id && styles.navTextActive]}>{item.label}</Text>
          </Pressable>)}
        </View>

        {tab === "home" && <ScrollView contentContainerStyle={styles.home}>
          <Text style={[styles.title, rtl && styles.rtl]}>{t.greeting}</Text>
          <Text style={[styles.subtitle, rtl && styles.rtl]}>{t.subtitle}</Text>
          <Orb label={t.assistantReady.toUpperCase()} />
          <Text style={[styles.sectionTitle, rtl && styles.rtl]}>{t.prompt}</Text>
          <Pressable style={styles.actionCard} onPress={() => setTab("chat")}>
            <Text style={styles.actionTitle}>{t.chat}</Text>
            <Text style={styles.actionDesc}>ابدأ محادثة مع aeron</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => setTab("learn")}>
            <Text style={styles.actionTitle}>{t.learn}</Text>
            <Text style={styles.actionDesc}>Merhaba · Nasılsın? · Teşekkürler</Text>
          </Pressable>
        </ScrollView>}

        {tab === "chat" && <KeyboardAvoidingView style={styles.panel} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.chatHeading}>
            <View style={styles.headingText}>
              <Text style={[styles.title, rtl && styles.rtl]}>{t.chat}</Text>
              <Text style={[styles.subtitle, rtl && styles.rtl]}>{isAeronConfigured() ? "aeron جاهز للمحادثة." : "يلزم إعداد متغيرات Supabase في بيئة التطبيق."}</Text>
            </View>
            <Pressable onPress={clearChat} style={styles.clearButton}><Text style={styles.clearText}>مسح</Text></Pressable>
          </View>
          <ScrollView style={styles.messages} contentContainerStyle={styles.messageList}>
            {!loaded && <ActivityIndicator color={colors.primary} />}
            {loaded && messages.length === 0 && <Text style={styles.empty}>اكتب سؤالك وابدأ أول محادثة مع aeron.</Text>}
            {messages.map((item) => <View key={item.id} style={[styles.messageBubble, item.role === "assistant" ? styles.assistantBubble : styles.userBubble]}>
              <Text style={styles.messageRole}>{item.role === "assistant" ? "aeron" : "YOU"}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>)}
            {busy && <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>aeron يفكر...</Text></View>}
          </ScrollView>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.composer}>
            <TextInput value={message} onChangeText={setMessage} placeholder={t.typeMessage} placeholderTextColor={colors.muted} style={[styles.input, rtl && styles.rtl]} multiline editable={loaded && !busy} />
            <Pressable onPress={sendMessage} disabled={busy || !loaded || !message.trim()} style={[styles.send, (busy || !loaded || !message.trim()) && styles.sendDisabled]}>
              <Text style={styles.sendText}>{busy ? "..." : t.send}</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>}

        {tab === "learn" && <ScrollView contentContainerStyle={styles.panel}>
          <Text style={[styles.title, rtl && styles.rtl]}>{t.lessonTitle}</Text>
          <Text style={[styles.subtitle, rtl && styles.rtl]}>{t.lessonHint}</Text>
          {words.map((word) => <View key={word.tr} style={styles.wordCard}>
            <Text style={styles.wordTr}>{word.tr}</Text>
            <Text style={styles.wordMeaning}>{language === "en" ? word.en : word.ar}</Text>
          </View>)}
          <View style={styles.quizCard}>
            <Text style={styles.quizTitle}>اختبر نفسك</Text>
            <Text style={styles.quizProgress}>السؤال {quizIndex + 1} من {quizQuestions.length} · نتيجتك {quizScore{'}'}</Text>
            <Text style={styles.quizQuestion}>{quizQuestions[quizIndex].question}</Text>
            {quizQuestions[quizIndex].options.map((option, index) => {
              const chosen = quizAnswer === index;
              const correct = quizQuestions[quizIndex].answer === index;
              return <Pressable
                key={option}
                disabled={quizAnswer !== null}
                onPress={() => {
                  setQuizAnswer(index);
                  if (correct) setQuizScore((score) => score + 1);
                }}
                style={[
                  styles.quizOption,
                  quizAnswer !== null && correct && styles.quizCorrect,
                  chosen && !correct && styles.quizWrong
                ]}
              >
                <Text style={styles.quizOptionText}>{option}</Text>
              </Pressable>;
            })}
            {quizAnswer !== null && <>
              <Text style={styles.quizExplanation}>
                {quizAnswer === quizQuestions[quizIndex].answer ? "إجابة صحيحة! " : "مو صحيح. "}
                {quizQuestions[quizIndex].explanation}
              </Text>
              <Pressable style={styles.quizNext} onPress={() => {
                if (quizIndex === quizQuestions.length - 1) {
                  setQuizIndex(0);
                  setQuizScore(0);
                } else {
                  setQuizIndex((index) => index + 1);
                }
                setQuizAnswer(null);
              }}>
                <Text style={styles.quizNextText}>{quizIndex === quizQuestions.length - 1 ? "إعادة الاختبار" : "السؤال التالي"}</Text>
              </Pressable>
            </>}
          </View>
        </ScrollView>}

        {tab === "settings" && <View style={styles.panel}>
          <Text style={[styles.title, rtl && styles.rtl]}>{t.settings}</Text>
          <Text style={[styles.subtitle, rtl && styles.rtl]}>{t.language}</Text>
          <View style={styles.languageRow}>
            {(["ar", "en", "tr"] as Language[]).map((item) => <Pressable key={item} onPress={() => setLanguage(item)} style={[styles.languageButton, language === item && styles.languageSelected]}>
              <Text style={[styles.languageText, language === item && styles.languageTextSelected]}>{item.toUpperCase()}</Text>
            </Pressable>)}
          </View>
          <Text style={styles.note}>يحفظ aeron المحادثة واللغة على هذا الجهاز فقط. حذف التطبيق أو بياناته قد يحذف المحادثات.</Text>
        </View>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md, paddingTop: 8 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  brand: { color: colors.text, fontSize: 23, fontWeight: "800", letterSpacing: 3 },
  eyebrow: { color: colors.primary, fontSize: 9, letterSpacing: 2, marginTop: 2 },
  status: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  statusText: { color: colors.muted, fontSize: 10 },
  nav: { flexDirection: "row", backgroundColor: colors.surface, padding: 4, borderRadius: 14, gap: 3 },
  navItem: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 11 },
  navActive: { backgroundColor: colors.primarySoft },
  navText: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  navTextActive: { color: colors.primary },
  home: { paddingTop: 28, paddingBottom: 30 },
  title: { color: colors.text, fontSize: 25, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 12 },
  rtl: { textAlign: "right", writingDirection: "rtl" },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 12, marginBottom: 12 },
  actionCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, padding: 17, borderRadius: 16, marginBottom: 11 },
  actionTitle: { color: colors.text, fontSize: 15, fontWeight: "700", marginBottom: 5 },
  actionDesc: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  panel: { flex: 1, paddingTop: 26, paddingBottom: 18 },
  chatHeading: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  headingText: { flex: 1 },
  clearButton: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 10 },
  clearText: { color: colors.danger, fontSize: 12, fontWeight: "700" },
  messages: { flex: 1, marginVertical: 12 },
  messageList: { paddingBottom: 10 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 40, lineHeight: 22 },
  messageBubble: { maxWidth: "88%", borderRadius: 14, padding: 12, marginBottom: 10 },
  assistantBubble: { alignSelf: "flex-start", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  userBubble: { alignSelf: "flex-end", backgroundColor: colors.primarySoft },
  messageRole: { color: colors.primary, fontSize: 9, fontWeight: "800", letterSpacing: 1, marginBottom: 5 },
  messageText: { color: colors.text, fontSize: 14, lineHeight: 21 },
  loading: { flexDirection: "row", alignItems: "center", gap: 9, padding: 10 },
  loadingText: { color: colors.muted, fontSize: 12 },
  error: { color: colors.danger, fontSize: 12, marginBottom: 8 },
  composer: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, maxHeight: 110, backgroundColor: colors.surface, color: colors.text, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: colors.border },
  send: { backgroundColor: colors.primary, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 14 },
  sendDisabled: { opacity: 0.45 },
  sendText: { color: colors.background, fontWeight: "800", fontSize: 12 },
  wordCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 17, marginBottom: 10 },
  wordTr: { color: colors.primary, fontSize: 19, fontWeight: "700", marginBottom: 5 },
  wordMeaning: { color: colors.text, fontSize: 14 },
  languageRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  languageButton: { flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 15, borderRadius: 13, alignItems: "center" },
  languageSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  languageText: { color: colors.muted, fontWeight: "700" },
  languageTextSelected: { color: colors.primary },
  note: { color: colors.muted, marginTop: 25, lineHeight: 21 },
  quizCard: { backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 12, marginBottom: 20 },
  quizTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 7 },
  quizProgress: { color: colors.muted, fontSize: 11, marginBottom: 14 },
  quizQuestion: { color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12 },
  quizOption: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 11, padding: 13, marginBottom: 8 },
  quizCorrect: { borderColor: colors.success, backgroundColor: "#17372F" },
  quizWrong: { borderColor: colors.danger, backgroundColor: "#3A2028" },
  quizOptionText: { color: colors.text, fontSize: 14 },
  quizExplanation: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 8 },
  quizNext: { backgroundColor: colors.primary, borderRadius: 11, padding: 13, alignItems: "center", marginTop: 12 },
  quizNextText: { color: colors.background, fontWeight: "800" }
});
