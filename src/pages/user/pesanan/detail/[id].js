import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PesananDetailPage() {
  const [id, setId] = useState(null);
  const [pesanan, setPesanan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Extract ID from URL
    const pathSegments = window.location.pathname.split('/');
    const orderId = pathSegments[pathSegments.length - 1];
    setId(orderId);
    
    if (orderId) {
      fetchPesananDetail(orderId);
    }
  }, []);

  const fetchPesananDetail = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/API/pesanan/detail/${orderId}`);
      setPesanan(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pesanan detail:', error);
      setError('Gagal mengambil detail pesanan');
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const statusColors = {
      'menunggu pembayaran': 'bg-yellow-100 text-yellow-800',
      'dibayar': 'bg-green-100 text-green-800',
      'diproses': 'bg-blue-100 text-blue-800',
      'dikirim': 'bg-purple-100 text-purple-800',
      'selesai': 'bg-green-100 text-green-800',
      'dibatalkan': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
          <div className="text-center mt-6">
            <a href="/pesanan/pesanan" className="text-blue-600 hover:text-blue-800 font-medium">
              &larr; Kembali ke Daftar Pesanan
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Pesanan tidak ditemukan</h1>
            <div className="text-center mt-6">
              <a href="/pesanan/pesanan" className="text-blue-600 hover:text-blue-800 font-medium">
                &larr; Kembali ke Daftar Pesanan
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <a href="/pesanan/pesanan" className="text-blue-600 hover:text-blue-800 font-medium">
            &larr; Kembali ke Daftar Pesanan
          </a>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(pesanan.status)}`}>
            {pesanan.status}
          </span>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan #{pesanan.id}</h1>
            {pesanan.nama_perusahaan && (
              <p className="text-gray-600 mt-1">{pesanan.nama_perusahaan}</p>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Informasi Pesanan</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">ID Pelanggan</p>
                    <p className="font-medium">{pesanan.id_pelanggan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Unit</p>
                    <p className="font-medium">{pesanan.id_unit}</p>
                  </div>
                  {pesanan.id_operator && (
                    <div>
                      <p className="text-sm text-gray-500">ID Operator</p>
                      <p className="font-medium">{pesanan.id_operator}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Lokasi Pengiriman</p>
                    <p className="font-medium">{pesanan.lokasi_pengiriman}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Waktu Sewa</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Mulai</p>
                    <p className="font-medium">{formatDate(pesanan.tanggal_mulai)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Selesai</p>
                    <p className="font-medium">{formatDate(pesanan.tanggal_selesai)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Durasi Sewa</p>
                    {pesanan.tanggal_mulai && pesanan.tanggal_selesai ? (
                      <p className="font-medium">
                        {Math.ceil((new Date(pesanan.tanggal_selesai) - new Date(pesanan.tanggal_mulai)) / (1000 * 60 * 60 * 24))} hari
                      </p>
                    ) : (
                      <p className="font-medium">-</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Timeline Status</h2>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <ul className="space-y-6">
                  {['menunggu pembayaran', 'dibayar', 'diproses', 'dikirim', 'selesai'].map((status, index) => {
                    const isCurrentStatus = status === pesanan.status;
                    const isPastStatus = getStatusIndex(pesanan.status) >= index;
                    const isCancelled = pesanan.status === 'dibatalkan';
                    
                    return (
                      <li key={status} className="relative pl-12">
                        <div className={`absolute left-0 w-12 flex items-center justify-center`}>
                          <div className={`w-4 h-4 rounded-full ${
                            isCancelled && status !== 'menunggu pembayaran' 
                              ? 'bg-gray-300' 
                              : isCurrentStatus 
                                ? 'bg-blue-500 ring-4 ring-blue-100' 
                                : isPastStatus 
                                  ? 'bg-green-500' 
                                  : 'bg-gray-300'
                          }`}></div>
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isCurrentStatus 
                              ? 'text-blue-600' 
                              : isPastStatus && !isCancelled 
                                ? 'text-green-600' 
                                : 'text-gray-500'
                          }`}>
                            {formatStatusName(status)}
                          </p>
                          {isCurrentStatus && (
                            <p className="text-sm text-gray-500 mt-1">Status saat ini</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              {pesanan.status === 'dibatalkan' && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-red-800 font-medium">Pesanan ini telah dibatalkan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusIndex(status) {
  const statuses = ['menunggu pembayaran', 'dibayar', 'diproses', 'dikirim', 'selesai'];
  return statuses.indexOf(status);
}

function formatStatusName(status) {
  const formattedNames = {
    'menunggu pembayaran': 'Menunggu Pembayaran',
    'dibayar': 'Pembayaran Diterima',
    'diproses': 'Sedang Diproses',
    'dikirim': 'Dalam Pengiriman',
    'selesai': 'Selesai',
    'dibatalkan': 'Dibatalkan'
  };
  return formattedNames[status] || status;
} 