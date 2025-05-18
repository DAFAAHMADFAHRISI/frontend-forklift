import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
// Either uncomment and fix the import:
// import Users from './pages/admin/users/Users';
// Or remove the Users route if the component doesn't exist
import Unit from './pages/admin/unit/Unit';
import TambahUnit from './pages/admin/unit/tambahUnit'; // Fixed case sensitivity
import EditUnit from './pages/admin/unit/editUnit'; // Fixed case sensitivity
import Operator from './pages/admin/operator/operator';
import TambahOperator from './pages/admin/operator/TambahOperator';
import EditOperator from './pages/admin/operator/EditOperator';
import Pesanan from './pages/admin/pesanan/pesanan';
import Pembayaran from './pages/admin/pembayaran/pembayaran';
import BuktiTransfer from './pages/admin/bukti_transfer/bukti';
import TambahBuktiTransfer from './pages/admin/bukti_transfer/tambah';
import EditBuktiTransfer from './pages/admin/bukti_transfer/edit';
import LogTransaksi from './pages/admin/log_transaksi/transaksi';
import Feedback from './pages/admin/feedback/feedback';
import TambahFeedback from './pages/admin/feedback/TambahFeedback';
import EditFeedback from './pages/admin/feedback/editFeedback';

// User Components
import UserDashboard from './pages/user/Dashboard';
import UserUnit from './pages/user/unit/Unit';
import UserOperator from './pages/user/operator/operator';
import UserPesanan from './pages/user/pesanan/pesanan';
import UserPembayaran from './pages/user/pembayaran/pembayaran';
import UserBuktiTransfer from './pages/user/bukti_transfer/bukti';
import UserLogTransaksi from './pages/user/log_transaksi/transaksi';
import UserFeedback from './pages/user/feedback/feedback';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Comment out Users route until the component is created */}
          {/*<Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />*/}
          <Route
            path="/admin/units"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Unit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/units/tambah"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TambahUnit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/units/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditUnit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operators"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Operator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operators/tambah"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TambahOperator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operators/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditOperator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Pesanan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Pembayaran />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transfer-proofs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BuktiTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transfer-proofs/tambah"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TambahBuktiTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transfer-proofs/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditBuktiTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transaction-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LogTransaksi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Feedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback/tambah"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TambahFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/forklifts"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserUnit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/operators"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserOperator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserPesanan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/payments"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserPembayaran />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/transfer-proofs"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserBuktiTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/transactions"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserLogTransaksi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/feedback"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
