import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Pembayaran() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id_pemesanan: '',
    jumlah: '',
    metode: '',
    tanggal_pembayaran: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState('');

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/API/pembayaran/');
      if (response.data.status) {
        setPayments(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load payment data');
      setLoading(false);
    }
  };


  const searchByOrderId = async () => {
    if (!searchOrderId.trim()) {
      fetchPayments();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/API/pembayaran/pemesanan/${searchOrderId}`);
      if (response.data.status) {
        setPayments(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to search payments');
      setLoading(false);
    }
  };

  const getPaymentById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/API/pembayaran/${id}`);
      if (response.data.status) {
        const payment = response.data.data;
        setFormData({
          id_pemesanan: payment.id_pemesanan,
          jumlah: payment.jumlah,
          metode: payment.metode,
          tanggal_pembayaran: formatDateForInput(payment.tanggal_pembayaran)
        });
        setEditingId(id);
        setShowForm(true);
      }
    } catch (err) {
      setError('Failed to get payment details');
    }
  };

  // Create new payment
  const createPayment = async () => {
    try {
      const response = await axios.post('http://localhost:3000/API/pembayaran/store', formData);
      if (response.data.status) {
        fetchPayments();
        resetForm();
      }
    } catch (err) {
      setError('Failed to create payment');
    }
  };

  // Update payment
  const updatePayment = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/API/pembayaran/update/${editingId}`, formData);
      if (response.data.status) {
        fetchPayments();
        resetForm();
      }
    } catch (err) {
      setError('Failed to update payment');
    }
  };

  // Delete payment
  const deletePayment = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/API/pembayaran/delete/${id}`);
      if (response.data.status) {
        fetchPayments();
        setShowConfirmDelete(false);
      }
    } catch (err) {
      setError('Failed to delete payment');
    }
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updatePayment();
    } else {
      createPayment();
    }
  };

  // Reset form and state
  const resetForm = () => {
    setFormData({
      id_pemesanan: '',
      jumlah: '',
      metode: '',
      tanggal_pembayaran: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pembayaran</h1>
      
      {/* Search and Add Button Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari berdasarkan ID Pemesanan"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchByOrderId}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Cari
          </button>
          <button
            onClick={fetchPayments}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Tambah Pembayaran
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right"
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Payment Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Pembayaran' : 'Tambah Pembayaran'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ID Pemesanan
                </label>
                <input
                  type="text"
                  name="id_pemesanan"
                  value={formData.id_pemesanan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={editingId !== null}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Jumlah Pembayaran
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Metode Pembayaran
                </label>
                <select
                  name="metode"
                  value={formData.metode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Metode</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Tunai">Tunai</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tanggal Pembayaran
                </label>
                <input
                  type="date"
                  name="tanggal_pembayaran"
                  value={formData.tanggal_pembayaran}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">Apakah Anda yakin ingin menghapus pembayaran ini?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={() => deletePayment(selectedId)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada data pembayaran</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pemesanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id_pemesanan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatCurrency(payment.jumlah)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.metode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(payment.tanggal_pembayaran)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => getPaymentById(payment.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(payment.id);
                          setShowConfirmDelete(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
