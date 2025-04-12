import { Routes, Route } from 'react-router-dom';
import { SignInPage, SignUpPage, ProtectedRoute } from './components/AuthComponents';
import { CreateOrganizationPage, OrganizationProfilePage, OrganizationCheck } from './pages/OrganizationPages';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <OrganizationCheck>
                <Dashboard />
              </OrganizationCheck>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-team" 
          element={
            <ProtectedRoute>
              <CreateOrganizationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/team-settings" 
          element={
            <ProtectedRoute>
              <OrganizationCheck>
                <OrganizationProfilePage />
              </OrganizationCheck>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
