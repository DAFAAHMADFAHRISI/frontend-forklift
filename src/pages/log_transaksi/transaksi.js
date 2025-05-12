import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LogTransaksi = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [newLog, setNewLog] = useState({
    id_pemesanan: '',
    status_transaksi: '',
    keterangan: '',
  });

  // Fetch all logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/API/log-transaksi/');
      setLogs(response.data.data);
      setFilteredLogs(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch transaction logs');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchLogsByOrderId = async (orderId) => {
    if (!orderId.trim()) {
      setFilteredLogs(logs);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/API/log-transaksi/pemesanan/${orderId}`);
      setFilteredLogs(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch logs for this order ID');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchLogDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/API/log-transaksi/${id}`);
      setSelectedLog(response.data.data);
      setShowDetailModal(true);
    } catch (err) {
      setError('Failed to fetch log details');
      console.error(err);
    }
  };

  // Add new log
  const addLog = async () => {
    try {
      await axios.post('http://localhost:3000/API/log-transaksi/store', newLog);
      setShowAddModal(false);
      setNewLog({
        id_pemesanan: '',
        status_transaksi: '',
        keterangan: '',
      });
      fetchLogs(); // Refresh the list
    } catch (err) {
      setError('Failed to add new log');
      console.error(err);
    }
  };

  // Delete log
  const deleteLog = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await axios.delete(`http://localhost:3000/API/log-transaksi/delete/${id}`);
        fetchLogs(); // Refresh the list
      } catch (err) {
        setError('Failed to delete log');
        console.error(err);
      }
    }
  };

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchOrderId(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogsByOrderId(searchOrderId);
  };

  // Handle new log input changes
  const handleNewLogChange = (e) => {
    setNewLog({
      ...newLog,
      [e.target.name]: e.target.value,
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Log Transaksi</h1>
      
      {/* Search and Add button section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchOrderId}
              onChange={handleSearch}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 text-gray-500 hover:text-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Add New Log
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Logs table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">id_log</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">id_pemesanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">status_transaksi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">keterangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">waktu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No transaction logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{log.id_log || log.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.id_pemesanan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${log.status_transaksi.toLowerCase().includes('diterima') || log.status_transaksi === 'Completed' ? 'bg-green-100 text-green-800' : 
                          log.status_transaksi === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          log.status_transaksi === 'Failed' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {log.status_transaksi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.keterangan || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.waktu).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add New Transaction Log</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  name="id_pemesanan"
                  value={newLog.id_pemesanan}
                  onChange={handleNewLogChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status_transaksi"
                  value={newLog.status_transaksi}
                  onChange={handleNewLogChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pembayaran diterima">Pembayaran diterima</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={newLog.keterangan}
                  onChange={handleNewLogChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Contoh: Pembayaran telah dikonfirmasi oleh admin"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addLog}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Transaction Log Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">id_log</p>
                <p className="font-medium">{selectedLog.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">id_pemesanan</p>
                <p className="font-medium">{selectedLog.id_pemesanan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">status_transaksi</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${selectedLog.status_transaksi.toLowerCase().includes('diterima') || selectedLog.status_transaksi === 'Completed' ? 'bg-green-100 text-green-800' : 
                      selectedLog.status_transaksi === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      selectedLog.status_transaksi === 'Failed' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {selectedLog.status_transaksi}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">keterangan</p>
                <p className="font-medium">{selectedLog.keterangan || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">waktu</p>
                <p className="font-medium">{new Date(selectedLog.waktu).toLocaleString()}</p>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogTransaksi;
