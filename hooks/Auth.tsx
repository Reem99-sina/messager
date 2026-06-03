"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@prisma/client";
import { apiRequest } from "@/action/api";
import { useRouter } from "next/navigation";
import { getPusherClient } from "@/libs/pusher-client";
import { useOnlineUsers } from "@/zustand/onlineUser";

type UserToken = {
  token: string;
};

type AuthContextType = {
  user: UserToken | null;
  login: (token: string) => void;
  logout: (user?: User | null) => void;
  token?: string;
  getToken: () => string | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setOnlineUsers, addOnlineUser, removeOnlineUser } = useOnlineUsers();
  const [user, setUser] = useState<UserToken | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const token = localStorage.getItem("authToken");
    return token ? { token } : null;
  });
  const router = useRouter();
  const [token, setToken] = useState<string>();

  const login = (token: string) => {
    localStorage.setItem("authToken", token);

    setUser({ token });
    setToken(token);
  };

  //
  // console.log("Subscribed to presence-online-users channel",channel);
  const logout = async (user?: User | null) => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(undefined);

    if (user) {
      await apiRequest("/api/pusher/offline", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
      });
    }

    router.replace("/login");
  };
  const getToken = () => {
    if (token) {
      return token;
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
        return storedToken;
      }
      return;
    }
  };
  useEffect(() => {
     if (!user) return;
    const pusherClient = getPusherClient();
    const channel = pusherClient?.subscribe("presence-online-users");

    channel?.bind(
      "pusher:subscription_succeeded",
      (members: { members: string[] }) => {
        const ids = Object.keys(members.members);

        setOnlineUsers(ids);
      },
    );

    channel?.bind("pusher:member_added", (member:{id:string}) => {
      addOnlineUser(member.id);
    });

    channel?.bind("pusher:member_removed", (member:{id:string}) => {
      removeOnlineUser(member.id);
    });
    channel?.bind("user-offline", (data: { userId: string }) => {
      removeOnlineUser(data.userId);
    });
    channel?.bind("user-online", (data: { userId: string }) => {
      
      addOnlineUser(data.userId);
    });
    return () => {
      pusherClient?.unsubscribe("presence-online-users");
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout: (user?: User | null) => logout(user),
        token,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
