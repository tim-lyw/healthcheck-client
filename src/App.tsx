import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FiMenu, FiX } from 'react-icons/fi';
import DeclarationForm from './pages/DeclarationForm';
import RecordsPage from './pages/RecordsPage';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/declaration" element={<DeclarationForm />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/" element={<Navigate to="/declaration" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/healthcheck-icon.svg" 
                alt="HealthCheck" 
                className="h-8 w-8"
                style={{ filter: 'invert(1) brightness(0)' }}
              />
              <h1 className="text-2xl font-bold text-gray-900">HealthCheck</h1>
            </div>
            
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer"
              >
                {menuOpen ? (
                  <FiX className="h-6 w-6"/>
                ) : (
                  <FiMenu className="h-6 w-6"/>
                )}
              </button>
              
              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <div className="py-1">
                      <Link 
                        to="/declaration" 
                        className="block px-4 py-2 text-md font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setMenuOpen(false)}
                      >
                        Submit Declaration
                      </Link>
                      <Link 
                        to="/records" 
                        className="block px-4 py-2 text-md font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => setMenuOpen(false)}
                      >
                        View Records
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;