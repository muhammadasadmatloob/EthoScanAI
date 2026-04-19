'use client';

import React from 'react';
import Header from '@/components/Header';
import LiquidBackground from '@/components/LiquidBackground';
import AuditScanner from '@/components/AuditScanner';
import GoogleAd from '@/components/GoogleAd';
import { motion } from 'motion/react';
import { CheckCircle, Shield, AlertTriangle, Scale, Lock, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <LiquidBackground />
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold mb-6 uppercase tracking-wider"
          >
            Compliance Intelligence Protocol v3.5
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-8 tracking-tight text-white"
          >
            Stop Losing <br /><span className="text-emerald-500">User Trust.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed"
          >
            Transform your interface into a benchmark of transparency. Our automated vision auditing identifies architectural friction and deceptive patterns that compromise your long-term integrity and regulatory standing.
          </motion.p>

          <AuditScanner />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex gap-8 items-center opacity-60 flex-wrap justify-center overflow-hidden"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">4.2k+</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Sites Audited</span>
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-800"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">98%</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Accuracy Rate</span>
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-800"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">2026</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">GDPR Ready</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Info Section */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-2">
              <Scale className="text-orange-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">Legal Compliance 2026</h3>
            <p className="text-white/40 leading-relaxed">Stay ahead of the latest UX regulations. We check for forced continuity and misdirection that risk heavy legal penalties.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-2">
              <Shield className="text-green-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">Ethical UX Tool</h3>
            <p className="text-white/40 leading-relaxed">Identity social proof manipulation and fake countdowns. Build a brand that users can actually trust for the long haul.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
              <CheckCircle className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">Comprehensive Pattern Audit</h3>
            <p className="text-white/40 leading-relaxed">Our advanced vision protocol scans every pixel for forced actions and hidden costs that compromise long-term user value.</p>
          </div>
        </div>
      </section>

      {/* Industry Standards Section */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-display font-bold uppercase tracking-tight">The Standard for Ethical Design</h2>
          <p className="text-gray-500 leading-relaxed text-lg">
            EthoScan AI was established to bridge the gap between complex regulatory requirements and practical interface design. Our objective is to automate the identification of structural patterns that compromise user trust, ensuring that global digital standards are met with precision and integrity.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <div className="p-4 glass-card border-white/5">
              <span className="block text-emerald-500 font-bold text-lg mb-1">98%</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Detection Accuracy</span>
            </div>
            <div className="p-4 glass-card border-white/5">
              <span className="block text-emerald-500 font-bold text-lg mb-1">2026</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Compliance Standard</span>
            </div>
            <div className="p-4 glass-card border-white/5">
              <span className="block text-emerald-500 font-bold text-lg mb-1">Global</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Legal Anchoring</span>
            </div>
            <div className="p-4 glass-card border-white/5">
              <span className="block text-emerald-500 font-bold text-lg mb-1">Instant</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Protocol Execution</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="container mx-auto px-6 pt-12">
        <GoogleAd slot="Landing_Page_Footer" />
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/20 text-sm">© 2026 EthoScan AI. Building an honest internet.</p>
        </div>
      </footer>
    </main>
  );
}
