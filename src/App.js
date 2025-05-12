import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditUnit from './pages/unit/editUnit';
import TambahUnit from './pages/unit/tambahUnit'; 
import Unit from './pages/unit/Unit';
import Navbar from './components/Navbar';
import Operator from './pages/operator/operator';
import TambahOperator from './pages/operator/TambahOperator';
import EditOperator from './pages/operator/EditOperator';
import BuktiTransfer from './pages/bukti_transfer/bukti';
import TambahBuktiTransfer from './pages/bukti_transfer/tambah';
import EditBuktiTransfer from './pages/bukti_transfer/edit';
import Feedback from './pages/feedback/feedback';
import TambahFeedback from './pages/feedback/TambahFeedback';
import EditFeedback from './pages/feedback/editFeedback';
import LogTransaksi from './pages/log_transaksi/transaksi';
import Pesanan from './pages/pesanan/pesanan';
import Pembayaran from './pages/pembayaran/pembayaran';
import Register from './pages/auth/register';
import Login from './pages/auth/login';
function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unit" element={<Unit />} />
          <Route path="/unit/tambah" element={<TambahUnit />} />
          <Route path="/unit/edit/:id" element={<EditUnit />} />
          <Route path="/operator" element={<Operator />} />
          <Route path="/operator/tambah" element={<TambahOperator />} />
          <Route path="/operator/edit/:id" element={<EditOperator />} />
          <Route path="/bukti-transfer" element={<BuktiTransfer />} />
          <Route path="/bukti-transfer/tambah" element={<TambahBuktiTransfer />} />
          <Route path="/bukti-transfer/edit/:id" element={<EditBuktiTransfer />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/feedback/tambah" element={<TambahFeedback />} />
          <Route path="/feedback/edit/:id" element={<EditFeedback />} />
          <Route path="/log-transaksi" element={<LogTransaksi />} />
          <Route path="/pesanan" element={<Pesanan />} />
          <Route path="/pembayaran" element={<Pembayaran />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
