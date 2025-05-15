import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function EditUnit({ unit, onUnitUpdated, onCancel }) {
    const [formData, setFormData] = useState({
        nama_unit: '',
        kapasitas: '',
        status: 'tersedia'
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState(null);
    
    // Base URL for images
    const imageBaseUrl = 'http://localhost:3000/images/';

    // Initialize form data when unit prop changes
    useEffect(() => {
        if (unit) {
            setFormData({
                nama_unit: unit.nama_unit || '',
                kapasitas: unit.kapasitas || '',
                status: unit.status || 'tersedia'
            });
            
            // Check if unit has an image
            if (unit.gambar) {
                // Set the preview to the full image URL
                setImagePreview(imageBaseUrl + unit.gambar);
            } else {
                setImagePreview(null);
            }
        }
    }, [unit]);

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
        
        if (!unit || !unit.id_unit) {
            setError('Unit ID is missing');
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
            
            await axios.patch(
                `http://localhost:3000/API/unit/update/${unit.id_unit}`, 
                formDataWithImage,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            // Notify parent component
            onUnitUpdated();
        } catch (err) {
            console.error("Error updating unit:", err);
            setError('Error updating unit: ' + (err.message || 'Unknown error'));
        }
    };

    return (
        <div className="bg-white border mb-4 p-4">
            <h3 className="font-semibold mb-3">Edit Unit</h3>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-2 mb-3">
                    <p>{error}</p>
                </div>
            )}
            
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
                                onChange={handleInputChange}
                                className="w-full border px-2 py-1"
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1" htmlFor="kapasitas">
                                Kapasitas (Ton)
                            </label>
                            <input
                                type="text"
                                id="kapasitas"
                                name="kapasitas"
                                value={formData.kapasitas}
                                onChange={handleInputChange}
                                className="w-full border px-2 py-1"
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
                                onChange={handleInputChange}
                                className="w-full border px-2 py-1"
                            >
                                <option value="tersedia">Tersedia</option>
                                <option value="disewa">Disewa</option>
                                <option value="maintenance">Maintenance</option>
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
                        <div className="border flex items-center justify-center bg-gray-100" style={{ height: '150px' }}>
                            {imagePreview ? (
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        console.error("Failed to load image preview:", imagePreview);
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/120x80?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div className="text-gray-400 text-center p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <path d="M20.4 14.5L16 10 4 20"></path>
                                    </svg>
                                    <p>No Image</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-1 mr-2"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 px-3 py-1"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditUnit; 