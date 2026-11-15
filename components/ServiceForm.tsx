'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tag, User, Laptop, ChevronDown, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { Service, ServiceFormData, ServiceStatus } from '@/lib/types';
import { generateServiceNumber } from '@/lib/utils';

interface ServiceFormProps {
  editingService: Service | null;
  onSubmit: (formData: ServiceFormData, id?: number) => Promise<void>;
  onCancelEdit: () => void;
  isLoading: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  editingService,
  onSubmit,
  onCancelEdit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    no_servis: '',
    nama_pelanggan: '',
    nama_barang: '',
    status: 'Diterima',
    biaya_akhir: 0,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const namaPelangganRef = useRef<HTMLInputElement>(null);
  const namaBarangRef = useRef<HTMLInputElement>(null);
  const biayaAkhirRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editingService) {
      setFormData({
        no_servis: editingService.no_servis,
        nama_pelanggan: editingService.nama_pelanggan,
        nama_barang: editingService.nama_barang,
        status: editingService.status,
        biaya_akhir: editingService.biaya_akhir,
      });
      setErrorMessage(null);
    } else {
      setFormData({
        no_servis: generateServiceNumber(),
        nama_pelanggan: '',
        nama_barang: '',
        status: 'Diterima',
        biaya_akhir: 0,
      });
      setErrorMessage(null);
    }
  }, [editingService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validasi String Kosong (TC-01)
    if (!formData.nama_pelanggan.trim() || !formData.nama_barang.trim()) {
      setErrorMessage('Nama pelanggan dan nama barang wajib diisi.');
      if (!formData.nama_pelanggan.trim()) {
        namaPelangganRef.current?.focus();
      } else {
        namaBarangRef.current?.focus();
      }
      return;
    }

    // 2. Validasi Nominal Negatif (TC-02)
    const nominalBiaya = parseFloat(String(formData.biaya_akhir));
    if (isNaN(nominalBiaya) || nominalBiaya < 0) {
      setErrorMessage('Biaya akhir tidak boleh bernilai negatif (minimal 0)');
      biayaAkhirRef.current?.focus();
      return;
    }

    // 3. Validasi Konsistensi Status
    const validStatus: ServiceStatus[] = ['Diterima', 'Diperiksa', 'Diproses', 'Selesai', 'Diambil'];
    if (!validStatus.includes(formData.status)) {
      setErrorMessage('Status pengerjaan servis tidak valid.');
      statusRef.current?.focus();
      return;
    }

    try {
      await onSubmit(
        {
          ...formData,
          no_servis: formData.no_servis.trim() || generateServiceNumber(),
          nama_pelanggan: formData.nama_pelanggan.trim(),
          nama_barang: formData.nama_barang.trim(),
          biaya_akhir: nominalBiaya,
        },
        editingService?.id
      );

      if (!editingService) {
        setFormData({
          no_servis: generateServiceNumber(),
          nama_pelanggan: '',
          nama_barang: '',
          status: 'Diterima',
          biaya_akhir: 0,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Gagal menyimpan transaksi servis.');
      }
    }
  };

  const handleReset = () => {
    setErrorMessage(null);
    if (editingService) {
      onCancelEdit();
    } else {
      setFormData({
        no_servis: generateServiceNumber(),
        nama_pelanggan: '',
        nama_barang: '',
        status: 'Diterima',
        biaya_akhir: 0,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-20">
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {editingService ? 'Edit Data & Biaya Servis' : 'Penerimaan Servis Baru'}
          </h3>
          <p className="text-xs text-slate-500">
            {editingService
              ? `Memperbarui record servis #${editingService.no_servis}`
              : 'Mencatat pendaftaran unit servis barang pelanggan'}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
            editingService
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
          }`}
        >
          {editingService ? 'Mode Edit' : 'Mode Baru'}
        </span>
      </div>

      {/* ALERT BANNER ERROR BOX (TC-01 / TC-02 VALIDATION DISPLAY) */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 transition-all">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block text-xs uppercase tracking-wider text-rose-800">
              Peringatan Validasi:
            </strong>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field 1: No. Servis */}
        <div>
          <label htmlFor="no_servis" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
            Nomor Servis <span className="text-indigo-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="no_servis"
              value={formData.no_servis}
              onChange={(e) => setFormData({ ...formData, no_servis: e.target.value })}
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="SRV-202611-001"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dihasilkan otomatis berformat unik atau dapat disesuaikan.</p>
        </div>

        {/* Field 2: Nama Pelanggan */}
        <div>
          <label htmlFor="nama_pelanggan" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
            Nama Pelanggan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              ref={namaPelangganRef}
              type="text"
              id="nama_pelanggan"
              value={formData.nama_pelanggan}
              onChange={(e) => setFormData({ ...formData, nama_pelanggan: e.target.value })}
              required
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="cth. Ahmad Fauzi"
            />
          </div>
        </div>

        {/* Field 3: Nama Barang */}
        <div>
          <label htmlFor="nama_barang" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
            Nama Barang / Perangkat <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Laptop className="w-4 h-4" />
            </div>
            <input
              ref={namaBarangRef}
              type="text"
              id="nama_barang"
              value={formData.nama_barang}
              onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
              required
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="cth. Laptop ASUS ROG Zephyrus G14"
            />
          </div>
        </div>

        {/* Field 4: Status Pengerjaan */}
        <div>
          <label htmlFor="status" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
            Status Pengerjaan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              ref={statusRef}
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ServiceStatus })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none pr-8"
            >
              <option value="Diterima">Diterima</option>
              <option value="Diperiksa">Diperiksa</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Diambil">Diambil</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Field 5: Biaya Akhir */}
        <div>
          <label htmlFor="biaya_akhir" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
            Biaya Akhir (Rp) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-semibold text-sm pointer-events-none">
              Rp
            </span>
            <input
              ref={biayaAkhirRef}
              type="number"
              id="biaya_akhir"
              min="0"
              step="1000"
              value={formData.biaya_akhir}
              onChange={(e) => setFormData({ ...formData, biaya_akhir: Number(e.target.value) })}
              required
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="0"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Isi nominal akhir saat status Selesai atau Diambil (TC-01: 150000; TC-02: minimal 0).
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{editingService ? 'Perbarui Data' : 'Simpan Data'}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-all text-sm focus:outline-none"
          >
            {editingService ? 'Batal Edit' : 'Reset'}
          </button>
        </div>
      </form>
    </div>
  );
};
