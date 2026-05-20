export function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const [, payload = ""] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = atob(padded);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return null;
  }

  return payload.exp * 1000;
}

export function getTokenRemainingMs(token) {
  const expiry = getTokenExpiryMs(token);

  if (!expiry) {
    return null;
  }

  return expiry - Date.now();
}

export function isTokenExpired(token, skewMs = 30000) {
  const remaining = getTokenRemainingMs(token);

  if (remaining === null) {
    return false;
  }

  return remaining <= skewMs;
}
