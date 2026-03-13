"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface BeaconUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "responder" | "viewer";
  avatar: string;
  org: string;
  zones: string[];
}

const MOCK_USER: BeaconUser = {
  id: "usr_000",
  name: "Dr. R. Ortiz",
  email: "riz.rupert.ortiz@nwssu.edu.ph",
  role: "admin",
  avatar: "RZ",
  org: "CDRRMO · Calbayog",
  zones: ["z01", "z02", "z03", "z04"],
};

const VALID_CREDENTIALS = {
  email: "nwssu-rie@cdrrmo.gov.ph",
  password: "Calb4yogK0!",
};

interface AuthContextValue {
  user: BeaconUser | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BeaconUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("beacon_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("beacon_user");
      }
    }
    setIsLoading(false);
  }, []);

  async function signIn(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (
      email === VALID_CREDENTIALS.email &&
      password === VALID_CREDENTIALS.password
    ) {
      setUser(MOCK_USER);
      localStorage.setItem("beacon_user", JSON.stringify(MOCK_USER));
      localStorage.setItem("beacon_last_login", new Date().toISOString());
      // Set default theme for usr_000
      localStorage.setItem("beacon_theme_usr_000", "nwssu-academic");
      return { success: true };
    }

    return { success: false, error: "Invalid credentials" };
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("beacon_user");
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getLastLogin(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("beacon_last_login");
}
