import { clearLocalStorage, loadLocalStorage } from "@/libs/storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function apiRequest(path: string, options: any = {}) {
  const token = await loadLocalStorage("authToken");

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body &&
    options.body.constructor &&
    options.body.constructor.name === "FormData";

  const isEmptyBody = options.body === undefined || options.body === null;

  const headers: any = {
    ...(token && {
      Authorization: `Bearer ${token.toString().trim()}`
    }),
    ...options.headers,
    ...corsHeaders
  };

  if (!isFormData && !isEmptyBody) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 || res.status === 403) {
    await clearLocalStorage("authToken");
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
