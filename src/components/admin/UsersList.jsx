import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const UsersList = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Error fetching users');
        setLoading(false);
      }
    };

    if (user && user.role === 'ADMIN') {
      fetchUsers();
    } else {
      setError('You do not have admin privileges');
      setLoading(false);
    }
  }, [user]);

  const toggleAdminRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
      await axios.put(`/api/users/${userId}`, { role: newRole });
      
      // Update the users list
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.response?.data?.message || 'Error updating user role');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading users...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Users Management</h1>
      <p className="lead">
        <i className="fas fa-users"></i> Manage system users
      </p>
      
      <Link to="/admin" className="btn btn-light my-1">
        <i className="fas fa-arrow-left"></i> Back to Admin Dashboard
      </Link>
      
      {users.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registro</th>
              <th>Coche</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-light'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{u.registrationNumber || 'N/A'}</td>
                <td>{u.carBrand && u.carModel ? `${u.carBrand} ${u.carModel}` : 'N/A'}</td>
                <td>
                  <button 
                    onClick={() => toggleAdminRole(u.id, u.role)} 
                    className={`btn ${u.role === 'ADMIN' ? 'btn-light' : 'btn-primary'}`}
                    disabled={u.id === user.id}
                    title={u.id === user.id ? "Can't change your own role" : ''}
                  >
                    {u.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button 
                    onClick={() => deleteUser(u.id)} 
                    className="btn btn-danger"
                    disabled={u.id === user.id}
                    title={u.id === user.id ? "Can't delete yourself" : ''}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </section>
  );
};

export default UsersList; 