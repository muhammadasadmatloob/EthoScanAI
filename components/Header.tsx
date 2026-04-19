'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, User } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function Header() {
  const [user, loading] = useAuthState(auth);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-xl">
            E
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">EthoScan AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => signOut(auth)}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
                <img src={user.photoURL || ''} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="px-5 py-2 glass-card text-sm font-medium hover:bg-white/10 transition-all active:scale-95"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
