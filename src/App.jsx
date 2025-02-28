import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import AdminDashboard from './components/AdminDashboard';
import Archive from './components/Archive';
import AuthorProfile from './components/AuthorProfile';
import './index.css';
import './styles/animations.css';

const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20
    },
    animate: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: 20
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <ArticleList />
            </PageTransition>
          } 
        />
        <Route 
          path="/articles/:id" 
          element={
            <PageTransition>
              <ArticleDetail />
            </PageTransition>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          } 
        />
        <Route 
          path="/archive" 
          element={
            <PageTransition>
              <Archive />
            </PageTransition>
          } 
        />
        <Route 
          path="/authors/:authorId" 
          element={
            <PageTransition>
              <AuthorProfile />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f4f1ea] text-black'}`}>
        <header className="bg-[#1a1a1a] text-white py-8 shadow-xl">
          <div className="container mx-auto px-4 text-center">
            <Link to="/" className="newspaper-title text-6xl md:text-8xl">
              The Trenches
            </Link>
            <div className="mt-4 text-sm border-t border-b border-gray-700 py-2 tracking-widest">
              REPORTING FROM THE DEPTHS • SINCE 2025
            </div>
          </div>
        </header>

        <nav className="bg-[#1a1a1a] text-white border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-12">
              <div className="flex items-center">
                <Link to="/" className="text-white hover:text-gray-300 text-lg tracking-wide">
                  Dispatches
                </Link>
              </div>
              <button onClick={toggleDarkMode} className="text-white hover:text-gray-300 text-lg tracking-wide">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full py-8">
          <div className="container mx-auto px-4">
            <AnimatedRoutes />
          </div>
        </main>

        <footer className="bg-[#1a1a1a] text-white py-6 mt-8">
          <div className="container mx-auto px-4 text-center">
            <div className="text-sm tracking-widest">
              THE TRENCHES • DIGGING DEEPER FOR THE TRUTH
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
