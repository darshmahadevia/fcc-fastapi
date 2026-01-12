import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Sparkles, TrendingUp, User, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostList, CreatePostDialog } from '@/components/posts';
import { postsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { PostWithVotes } from '@/types';

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

export function Feed() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState<PostWithVotes | null>(null);
  
  // Initialize filter from URL params
  const urlFilter = searchParams.get('filter');
  const [feedFilter, setFeedFilter] = useState<'all' | 'my-posts'>(
    urlFilter === 'my-posts' && isAuthenticated ? 'my-posts' : 'all'
  );

  // Sync filter with URL
  useEffect(() => {
    if (urlFilter === 'my-posts' && isAuthenticated) {
      setFeedFilter('my-posts');
    }
  }, [urlFilter, isAuthenticated]);

  const handleFilterChange = (value: 'all' | 'my-posts') => {
    setFeedFilter(value);
    if (value === 'my-posts') {
      setSearchParams({ filter: 'my-posts' });
    } else {
      setSearchParams({});
    }
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', searchQuery],
    queryFn: () =>
      postsApi.getPosts({
        limit: 50,
        search: searchQuery || undefined,
      }),
    staleTime: 1000 * 15, // 15 seconds for posts
    refetchOnMount: 'always', // Always refetch on mount for fresh data
    placeholderData: (previousData) => previousData, // Show old data while fetching
  });

  // Filter posts based on selected tab
  const filteredPosts = useMemo(() => {
    if (feedFilter === 'my-posts' && user) {
      return posts.filter(post => post.Post.owner_id === user.id);
    }
    return posts;
  }, [posts, feedFilter, user]);

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEditPost(null);
    setCreateDialogOpen(true);
  };

  const handleEditPost = (post: PostWithVotes) => {
    setEditPost(post);
    setCreateDialogOpen(true);
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="flex flex-col gap-6" variants={itemVariants}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">
                {feedFilter === 'my-posts' ? 'My Posts' : 'Your Feed'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {feedFilter === 'my-posts' 
                ? 'Manage and view all your published content'
                : 'Discover and share amazing content with the community'}
            </p>
          </motion.div>
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleCreateClick} className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            </motion.div>
          )}
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
            >
              <Tabs value={feedFilter} onValueChange={(v) => handleFilterChange(v as 'all' | 'my-posts')}>
                <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.3)_inset] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.1)_inset] rounded-xl">
                  <TabsTrigger value="all" className="gap-2 rounded-lg data-[state=active]:bg-white/90 dark:data-[state=active]:bg-white/15 data-[state=active]:shadow-md">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">All Posts</span>
                    <span className="sm:hidden">All</span>
                  </TabsTrigger>
                  <TabsTrigger value="my-posts" className="gap-2 rounded-lg data-[state=active]:bg-white/90 dark:data-[state=active]:bg-white/15 data-[state=active]:shadow-md">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">My Posts</span>
                    <span className="sm:hidden">Mine</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          )}
          
          {/* Search */}
          <div className={`relative ${isAuthenticated ? 'sm:max-w-xs flex-1' : 'max-w-lg'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Banner */}
      <AnimatePresence>
        {!searchQuery && filteredPosts.length > 0 && (
          <motion.div 
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.3)_inset] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.1)_inset]"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              <motion.span 
                className="font-medium text-foreground"
                key={filteredPosts.length}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {filteredPosts.length}
              </motion.span>{' '}
              {filteredPosts.length === 1 ? 'post' : 'posts'} {feedFilter === 'my-posts' ? 'created by you' : 'to explore'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State for My Posts */}
      <AnimatePresence>
        {feedFilter === 'my-posts' && filteredPosts.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/40 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.1)_inset] flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <User className="w-8 h-8 text-primary" />
            </motion.div>
            <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              You haven't created any posts yet. Share your first thought with the community!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleCreateClick} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Post
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts */}
      {(feedFilter !== 'my-posts' || filteredPosts.length > 0 || isLoading) && (
        <motion.div variants={itemVariants}>
          <PostList posts={filteredPosts} isLoading={isLoading} onEdit={handleEditPost} />
        </motion.div>
      )}

      {/* Create/Edit Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        editPost={editPost}
      />
    </motion.div>
  );
}
