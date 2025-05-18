import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TambahUnit() {
    const [formData, setFormData] = useState({
        nama_unit: '',
        kapasitas: '',
        status: 'tersedia',
        harga_per_jam: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Valid kapasitas values
    const validKapasitas = ['2.5', '3', '5', '7', '10'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                setError('Hanya file JPEG, JPG, dan PNG yang diperbolehkan');
                return;
            }
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Ukuran file maksimal 2MB');
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate kapasitas
        if (!validKapasitas.includes(formData.kapasitas)) {
            setError('Kapasitas harus salah satu dari: 2.5, 3, 5, 7, 10');
            return;
        }

        // Validate harga_per_jam
        const harga = parseFloat(formData.harga_per_jam);
        if (isNaN(harga) || harga <= 0) {
            setError('Harga per jam harus berupa angka positif');
            return;
        }
        
        try {
            const formDataWithImage = new FormData();
            Object.keys(formData).forEach(key => {
                formDataWithImage.append(key, formData[key]);
            });
            
            if (selectedImage) {
                formDataWithImage.append('gambar', selectedImage);
            }

            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }
            
            const API_BASE_URL = 'http://localhost:4001/api/unit';
            await axios.post(
                `${API_BASE_URL}/store`,
                formDataWithImage,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            // Navigate back to unit list
            navigate('/admin/units');
        } catch (err) {
            console.error("Error saving unit:", err);
            setError(err.response?.data?.message || 'Error saving unit');
        }
    };

    return (
        <div className="px-6 py-5">
            <h2 className="text-2xl font-bold mb-4">Tambah Unit Baru</h2>
            
            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nama_unit">
                                Nama Unit
                            </label>
                            <input
                                type="text"
                                id="nama_unit"
                                name="nama_unit"
                                value={formData.nama_unit}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kapasitas">
                                Kapasitas (Ton)
                            </label>
                            <select
                                id="kapasitas"
                                name="kapasitas"
                                value={formData.kapasitas}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Pilih Kapasitas</option>
                                {validKapasitas.map(kap => (
                                    <option key={kap} value={kap}>{kap} Ton</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="harga_per_jam">
                                Harga per Jam (Rp)
                            </label>
                            <input
                                type="number"
                                id="harga_per_jam"
                                name="harga_per_jam"
                                value={formData.harga_per_jam}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="tersedia">Tersedia</option>
                                <option value="disewa">Disewa</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gambar Unit
                        </label>
                        <div className="mt-1 mb-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <div className="mb-3">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="mx-auto h-32 w-auto object-contain"
                                        />
                                    </div>
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input 
                                            id="file-upload" 
                                            name="file-upload" 
                                            type="file" 
                                            className="sr-only"
                                            accept="image/jpeg,image/png,image/jpg"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 2MB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/unit')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TambahUnit; 