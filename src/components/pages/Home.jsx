import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Control de flotas</h1>
          <p className="lead">
          Gestiona tu flota de vehículos, usuarios y realiza un seguimiento de las incidencias
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Registrarse
            </Link>
            <Link to="/login" className="btn btn-light">
              Ingresar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home; 