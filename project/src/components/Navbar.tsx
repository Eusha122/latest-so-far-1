import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisitorModal from './VisitorModal';

interface NavbarProps {
  visitors: Array<{name: string, relation: string}>;
  onAddVisitor: (name: string, relation: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ visitors, onAddVisitor }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showVisitors, setShowVisitors] = useState(false);
  const [allVisitors, setAllVisitors] = useState(visitors);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleAddVisitor = async (name: string, relation: string, email?: string) => {
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the original callback for local state
      onAddVisitor(name, relation);
      return { success: true, message: 'Thank you for visiting! You have been added to the visitor book.' };
    } catch (error) {
      console.error('Failed to add visitor:', error);
      return { success: false, message: 'Failed to add visitor. Please try again.' };
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 flex-shrink-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-primary-500 flex-shrink-0">
                <img 
                  src="/481281109_1096804492202639_400819024598160651_n.jpg" 
                  alt="Eusha" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold font-poppins">Eusha</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm xl:text-base"
                  data-cursor="pointer"
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Visitors Section */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowVisitors(!showVisitors)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm xl:text-base"
                  data-cursor="pointer"
                >
                  <Users size={16} />
                  <span className="hidden xl:inline">Visitors ({visitors.length})</span>
                  <span className="xl:hidden">({visitors.length})</span>
                </motion.button>
                
                <AnimatePresence>
                  {showVisitors && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-dark-800 rounded-lg shadow-xl border border-dark-700 p-4 max-h-80 overflow-y-auto"
                    >
                      <h3 className="text-sm font-semibold mb-3">Recent Visitors</h3>
                      {visitors.length === 0 ? (
                        <p className="text-gray-400 text-sm">No visitors yet</p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {visitors.slice(0, 8).map((visitor, index) => (
                            <div key={index} className="text-sm">
                              <span className="text-white">{visitor.name}</span>
                              <span className="text-gray-400 ml-2">({visitor.relation})</span>
                            </div>
                          ))}
                          {visitors.length > 8 && (
                            <p className="text-gray-400 text-xs">...and {visitors.length - 8} more</p>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setShowVisitorModal(true);
                          setShowVisitors(false);
                        }}
                        className="w-full mt-3 px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-sm font-medium transition-colors"
                        data-cursor="pointer"
                      >
                        Add Your Name
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 hover:text-white p-2"
                data-cursor="pointer"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-dark-800/95 backdrop-blur-md border-t border-dark-700"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                    data-cursor="pointer"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => {
                    setShowVisitorModal(true);
                    setIsOpen(false);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  data-cursor="pointer"
                >
                  <Users size={18} />
                  <span>Add Your Name ({allVisitors.length} visitors)</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <VisitorModal
        isOpen={showVisitorModal}
        onClose={() => setShowVisitorModal(false)}
        onSubmit={handleAddVisitor}
      />
    </>
  );
};

export default Navbar;