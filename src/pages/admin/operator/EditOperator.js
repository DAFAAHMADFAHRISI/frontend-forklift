import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Operator.css';

// Config
const API_BASE_URL = 'http://localhost:3000/API';

function EditOperator() {
    const [formData, setFormData] = useState({
        nama_operator: '',
        no_hp: '',
        status: 'tersedia'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchOperator();
    }, [id]);

    const fetchOperator = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token tidak ditemukan. Silakan login kembali.');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/operator/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Fallback: use data field if present, otherwise use the response object itself
            let operatorData = response.data.data;
            if (!operatorData) {
                // Try to find operator data directly in the response (excluding status/message)
                const { status, message, ...rest } = response.data;
                // If rest has keys, assume it's the operator data
                if (Object.keys(rest).length > 0) {
                    operatorData = rest;
                } else {
                    operatorData = null;
                }
            }

            if (operatorData && (operatorData.nama_operator || operatorData.no_hp)) {
                setFormData({
                    nama_operator: operatorData.nama_operator || operatorData.nama || '',
                    no_hp: operatorData.no_hp || operatorData.nomor_hp || '',
                    status: operatorData.status || 'tersedia'
                });
            } else {
                setError('Data operator tidak ditemukan atau format tidak valid.');
            }
        } catch (err) {
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            if (err.response) {
                if (err.response.status === 404) {
                    setError('Operator tidak ditemukan');
                } else {
                    setError('Error: ' + (err.response.data?.message || err.message));
                }
            } else {
                setError('Error mengambil data operator: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token tidak ditemukan. Silakan login kembali.');
                return;
            }

            const response = await axios.put(
                `${API_BASE_URL}/operator/edit/${id}`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.data && response.data.status) {
                navigate('/admin/operators');
            } else {
                setError('Gagal memperbarui operator: ' + (response.data?.message || 'Unknown error'));
            }
        } catch (err) {
            console.error("Error updating operator:", err);
            if (err.response) {
                setError('Error: ' + (err.response.data?.message || err.message));
            } else {
                setError('Error memperbarui operator: ' + err.message);
            }
        } finally {
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

    if (loading) return (
        <div className="operator-container">
            <h1 className="page-title">Edit Operator</h1>
            <div className="loading-container">
                <p>Loading operator data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="operator-container">
            <h1 className="page-title">Edit Operator</h1>
            <div className="error-container">
                <p>Error: {error}</p>
                <button 
                    onClick={() => navigate('/admin/operators')}
                    className="retry-button"
                >
                    Kembali
                </button>
            </div>
        </div>
    );

    return (
        <div className="operator-container">
            <h1 className="page-title">Edit Operator</h1>
            
            <div className="operator-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nama_operator">
                                Nama Operator
                            </label>
                            <input
                                type="text"
                                id="nama_operator"
                                name="nama_operator"
                                value={formData.nama_operator}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="no_hp">
                                Nomor HP
                            </label>
                            <input
                                type="text"
                                id="no_hp"
                                name="no_hp"
                                value={formData.no_hp}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="tersedia">Tersedia</option>
                                <option value="sibuk">Sibuk</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/operators')}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditOperator;
