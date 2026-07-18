import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, 
  Sun, Moon, AlertCircle, CheckCircle2, ChevronLeft, Info
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useTheme } from '../components/ThemeProvider';
import PageTransition from '../components/PageTransition';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Authentication & Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'forgot_password'>('login');

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!isSupabaseConfigured) {
          const sandboxAuth = localStorage.getItem('hds_sandbox_auth');
          if (sandboxAuth === 'active') {
            navigate('/admin/dashboard');
          }
          const savedEmail = localStorage.getItem('hds_remembered_email');
          if (savedEmail) {
            setEmail(savedEmail);
          }
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/admin/dashboard');
        } else {
          const savedEmail = localStorage.getItem('hds_remembered_email');
          if (savedEmail) {
            setEmail(savedEmail);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  // Handle Admin Sign In
  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthLoading(true);

    if (!email || !password) {
      setAuthError('Please fill in both your email and password.');
      setAuthLoading(false);
      return;
    }

    try {
      if (!isSupabaseConfigured) {
        // Local simulation sandbox testing mode
        if (email.toLowerCase() === 'admin@hds.com' && password === 'admin123') {
          setAuthSuccessMsg('Credentials verified. Unlocking dashboard...');
          localStorage.setItem('hds_sandbox_auth', 'active');
          localStorage.setItem('hds_sandbox_email', email.toLowerCase());
          
          if (rememberMe) {
            localStorage.setItem('hds_remembered_email', email);
          } else {
            localStorage.removeItem('hds_remembered_email');
          }

          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        } else {
          setAuthError('Invalid credentials. Hint: Use admin@hds.com / admin123 for local testing.');
        }
        setAuthLoading(false);
        return;
      }

      // Live Supabase Authenticator
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setAuthError(error.message);
      } else if (data.session) {
        setAuthSuccessMsg('Secure gateway opened. Loading admin space...');
        if (rememberMe) {
          localStorage.setItem('hds_remembered_email', email);
        } else {
          localStorage.removeItem('hds_remembered_email');
        }
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during admin gate verification.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Forgot Password Trigger
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthLoading(true);

    if (!email) {
      setAuthError('Please enter your administrator email to trigger recovery.');
      setAuthLoading(false);
      return;
    }

    try {
      if (!isSupabaseConfigured) {
        setAuthSuccessMsg(`[Sandbox Mode] Mock password reset email sent to: ${email}`);
        setAuthLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/dashboard`
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccessMsg('A secure password restoration link has been dispatched to your email.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to dispatch password restoration payload.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-sm font-medium">Contacting security gate...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-bg-base relative overflow-hidden transition-colors duration-300">
        
        {/* Ambient Cosmic Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-accent/5 dark:bg-accent/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="w-full max-w-lg z-10 relative">
          
          {/* Theme Toggle & Back Button Utility Bar */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="flex items-center text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors gap-1 group py-2"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Site</span>
            </Link>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 bg-card-bg border border-card-border hover:bg-btn-bg text-text-secondary hover:text-text-primary rounded-xl transition-all shadow-sm"
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-accent" /> : <Moon className="w-4.5 h-4.5 text-secondary" />}
            </button>
          </div>

          {/* Local Sandbox Mode Banner */}
          {!isSupabaseConfigured && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl flex items-start text-amber-600 dark:text-amber-300 text-xs shadow-md backdrop-blur-md"
            >
              <Info className="w-5 h-5 mr-3 shrink-0 text-amber-500 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-1">Sandbox Simulation Mode Active</h4>
                <p className="leading-relaxed mb-2 text-text-secondary dark:text-amber-200">
                  Secure Supabase connection parameters are missing. Use the pre-provisioned developer key below to verify administrative components and CRM:
                </p>
                <div className="font-mono bg-black/5 dark:bg-black/40 p-2 rounded text-amber-700 dark:text-amber-400 select-all border border-amber-500/20">
                  Email: <span className="font-semibold">admin@hds.com</span> <br />
                  Password: <span className="font-semibold">admin123</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Secure Login Glass Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card-bg border border-card-border rounded-[32px] p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_0_80px_rgba(0,240,255,0.02)] backdrop-blur-md relative overflow-hidden"
          >
            {/* Vercel-Style Ambient Accent Border Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-[#0080FF] to-secondary" />

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 bg-accent/5 dark:bg-accent/10 border border-accent/10 dark:border-accent/20 rounded-2xl flex items-center justify-center mb-4 text-accent shadow-inner">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-heading text-text-primary tracking-tight">HDS Administrative Gate</h1>
              <p className="text-text-tertiary text-xs md:text-sm mt-1.5 max-w-xs">
                Unlock dashboard capabilities and monitor real-time business pipelines.
              </p>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleAuthLogin} className="space-y-5">
                
                {/* Error Banner */}
                <AnimatePresence mode="wait">
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-600 dark:text-red-400 text-xs overflow-hidden"
                    >
                      <AlertCircle className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Banner */}
                <AnimatePresence mode="wait">
                  {authSuccessMsg && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start text-emerald-600 dark:text-emerald-400 text-xs overflow-hidden"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authSuccessMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Address input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2 font-mono">
                    Admin Mail ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@harshdigitalstudios.com"
                      className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-tertiary font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary font-mono">
                      Security Key
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot_password');
                        setAuthError('');
                        setAuthSuccessMsg('');
                      }}
                      className="text-[10px] text-accent font-semibold hover:underline"
                    >
                      Forgot Credentials?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter verification password"
                      className="w-full pl-11 pr-12 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-tertiary font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-text-tertiary hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-xs text-text-secondary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-btn-border bg-btn-bg text-accent focus:ring-accent/40 w-4 h-4 transition-all"
                    />
                    <span>Persist session</span>
                  </label>
                  <span className="text-[10px] text-text-tertiary font-mono flex items-center gap-1">
                    <Shield className="w-3 h-3 text-accent" /> Encrypted Keyring
                  </span>
                </div>

                {/* Unlock Button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-6 premium-button bg-gradient-to-r from-accent to-secondary hover:brightness-110 active:scale-[0.98] text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>Verifying Security Clearence...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock System</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Forgot password layout */
              <form onSubmit={handleForgotPassword} className="space-y-5">
                
                <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl text-xs text-text-secondary leading-relaxed mb-4">
                  Please submit your registered administrator email id. A secure credentials recovery link will be triggered to regain access.
                </div>

                {/* Error Banner */}
                <AnimatePresence mode="wait">
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start text-red-600 dark:text-red-400 text-xs overflow-hidden"
                    >
                      <AlertCircle className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Banner */}
                <AnimatePresence mode="wait">
                  {authSuccessMsg && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start text-emerald-600 dark:text-emerald-400 text-xs overflow-hidden"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 mr-2 shrink-0 mt-0.5" />
                      <span>{authSuccessMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2 font-mono">
                    Registered Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-text-tertiary" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@harshdigitalstudios.com"
                      className="w-full pl-11 pr-4 py-3 bg-btn-bg border border-btn-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-tertiary"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                      setAuthSuccessMsg('');
                    }}
                    className="text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1"
                  >
                    ← Return to Lock Screen
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-4 premium-button bg-gradient-to-r from-accent to-secondary text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <span>Disptach recovery link</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
