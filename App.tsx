import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Orb } from "./src/components/Orb";
import { Language, translations } from "./src/i18n";
import { colors, spacing } from "./src/theme";

type Tab = "home" | "chat" | "learn" | "settings";
const words = [
  { tr: "Merhaba", ar: "مرحباً", en: "Hello" },
  { tr: "Nasılsın?", ar: "كيف حالك؟", en: "How are you?" },
  { tr: "Teşekkür ederim", ar: "شكراً لك", en: "Thank you" },
  { tr: "Görüşürüz", ar: "أراك لاحقاً", en: "See you" }
];

export default function App() {
  const [language, setLanguage] = useState<Language>("ar");
  const [tab, setTab] = useState<Tab>("home");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const t = useMemo(() => translations[language], [language]);
  const rtl = language === "ar";
  const sendMessage = () => {
    const clean = message.trim();
    if (!clean) return;
    setMessages((current) => [...current, clean]);
    setMessage("");
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
          <View><Text style={styles.brand}>AERON</Text><Text style={styles.eyebrow}>PERSONAL AI</Text></View>
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
          <Pressable style={styles.actionCard} onPress={() => setTab("chat")}><Text style={styles.actionTitle}>{t.chat}</Text><Text style={styles.actionDesc}>{t.comingSoon}</Text></Pressable>
          <Pressable style={styles.actionCard} onPress={() => setTab("learn")}><Text style={styles.actionTitle}>{t.learn}</Text><Text style={styles.actionDesc}>Merhaba · Nasılsın? · Teşekkürler</Text></Pressable>
        </ScrollView>}
        {tab === "chat" && <View style={styles.panel}>
          <Text style={[styles.title, rtl && styles.rtl]}>{t.chat}</Text>
          <Text style={[styles.subtitle, rtl && styles.rtl]}>{t.comingSoon}</Text>
          <ScrollView style={styles.messages}>{messages.map((item, index) => <View key={index} style={styles.messageBubble}><Text style={styles.messageText}>{item}</Text></View>)}</ScrollView>
          <View style={styles.composer}>
            <TextInput value={message} onChangeText={setMessage} placeholder={t.typeMessage} placeholderTextColor={colors.muted} style={[styles.input, rtl && styles.rtl]} />
            <Pressable onPress={sendMessage} style={styles.send}><Text style={styles.sendText}>{t.send}</Text></Pressable>
          </View>
        </View>}
        {tab === "learn" && <ScrollView contentContainerStyle={styles.panel}>
          <Text style={[styles.title, rtl && styles.rtl]}>{t.lessonTitle}</Text>
          <Text style={[styles.subtitle, rtl && styles.rtl]}>{t.lessonHint}</Text>
          {words.map((word) => <View key={word.tr} style={styles.wordCard}><Text style={styles.wordTr}>{word.tr}</Text><Text style={styles.wordMeaning}>{language === "en" ? word.en : word.ar}</Text></View>)}
        </ScrollView>}
        {tab === "settings" && <View style={styles.panel}>
          <Text style={[styles.title, rtl && styles.rtl]}>{t.settings}</Text>
          <Text style={[styles.subtitle, rtl && styles.rtl]}>{t.language}</Text>
          <View style={styles.languageRow}>{(["ar", "en", "tr"] as Language[]).map((item) => <Pressable key={item} onPress={() => setLanguage(item)} style={[styles.languageButton, language === item && styles.languageSelected]}><Text style={[styles.languageText, language === item && styles.languageTextSelected]}>{item.toUpperCase()}</Text></Pressable>)}</View>
          <Text style={styles.note}>{t.comingSoon}</Text>
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
  messages: { flex: 1, marginVertical: 12 },
  messageBubble: { alignSelf: "flex-end", maxWidth: "85%", backgroundColor: colors.primarySoft, borderRadius: 14, padding: 12, marginBottom: 8 },
  messageText: { color: colors.text, fontSize: 14 },
  composer: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, backgroundColor: colors.surface, color: colors.text, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: colors.border },
  send: { backgroundColor: colors.primary, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 14 },
  sendText: { color: colors.background, fontWeight: "800", fontSize: 12 },
  wordCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 17, marginBottom: 10 },
  wordTr: { color: colors.primary, fontSize: 19, fontWeight: "700", marginBottom: 5 },
  wordMeaning: { color: colors.text, fontSize: 14 },
  languageRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  languageButton: { flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 15, borderRadius: 13, alignItems: "center" },
  languageSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  languageText: { color: colors.muted, fontWeight: "700" },
  languageTextSelected: { color: colors.primary },
  note: { color: colors.muted, marginTop: 25, lineHeight: 21 }
});
