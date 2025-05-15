import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './bukti.css';

// Config
const API_BASE_URL = 'http://localhost:3000/API';

const TambahBuktiTransfer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_pembayaran: '',
    status_verifikasi: 'menunggu'
  });
  const [files, setFiles] = useState({
    file_bukti: null,
    gambar_bukti: null
  });
  const [fileNames, setFileNames] = useState({
    file_bukti: '',
    gambar_bukti: ''
  });
  const [pembayaranList, setPembayaranList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
      setFileNames(prev => ({
        ...prev,
        [name]: files[0].name
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Check if at least one file is uploaded
    if (!files.file_bukti && !files.gambar_bukti) {
      setError('Minimal satu file bukti harus diunggah');
      setLoading(false);
      return;
    }

    // Create form data object for file upload
    const uploadData = new FormData();
    uploadData.append('id_pembayaran', formData.id_pembayaran);
    uploadData.append('status_verifikasi', formData.status_verifikasi);
    
    if (files.file_bukti) {
      uploadData.append('file_bukti', files.file_bukti);
    }
    
    if (files.gambar_bukti) {
      uploadData.append('gambar_bukti', files.gambar_bukti);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/bukti-transfer/store`,
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status) {
        setSuccess('Bukti transfer berhasil ditambahkan');
        // Reset form after successful submission
        setFormData({
          id_pembayaran: '',
          status_verifikasi: 'menunggu'
        });
        setFiles({
          file_bukti: null,
          gambar_bukti: null
        });
        setFileNames({
          file_bukti: '',
          gambar_bukti: ''
        });
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/bukti-transfer');
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting bukti transfer:', error);
      setError(error.response?.data?.message || 'Gagal menambahkan bukti transfer');
    } finally {
      setLoading(false);
    }
  };

  // Load pembayaran options
  // Note: This is a placeholder. You need to implement actual API call to get pembayaran data
  useEffect(() => {
    const fetchPembayaran = async () => {
      try {
        // Replace with your actual API endpoint for pembayaran
        // const response = await axios.get(`${API_BASE_URL}/pembayaran/`);
        // if (response.data.status) {
        //   setPembayaranList(response.data.data);
        // }
        
        // Placeholder data - replace with actual API call
        setPembayaranList([
          { id_pembayaran: 'P001', keterangan: 'Pembayaran 1' },
          { id_pembayaran: 'P002', keterangan: 'Pembayaran 2' },
          { id_pembayaran: 'P003', keterangan: 'Pembayaran 3' }
        ]);
      } catch (error) {
        console.error('Error fetching pembayaran data:', error);
      }
    };

    fetchPembayaran();
  }, []);

  return (
    <div className="bukti-container">
      <h1 className="page-title">Tambah Bukti Transfer</h1>
      
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
          <div className="form-group">
            <label htmlFor="id_pembayaran">ID Pembayaran</label>
            <select
              id="id_pembayaran"
              name="id_pembayaran"
              value={formData.id_pembayaran}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">-- Pilih ID Pembayaran --</option>
              {pembayaranList.map((p) => (
                <option key={p.id_pembayaran} value={p.id_pembayaran}>
                  {p.id_pembayaran} - {p.keterangan}
                </option>
              ))}
            </select>
            <div className="text-gray-500 text-sm mt-1">
              Pilih ID pembayaran yang sesuai dengan bukti transfer
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="file_bukti">File Bukti (PDF)</label>
              <input
                type="file"
                id="file_bukti"
                name="file_bukti"
                onChange={handleFileChange}
                accept=".pdf"
                className="form-control"
              />
              {files.file_bukti && (
                <div className="file-info">
                  <span className="font-medium">File: </span>
                  {fileNames.file_bukti}
                </div>
              )}
              <div className="text-gray-500 text-sm mt-1">
                Upload file bukti transfer dalam format PDF (Max 5MB)
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="gambar_bukti">Gambar Bukti (JPG/PNG)</label>
              <input
                type="file"
                id="gambar_bukti"
                name="gambar_bukti"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                className="form-control"
              />
              {files.gambar_bukti && (
                <div className="preview-container">
                  <img
                    src={URL.createObjectURL(files.gambar_bukti)}
                    alt="Preview"
                    className="preview-image"
                  />
                  <div className="file-info mt-2">
                    <span className="font-medium">File: </span>
                    {fileNames.gambar_bukti}
                  </div>
                </div>
              )}
              <div className="text-gray-500 text-sm mt-1">
                Upload gambar bukti transfer dalam format JPG/PNG (Max 5MB)
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
              disabled={loading}
            >
              {loading ? 'Mengunggah...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahBuktiTransfer;
