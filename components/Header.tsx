'use client';

import React from 'react';
import { Wrench, Shield, Settings } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isConnected, onOpenConfig }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">ServiceTrack</h1>
            <p className="text-xs text-slate-500 font-medium">Sistem Pencatatan Servis & Tracking Biaya</p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Supabase Status Badge */}
          <button
            onClick={onOpenConfig}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title="Klik untuk atur koneksi Supabase"
          >
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span>{isConnected ? 'Supabase Connected' : 'Mode Demo / Offline'}</span>
          </button>

          {/* User Role Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Shield className="w-3.5 h-3.5" />
            Petugas Servis
          </span>

          {/* Config Cog */}
          <button
            onClick={onOpenConfig}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            title="Konfigurasi Kredensial Supabase"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};
