export interface AuthConfigPlaceholder {
  // Minimal placeholder config to be replaced by NextAuth config
  enabled: boolean;
}

export function getAuthConfig(): AuthConfigPlaceholder {
  return { enabled: false };
} 