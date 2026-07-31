export const animations = {
  // Durations (in ms)
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    extraSlow: 800,
  },
  
  // Easing functions
  easing: {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    spring: { damping: 15, stiffness: 150 },
  },
  
  // Page transitions
  pageTransition: {
    enter: { opacity: 1, translateX: 0 },
    exit: { opacity: 0, translateX: 50 },
  },
  
  // Fade in
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  // Scale in (for modals/cards)
  scaleIn: {
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1 },
  },
  
  // Slide up (for bottom sheets)
  slideUp: {
    from: { translateY: 100 },
    to: { translateY: 0 },
  },
  
  // Button press
  buttonPress: {
    scale: 0.97,
    opacity: 0.9,
  },
  
  // Skeleton shimmer
  skeleton: {
    shimmerDuration: 1500,
    shimmerColors: ['#e1e3e5', '#f0f0f5', '#e1e3e5'],
  },
};
