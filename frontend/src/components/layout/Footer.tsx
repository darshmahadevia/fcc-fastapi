import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Rss } from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="border-t border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_-4px_30px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.2)_inset] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.05)_inset]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <motion.div 
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </motion.div>
              <span className="text-xl font-bold">PostHub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A modern platform for sharing thoughts, connecting with others,
              and discovering amazing content from creators around the globe.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/feed"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <Rss className="h-3.5 w-3.5" />
                  </motion.div>
                  Browse Feed
                </Link>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Link
                    to="/register"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </li>
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/70 dark:hover:bg-white/15 transition-colors border border-white/20 dark:border-white/10"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/70 dark:hover:bg-white/15 transition-colors border border-white/20 dark:border-white/10"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4"
          variants={itemVariants}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} PostHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Built with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </motion.span>{' '}
            using FastAPI & React
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
