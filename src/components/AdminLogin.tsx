import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAIL = "donbburi83@gmail.com";

export default function AdminLogin() {
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user && user.email === ADMIN_EMAIL) {
        navigate('/admin/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setAuthenticating(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== ADMIN_EMAIL) {
        await auth.signOut();
        setError('접근 권한이 없는 계정입니다.');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('인증 중 오류가 발생했습니다.');
    } finally {
      setAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center immersive-bg p-6 font-sans overflow-hidden">
      <div className="absolute top-20 left-0 w-full whitespace-nowrap opacity-[0.02] font-serif italic text-[120px] pointer-events-none select-none z-0 uppercase tracking-tighter">
        SECURITY GATE • PORTAL ACCESS • INTERFACE LOG •
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex p-4 rounded-full bg-gold/5 text-gold mb-8 border border-gold/10 shadow-[0_0_30px_rgba(172,169,156,0.15)]"
          >
            <ShieldCheck className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-serif text-gold mb-3 tracking-[0.3em] uppercase gold-glow"
          >
            JCF ADMIN
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/30 text-[9px] tracking-[0.5em] uppercase font-bold"
          >
            Professional Portal Entry
          </motion.p>
        </div>

        <div className="space-y-8">
          <div className="p-10 border border-white/5 bg-zinc-900/20 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
            <p className="text-white/40 text-[11px] text-center mb-10 leading-relaxed tracking-wider font-light uppercase">
              보안을 위해 관리자 승인된 계정으로 <br />구글 로그인을 진행해 주세요.
            </p>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={authenticating}
              onClick={handleGoogleLogin}
              className="w-full bg-gold text-black py-4 rounded-none uppercase tracking-[0.4em] text-[10px] font-bold flex items-center justify-center group hover:bg-gold-light transition-all duration-500 disabled:opacity-50 shadow-[0_0_20px_rgba(172,169,156,0.2)]"
            >
              {authenticating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-3" />
                  Authenticate
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500/60 text-[9px] uppercase tracking-[0.3em] text-center mt-8 font-bold"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] font-bold">
            &copy; 2024 J Content Factory. PRODUCED IN SEOUL.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

