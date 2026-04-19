'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  CreditCard,
  Target,
  FileText,
  Sparkles
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
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#050505'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ethoscan-report-${auditId?.slice(-6)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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
        <p className="text-white/40 font-medium">Fetching your ethical report...</p>
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
          <h2 className="text-2xl font-display font-bold mb-2">Audit Not Found</h2>
          <p className="text-white/40 max-w-sm">We couldn&apos;t find this audit report. It may have been deleted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20">
      <GoogleAd slot="Upper_Dashboard" />
      
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Start New Analysis
        </button>
        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          Official Compliance Log
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-7 space-y-8">
          <div ref={reportRef} className="glass-card p-8 md:p-12 relative overflow-hidden shadow-2xl bg-[#050505]">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">Technical Analysis</h3>
                <p className="text-sm text-gray-500 tracking-wider font-mono">ID: #{auditId?.slice(-6).toUpperCase() || 'PND-X'}</p>
              </div>
              
              <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: `conic-gradient(#10B981 ${audit.score}%, #222 0)` 
                  }}
                />
                <div className="absolute inset-[10px] bg-[#0A0A0A] rounded-full" />
                <span className="relative z-10 text-3xl font-bold text-emerald-500">{audit.score}</span>
              </div>
            </div>

            <div className="relative z-10 mb-8">
              <p className="text-lg text-gray-400 leading-relaxed mb-6">
                 Your interface has been benchmarked at <span className="text-emerald-500 font-bold">{audit.score}/100</span> for architectural transparency.
                 Automated intelligence detected {audit.issueList.length} critical architectural patterns that deviate from ethical standards.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-emerald-500/5 text-emerald-500 rounded border border-emerald-500/10">
                  <span className="status-dot dot-green"></span>
                  Verified Authenticity
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-white/5 text-gray-500 rounded border border-white/5">
                  Protocol v3.5
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-12 border-t border-white/5">
              {audit.issueList.map((issue: any, idx: number) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-xl border-l-4 ${issue.severity === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-1">
                       <span className={`text-sm font-bold uppercase tracking-tight ${issue.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                         {issue.type}
                       </span>
                       <span className="text-[10px] uppercase tracking-wider text-gray-500 italic">Level {idx + 1}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{issue.description}</p>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
                         Actionable Solution:
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">{issue.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <GoogleAd slot="Mid_Content_List" />
        </div>

        {/* Sidebar / Monetization */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-8 shadow-2xl sticky top-32">
            <FileText className="text-emerald-500 w-10 h-10 mb-6" />
            <h3 className="text-xl font-display font-bold mb-4">Official Compliance Documentation</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Export your findings as a formalized documentation report for internal review or legal archives. This summary includes identifying markers and specific design suggestions.
            </p>
            <button 
              onClick={downloadPDF}
              disabled={isDownloading}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-500 transition-all group disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : 'group-hover:translate-y-1'} transition-transform`} />
              {isDownloading ? 'Generating Document...' : 'Download Report — Free'}
            </button>
            <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400">Archived for Compliance Integrity</span>
            </div>
          </div>

          <GoogleAd slot="Side_Banner" />
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
