'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Scan, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
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

    if (!file || !preview) return;

    setIsScanning(true);
    setScanStatus('Initializing deep compliance check...');
    
    try {
      setScanStatus('Automated agent is analyzing your interface architecture...');
      
      const base64Data = preview.split(',')[1];
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: file.type } },
              { text: ETHICAL_AUDIT_PROMPT }
            ]
          }
        ],
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
        imageUrl: '', // In a real app, upload to Storage. For now we use the ID as reference. 
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <div 
                className="flex-grow glass-card p-2 flex items-center pr-4 shadow-2xl cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-transparent border-none outline-none flex-grow px-4 text-white/40 italic text-sm">
                  {file ? file.name : "Upload interface snapshot..."}
                </div>
                <button className="bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 active:scale-95">
                  <Scan className="w-4 h-4" />
                  Apply Vision Scan
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
              <button 
                onClick={startScan}
                disabled={isScanning}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
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
