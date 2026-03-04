import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, Cross, Loader2, LogIn, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { login, isAuthenticated, isLoggingIn, isInitializing } = useAuth();
  const { actor, isFetching } = useActor();
  const [checking, setChecking] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !actor || isFetching) return;

    setChecking(true);
    setAccessDenied(false);
    setError(null);

    actor
      .isCallerAdmin()
      .then((isAdmin) => {
        if (isAdmin) {
          onLoginSuccess();
        } else {
          setAccessDenied(true);
        }
      })
      .catch(() => {
        setError("Failed to verify admin access. Please try again.");
      })
      .finally(() => {
        setChecking(false);
      });
  }, [isAuthenticated, actor, isFetching, onLoginSuccess]);

  const isLoading = isLoggingIn || isInitializing || checking || isFetching;

  return (
    <div className="min-h-screen bg-health-surface flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[oklch(0.88_0.1_195/0.15)]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[oklch(0.88_0.1_195/0.12)]" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[oklch(0.92_0.06_195/0.08)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-card-hover border border-border/60 overflow-hidden">
          {/* Header band */}
          <div className="bg-health-navy px-8 pt-10 pb-8 text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-[oklch(0.62_0.12_195)] rounded-xl flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Apna<span className="text-[oklch(0.72_0.1_195)]"> Health</span>
              </span>
            </div>

            {/* Shield icon */}
            <div className="w-16 h-16 bg-[oklch(0.62_0.12_195/0.2)] border border-[oklch(0.62_0.12_195/0.3)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[oklch(0.72_0.1_195)]" />
            </div>

            <h1 className="font-display font-bold text-2xl text-white mb-2">
              Admin Portal
            </h1>
            <p className="text-white/60 text-sm">
              Secure login with Internet Identity
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {/* Access Denied */}
            {accessDenied && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="admin.login.error_state"
                className="mb-6 flex items-start gap-3 bg-[oklch(0.95_0.06_27)] border border-[oklch(0.85_0.1_27)] rounded-xl p-4"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">
                    Access Denied
                  </p>
                  <p className="text-xs text-destructive/80 mt-0.5">
                    You are not an admin. Contact your system administrator to
                    grant admin access.
                  </p>
                </div>
              </motion.div>
            )}

            {/* General Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 bg-[oklch(0.95_0.06_27)] border border-[oklch(0.85_0.1_27)] rounded-xl p-4"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            {/* Info note */}
            <div className="mb-6 bg-[oklch(0.94_0.06_195)] rounded-xl p-4 border border-[oklch(0.88_0.08_195)]">
              <p className="text-sm text-health-navy/80 leading-relaxed">
                <span className="font-semibold text-health-teal">
                  First time setup?
                </span>{" "}
                Contact your system administrator to grant admin access to your
                Internet Identity principal.
              </p>
            </div>

            {/* Login button */}
            <Button
              data-ocid="admin.login.primary_button"
              onClick={login}
              disabled={isLoading || isAuthenticated}
              className="w-full bg-health-teal hover:bg-health-teal-dark text-white font-semibold py-3 h-12 rounded-xl transition-all duration-200 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {checking ? "Verifying access..." : "Connecting..."}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>

            {/* Back to website link */}
            <div className="mt-6 text-center">
              <a
                href="/"
                data-ocid="admin.login.link"
                className="text-sm text-muted-foreground hover:text-health-teal transition-colors"
              >
                ← Back to website
              </a>
            </div>
          </div>
        </div>

        {/* Bottom credit */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Protected admin area — unauthorized access is prohibited
        </p>
      </motion.div>
    </div>
  );
}
