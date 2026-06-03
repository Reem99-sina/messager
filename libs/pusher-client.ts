"use client";

import Pusher from "pusher-js";
import { loadLocalStorage } from "./storage";

let pusherClient: Pusher | null = null;

export function getPusherClient() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!pusherClient) {
    pusherClient = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: "eu",
        channelAuthorization: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
          headers: {
            Authorization: `Bearer ${loadLocalStorage("authToken")}`,
          },
        },
      }
    );
  }

  return pusherClient;
}