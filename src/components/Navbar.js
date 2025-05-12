import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
        <li><Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Home</Link></li>
        <li><Link to="/unit" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Unit</Link></li>
        <li><Link to="/operator" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Operator</Link></li>
        <li><Link to="/pesanan" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Pesanan</Link></li>
        <li><Link to="/pembayaran" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Pembayaran</Link></li>
        <li><Link to="/bukti-transfer" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Bukti Transfer</Link></li>
        <li><Link to="/log-transaksi" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Log Transaksi</Link></li>
        <li><Link to="/feedback" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Feedback</Link></li>
        <li><Link to="/login" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Login</Link></li>
        <li><Link to="/register" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar; 