import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Mail, User as UserIcon, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usersApi, postsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PostCard, CreatePostDialog } from '@/components/posts';
import type { PostWithVotes } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [editPost, setEditPost] = useState<PostWithVotes | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const isOwnProfile = currentUser?.id === Number(id);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUser(Number(id)),
    enabled: !!id,
  });

  // Fetch all posts and filter by user
  const { data: allPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.getPosts({ limit: 100 }),
  });

  const userPosts = allPosts.filter(post => post.Post.owner_id === Number(id));

  const handleEditPost = (post: PostWithVotes) => {
    setEditPost(post);
    setCreateDialogOpen(true);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <motion.div 
        className="max-w-2xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Skeleton className="h-8 w-20" />
        <Card className="overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border-white/20 dark:border-white/10">
          <div className="h-28 bg-gradient-to-r from-primary/20 to-primary/5" />
          <CardContent className="pt-0">
            <div className="flex flex-col items-center -mt-14 text-center">
              <Skeleton className="h-28 w-28 rounded-full border-4 border-background" />
              <Skeleton className="h-6 w-48 mt-4" />
              <Skeleton className="h-4 w-32 mt-2" />
              <div className="flex gap-6 mt-4">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-12 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Card className="overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border-white/20 dark:border-white/10">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  if (error || !user) {
    return (
      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="text-center py-16 bg-white/60 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border-white/20 dark:border-white/10">
          <CardContent>
            <motion.div 
              className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
            >
              <UserIcon className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <motion.h2 
              className="text-xl font-semibold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              User Not Found
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The user you're looking for doesn't exist or has been removed.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/feed">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Feed
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Link to="/feed">
          <motion.div 
            whileHover={{ x: -4 }} 
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
      >
        <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.1)_inset] rounded-2xl">
          {/* Banner */}
          <motion.div 
            className="h-28 bg-gradient-to-br from-primary/30 via-primary/20 to-accent/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          <CardContent className="pt-0">
            <motion.div 
              className="flex flex-col items-center -mt-14 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2 
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-3xl font-bold">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              {/* User Info */}
              <div className="mt-4 space-y-3">
                <motion.h1 
                  className="text-2xl font-bold"
                  variants={itemVariants}
                >
                  {isOwnProfile ? 'My Profile' : `User #${user.id}`}
                </motion.h1>
                
                <motion.div 
                  className="flex items-center justify-center gap-2 text-muted-foreground"
                  variants={itemVariants}
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center gap-2 text-muted-foreground"
                  variants={itemVariants}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Joined {format(new Date(user.created_at), 'MMMM d, yyyy')}
                  </span>
                </motion.div>

                {/* Stats */}
                <motion.div 
                  className="flex items-center justify-center gap-6 pt-2"
                  variants={itemVariants}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{userPosts.length}</p>
                    <p className="text-xs text-muted-foreground">{userPosts.length === 1 ? 'Post' : 'Posts'}</p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {userPosts.reduce((acc, post) => acc + post.votes, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Likes</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User's Posts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {isOwnProfile ? 'My Posts' : 'Posts'}
            </h2>
          </div>
          {isOwnProfile && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm" 
                onClick={() => {
                  setEditPost(null);
                  setCreateDialogOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </motion.div>
          )}
        </div>

        {postsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard 
                key={post.Post.id} 
                post={post} 
                onEdit={isOwnProfile ? handleEditPost : undefined}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <motion.div 
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <FileText className="w-6 h-6 text-muted-foreground" />
            </motion.div>
            <p className="text-muted-foreground text-sm">
              {isOwnProfile 
                ? "You haven't created any posts yet"
                : "This user hasn't created any posts yet"}
            </p>
            {isOwnProfile && (
              <motion.div 
                className="mt-4"
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditPost(null);
                    setCreateDialogOpen(true);
                  }}
                >
                  Create Your First Post
                </Button>
              </motion.div>
            )}
          </Card>
        )}
      </motion.div>

      {/* Create/Edit Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        editPost={editPost}
      />
    </motion.div>
  );
}
