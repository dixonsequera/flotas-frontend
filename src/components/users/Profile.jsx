import { useState, useEffect, useContext } from 'react';
import api from '../../api/config';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    carBrand: '',
    carModel: '',
    deliveryDate: ''
  });
  
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        registrationNumber: user.registrationNumber || '',
        carBrand: user.carBrand || '',
        carModel: user.carModel || '',
        deliveryDate: user.deliveryDate ? new Date(user.deliveryDate).toISOString().split('T')[0] : ''
      });
      setLoading(false);
    }
  }, [user]);
  
  const { name, email, registrationNumber, carBrand, carModel, deliveryDate } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setAlert(null);
    setSuccess(false);
    
    try {
      await api.put(`/api/users/${user.id}`, formData);
      setSuccess(true);
      setAlert('Profile updated successfully');
      
      // Update user in context
      if (updateProfile) {
        await updateProfile(formData);
      }
    } catch (err) {
      setAlert(err.response?.data?.message || 'Error updating profile');
      console.error('Error updating profile:', err);
    }
  };
  
  if (loading) {
    return <div className="container">Loading profile data...</div>;
  }
  
  return (
    <section className="container">
      <h1 className="large text-primary">Editar perfil</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Actualizar su perfil
      </p>
      
      {alert && (
        <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
          {alert}
        </div>
      )}
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            disabled
          />
          <small className="form-text">El correo electrónico no se puede cambiar</small>
        </div>
        <div className="form-group">
          <label htmlFor="registrationNumber">Matricula</label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={registrationNumber}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="carBrand">marca del coche</label>
          <input
            type="text"
            id="carBrand"
            name="carBrand"
            value={carBrand}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="carModel">Modelo</label>
          <input
            type="text"
            id="carModel"
            name="carModel"
            value={carModel}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryDate">Fecha de entrega</label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={deliveryDate}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Update Profile" />
      </form>
    </section>
  );
};

export default Profile;