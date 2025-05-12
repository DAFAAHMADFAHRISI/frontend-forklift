import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './bukti.css';

// Config
const API_BASE_URL = 'http://localhost:3000/API';

const EditBuktiTransfer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_pembayaran: '',
    status_verifikasi: 'menunggu'
  });
  const [buktiData, setBuktiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch bukti transfer data
  useEffect(() => {
    const fetchBuktiTransfer = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/bukti-transfer/${id}`);
        if (response.data.status) {
          const bukti = response.data.data;
          setBuktiData(bukti);
          setFormData({
            id_pembayaran: bukti.id_pembayaran,
            status_verifikasi: bukti.status_verifikasi
          });
        } else {
          setError('Bukti transfer tidak ditemukan');
          setTimeout(() => {
            navigate('/bukti-transfer');
          }, 2000);
        }
      } catch (error) {
        console.error('Error fetching bukti transfer:', error);
        setError('Failed to fetch bukti transfer data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBuktiTransfer();
    }
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // We'll use PATCH to update status only
      const response = await axios.patch(
        `${API_BASE_URL}/bukti-transfer/status/${id}`,
        { status_verifikasi: formData.status_verifikasi }
      );

      if (response.data.status) {
        setSuccess('Status verifikasi berhasil diperbarui');
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/bukti-transfer');
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error updating bukti transfer:', error);
      setError(error.response?.data?.message || 'Failed to update bukti transfer');
    } finally {
      setSubmitting(false);
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
      <h1 className="page-title">Edit Bukti Transfer</h1>
      <div className="loading-container">
          <p>Loading bukti transfer data...</p>
      </div>
    </div>
  );

  if (!buktiData && !loading) return (
    <div className="bukti-container">
      <h1 className="page-title">Edit Bukti Transfer</h1>
      <div className="error-container">
          <p>Error: Bukti transfer tidak ditemukan</p>
          <button 
              onClick={() => navigate('/bukti-transfer')}
              className="retry-button"
          >
              Kembali
          </button>
      </div>
    </div>
  );

  return (
    <div className="bukti-container">
      <h1 className="page-title">Edit Bukti Transfer</h1>
      
      <div className="bukti-form">
        {error && (
          <div className="error-message p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="success-message p-3 mb-4 bg-green-50 text-green-700 border border-green-200 rounded">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="id_pembayaran">ID Pembayaran</label>
              <input
                type="text"
                id="id_pembayaran"
                value={formData.id_pembayaran}
                disabled
                className="form-control bg-gray-100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status_verifikasi">Status Verifikasi</label>
              <select
                id="status_verifikasi"
                name="status_verifikasi"
                value={formData.status_verifikasi}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="menunggu">Menunggu</option>
                <option value="terverifikasi">Terverifikasi</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          <h3 className="mt-6 mb-3">Bukti yang Diunggah</h3>
          <div className="form-grid">
            <div className="preview-box">
              <h4 className="text-base font-medium mb-2">File Bukti</h4>
              <div className="bg-gray-50 rounded border p-4 text-center">
                {buktiData.file_bukti ? (
                  <div>
                    <p className="mb-2 text-sm">{buktiData.file_bukti}</p>
                    <button 
                      onClick={() => viewFile(buktiData.file_bukti)}
                      type="button"
                      className="file-button"
                    >
                      Lihat File
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">Tidak ada file bukti</p>
                )}
              </div>
            </div>
            
            <div className="preview-box">
              <h4 className="text-base font-medium mb-2">Gambar Bukti</h4>
              <div className="bg-gray-50 rounded border p-4 text-center">
                {buktiData.gambar_bukti ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <img 
                        src={`${API_BASE_URL.replace('/API', '')}/bukti_transfer/${buktiData.gambar_bukti}`}
                        alt="Bukti Transfer"
                        className="max-h-32 max-w-full object-contain mb-2"
                      />
                    </div>
                    <button 
                      onClick={() => viewFile(buktiData.gambar_bukti)}
                      type="button"
                      className="file-button"
                    >
                      Lihat Gambar
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">Tidak ada gambar bukti</p>
                )}
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button 
              type="button" 
              onClick={() => navigate('/bukti-transfer')}
              className="cancel-button"
            >
              Kembali
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBuktiTransfer;
