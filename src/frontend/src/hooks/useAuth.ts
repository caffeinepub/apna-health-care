import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Simplified auth hook wrapping InternetIdentity
 */
export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = identity?.getPrincipal().toString() ?? null;

  return {
    login,
    logout: clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    principal,
    identity,
  };
}
