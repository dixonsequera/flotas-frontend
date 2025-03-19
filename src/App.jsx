import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/users/Profile';
import IncidentsList from './components/incidents/IncidentsList';
import IncidentForm from './components/incidents/IncidentForm';
import AdminDashboard from './components/admin/AdminDashboard';
import UsersList from './components/admin/UsersList';
import NotFound from './components/pages/NotFound';

// Routing
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/incidents" element={<PrivateRoute><IncidentsList /></PrivateRoute>} />
          <Route path="/incidents/new" element={<PrivateRoute><IncidentForm /></PrivateRoute>} />
          <Route path="/incidents/edit/:id" element={<PrivateRoute><IncidentForm /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UsersList /></AdminRoute>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
