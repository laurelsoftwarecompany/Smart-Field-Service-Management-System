import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';

// Stubs for other pages
const Dashboard = () => <div className="p-4"><h1 className="text-2xl font-bold">Dashboard Overview</h1><p className="text-muted-foreground mt-2">Welcome to Smart Field Service Management.</p></div>;
const Requests = () => <div className="p-4"><h1 className="text-2xl font-bold">Service Requests</h1></div>;
const Jobs = () => <div className="p-4"><h1 className="text-2xl font-bold">Jobs</h1></div>;
const Customers = () => <div className="p-4"><h1 className="text-2xl font-bold">Customers</h1></div>;
const Technicians = () => <div className="p-4"><h1 className="text-2xl font-bold">Technicians</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute allowedRoles={['Manager', 'Admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/technicians" element={<Technicians />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
