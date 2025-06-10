import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { colors } from './theme/colors'; // Import the centralized colors
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

// Components
import Login from './components/Auth/Login';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Problems from './components/Problems/Problems';
import ProblemView from './components/Problems/ProblemView';
import ProblemEditor from './components/Problems/ProblemEditor';
import Planning from './components/Planning/Planning';
import Graph from './components/Graph/Graph';
import { supabase, authService } from './services/supabase'; // Import supabase client and authService

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
      // localStorage.removeItem('leetcode-auth'); // Clean up old local storage item if it exists
      
      // Handle specific events if needed
      // if (event === 'SIGNED_IN') { /* User signed in */ }
      // if (event === 'SIGNED_OUT') { /* User signed out */ }
    });

    // Cleanup listener on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (success: boolean) => {
    // setIsAuthenticated(success); 
    // This is now primarily handled by the onAuthStateChange listener.
    // You might still use this callback for UI changes immediate to login action if needed.
    if (success) {
      // console.log("Login successful, auth state will update via listener.");
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    // setIsAuthenticated(false); 
    // This is also handled by onAuthStateChange.
    // localStorage.removeItem('leetcode-auth'); // Supabase client manages its own session.
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.background.primary}`}>
        <div className={`text-lg ${colors.text.secondary}`}>Loading...</div>
      </div>
    );
  }

  // No need to pass onLogin to Login component if auth is handled by context/listener
  // However, if Login component needs to trigger UI changes not covered by global state, keep it.
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider> {/* Wrap the Router with ThemeProvider */}
      <Router>
        <div className={`min-h-screen ${colors.background.primary}`}>
          <Navbar onLogout={handleLogout} />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/new" element={<ProblemEditor />} />
              <Route path="/problems/:id" element={<ProblemView />} />
              <Route path="/problems/:id/edit" element={<ProblemEditor />} />
              <Route path="/planning" element={<Planning />} />
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
