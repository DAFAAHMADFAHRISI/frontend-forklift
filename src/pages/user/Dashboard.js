import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const menuItems = [
    { nama: 'Unit Forklift', path: '/user/forklifts', icon: '🚜', deskripsi: 'Lihat unit forklift yang tersedia.' },
    { nama: 'Operator', path: '/user/operators', icon: '👨‍💼', deskripsi: 'Lihat operator yang tersedia.' },
    { nama: 'Pemesanan Saya', path: '/user/orders', icon: '📋', deskripsi: 'Lihat dan buat pemesanan Anda.' },
    { nama: 'Pembayaran', path: '/user/payments', icon: '💰', deskripsi: 'Unggah dan kelola pembayaran Anda.' },
    { nama: 'Bukti Transfer', path: '/user/transfer-proofs', icon: '📄', deskripsi: 'Unggah dan cek status bukti transfer.' },
    { nama: 'Log Transaksi', path: '/user/transactions', icon: '📊', deskripsi: 'Riwayat transaksi pemesanan Anda.' },
    { nama: 'Feedback', path: '/user/feedback', icon: '💬', deskripsi: 'Beri rating dan komentar untuk pemesanan.' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col gap-2 px-4 py-4">
        <h1 className="text-2xl font-bold">Dashboard Pengguna</h1>
        <p className="text-gray-700 max-w-2xl">Sebagai pengguna, Anda dapat melakukan pemesanan forklift, mengelola akun pribadi, pembayaran, dan memberikan feedback. Anda hanya dapat mengakses data dan riwayat milik Anda sendiri.</p>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="self-end px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Keluar
        </button>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full text-left relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-start space-y-2 hover:border-indigo-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg font-semibold">{item.nama}</span>
              </div>
              <div className="text-gray-600 text-sm">{item.deskripsi}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 