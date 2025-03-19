import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const IncidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await axios.get(`/api/incidents/${id}`);
        const incident = res.data;
        
        setFormData({
          description: incident.description,
          date: new Date(incident.date).toISOString().split('T')[0]
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching incident:', err);
        setAlert(err.response?.data?.message || 'Error fetching incident');
        setLoading(false);
      }
    };
    
    if (isEdit) {
      fetchIncident();
    }
  }, [id, isEdit]);
  
  const { description, date } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setAlert(null);
    setSuccess(false);
    
    try {
      if (isEdit) {
        await axios.put(`/api/incidents/${id}`, formData);
        setSuccess(true);
        setAlert('Incident updated successfully');
      } else {
        await axios.post('/api/incidents', formData);
        setSuccess(true);
        setAlert('Incident reported successfully');
        
        setFormData({
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      
      setTimeout(() => {
        navigate('/incidents');
      }, 2000);
    } catch (err) {
      console.error('Error saving incident:', err);
      setAlert(err.response?.data?.message || 'Error saving incident');
    }
  };
  
  if (loading) {
    return <div className="container">Loading incident data...</div>;
  }
  
  return (
    <section className="container">
      <h1 className="large text-primary">
        {isEdit ? 'Edit Incident' : 'Report Incident'}
      </h1>
      <p className="lead">
        <i className="fas fa-exclamation-triangle"></i>{' '}
        {isEdit ? 'Update incident details' : 'Report a new incident'}
      </p>
      
      {alert && (
        <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
          {alert}
        </div>
      )}
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="description">Describe tu incidencia</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Describe the incident"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        <input 
          type="submit" 
          className="btn btn-primary" 
          value={isEdit ? 'Update Incident' : 'Report Incident'} 
        />
      </form>
    </section>
  );
};

export default IncidentForm; 