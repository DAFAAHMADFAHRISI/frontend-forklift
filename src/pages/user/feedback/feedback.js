import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/API/feedback/');
        setFeedbacks(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch feedback data');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://localhost:3000/API/feedback/delete/${id}`);
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
      } catch (err) {
        setError('Failed to delete feedback');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i < rating ? 'text-yellow-400' : 'text-gray-300'} 
        />
      );
    }
    return stars;
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Pelanggan</h1>
          <Link 
            to="/feedback/tambah" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tambah Feedback
          </Link>
        </div>

        {feedbacks.length === 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg p-10 text-center">
            <p className="text-gray-500 text-lg">Belum ada feedback</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {feedbacks.map((feedback) => (
                <li key={feedback.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">Rating:</span>
                        <div className="flex text-lg">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">ID Pemesanan:</span> {feedback.id_pemesanan}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Komentar:</span> {feedback.komentar || '-'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/feedback/edit/${feedback.id}`}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(feedback.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
