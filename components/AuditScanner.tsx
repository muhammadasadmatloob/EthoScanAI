'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Scan, ShieldAlert, Sparkles, Loader2, Globe } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, googleProvider, handleFirestoreError } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { ai, ETHICAL_AUDIT_PROMPT } from '@/lib/gemini';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AuditScanner() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File too large. Max 10MB.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const startScan = async () => {
    if (!user) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err) {
        console.error(err);
        return;
      }
    }

    if (!file && !urlInput) {
      alert("Please provide either a screenshot or a website URL to begin the audit.");
      return;
    }

    setIsScanning(true);
    setScanStatus('Initializing deep compliance check...');
    
    try {
      setScanStatus('Automated agent is analyzing your interface architecture...');
      
      const parts: any[] = [{ text: `${ETHICAL_AUDIT_PROMPT}\n\nAdditional Context: The website URL is ${urlInput || 'Not provided'}` }];
      
      if (preview) {
        const base64Data = preview.split(',')[1];
        parts.push({ inlineData: { data: base64Data, mimeType: file?.type || 'image/png' } });
      }

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const analysis = JSON.parse(result.text || '{}');
      
      setScanStatus('Syncing ethical scores with your records...');

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Authentication lost. Please sign in again.");

      const auditData = {
        userId: currentUser.uid,
        url: urlInput || '',
        imageUrl: '', 
        timestamp: new Date().toISOString(),
        score: analysis.score || 0,
        issueList: (analysis.issue_list || []).map((issue: any) => ({
          type: issue.type,
          severity: issue.severity,
          description: issue.description,
          recommendation: issue.recommendation
        })),
        status: 'completed',
        serverTimestamp: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, `users/${currentUser.uid}/audits`), auditData).catch(e => handleFirestoreError(e, 'create', `users/${currentUser.uid}/audits`));

      setScanStatus('Audit Complete. Redirecting to your report...');
      
      setTimeout(() => {
        router.push(`/dashboard?auditId=${docRef.id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      alert("Scanning failed. Please try again.");
      setIsScanning(false);
    }
  };

  const [urlInput, setUrlInput] = useState('');

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            {/* Multi-input Area */}
            <div className="space-y-4">
              <div className="glass-card p-4 md:p-6 shadow-2xl space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1 block">Step 1: Website Context</label>
                  <input 
                    type="url"
                    placeholder="https://your-website.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-grow h-px bg-white/5"></div>
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">AND / OR</span>
                  <div className="flex-grow h-px bg-white/5"></div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1 block">Step 2: Interface Snapshot</label>
                  <div 
                    className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-gray-600 group-hover:text-emerald-500 transition-colors" />
                    <span className="text-xs text-gray-500 font-medium">{file ? file.name : "Click to upload screenshot"}</span>
                  </div>
                </div>

                <button 
                  onClick={startScan}
                  disabled={isScanning || (!file && !urlInput)}
                  className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{scanStatus}</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5" />
                      <span>Start Professional Ethics Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <div className="flex items-center justify-center gap-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
               <span>ISO Compliance Ready</span>
               <span>Vision Intel v3.5</span>
               <span>Automated Ethics Check</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="relative rounded-[24px] overflow-hidden border border-white/8 group bg-black/40 backdrop-blur-md p-2">
              <img src={preview} alt="Upload preview" className="w-full h-auto max-h-[400px] object-contain rounded-[20px]" />
              
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] z-10"
                  />
                )}
              </AnimatePresence>

              {!isScanning && (
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {urlInput && (
                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-gray-400 truncate">{urlInput}</span>
                </div>
              )}
              
              <button 
                onClick={startScan}
                disabled={isScanning}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{scanStatus}</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Generate Compliance Report — Free</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
