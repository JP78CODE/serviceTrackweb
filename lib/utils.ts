import { ServiceStatus } from './types';

/**
 * Format Angka ke Rupiah Indonesia (id-ID)
 */
export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number || 0);
};

/**
 * Format Timestamp ISO ke Tanggal Indonesia (id-ID)
 */
export const formatTanggal = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

/**
 * Anti-XSS Sanitizer (SEC-01)
 */
export const escapeHtml = (str?: string): string => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Auto-generate Nomor Servis Unik (SRV-YYYYMM-XXX)
 */
export const generateServiceNumber = (): string => {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const randomSeq = String(Math.floor(100 + Math.random() * 900));
  return `SRV-${yr}${mo}-${randomSeq}`;
};

/**
 * Helper Warna Badge Status Fungsional (Wajib Persis DESIGN.md)
 */
export const getStatusBadgeClass = (status: ServiceStatus): string => {
  switch (status) {
    case 'Diterima':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Diperiksa':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Diproses':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Selesai':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Diambil':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
