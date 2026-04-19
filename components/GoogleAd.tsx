'use client';

import React from 'react';

export default function GoogleAd({ slot }: { slot?: string }) {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-full max-w-4xl h-[90px] bg-white/5 border border-white/5 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/10 absolute top-2 right-4">Sponsored Content</div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500/20 animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Ad Slot: {slot || 'Global_Banner'}</span>
        </div>
      </div>
    </div>
  );
}
