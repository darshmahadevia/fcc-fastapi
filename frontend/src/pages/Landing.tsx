import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Users,
  Heart,
  Zap,
  Shield,
  MessageSquare,
} from 'lucide-react';

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

const featureContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

export function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
          <motion.div 
            className="flex flex-col items-center text-center space-y-8"
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              variants={heroItemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/15 text-primary text-sm font-medium shadow-lg shadow-black/5"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Welcome to PostHub</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              variants={heroItemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl"
            >
              Share your ideas with the{' '}
              <motion.span 
                className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                world
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              variants={heroItemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              A modern platform for sharing thoughts, connecting with others,
              and discovering amazing content from creators around the globe.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={heroItemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {isAuthenticated ? (
                <Link to="/feed">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="gap-2 px-8 h-12 text-base">
                      Go to Feed
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button size="lg" className="gap-2 px-8 h-12 text-base">
                        Get Started Free
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-8 h-12 text-base"
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Social proof */}
            <motion.div 
              variants={heroItemVariants}
              className="flex items-center gap-8 pt-8 text-sm text-muted-foreground"
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-4 h-4" />
                <span>Join our growing community</span>
              </motion.div>
              <motion.div 
                className="hidden sm:flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                </motion.div>
                <span>Share what you love</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative">
        {/* Floating orb for visual continuity */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to share
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, fast, and beautiful. PostHub gives you all the tools to
              create and share your content.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={featureContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Feature 1 */}
            <motion.div 
              variants={featureCardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 hover:border-white/60 dark:hover:border-white/25 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.1)_inset] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.5)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.15)_inset]"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              >
                <Zap className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built with modern technology for instant loading and smooth
                interactions across all devices.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={featureCardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 hover:border-white/60 dark:hover:border-white/25 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.1)_inset] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.5)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.15)_inset]"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              >
                <Shield className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your content and data are protected with industry-standard
                security and authentication.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={featureCardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 hover:border-white/60 dark:hover:border-white/25 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.1)_inset] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.5)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.15)_inset]"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">Engage & Connect</h3>
              <p className="text-muted-foreground leading-relaxed">
                Interact with posts through voting, discover new creators, and
                build your network.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pt-12">
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <motion.div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>

            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ready to start sharing?
            </motion.h2>
            <motion.p 
              className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join PostHub today and be part of a community that values great
              content and meaningful connections.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {isAuthenticated ? (
                <Link to="/feed">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 px-8 h-12 text-base"
                    >
                      View Posts
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 px-8 h-12 text-base"
                    >
                      Create Your Account
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
