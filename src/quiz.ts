import { Language } from "./i18n";
export type QuizQuestion = { question: string; options: string[]; answer: number; explanation: string };
const ar: QuizQuestion[] = [
{question:"وش معنى Merhaba؟",options:["مع السلامة","مرحباً","شكراً"],answer:1,explanation:"Merhaba تعني مرحباً."},
{question:"كيف تقول شكراً بالتركي؟",options:["Teşekkür ederim","Lütfen","Görüşürüz"],answer:0,explanation:"Teşekkür ederim تعني شكراً لك."},
{question:"وش معنى Nasılsın؟",options:["أين أنت؟","كم عمرك؟","كيف حالك؟"],answer:2,explanation:"Nasılsın تعني كيف حالك؟"},
{question:"وش معنى Lütfen؟",options:["من فضلك","صباح الخير","لا أفهم"],answer:0,explanation:"Lütfen تعني من فضلك."},
{question:"كيف تقول أراك لاحقاً؟",options:["Merhaba","Görüşürüz","Anlamadım"],answer:1,explanation:"Görüşürüz تعني أراك لاحقاً."},
{question:"وش معنى Evet؟",options:["لا","نعم","ربما"],answer:1,explanation:"Evet تعني نعم."},
{question:"وش معنى Hayır؟",options:["لا","نعم","شكراً"],answer:0,explanation:"Hayır تعني لا."},
{question:"كيف تقول صباح الخير؟",options:["İyi geceler","Günaydın","İyi akşamlar"],answer:1,explanation:"Günaydın تعني صباح الخير."},
{question:"وش معنى Su؟",options:["ماء","خبز","بيت"],answer:0,explanation:"Su تعني ماء."},
{question:"وش معنى Ekmek؟",options:["قهوة","ماء","خبز"],answer:2,explanation:"Ekmek تعني خبز."}
];
const en: QuizQuestion[] = ar.map((q,i)=>({...q,question:["What does Merhaba mean?","How do you say thank you in Turkish?","What does Nasılsın mean?","What does Lütfen mean?","How do you say see you later?","What does Evet mean?","What does Hayır mean?","How do you say good morning?","What does Su mean?","What does Ekmek mean?"][i],options:[["Goodbye","Hello","Thank you"],["Teşekkür ederim","Lütfen","Görüşürüz"],["Where are you?","How old are you?","How are you?"],["Please","Good morning","I don't understand"],["Merhaba","Görüşürüz","Anlamadım"],["No","Yes","Maybe"],["No","Yes","Thank you"],["Good night","Günaydın","Good evening"],["Water","Bread","House"],["Coffee","Water","Bread"]][i],explanation:["Merhaba means hello.","Teşekkür ederim means thank you.","Nasılsın means how are you?","Lütfen means please.","Görüşürüz means see you later.","Evet means yes.","Hayır means no.","Günaydın means good morning.","Su means water.","Ekmek means bread."][i]}));
const tr: QuizQuestion[] = ar.map((q,i)=>({...q,question:["Merhaba ne demektir?","Teşekkür etmek için ne söylenir?","Nasılsın ne demektir?","Lütfen ne demektir?","Sonra görüşürüz nasıl söylenir?","Evet ne demektir?","Hayır ne demektir?","Sabah nasıl selam verilir?","Su ne demektir?","Ekmek ne demektir?"][i],options:[["Hoşça kal","Merhaba","Teşekkürler"],["Teşekkür ederim","Lütfen","Görüşürüz"],["Neredesin?","Kaç yaşındasın?","Nasılsın?"],["Lütfen","Günaydın","Anlamadım"],["Merhaba","Görüşürüz","Anlamadım"],["Hayır","Evet","Belki"],["Hayır","Evet","Teşekkürler"],["İyi geceler","Günaydın","İyi akşamlar"],["Su","Ekmek","Ev"],["Kahve","Su","Ekmek"]][i],explanation:["Merhaba selamlaşmak için kullanılır.","Teşekkür ederim teşekkür etmek demektir.","Nasılsın kişinin durumunu sormaktır.","Lütfen rica ederken kullanılır.","Görüşürüz sonra görüşmek üzere demektir.","Evet olumlu cevaptır.","Hayır olumsuz cevaptır.","Günaydın sabah selamlaşmasıdır.","Su içtiğimiz sıvıdır.","Ekmek temel bir yiyecektir."][i]}));
export const quizQuestionsByLanguage: Record<Language, QuizQuestion[]> = {ar,en,tr};
