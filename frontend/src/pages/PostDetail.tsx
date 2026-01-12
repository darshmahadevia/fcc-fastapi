import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow, format } from 'date-fns';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Loader2, Edit, Trash2, FileText, AlertTriangle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { postsApi, voteApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CreatePostDialog } from '@/components/posts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const [isVoted, setIsVoted] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPost(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setOptimisticVotes(post.votes);
    }
  }, [post]);

  const isOwner = user?.id === post?.Post.owner_id;

  const voteMutation = useMutation({
    mutationFn: (dir: 0 | 1) => voteApi.vote({ post_id: Number(id), dir }),
    onMutate: async (dir) => {
      if (dir === 1) {
        setOptimisticVotes((prev) => prev + 1);
        setIsVoted(true);
      } else {
        setOptimisticVotes((prev) => Math.max(0, prev - 1));
        setIsVoted(false);
      }
    },
    onError: () => {
      if (post) setOptimisticVotes(post.votes);
      setIsVoted(false);
      toast.error('Failed to vote');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.deletePost(Number(id)),
    onSuccess: () => {
      toast.success('Post deleted successfully');
      navigate('/feed');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  const handleVote = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to vote');
      return;
    }
    voteMutation.mutate(isVoted ? 0 : 1);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <motion.div 
        className="max-w-2xl mx-auto space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Skeleton className="h-8 w-32" />
        <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/70 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.1)_inset] rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error || !post) {
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
              <FileText className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <motion.h2 
              className="text-xl font-semibold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Post Not Found
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The post you're looking for doesn't exist or has been removed.
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
      className="max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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
              Back to Feed
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
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <Link
                to={`/profile/${post.Post.owner_id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-medium">
                      {getInitials(post.Post.owner.email)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <p className="font-medium hover:text-primary transition-colors">
                    {post.Post.owner.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(post.Post.created_at), 'MMM d, yyyy')} ·{' '}
                    {formatDistanceToNow(new Date(post.Post.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                {!post.Post.published && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Badge variant="secondary" className="font-medium">Draft</Badge>
                  </motion.div>
                )}
                {isOwner && (
                  <motion.div 
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full"
                              onClick={() => setEditDialogOpen(true)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit post</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteDialogOpen(true)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete post</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {post.Post.title}
            </motion.h1>
            <motion.div 
              className="prose prose-sm max-w-none dark:prose-invert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-base">
                {post.Post.content}
              </p>
            </motion.div>
          </CardContent>

          <Separator className="mx-6" />

          <CardFooter className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleVote}
                        disabled={voteMutation.isPending}
                        className={cn(
                          'gap-2 h-10 px-4 rounded-full transition-all',
                          isVoted
                            ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <motion.div
                          animate={isVoted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={cn(
                              'h-5 w-5 transition-all',
                              isVoted && 'fill-current'
                            )}
                          />
                        </motion.div>
                        <motion.span 
                          className="font-medium"
                          key={optimisticVotes}
                          initial={{ scale: 1.3, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          {optimisticVotes || post.votes}
                        </motion.span>
                        <span className="text-muted-foreground font-normal">
                          {(optimisticVotes || post.votes) === 1 ? 'like' : 'likes'}
                        </span>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isAuthenticated ? (isVoted ? 'Remove like' : 'Like this post') : 'Sign in to like'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 h-10 px-4 rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard!');
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </motion.div>

      <CreatePostDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editPost={post}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </motion.div>
              Delete Post
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone and all data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="min-w-[100px]"
              >
                {deleteMutation.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-4 w-4" />
                  </motion.div>
                ) : (
                  'Delete'
                )}
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
