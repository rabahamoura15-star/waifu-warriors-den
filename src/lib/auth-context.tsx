import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { auth, onAuthStateChanged, type User, getPlayerProfile, type PlayerProfile, updatePlayerField } from "./firebase";

interface AuthContextType {
  user: User | null;
  profile: PlayerProfile | null;
  loading: boolean;
  setProfile: (p: PlayerProfile | null) => void;
  nsfwFilterEnabled: boolean;
  setNsfwFilterEnabled: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  setProfile: () => {},
  nsfwFilterEnabled: true,
  setNsfwFilterEnabled: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await getPlayerProfile(u.uid);
        // Ensure new users or older profiles have the NSFW filter setting.
        if (p && typeof p.nsfwFilterEnabled === "undefined") {
          updatePlayerField(u.uid, { nsfwFilterEnabled: true }).catch(() => {
            // ignore
          });
          setProfile({ ...p, nsfwFilterEnabled: true });
        } else {
          setProfile(p);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const nsfwFilterEnabled = profile?.nsfwFilterEnabled ?? true;

  const setNsfwFilterEnabled = async (enabled: boolean) => {
    if (!user) return;
    try {
      await updatePlayerField(user.uid, { nsfwFilterEnabled: enabled });
      setProfile((prev) => (prev ? { ...prev, nsfwFilterEnabled: enabled } : prev));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, setProfile, nsfwFilterEnabled, setNsfwFilterEnabled }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
