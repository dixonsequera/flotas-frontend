import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const IncidentsList = () => {
  const { user } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        console.log('Fetching all incidents');
        const res = await axios.get('/api/incidents');
        console.log('Incidents fetched:', res.data);
        setIncidents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError(err.response?.data?.message || 'Error fetching incidents');
        setLoading(false);
      }
    };

    if (user) {
      fetchIncidents();
    }
  }, [user]);

  const deleteIncident = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await axios.delete(`/api/incidents/${id}`);
        setIncidents(incidents.filter(incident => incident.id !== id));
      } catch (err) {
        console.error('Error deleting incident:', err);
        setError(err.response?.data?.message || 'Error deleting incident');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading incidents...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Incidencias</h1>
      <p className="lead">
        <i className="fas fa-exclamation-triangle"></i> Administra tus incidencias
      </p>
      
      <Link to="/incidents/new" className="btn btn-primary my-1">
        <i className="fas fa-plus"></i> Reporta tu incidencia
      </Link>
      
      {incidents.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Fecha</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td>{incident.description}</td>
                <td>{new Date(incident.date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/incidents/edit/${incident.id}`} className="btn btn-primary">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button 
                    onClick={() => deleteIncident(incident.id)} 
                    className="btn btn-danger"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No incidents found</p>
      )}
    </section>
  );
};

export default IncidentsList; 