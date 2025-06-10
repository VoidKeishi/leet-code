import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase, authService } from './services/supabase';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Problems from './components/Problems/Problems';
import ProblemView from './components/Problems/ProblemView';
import ProblemEditor from './components/Problems/ProblemEditor';
import Planning from './components/Planning/Planning';
import Graph from './components/Graph/Graph';
import { colors } from './theme/colors';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setLoading(true);
    const checkUserSession = async () => {
      const user = await authService.getCurrentUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkUserSession(); // Check initial session

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      if (event === 'SIGNED_IN') {
        setShowLogin(false);
      }
    });

    // Cleanup listener on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setShowLogin(false);
    }
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setShowLogin(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.background.primary}`}>
        <div className={`text-lg ${colors.text.secondary}`}>Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className={`min-h-screen ${colors.background.primary}`}>
          <Navbar 
            isAuthenticated={isAuthenticated}
            onLogin={handleShowLogin}
            onLogout={handleLogout}
          />
          
          {/* Login Modal */}
          {showLogin && (
            <Login 
              onLogin={handleLogin} 
              onClose={handleCloseLogin}
              isModal={true}
            />
          )}

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard isGuest={!isAuthenticated} />} />
              <Route path="/problems" element={<Problems isGuest={!isAuthenticated} />} />
              <Route path="/problems/:id" element={<ProblemView isGuest={!isAuthenticated} />} />
              <Route 
                path="/problems/new" 
                element={
                  isAuthenticated ? 
                  <ProblemEditor /> : 
                  <div className={`text-center py-8 ${colors.text.primary}`}>
                    <p>Please log in to create new problems.</p>
                    <button 
                      onClick={handleShowLogin}
                      className={`mt-4 px-4 py-2 rounded-md ${colors.button.primary}`}
                    >
                      Log In
                    </button>
                  </div>
                } 
              />
              <Route 
                path="/problems/:id/edit" 
                element={
                  isAuthenticated ? 
                  <ProblemEditor /> : 
                  <div className={`text-center py-8 ${colors.text.primary}`}>
                    <p>Please log in to edit problems.</p>
                    <button 
                      onClick={handleShowLogin}
                      className={`mt-4 px-4 py-2 rounded-md ${colors.button.primary}`}
                    >
                      Log In
                    </button>
                  </div>
                } 
              />
              <Route path="/planning" element={<Planning isGuest={!isAuthenticated} />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
