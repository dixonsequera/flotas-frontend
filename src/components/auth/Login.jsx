import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState(null);
  
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
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

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
    } catch (err) {
      setAlert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">iniciar sesión</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Iniciar sesión en su cuenta
      </p>
      
      {alert && (
        <div className="alert alert-danger">{alert}</div>
      )}
      
      <form className="form" onSubmit={onSubmit}>
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
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
      ¿No tienes una cuenta? <Link to="/register">Registrate</Link>
      </p>
    </section>
  );
};

export default Login; 