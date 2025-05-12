import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const EditFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_pemesanan: '',
    rating: 0,
    komentar: ''
  });
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/API/feedback/${id}`);
        const { id_pemesanan, rating, komentar } = response.data.data;
        setFormData({
          id_pemesanan,
          rating,
          komentar: komentar || ''
        });
        setLoading(false);
      } catch (err) {
        setError('Gagal mengambil data feedback');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Rating harus dipilih');
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.patch(`http://localhost:3000/API/feedback/update/${id}`, {
        rating: formData.rating,
        komentar: formData.komentar
      });
      setSubmitting(false);
      navigate('/feedback');
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memperbarui feedback');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Edit Feedback</h2>
          <p className="mt-1 text-sm text-gray-500">Perbarui penilaian dan komentar anda</p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="id_pemesanan" className="block text-sm font-medium text-gray-700">
                ID Pemesanan
              </label>
              <input
                type="text"
                name="id_pemesanan"
                id="id_pemesanan"
                value={formData.id_pemesanan}
                disabled
                className="mt-1 bg-gray-100 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index} className="cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setFormData({...formData, rating: ratingValue})}
                        className="hidden"
                      />
                      <FaStar
                        className="mr-1"
                        color={ratingValue <= (hover || formData.rating) ? "#FFD700" : "#e4e5e9"}
                        size={30}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="komentar" className="block text-sm font-medium text-gray-700">
                Komentar (Opsional)
              </label>
              <textarea
                name="komentar"
                id="komentar"
                rows="4"
                value={formData.komentar}
                onChange={handleChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/feedback')}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFeedback;
