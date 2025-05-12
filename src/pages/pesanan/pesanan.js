import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Tambahkan interceptor agar token selalu terupdate
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function PesananPage() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPesanan, setCurrentPesanan] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState({
    id_user: '',
    id_unit: '',
    id_operator: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    lokasi_pengiriman: '',
    nama_perusahaan: '',
    status: 'menunggu pembayaran'
  });
  const [error, setError] = useState('');

  const statusBadgeColors = {
    'menunggu pembayaran': 'bg-yellow-100 text-yellow-800',
    'dibayar': 'bg-green-100 text-green-800',
    'diproses': 'bg-blue-100 text-blue-800',
    'dikirim': 'bg-purple-100 text-purple-800',
    'selesai': 'bg-green-100 text-green-800',
    'dibatalkan': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/pesanan');
      if (response.data.status) {
        setPesanan(response.data.data);
      } else {
        setError(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pesanan:', error);
      if (error.response?.status === 401) {
        setError('Sesi anda telah berakhir. Silakan login kembali.');
        // Redirect to login page or handle unauthorized access
      } else {
        setError(error.response?.data?.message || 'Gagal mengambil data pesanan');
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      id_user: '',
      id_unit: '',
      id_operator: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      lokasi_pengiriman: '',
      nama_perusahaan: '',
      status: 'menunggu pembayaran'
    });
  };

  const openCreateModal = () => {
    resetForm();
    setFormMode('create');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setFormMode('edit');
    setCurrentPesanan(item);
    setFormData({
      id_user: item.id_user || '',
      id_unit: item.id_unit || '',
      id_operator: item.id_operator || '',
      tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '',
      tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split('T')[0] : '',
      lokasi_pengiriman: item.lokasi_pengiriman || '',
      nama_perusahaan: item.nama_perusahaan || '',
      status: item.status || 'menunggu pembayaran'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        const response = await axios.post('http://localhost:3000/api/pesanan/store', formData);
        if (response.data.status) {
          setShowModal(false);
          fetchPesanan();
        } else {
          setError(response.data.message);
        }
      } else {
        const response = await axios.patch(`http://localhost:3000/api/pesanan/update/${currentPesanan.id}`, formData);
        if (response.data.status) {
          setShowModal(false);
          fetchPesanan();
        } else {
          setError(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.response?.data?.message || (formMode === 'create' ? 'Gagal membuat pesanan' : 'Gagal memperbarui pesanan'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/pesanan/delete/${id}`);
        if (response.data.status) {
          fetchPesanan();
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting pesanan:', error);
        setError(error.response?.data?.message || 'Gagal menghapus pesanan');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/pesanan/${id}/status`, { status: newStatus });
      if (response.data.status) {
        fetchPesanan();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Gagal memperbarui status pesanan');
    }
  };

  const viewDetail = (id) => {
    window.location.href = `/pesanan/detail/${id}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pesanan</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
        >
          + Tambah Pesanan Baru
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
          <button className="absolute top-0 right-0 px-4 py-3" onClick={() => setError('')}>
            <span className="text-red-500">&times;</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Mulai
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pesanan.length > 0 ? (
                pesanan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id_pelanggan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id_unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lokasi_pengiriman}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded ${statusBadgeColors[item.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        <option value="menunggu pembayaran">Menunggu Pembayaran</option>
                        <option value="dibayar">Dibayar</option>
                        <option value="diproses">Diproses</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewDetail(item.id)} 
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Lihat Detail"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => openEditModal(item)} 
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit Pesanan"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="text-red-600 hover:text-red-900"
                          title="Hapus Pesanan"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data pesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {formMode === 'create' ? 'Tambah Pesanan Baru' : 'Edit Pesanan'}
                  </h3>
                  <div className="grid grid-cols-1 gap-y-4">
                    <div>
                      <label htmlFor="id_user" className="block text-sm font-medium text-gray-700">ID User</label>
                      <input
                        type="text"
                        name="id_user"
                        id="id_user"
                        value={formData.id_user}
                        onChange={handleInputChange}
                        required
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="id_unit" className="block text-sm font-medium text-gray-700">ID Unit</label>
                      <input
                        type="text"
                        name="id_unit"
                        id="id_unit"
                        value={formData.id_unit}
                        onChange={handleInputChange}
                        required
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="id_operator" className="block text-sm font-medium text-gray-700">ID Operator</label>
                      <input
                        type="text"
                        name="id_operator"
                        id="id_operator"
                        value={formData.id_operator}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="tanggal_mulai" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                      <input
                        type="date"
                        name="tanggal_mulai"
                        id="tanggal_mulai"
                        value={formData.tanggal_mulai}
                        onChange={handleInputChange}
                        required
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="tanggal_selesai" className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                      <input
                        type="date"
                        name="tanggal_selesai"
                        id="tanggal_selesai"
                        value={formData.tanggal_selesai}
                        onChange={handleInputChange}
                        required
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="lokasi_pengiriman" className="block text-sm font-medium text-gray-700">Lokasi Pengiriman</label>
                      <input
                        type="text"
                        name="lokasi_pengiriman"
                        id="lokasi_pengiriman"
                        value={formData.lokasi_pengiriman}
                        onChange={handleInputChange}
                        required
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="nama_perusahaan" className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
                      <input
                        type="text"
                        name="nama_perusahaan"
                        id="nama_perusahaan"
                        value={formData.nama_perusahaan}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="menunggu pembayaran">Menunggu Pembayaran</option>
                        <option value="dibayar">Dibayar</option>
                        <option value="diproses">Diproses</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {formMode === 'create' ? 'Simpan' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
