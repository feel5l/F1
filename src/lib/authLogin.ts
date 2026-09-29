/** Firebase auth error codes that should trigger redirect-based Google sign-in. */
export function shouldUseGoogleRedirectFallback(error: { code?: string } | null | undefined): boolean {
  return (
    error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user'
  );
}
