import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/config';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        console.log('Fetching incidents for user:', user?.id);
        const res = await api.get('/api/incidents');
        console.log('Incidents fetched:', res.data);
        setIncidents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setLoading(false);
      }
    };

    if (user) {
      fetchIncidents();
    }
  }, [user]);

  if (!user) {
    return <div className="container">Loading user data...</div>;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Bienvenido {user.name}
      </p>
      
      <div className="dash-buttons">
        <Link to="/profile" className="btn btn-light">
          <i className="fas fa-user-circle text-primary"></i> Editar Perfil
        </Link>
        <Link to="/incidents/new" className="btn btn-light">
          <i className="fas fa-exclamation-triangle text-primary"></i> Reportar Incidencia
        </Link>
      </div>

      <h2 className="my-2">Incidencias</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : incidents.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Fecha</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {incidents.slice(0, 5).map((incident) => (
              <tr key={incident.id}>
                <td>{incident.description}</td>
                <td>{new Date(incident.date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/incidents/edit/${incident.id}`} className="btn btn-primary">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay incidencias</p>
      )}
      
      {incidents.length > 5 && (
        <Link to="/incidents" className="btn btn-primary">
          Ver todas las incidencias
        </Link>
      )}
    </section>
  );
};

export default Dashboard; 