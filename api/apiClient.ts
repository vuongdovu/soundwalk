import axios from "axios";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useSelector, UseSelector } from "react-redux";
import { selectSession } from "@/state/selectors/sessionSelectors";

// Mirror ApiClient/ApiService behavior without an async singleton
const FORCE_PRODUCTION_URLS = false;
const apiUrl = process.env.EXPO_PUBLIC_API_URL_DEV;

const resolveBaseUrl = () => {
  if (FORCE_PRODUCTION_URLS) return "https://prod.spotsocial.app";

  if (__DEV__) {
    let localIP: string | null = null;
    if (process.env.EXPO_PUBLIC_DEV_SERVER_IP) {
      localIP = process.env.EXPO_PUBLIC_DEV_SERVER_IP;
    }
    if (!localIP && Constants.debuggerHost) {
      localIP = Constants.debuggerHost.split(":")[0];
    }
    if (!localIP && Constants.manifest?.debuggerHost) {
      localIP = Constants.manifest.debuggerHost.split(":")[0];
    }
    if (!localIP && (Constants as any).manifest2?.extra?.expoGo?.debuggerHost) {
      localIP = (Constants as any).manifest2.extra.expoGo.debuggerHost.split(":")[0];
    }
    if (!localIP && Constants.experienceUrl) {
      try {
        const url = new URL(Constants.experienceUrl);
        if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
          localIP = url.hostname;
        }
      } catch {}
    }
    if (!localIP && Constants.linkingUrl) {
      try {
        const url = new URL(Constants.linkingUrl);
        if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
          localIP = url.hostname;
        }
      } catch {}
    }

    if (localIP) return `http://${localIP}:80`;
    if (apiUrl) return `http://${apiUrl}`;

    const envUrl = process.env.EXPO_PUBLIC_API_URL_DEV || process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) return envUrl;
  }

  return process.env.EXPO_PUBLIC_API_URL || "https://prod.spotsocial.app";
};

const deviceHeaders =
  Platform.OS === "web"
    ? {}
    : {
        "Device-Id": Constants.deviceId || Constants.installationId || "unknown",
        "Device-Manufacturer": Device.manufacturer || "unknown",
        "Version": "2.1",
      };

export const httpClient = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "Spot App v2.1",
    ...deviceHeaders,
  },
});

httpClient.interceptors.request.use(async (config) => {
  (config as any).metadata = { startTime: Date.now() };
  const session = useSelector(selectSession);
  const token = session?.token
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Token ${token}`,
    };
  }

  return config;
});

httpClient.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const duration =
      error.config && (error.config as any).metadata?.startTime
        ? Date.now() - (error.config as any).metadata.startTime
        : null;

    const status = error.response?.status;

    if (__DEV__) {
      console.warn("[httpClient] error", {
        status,
        url: error.config?.baseURL + error.config?.url,
        duration,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);
