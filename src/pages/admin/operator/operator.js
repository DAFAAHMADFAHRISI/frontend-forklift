import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Operator.css';

// Config
const API_BASE_URL = 'http://localhost:3000/API';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    tersedia: 'bg-green-100 text-green-800',
    sibuk: 'bg-yellow-100 text-yellow-800'
  };
  
  const statusLabels = {
    tersedia: 'Tersedia',
    sibuk: 'Sibuk'
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs ${statusStyles[status] || 'bg-gray-100'}`}>
      {statusLabels[status] || status}
    </span>
  );
};

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

// Main Operator component
function Operator() {
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOperators();
    }, [viewMode]);

    const fetchOperators = async () => {
        try {
            setLoading(true);
            let endpoint = `${API_BASE_URL}/operator`;
            
            if (viewMode === 'available') {
                endpoint = `${API_BASE_URL}/operator/available`;
            }
            
            const response = await axios.get(endpoint);
            
            if (response.data && response.data.status) {
                if (response.data.data) {
                    setOperators(response.data.data);
                } else {
                    setOperators([]);
                    setError('Data format not recognized');
                }
            } else {
                setError('Failed to fetch operator data: ' + (response.data?.message || 'Unknown error'));
            }
        } catch (err) {
            console.error("Error fetching operators:", err);
            setError('Error fetching operators: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/operator/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this operator?')) {
            try {
                await axios.delete(`${API_BASE_URL}/operator/delete/${id}`);
                fetchOperators();
            } catch (err) {
                console.error("Error deleting operator:", err);
                setError('Error deleting operator: ' + (err.message || 'Unknown error'));
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.patch(`${API_BASE_URL}/operator/status/${id}`, { status });
            fetchOperators();
        } catch (err) {
            console.error("Error updating status:", err);
            setError('Error updating status: ' + (err.message || 'Unknown error'));
        }
    };

    if (loading) return (
        <div>
            <h1 className="page-title">Manajemen Operator</h1>
            <div className="loading-container">
                <p>Loading operators data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div>
            <h1 className="page-title">Manajemen Operator</h1>
            <div className="error-container">
                <p>Error: {error}</p>
                <button 
                    onClick={() => {setError(null); fetchOperators();}}
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="operator-container">
            <h1 className="page-title">Manajemen Operator</h1>
            
            {/* Filter buttons */}
            <div className="filter-buttons">
                <button 
                    onClick={() => setViewMode('all')}
                    className={viewMode === 'all' ? 'filter-button active' : 'filter-button'}
                >
                    Semua Operator
                </button>
                <button 
                    onClick={() => setViewMode('available')}
                    className={viewMode === 'available' ? 'filter-button active' : 'filter-button'}
                >
                    Operator Tersedia
                </button>
            </div>
            
            <div className="operator-header">
                <h2>Daftar Operator</h2>
                <button 
                    onClick={() => navigate('/operator/tambah')}
                    className="add-button"
                >
                    + Tambah Operator
                </button>
            </div>
            
            {/* Table */}
            <table className="operator-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Operator</th>
                        <th>Nomor HP</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {operators.length > 0 ? (
                        operators.map((operator) => (
                            <tr key={operator.id_operator}>
                                <td>{operator.id_operator}</td>
                                <td>{operator.nama_operator}</td>
                                <td>{operator.no_hp}</td>
                                <td>
                                    <span className={`status-badge status-${operator.status}`}>
                                        {operator.status === 'tersedia' ? 'Tersedia' : 'Sibuk'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleEdit(operator.id_operator)}
                                            className="action-button edit-button"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(operator.id_operator)}
                                            className="action-button delete-button"
                                        >
                                            🗑️ Delete
                                        </button>
                                        
                                        {operator.status !== 'tersedia' ? (
                                            <button
                                                onClick={() => handleStatusChange(operator.id_operator, 'tersedia')}
                                                className="action-button available-button"
                                            >
                                                ✓ Set Tersedia
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(operator.id_operator, 'sibuk')}
                                                className="action-button busy-button"
                                            >
                                                ⚡ Set Sibuk
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-data">
                                No operators found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Operator;
        