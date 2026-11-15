'use client';

import React, { useState } from 'react';
import { Search, Edit3, Trash2, Inbox } from 'lucide-react';
import { Service, ServiceStatus } from '@/lib/types';
import { formatRupiah, formatTanggal, getStatusBadgeClass } from '@/lib/utils';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDeleteRequest: (service: Service) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  onEdit,
  onDeleteRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredServices = services.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      (item.no_servis && item.no_servis.toLowerCase().includes(q)) ||
      (item.nama_pelanggan && item.nama_pelanggan.toLowerCase().includes(q)) ||
      (item.nama_barang && item.nama_barang.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3 justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Cari No, Pelanggan, Barang..."
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="filter-status" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Filter Status:
          </label>
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="ALL">Semua Status</option>
            <option value="Diterima">Diterima</option>
            <option value="Diperiksa">Diperiksa</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Diambil">Diambil</option>
          </select>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">No. Servis</th>
                <th className="py-3 px-4">Pelanggan & Tanggal</th>
                <th className="py-3 px-4">Barang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Biaya Akhir</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredServices.length > 0 ? (
                filteredServices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    {/* Kolom 1: No. Servis (font-mono) */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 text-xs">
                      {item.no_servis}
                    </td>

                    {/* Kolom 2: Pelanggan & Tanggal */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{item.nama_pelanggan}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{formatTanggal(item.created_at)}</div>
                    </td>

                    {/* Kolom 3: Barang */}
                    <td className="py-3 px-4 text-slate-600">{item.nama_barang}</td>

                    {/* Kolom 4: Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Kolom 5: Biaya Akhir */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {formatRupiah(item.biaya_akhir)}
                    </td>

                    {/* Kolom 6: Aksi (Edit & Hapus) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all mr-1"
                        title="Edit Data Servis"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRequest(item)}
                        className="inline-flex items-center p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-all"
                        title="Hapus Servis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mb-3">
              <Inbox className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Belum Ada Data Servis</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Gunakan form di sebelah kiri untuk mencatat transaksi baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
