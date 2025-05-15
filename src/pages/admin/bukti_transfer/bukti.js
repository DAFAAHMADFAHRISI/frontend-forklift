import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './bukti.css';

const API_BASE_URL = 'http://localhost:3000/API';
const StatusBadge = ({ status }) => {
  const statusStyles = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    terverifikasi: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800'
  };
  
  const statusLabels = {
    menunggu: 'Menunggu',
    terverifikasi: 'Terverifikasi',
    ditolak: 'Ditolak'
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyles[status] || 'bg-gray-100'}`}>
      {statusLabels[status] || status}
    </span>
  );
};

const ActionButton = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`hover:opacity-90 px-2 py-1 text-xs rounded-sm ${className}`}
  >
    {children}
  </button>
);

const BuktiTransferList = () => {
  const [buktiTransfers, setBuktiTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuktiTransfers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/bukti-transfer/`);
      if (response.data.status) {
        setBuktiTransfers(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching bukti transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuktiTransfers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/bukti-transfer/delete/${id}`);
        if (response.data.status) {
          alert('Bukti transfer berhasil dihapus');
                  fetchBuktiTransfers(); 
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert('Failed to delete bukti transfer');
        console.error('Error deleting bukti transfer:', error);
      }
    }
  };

  // View file in new tab
  const viewFile = (filename) => {
    if (filename) {
      window.open(`${API_BASE_URL.replace('/API', '')}/bukti_transfer/${filename}`, '_blank');
    }
  };

  if (loading) return (
    <div className="bukti-container">
      <h1 className="page-title">Bukti Transfer</h1>
      <div className="loading-container">
          <p>Loading bukti transfer data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bukti-container">
      <h1 className="page-title">Bukti Transfer</h1>
      <div className="error-container">
          <p>Error: {error}</p>
          <button 
              onClick={() => {setError(null); fetchBuktiTransfers();}}
              className="retry-button"
          >
              Try Again
          </button>
      </div>
    </div>
  );

  return (
    <div className="bukti-container">
      <h1 className="page-title">Bukti Transfer</h1>
      
      <div className="bukti-header">
        <h2>Daftar Bukti Transfer</h2>
        <Link to="/bukti-transfer/tambah" className="add-button">
          + Tambah Bukti Transfer
        </Link>
      </div>
      
      {/* Table */}
      <table className="bukti-table">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>ID Pembayaran</th>
            <th>File Bukti</th>
            <th>Gambar Bukti</th>
            <th className="text-center">Status Verifikasi</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buktiTransfers.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                Tidak ada data bukti transfer yang tersedia
              </td>
            </tr>
          ) : (
            buktiTransfers.map((bukti, index) => (
              <tr key={bukti.id_bukti_transfer}>
                <td className="text-center">{index + 1}</td>
                <td>{bukti.id_pembayaran}</td>
                <td>
                  {bukti.file_bukti ? (
                    <button 
                      onClick={() => viewFile(bukti.file_bukti)}
                      className="file-button"
                    >
                      Lihat File
                    </button>
                  ) : (
                    <span className="text-gray-500">Tidak ada file</span>
                  )}
                </td>
                <td>
                  {bukti.gambar_bukti ? (
                    <button 
                      onClick={() => viewFile(bukti.gambar_bukti)}
                      className="file-button"
                    >
                      Lihat Gambar
                    </button>
                  ) : (
                    <span className="text-gray-500">Tidak ada gambar</span>
                  )}
                </td>
                <td className="text-center">
                  <StatusBadge status={bukti.status_verifikasi} />
                </td>
                <td className="text-center">
                  <div className="action-buttons">
                    <Link to={`/bukti-transfer/${bukti.id_bukti_transfer}`}>
                      <button className="action-button view-button">
                        👁️ Lihat
                      </button>
                    </Link>
                    <Link to={`/bukti-transfer/edit/${bukti.id_bukti_transfer}`}>
                      <button className="action-button edit-button">
                        ✏️ Edit
                      </button>
                    </Link>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDelete(bukti.id_bukti_transfer)}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BuktiTransferList;
