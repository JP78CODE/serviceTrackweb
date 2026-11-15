'use client';

import React from 'react';
import { Clock, CheckCircle2, Banknote } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { Service } from '@/lib/types';

interface KPICardsProps {
  services: Service[];
}

export const KPICards: React.FC<KPICardsProps> = ({ services }) => {
  const aktifCount = services.filter((s) => ['Diterima', 'Diperiksa', 'Diproses'].includes(s.status)).length;
  const selesaiCount = services.filter((s) => ['Selesai', 'Diambil'].includes(s.status)).length;
  const totalPendapatan = services.reduce((acc, s) => acc + (Number(s.biaya_akhir) || 0), 0);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Servis Aktif */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Servis Aktif</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{aktifCount}</h2>
          <span className="text-xs text-blue-600 font-medium">Diterima, Diperiksa & Diproses</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Card 2: Servis Selesai & Diambil */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selesai & Diambil</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{selesaiCount}</h2>
          <span className="text-xs text-emerald-600 font-medium">Pengerjaan Rampung</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Total Pendapatan Biaya Akhir */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendapatan Biaya</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(totalPendapatan)}</h2>
          <span className="text-xs text-indigo-600 font-medium">Akumulasi Biaya Akhir</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Banknote className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};
