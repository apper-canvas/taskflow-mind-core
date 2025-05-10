import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const navigate = useNavigate();
  
  // Icon components
  const HomeIcon = getIcon('Home');
  const AlertTriangleIcon = getIcon('AlertTriangle');

  // Auto-redirect after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto px-4">
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-secondary mb-6"
        >
          <AlertTriangleIcon size={80} />
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-2 bg-gradient-to-r from-secondary to-red-500 bg-clip-text text-transparent"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.h2 
          className="text-2xl md:text-3xl font-semibold mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Page Not Found
        </motion.h2>

        <motion.p 
          className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="btn-primary flex items-center gap-2"
          >
            <HomeIcon size={20} />
            Back to Home
          </Link>
        </motion.div>

        <motion.p 
          className="text-surface-500 dark:text-surface-400 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Redirecting to home page in 5 seconds...
        </motion.p>
      </div>
    </div>
  );
}