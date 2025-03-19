import { motion } from "framer-motion";

// This custom component wraps elements with motion animations
// It preserves the original element and just adds animation capabilities
const AnimateWrapper = ({ children, animation = {}, ...props }) => {
  const defaultAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    ...animation
  };
  
  return (
    <motion.div {...defaultAnimation} {...props}>
      {children}
    </motion.div>
  );
};

// Use this animation config object in your HomePage component
const animationConfig = {
  // Page fade in
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  
  // Hero section 
  heroTitle: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.2 }
  },
  
  // Hero buttons
  heroButton: (delay = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  }),
  
  // Section headers
  sectionTitle: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7 }
  },
  
  // Cards animation
  card: (index) => ({
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * 0.1 }
  }),
  
  // Filter panel
  filterPanel: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  
  // Loading spinner
  spinner: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  // Pagination controls  
  pagination: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3, duration: 0.5 }
  },
  
  // Empty state message
  emptyState: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  }
};

export { AnimateWrapper, animationConfig };