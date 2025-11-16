import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecruitmentSystem from './components/RecruitmentSystem';
import EmployeeDashboard from './components/EmployeeDashboard';
import LoginPage from './pages/LoginPage';

function ProtectedRoute({ children, user, allowedRole }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />;
  }
  
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('employee');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('employee', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('employee');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />

        <Route 
          path="/manager" 
          element={
            <ProtectedRoute user={user} allowedRole="manager">
              <RecruitmentSystem user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/employee" 
          element={
            <ProtectedRoute user={user} allowedRole="employee">
              <EmployeeDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
