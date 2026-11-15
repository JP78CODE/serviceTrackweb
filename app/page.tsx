'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { KPICards } from '@/components/KPICards';
import { StatusBar } from '@/components/StatusBar';
import { ServiceForm } from '@/components/ServiceForm';
import { ServiceTable } from '@/components/ServiceTable';
import { DeleteModal } from '@/components/DeleteModal';
import { ConfigModal } from '@/components/ConfigModal';
import { Service, ServiceFormData } from '@/lib/types';
import { getSupabaseClient } from '@/lib/supabase';

// Mock Dummy Data Awal Sesuai Modul 2 SKPL
const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    no_servis: 'SRV-202611-001',
    nama_pelanggan: 'Ahmad Fauzi',
    nama_barang: 'Laptop ASUS ROG Zephyrus G14',
    status: 'Diproses',
    biaya_akhir: 0.0,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 2,
    no_servis: 'SRV-202611-002',
    nama_pelanggan: 'Siti Nurhaliza',
    nama_barang: 'Printer Epson L3110',
    status: 'Selesai',
    biaya_akhir: 150000.0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    no_servis: 'SRV-202611-003',
    nama_pelanggan: 'Budi Santoso',
    nama_barang: 'Smartphone Samsung Galaxy S21',
    status: 'Diterima',
    biaya_akhir: 0.0,
    created_at: new Date().toISOString(),
  },
];

export default function ServiceTrackApp() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Data
  const loadServices = useCallback(async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('services')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setServices(data || []);
        setIsConnected(true);
        return;
      } catch (err) {
        console.warn('Supabase fetch failed, fallback to local storage:', err);
        setIsConnected(false);
      }
    } else {
      setIsConnected(false);
    }

    // Local Storage Fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ST_SERVICES_DATA');
      if (stored) {
        try {
          setServices(JSON.parse(stored));
        } catch {
          setServices(DEFAULT_SERVICES);
        }
      } else {
        setServices(DEFAULT_SERVICES);
        localStorage.setItem('ST_SERVICES_DATA', JSON.stringify(DEFAULT_SERVICES));
      }
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Create / Update Service Handler
  const handleFormSubmit = async (formData: ServiceFormData, id?: number) => {
    setIsLoading(true);
    const client = getSupabaseClient();

    try {
      if (client) {
        if (id) {
          // UPDATE
          const { error } = await client
            .from('services')
            .update(formData)
            .eq('id', id);
          if (error) throw error;
        } else {
          // INSERT
          const { error } = await client
            .from('services')
            .insert([formData]);
          if (error) throw error;
        }
        await loadServices();
      } else {
        // Local state mutation
        if (id) {
          const updated = services.map((s) =>
            s.id === id ? { ...s, ...formData } : s
          );
          setServices(updated);
          localStorage.setItem('ST_SERVICES_DATA', JSON.stringify(updated));
        } else {
          const nextId =
            services.length > 0
              ? Math.max(...services.map((s) => Number(s.id) || 0)) + 1
              : 1;
          const newService: Service = {
            id: nextId,
            ...formData,
            created_at: new Date().toISOString(),
          };
          const updated = [newService, ...services];
          setServices(updated);
          localStorage.setItem('ST_SERVICES_DATA', JSON.stringify(updated));
        }
      }
      setEditingService(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Service Handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const client = getSupabaseClient();

    try {
      if (client) {
        const { error } = await client
          .from('services')
          .delete()
          .eq('id', deleteTarget.id);
        if (error) throw error;
        await loadServices();
      } else {
        const updated = services.filter((s) => s.id !== deleteTarget.id);
        setServices(updated);
        localStorage.setItem('ST_SERVICES_DATA', JSON.stringify(updated));
      }
      setDeleteTarget(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Gagal menghapus data: ' + err.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Config Handlers
  const handleSaveConfig = (url: string, key: string) => {
    localStorage.setItem('ST_SUPABASE_URL', url);
    localStorage.setItem('ST_SUPABASE_ANON_KEY', key);
    loadServices();
  };

  const handleUseMock = () => {
    localStorage.removeItem('ST_SUPABASE_URL');
    localStorage.removeItem('ST_SUPABASE_ANON_KEY');
    loadServices();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header Bar */}
      <Header
        isConnected={isConnected}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* 2. Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        {/* KPI Summary Cards */}
        <KPICards services={services} />

        {/* Status Breakdown Bar */}
        <StatusBar services={services} />

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Input / Edit (5 Kolom) */}
          <div className="lg:col-span-5">
            <ServiceForm
              editingService={editingService}
              onSubmit={handleFormSubmit}
              onCancelEdit={() => setEditingService(null)}
              isLoading={isLoading}
            />
          </div>

          {/* Tabel Transaksi & Filter (7 Kolom) */}
          <div className="lg:col-span-7">
            <ServiceTable
              services={services}
              onEdit={(srv) => {
                setEditingService(srv);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDeleteRequest={(srv) => setDeleteTarget(srv)}
            />
          </div>
        </div>
      </main>

      {/* 3. Custom Modal Konfirmasi Hapus */}
      <DeleteModal
        targetService={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {/* 4. Modal Konfigurasi Supabase */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
        onUseMock={handleUseMock}
      />
    </div>
  );
}
