import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const menuItems = [
    { nama: 'Pengguna', path: '/admin/users', icon: '👥', deskripsi: 'Kelola data user dan role.' },
    { nama: 'Unit Forklift', path: '/admin/units', icon: '🚜', deskripsi: 'Kelola unit forklift dan status.' },
    { nama: 'Operator', path: '/admin/operators', icon: '👨‍💼', deskripsi: 'Kelola operator dan status.' },
    { nama: 'Pemesanan', path: '/admin/orders', icon: '📋', deskripsi: 'Lihat dan kelola semua pemesanan.' },
    { nama: 'Pembayaran', path: '/admin/payments', icon: '💰', deskripsi: 'Verifikasi dan kelola pembayaran.' },
    { nama: 'Bukti Transfer', path: '/admin/transfer-proofs', icon: '📄', deskripsi: 'Verifikasi bukti transfer.' },
    { nama: 'Log Transaksi', path: '/admin/transaction-logs', icon: '📊', deskripsi: 'Riwayat transaksi semua pemesanan.' },
    { nama: 'Feedback', path: '/admin/feedback', icon: '💬', deskripsi: 'Lihat feedback dan rating user.' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col gap-2 px-4 py-4">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-700 max-w-2xl">Sebagai admin, Anda memiliki kontrol penuh untuk mengelola seluruh data dan operasional sistem, termasuk user, unit forklift, operator, pemesanan, pembayaran, bukti transfer, log transaksi, feedback, dan laporan.</p>
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

export default AdminDashboard; 