import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    registrationNumber: '',
    carBrand: '',
    carModel: '',
    deliveryDate: ''
  });
  const [alert, setAlert] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    if (error) {
      setAlert(error);
      clearError();
    }
  }, [isAuthenticated, error, navigate, clearError]);

  const { 
    name, 
    email, 
    password, 
    password2, 
    registrationNumber, 
    carBrand, 
    carModel, 
    deliveryDate 
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error states
    setAlert(null);
    setDetailedError(null);
    
    // Validate form
    if (password !== password2) {
      setAlert('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setAlert('Password must be at least 6 characters');
      return;
    }
    
    try {
      const registerData = {
        name,
        email,
        password,
        registrationNumber,
        carBrand,
        carModel,
        deliveryDate: deliveryDate ? deliveryDate : undefined
      };
      
      console.log('Sending registration data:', registerData);
      await register(registerData);
    } catch (err) {
      console.error('Registration error:', err);
      
      // Set a general error message
      setAlert(err.response?.data?.message || 'Registration failed');
      
      // Set detailed error information if available
      if (err.response?.data) {
        setDetailedError(err.response.data);
      } else if (err.message) {
        setDetailedError({ error: err.message });
      }
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Registrase</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Crear una cuenta
      </p>
      
      {alert && (
        <div className="alert alert-danger">{alert}</div>
      )}
      
      {detailedError && (
        <div className="alert alert-danger">
          <p><strong>Error Details:</strong></p>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            {JSON.stringify(detailedError, null, 2)}
          </pre>
        </div>
      )}
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
          <small className="form-text">la contraseña debe contener 6 caracteres</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Vehicle Registration Number"
            name="registrationNumber"
            value={registrationNumber}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Car Brand"
            name="carBrand"
            value={carBrand}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Car Model"
            name="carModel"
            value={carModel}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            placeholder="Delivery Date"
            name="deliveryDate"
            value={deliveryDate}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        ¿Ya tienes cuenta? <Link to="/login">Registrarse</Link>
      </p>
    </section>
  );
};

export default Register; 