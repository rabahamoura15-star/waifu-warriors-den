import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import companionImg from "@/assets/shadow-companion.png";
import { useI18n } from "@/lib/i18n";

const tips: Record<string, string[]> = {
  ar: [
    "هل تعلم؟ يمكنك كسب عملات إضافية كل يوم!",
    "جرّب البحث بوصف مثل 'بطل يتحول للظلام'",
    "أكمل المهمات اليومية لتصعد بالرتبة!",
    "اسحب بطاقات من الاستدعاء لتفتح ثيمات حصرية!",
    "سجل دخولك 30 يوماً متواصلة للحصول على VIP!",
  ],
  en: [
    "Did you know? You can earn extra coins daily!",
    "Try searching with descriptions like 'weak hero becomes strongest'",
    "Complete daily quests to rank up!",
    "Pull cards from Gacha to unlock exclusive themes!",
    "Login for 30 consecutive days to get VIP!",
  ],
};

interface ChatMessage {
  role: "user" | "companion";
  text: string;
}

export default function ShadowCompanion() {
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { lang } = useI18n();

  const currentTips = tips[lang] || tips.en;
  const isAr = lang === "ar";

  useEffect(() => {
    const interval = setInterval(() => {
      if (!chatOpen) {
        setMessage(currentTips[Math.floor(Math.random() * currentTips.length)]);
        setShowMsg(true);
        setTimeout(() => setShowMsg(false), 5000);
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [chatOpen, currentTips]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typing]);

  const handleClick = () => {
    if (!chatOpen) {
      setChatOpen(true);
      setShowMsg(false);
      if (chatMessages.length === 0) {
        setChatMessages([{
          role: "companion",
          text: isAr
            ? "مرحباً أيها الصياد! أنا مرافقك الظلّي. أخبرني بمزاجك وسأقترح لك أعمالاً تناسبك. يمكنك أيضاً سؤالي عن أي شيء يخص المانهوا والأنمي!"
            : "Hello Hunter! I'm your Shadow Companion. Tell me your mood and I'll suggest works that match. You can also ask me anything about manhwa and anime!",
        }]);
      }
    }
  };

  const handleSend = async () => {
    if (!chatInput.trim() || typing) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setTyping(true);

    // Smart local responses based on mood/keywords
    setTimeout(() => {
      const response = generateSmartResponse(userMsg, isAr);
      setChatMessages((prev) => [...prev, { role: "companion", text: response }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating companion */}
      <motion.div
        className="fixed bottom-6 left-6 z-50 cursor-pointer"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        onClick={handleClick}
      >
        <AnimatePresence>
          {showMsg && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute bottom-full mb-3 left-0 w-56 p-3 rounded-xl glass text-xs text-foreground"
            >
              {message}
              <div className="absolute bottom-0 left-4 w-2 h-2 glass rotate-45 translate-y-1" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative w-14 h-14 rounded-full glow-purple flex items-center justify-center overflow-hidden border-2 border-primary/40">
          <img src={companionImg} alt="Shadow Companion" className="w-full h-full object-cover" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
            <Sparkles size={8} className="text-accent-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-80 max-h-[60vh] glass-strong rounded-2xl flex flex-col overflow-hidden border border-primary/20"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-border">
              <img src={companionImg} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">
                  {isAr ? "المرافق الظلّي" : "Shadow Companion"}
                </p>
                <p className="text-[10px] text-energy">
                  {isAr ? "متصل" : "Online"}
                </p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[40vh]">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-secondary px-3 py-2 rounded-xl text-xs text-muted-foreground">
                    <span className="animate-pulse">●●●</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-2 border-t border-border flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isAr ? "اكتب رسالتك..." : "Type a message..."}
                className="flex-1 px-3 py-2 rounded-xl bg-secondary text-foreground text-xs placeholder:text-muted-foreground border-none outline-none"
              />
              <button
                onClick={handleSend}
                disabled={typing || !chatInput.trim()}
                className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center text-primary-foreground disabled:opacity-40"
              >
                <Send size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Smart local response generator (psychological bot style)
function generateSmartResponse(input: string, isAr: boolean): string {
  const lower = input.toLowerCase();

  // Mood-based suggestions
  const moodMap: Record<string, { ar: string; en: string }> = {
    "حزين|sad|depressed|down": {
      ar: "أشعر بك... جرّب قراءة 'A Silent Voice' أو 'Your Lie in April' — أعمال ستلمس قلبك وتجعلك تشعر بأنك لست وحدك.",
      en: "I feel you... Try 'A Silent Voice' or 'Your Lie in April' — works that will touch your heart and remind you you're not alone.",
    },
    "سعيد|happy|excited|good": {
      ar: "رائع! حماسك يلهمني. جرّب 'One Punch Man' أو 'Spy x Family' لمزيد من المرح!",
      en: "Awesome! Your energy inspires me. Try 'One Punch Man' or 'Spy x Family' for more fun!",
    },
    "ملل|bored|boring": {
      ar: "الملل عدوّنا! جرّب 'Solo Leveling' أو 'Tower of God' — ستنسيك كل شيء.",
      en: "Boredom is our enemy! Try 'Solo Leveling' or 'Tower of God' — you'll forget everything else.",
    },
    "قوي|action|strong|fight|قتال": {
      ar: "تريد أكشن؟ 'Berserk' و 'Vinland Saga' و 'Omniscient Reader' — أعمال ستجعل دمك يغلي!",
      en: "Want action? 'Berserk', 'Vinland Saga', and 'Omniscient Reader' — works that'll make your blood boil!",
    },
    "رومانس|romance|love|حب": {
      ar: "الحب في الهواء! جرّب 'Horimiya' أو 'Kaguya-sama' — أعمال ستُسرّع نبضات قلبك.",
      en: "Love is in the air! Try 'Horimiya' or 'Kaguya-sama' — works that'll make your heart race.",
    },
    "رعب|horror|scary|مخيف|dark|ظلام": {
      ar: "تحب الظلام؟ 'Junji Ito Collection' و 'Tokyo Ghoul' — لكن احذر... لا تقرأها وحدك في الليل.",
      en: "You like the dark? 'Junji Ito Collection' and 'Tokyo Ghoul' — but beware... don't read alone at night.",
    },
    "ذكاء|smart|strategy|خطة": {
      ar: "عقلك حاد! جرّب 'Death Note' أو 'Code Geass' أو 'The Beginning After The End'.",
      en: "Sharp mind! Try 'Death Note', 'Code Geass', or 'The Beginning After The End'.",
    },
  };

  for (const [keys, response] of Object.entries(moodMap)) {
    const patterns = keys.split("|");
    if (patterns.some((p) => lower.includes(p))) {
      return isAr ? response.ar : response.en;
    }
  }

  // Default personality responses
  const defaults = isAr
    ? [
        "مثير للاهتمام... أخبرني أكثر عن مزاجك اليوم وسأقترح لك عملاً مثالياً!",
        "كل قارئ يحمل عالماً بداخله. أخبرني: هل تفضل الأكشن، الرومانس، أم الغموض؟",
        "أنا هنا لمساعدتك! جرّب أن تصف لي ما تشعر به الآن بكلمة واحدة.",
        "يبدو أنك تبحث عن شيء مميز... هل جربت استخدام البحث الذكي للعثور على عمل يناسب ذوقك؟",
      ]
    : [
        "Interesting... Tell me more about your mood today and I'll suggest the perfect work!",
        "Every reader carries a world within. Tell me: do you prefer action, romance, or mystery?",
        "I'm here to help! Try describing how you feel right now in one word.",
        "Seems like you're looking for something special... Have you tried the smart search to find a work that matches your taste?",
      ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
