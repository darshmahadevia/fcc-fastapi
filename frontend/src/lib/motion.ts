import type { Variants, Transition } from "motion/react";

// ============================================
// TRANSITIONS
// ============================================

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 15,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const easeTransition: Transition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
};

// ============================================
// BASIC VARIANTS
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springGentle,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springGentle,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springGentle,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springGentle,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springBouncy,
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springBouncy,
  },
};

// ============================================
// STAGGER CONTAINERS
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ============================================
// STAGGER CHILDREN
// ============================================

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springGentle,
  },
};

export const staggerItemFade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: easeTransition,
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springGentle,
  },
};

// ============================================
// HOVER EFFECTS
// ============================================

export const hoverScale = {
  scale: 1.02,
  transition: springTransition,
};

export const hoverScaleSmall = {
  scale: 1.01,
  transition: springTransition,
};

export const hoverLift = {
  y: -4,
  transition: springTransition,
};

export const hoverLiftSmall = {
  y: -2,
  transition: springTransition,
};

// ============================================
// TAP EFFECTS
// ============================================

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const tapScaleSmall = {
  scale: 0.99,
  transition: { duration: 0.1 },
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// MODAL/DIALOG VARIANTS
// ============================================

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: springBouncy,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

// ============================================
// SPECIAL ANIMATIONS
// ============================================

export const heartBeat: Variants = {
  initial: { scale: 1 },
  beat: { 
    scale: [1, 1.3, 1],
    transition: { duration: 0.3 },
  },
};

export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

export const slideInFromLeft: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: springGentle,
  },
};

export const slideInFromRight: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: springGentle,
  },
};

export const slideInFromTop: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: springGentle,
  },
};

export const slideInFromBottom: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: springGentle,
  },
};

// ============================================
// SCROLL-TRIGGERED (for whileInView)
// ============================================

export const scrollFadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const scrollScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ============================================
// LOADING STATES
// ============================================

export const pulse: Variants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const shimmer: Variants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};
