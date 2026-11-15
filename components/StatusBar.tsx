'use client';

import React from 'react';
import { Service } from '@/lib/types';

interface StatusBarProps {
  services: Service[];
}

export const StatusBar: React.FC<StatusBarProps> = ({ services }) => {
  const getCount = (st: string) => services.filter((s) => s.status === st).length;

  return (
    <section className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
      <span className="font-semibold text-slate-500 uppercase tracking-wider">Status Antrean:</span>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          Diterima: <strong className="ml-1 font-bold">{getCount('Diterima')}</strong>
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Diperiksa: <strong className="ml-1 font-bold">{getCount('Diperiksa')}</strong>
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Diproses: <strong className="ml-1 font-bold">{getCount('Diproses')}</strong>
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Selesai: <strong className="ml-1 font-bold">{getCount('Selesai')}</strong>
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          Diambil: <strong className="ml-1 font-bold">{getCount('Diambil')}</strong>
        </span>
      </div>
    </section>
  );
};
