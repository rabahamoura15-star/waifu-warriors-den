import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, AlertTriangle } from "lucide-react";
import { signInWithGoogle, signInEmail, signUpEmail, createPlayerProfile } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setProfile } = useAuth();
  const { t, lang } = useI18n();

  const isAr = lang === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!nickname.trim() || nickname.length < 3) {
          setError(isAr ? "الاسم المستعار يجب أن يكون 3 أحرف على الأقل" : "Nickname must be at least 3 characters");
          setLoading(false);
          return;
        }
        const cred = await signUpEmail(email, password);
        await createPlayerProfile(cred.user.uid, nickname.trim());
        setProfile({
          uid: cred.user.uid, nickname: nickname.trim(), xp: 0, coins: 50,
          energy: 100, maxEnergy: 100, rank: "E", level: 1, streak: 0,
          vip: false, cards: [], questsCompleted: [], totalTimeMinutes: 0,
          weeklyTimeMinutes: 0, lastLogin: null, createdAt: null,
        });
        onClose();
      } else {
        await signInEmail(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Error");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithGoogle();
      const { getPlayerProfile } = await import("@/lib/firebase");
      const existing = await getPlayerProfile(cred.user.uid);
      if (!existing) {
        // New Google user — needs nickname
        setMode("signup");
        setError(isAr ? "مرحباً! اختر اسماً مستعاراً لحسابك" : "Welcome! Choose a nickname for your account");
        setLoading(false);
        return;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Error");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm glass-strong rounded-2xl p-6 space-y-5"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-display font-bold text-foreground">
                {mode === "login"
                  ? (isAr ? "تسجيل الدخول" : "Sign In")
                  : (isAr ? "إنشاء حساب" : "Create Account")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isAr ? "ادخل عالم Asgard Verse" : "Enter the Asgard Verse"}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                <AlertTriangle size={14} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <User size={12} />
                    {isAr ? "الاسم المستعار" : "Nickname"}
                  </label>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={isAr ? "اختر اسمك المستعار..." : "Choose your nickname..."}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:border-primary outline-none text-sm"
                    maxLength={20}
                    required
                  />
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertTriangle size={10} />
                    {isAr
                      ? "⚠️ تحذير: هذا الاسم سيبقى معك للأبد ولا يمكن تغييره!"
                      : "⚠️ Warning: This name is PERMANENT and cannot be changed!"}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail size={12} />
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground border border-border focus:border-primary outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock size={12} />
                  {isAr ? "كلمة المرور" : "Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground border border-border focus:border-primary outline-none text-sm"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl gradient-purple text-primary-foreground font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : mode === "login"
                    ? (isAr ? "دخول" : "Sign In")
                    : (isAr ? "إنشاء الحساب" : "Create Account")}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground">
                  {isAr ? "أو" : "or"}
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-foreground font-medium text-sm hover:bg-muted transition-colors border border-border"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {mode === "login" ? (
                <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                  {isAr ? "ليس لديك حساب؟ سجل الآن" : "Don't have an account? Sign up"}
                </button>
              ) : (
                <button onClick={() => setMode("login")} className="text-primary hover:underline">
                  {isAr ? "لديك حساب؟ سجل دخول" : "Already have an account? Sign in"}
                </button>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
