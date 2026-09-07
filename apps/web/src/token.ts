const KEY = "very_secret_key_for_the_token_here_bro";

export function getToken() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return undefined;
  }
}

export function setToken(token: string | undefined) {
  try {
    if (token) {
      localStorage.setItem(KEY, token);
    } else {
      localStorage.removeItem(KEY);
    }
  } catch {
    console.error("Local storage unavailable");
  }
}