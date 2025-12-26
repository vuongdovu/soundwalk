import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = "auth.accessToken";
const REFRESH_KEY = "auth.refreshToken";

// Service to manage access and refresh tokens using AsyncStorage for api calls.

class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private hydrated = false;

  private async hydrate() {
    if (this.hydrated) return;
    const [access, refresh] = await Promise.all([
      AsyncStorage.getItem(ACCESS_KEY),
      AsyncStorage.getItem(REFRESH_KEY),
    ]); 
    this.accessToken = access;
    this.refreshToken = refresh;
    this.hydrated = true;
  }

  async getAccessToken() {
    await this.hydrate();
    return this.accessToken;
  }

  async getRefreshToken() {
    await this.hydrate();
    return this.refreshToken;
  }

  async setTokens(access: string | null, refresh: string | null) {
    this.accessToken = access;
    this.refreshToken = refresh;
    this.hydrated = true;

    const ops: Promise<void>[] = [];
    if (access) {
      ops.push(AsyncStorage.setItem(ACCESS_KEY, access));
    } else {
      ops.push(AsyncStorage.removeItem(ACCESS_KEY));
    }

    if (refresh) {
      ops.push(AsyncStorage.setItem(REFRESH_KEY, refresh));
    } else {
      ops.push(AsyncStorage.removeItem(REFRESH_KEY));
    }

    await Promise.all(ops);
  }

  async setAccessToken(access: string | null) {
    this.accessToken = access;
    this.hydrated = true;
    if (access) {
      await AsyncStorage.setItem(ACCESS_KEY, access);
    } else {
      await AsyncStorage.removeItem(ACCESS_KEY);
    }
  }

  async setRefreshToken(refresh: string | null) {
    this.refreshToken = refresh;
    this.hydrated = true;
    if (refresh) {
      await AsyncStorage.setItem(REFRESH_KEY, refresh);
    } else {
      await AsyncStorage.removeItem(REFRESH_KEY);
    }
  }

  async clear() {
    this.accessToken = null;
    this.refreshToken = null;
    this.hydrated = true;
    await Promise.all([
      AsyncStorage.removeItem(ACCESS_KEY),
      AsyncStorage.removeItem(REFRESH_KEY),
    ]);
  }
}

const tokenService = new TokenService();

export default tokenService;
