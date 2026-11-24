/**
 * Motion Tokens & Animation Presets
 * Optimized for 60fps mobile GPU acceleration (transform & opacity)
 */

export const transitionSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const transitionSmooth = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for snappy mobile response
};

export const transitionCinematic = {
  duration: 0.65,
  ease: [0.16, 1, 0.3, 1],
};

// Multi-step slide variants (direction-aware)
export const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// Staggered field entrance
export const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const fieldEntrance = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Micro-interaction button tap scale
export const buttonTapMotion = {
  scale: 0.96,
  transition: { duration: 0.1 },
};

export const cardHoverMotion = {
  scale: 1.015,
  y: -4,
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};
