import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await axios.get('/api/users');
        setUsers(usersRes.data);
        
        // Fetch incidents
        const incidentsRes = await axios.get('/api/incidents');
        setIncidents(incidentsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      }
    };

    if (user && user.role === 'ADMIN') {
      fetchData();
    } else {
      setError('You do not have admin privileges');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="container">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Panel usuarios administradores</h1>
      <p className="lead">
        <i className="fas fa-user-shield"></i> Bienvenido al panel de administrador
      </p>
      
      <div className="dash-buttons">
        <Link to="/admin/users" className="btn btn-light">
          <i className="fas fa-users text-primary"></i> todos los usuarios
        </Link>
        <Link to="/incidents" className="btn btn-light">
          <i className="fas fa-exclamation-triangle text-primary"></i> Mostrar todas las incidencias
        </Link>
      </div>
      
      <div className="my-2">
        <h2>Panel general del sistema</h2>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Usuarios</h3>
            <p className="lead">{users.length}</p>
            <div className="stat-details">
              <p>Admins: {users.filter(u => u.role === 'ADMIN').length}</p>
              <p>Usuarios: {users.filter(u => u.role === 'USER').length}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Incidencia</h3>
            <p className="lead">{incidents.length}</p>
            <div className="stat-details">
              <p>Este mes: {incidents.filter(i => {
                const date = new Date(i.date);
                const now = new Date();
                return date.getMonth() === now.getMonth() && 
                       date.getFullYear() === now.getFullYear();
              }).length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="my-2">
        <h2>Incidencia Reciente</h2>
        {incidents.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Descripcion</th>
                <th>Fecha</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 5).map((incident) => (
                <tr key={incident.id}>
                  <td>{incident.user?.name || 'Unknown'}</td>
                  <td>{incident.description}</td>
                  <td>{new Date(incident.date).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/incidents/edit/${incident.id}`} className="btn btn-primary">
                      <i className="fas fa-edit"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No incidents found</p>
        )}
        
        {incidents.length > 5 && (
          <Link to="/incidents" className="btn btn-primary">
            Ver todas las incidencias
          </Link>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard; 