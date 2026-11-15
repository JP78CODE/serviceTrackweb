/**
 * TypeScript Data Models & Contracts for ServiceTrack
 * 100% Sesuai Skema Database PostgreSQL (Modul 2 SKPL)
 */

export type ServiceStatus = 'Diterima' | 'Diperiksa' | 'Diproses' | 'Selesai' | 'Diambil';

export interface Service {
  id: number;
  no_servis: string;
  nama_pelanggan: string;
  nama_barang: string;
  status: ServiceStatus;
  biaya_akhir: number;
  created_at: string;
}

export interface ServiceFormData {
  no_servis: string;
  nama_pelanggan: string;
  nama_barang: string;
  status: ServiceStatus;
  biaya_akhir: number;
}
