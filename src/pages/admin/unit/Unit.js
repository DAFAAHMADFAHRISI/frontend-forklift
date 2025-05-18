import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Unit.css'; // Pastikan file CSS ini ada

// Config
const API_BASE_URL = 'http://localhost:4001/api/unit';
const IMAGE_BASE_URL = 'http://localhost:4001/public/images/';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    tersedia: 'bg-green-100 text-green-800',
    disewa: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800'
  };
  
  const statusLabels = {
    tersedia: 'Tersedia',
    disewa: 'Disewa',
    maintenance: 'Maintenance'
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs ${statusStyles[status] || 'bg-gray-100'}`}>
      {statusLabels[status] || status}
    </span>
  );
};

// Image component with fallback
const UnitImage = ({ src, alt, className = "max-h-full max-w-full object-contain" }) => {
  const fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallbackSrc;
      }}
    />
  );
};

// No image placeholder component
const NoImagePlaceholder = () => (
  <div className="text-gray-400 text-center p-4">
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <path d="M20.4 14.5L16 10 4 20"></path>
    </svg>
    <p>No Image</p>
  </div>
);

// Button component for consistent styling
const Button = ({ onClick, className, children, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-3 py-1 ${className}`}
  >
    {children}
  </button>
);

// Action button component for table actions
const ActionButton = ({ onClick, className, icon, children }) => (
  <button
    onClick={onClick}
    className={`hover:opacity-90 text-white px-2 py-0.5 text-xs inline-flex items-center ${className}`}
  >
    <span className="mr-1">{icon}</span> {children}
  </button>
);

// Unit form component
const UnitForm = ({ formData, setFormData, imagePreview, selectedImage, handleImageChange, handleSubmit, isEditing, handleCancel, fileInputRef }) => (
  <div className="bg-white border mb-4 p-4 rounded shadow-sm">
    <h3 className="font-semibold mb-3 text-lg">{isEditing ? 'Edit Unit' : 'Tambah Unit Baru'}</h3>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="nama_unit">
              Nama Unit
            </label>
            <input
              type="text"
              id="nama_unit"
              name="nama_unit"
              value={formData.nama_unit}
              onChange={(e) => setFormData({...formData, nama_unit: e.target.value})}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="kapasitas">
              Kapasitas (Ton)
            </label>
            <select
              id="kapasitas"
              name="kapasitas"
              value={formData.kapasitas}
              onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
              className="w-full border rounded px-2 py-1"
            >
              <option value="2.5">2.5</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="10">10</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="harga_per_jam">
              Harga per Jam (Rp)
            </label>
            <input
              type="number"
              id="harga_per_jam"
              name="harga_per_jam"
              value={formData.harga_per_jam}
              onChange={(e) => setFormData({...formData, harga_per_jam: e.target.value})}
              min="0"
              step="0.01"
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full border rounded px-2 py-1"
            >
              <option value="tersedia">Tersedia</option>
              <option value="disewa">Disewa</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Gambar Unit
          </label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="mb-2"
          />
          <div className="border rounded flex items-center justify-center bg-gray-100" style={{ height: '150px' }}>
            {imagePreview ? (
              <UnitImage src={imagePreview} alt="Preview" />
            ) : (
              <NoImagePlaceholder />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex">
        <Button
          type="submit"
          className="bg-blue-600 text-white mr-2"
        >
          {isEditing ? 'Update' : 'Simpan'}
        </Button>
        {isEditing && (
          <Button
            onClick={handleCancel}
            className="bg-gray-300"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  </div>
);

const validKapasitas = ['2.5', '3', '5', '7', '10'];

// Main Unit component
function Unit() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUnits();
    }, [viewMode]);

    const fetchUnits = async () => {
        try {
            setLoading(true);
            let endpoint = `${API_BASE_URL}`;
            if (viewMode === 'available') {
                endpoint = `${API_BASE_URL}/available`;
            }
            const token = localStorage.getItem('token');
            const response = await axios.get(endpoint, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
            if (response.data && response.data.status) {
                if (response.data.data) {
                    setUnits(response.data.data);
                } else {
                    setUnits([]);
                    setError('Data format not recognized');
                }
            } else {
                setError('Failed to fetch unit data: ' + (response.data?.message || 'Unknown error'));
            }
        } catch (err) {
            console.error("Error fetching units:", err);
            setError('Error fetching units: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus unit ini?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required');
                    return;
                }
                await axios.delete(`${API_BASE_URL}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                fetchUnits();
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal menghapus unit');
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE_URL}/status/${id}`, 
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            fetchUnits();
        } catch (err) {
            console.error("Error updating status:", err);
            setError('Error updating status: ' + (err.message || 'Unknown error'));
        }
    };

    const getImageUrl = (imageName) => {
        if (!imageName) return null;
        return `${IMAGE_BASE_URL}${imageName}`;
    };

    if (loading) return (
        <div>
            <h1 className="page-title">Manajemen Unit Forklift</h1>
            <div className="loading-container">
                <p>Loading units data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div>
            <h1 className="page-title">Manajemen Unit Forklift</h1>
            <div className="error-container">
                <p>Error: {error}</p>
                <button 
                    onClick={() => {setError(null); fetchUnits();}}
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="unit-container">
            <h1 className="page-title">Manajemen Unit Forklift</h1>
            
            {/* Filter buttons */}
            <div className="filter-buttons">
                <button 
                    onClick={() => setViewMode('all')}
                    className={viewMode === 'all' ? 'filter-button active' : 'filter-button'}
                >
                    Semua Unit
                </button>
                <button 
                    onClick={() => setViewMode('available')}
                    className={viewMode === 'available' ? 'filter-button active' : 'filter-button'}
                >
                    Unit Tersedia
                </button>
            </div>
            
            <div className="unit-header">
                <h2>Daftar Unit Forklift</h2>
                <button 
                    onClick={() => navigate('/admin/units/tambah')}
                    className="add-button"
                >
                    + Tambah Unit
                </button>
            </div>

            {/* Table */}
            <table className="unit-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Gambar</th>
                        <th>Nama Unit</th>
                        <th>Kapasitas (Ton)</th>
                        <th>Harga per Jam</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {units.length > 0 ? (
                        units.map((unit) => (
                            <tr key={unit.id_unit}>
                                <td>{unit.id_unit}</td>
                                <td>
                                    <div className="unit-image">
                                        {unit.gambar ? (
                                            <UnitImage 
                                                src={getImageUrl(unit.gambar)} 
                                                alt={unit.nama_unit}
                                            />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="no-image-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                        )}
                                    </div>
                                </td>
                                <td>{unit.nama_unit}</td>
                                <td>{unit.kapasitas}</td>
                                <td>{unit.harga_per_jam}</td>
                                <td>
                                    <StatusBadge status={unit.status} />
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => navigate(`/admin/units/edit/${unit.id_unit}`)}
                                            className="action-button edit-button"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(unit.id_unit)}
                                            className="action-button delete-button"
                                        >
                                            🗑️ Delete
                                        </button>
                                        
                                        {unit.status !== 'tersedia' ? (
                                            <button
                                                onClick={() => handleStatusChange(unit.id_unit, 'tersedia')}
                                                className="action-button available-button"
                                            >
                                                ✓ Set Tersedia
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(unit.id_unit, 'disewa')}
                                                className="action-button rent-button"
                                            >
                                                ⭐ Set Disewa
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data">
                                No units found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Unit; 