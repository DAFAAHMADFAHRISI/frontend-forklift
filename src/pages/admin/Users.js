import React from 'react';

const Users = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manajemen Pengguna</h2>
      <button className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded">Tambah User</button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Nama</th>
            <th className="p-2">Email</th>
            <th className="p-2">Username</th>
            <th className="p-2">Role</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Contoh User</td>
            <td className="p-2">user@email.com</td>
            <td className="p-2">username</td>
            <td className="p-2">user</td>
            <td className="p-2 space-x-2">
              <button className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
              <button className="px-2 py-1 bg-red-500 text-white rounded">Hapus</button>
              <button className="px-2 py-1 bg-blue-500 text-white rounded">Ubah Role</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Users; 