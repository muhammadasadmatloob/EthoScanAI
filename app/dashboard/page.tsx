'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  CreditCard,
  Target,
  FileText,
  Sparkles,
  Globe
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GoogleAd from '@/components/GoogleAd';

function DashboardContent() {
  const [user, userLoading] = useAuthState(auth);
  const searchParams = useSearchParams();
  const auditId = searchParams.get('auditId');
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAudit() {
      if (!user || !auditId) return;
      try {
        const docRef = doc(db, `users/${user.uid}/audits`, auditId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAudit(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [user, auditId]);

  if (userLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-medium">Synthesizing compliance intelligence...</p>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-white/20" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold mb-2">Analysis Records Inaccessible</h2>
          <p className="text-white/40 max-w-sm">The requested signature is unavailable or has been purged from our active secure logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-32 pb-20">
      <GoogleAd slot="Upper_Dashboard" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Initialize New Scan
        </button>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          {audit.url && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Globe className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{audit.url}</span>
            </div>
          )}
          <span>Compliance Index: v3.5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Audit Data */}
        <div className="lg:col-span-8 space-y-12">
          <section className="glass-card p-8 md:p-12 relative overflow-hidden shadow-2xl bg-[#050505]">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 uppercase tracking-tight">Interface Integrity Metric</h3>
                <p className="text-sm text-gray-500 tracking-wider font-mono">HASH: #{auditId?.toUpperCase() || 'PND-X'}</p>
              </div>
              
              <div className="relative w-[140px] h-[140px] flex items-center justify-center shrink-0">
                <div 
                  className="absolute inset-0 rounded-full opacity-20 blur-xl bg-emerald-500"
                  style={{ opacity: audit.score / 200 }}
                />
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: `conic-gradient(#10B981 ${audit.score}%, #111 0)` 
                  }}
                />
                <div className="absolute inset-[12px] bg-[#0A0A0A] rounded-full" />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-4xl font-bold text-emerald-500 leading-none">{audit.score}</span>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Trust Score</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-12">
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                 Your architecture benchmarked at <span className="text-emerald-500 font-bold">{audit.score}% compliance</span>.
                 We identified {audit.issueList.length} significant structural patterns that impact ethical user engagement and regulatory positioning.
              </p>
            </div>

            <div className="space-y-6 pt-12 border-t border-white/5">
              <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em] mb-8">Detected Risk Matrix</h4>
              {audit.issueList.map((issue: any, idx: number) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col gap-4 relative group hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${issue.severity === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                      <span className="text-sm font-bold uppercase tracking-tight text-white/90">
                        {issue.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-600">SEVERITY: {issue.severity.toUpperCase()}</span>
                  </div>
                  
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{issue.description}</p>
                  
                  <div className="p-5 bg-emerald-500/[0.03] rounded-xl border border-emerald-500/10">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" />
                      Remediation Protocol
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">{issue.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <GoogleAd slot="Dashboard_Mid" />
        </div>

        {/* Informational Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-8">
            <div className="glass-card p-8 border-emerald-500/10">
              <Sparkles className="w-8 h-8 text-emerald-500 mb-6" />
              <h4 className="text-lg font-bold mb-4 uppercase tracking-tighter">Why This Audit Matters</h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Ethical interface design is no longer just a &quot;nice-to-have.&quot; In 2026, user trust is the primary currency of the digital economy.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="p-1 bg-emerald-500/10 rounded-md shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80">Regulatory Shielding</p>
                    <p className="text-[10px] text-gray-600">Protect your enterprise from multi-million dollar fines associated with deceptive UI practices.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="p-1 bg-emerald-500/10 rounded-md shrink-0">
                    <Target className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80">LTV Optimization</p>
                    <p className="text-[10px] text-gray-600">Honest architectures lead to 3x higher long-term user retention compared to manipulative cohorts.</p>
                  </div>
                </li>
              </ul>
            </div>

            <GoogleAd slot="Sidebar_Bottom" />
            
            <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.01]">
              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-4">Strategic Insight</h4>
              <p className="text-xs text-gray-500 italic leading-relaxed">
                &quot;Users may not always identify a dark pattern consciously, but they feel the &apos;friction of deception&apos;—this is why transparency is the greatest competitive advantage today.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      <Header />
      <Suspense fallback={<div className="pt-32 px-6 text-center">Loading search params...</div>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
