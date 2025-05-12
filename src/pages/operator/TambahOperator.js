import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Operator.css';

// Config
const API_BASE_URL = 'http://localhost:3000/API';

function TambahOperator() {
    const [formData, setFormData] = useState({
        nama_operator: '',
        no_hp: '',
        status: 'tersedia'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            await axios.post(
                `${API_BASE_URL}/operator/store`, 
                formData
            );
            
            navigate('/operator'); // Redirect back to operator list
        } catch (err) {
            console.error("Error saving operator:", err);
            setError('Error saving operator: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="operator-container">
            <h1 className="page-title">Tambah Operator Baru</h1>
            <div className="loading-container">
                <p>Menyimpan data operator...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="operator-container">
            <h1 className="page-title">Tambah Operator Baru</h1>
            <div className="error-container">
                <p>Error: {error}</p>
                <button 
                    onClick={() => navigate('/operator')}
                    className="retry-button"
                >
                    Kembali
                </button>
            </div>
        </div>
    );

    return (
        <div className="operator-container">
            <h1 className="page-title">Tambah Operator Baru</h1>
            
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
                            Simpan
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/operator')}
                            className="cancel-button"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TambahOperator;
