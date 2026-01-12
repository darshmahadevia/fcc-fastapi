import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Trash2, Edit, MessageCircle, MoreHorizontal, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import type { PostWithVotes } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: PostWithVotes;
  onEdit?: (post: PostWithVotes) => void;
}

export function PostCard({ post, onEdit }: PostCardProps) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isVoted, setIsVoted] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState(post.votes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOwner = user?.id === post.Post.owner_id;

  const voteMutation = useMutation({
    mutationFn: (dir: 0 | 1) => voteApi.vote({ post_id: post.Post.id, dir }),
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
      setOptimisticVotes(post.votes);
      setIsVoted(false);
      toast.error('Failed to vote');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.deletePost(post.Post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDeleteDialogOpen(false);
      toast.success('Post deleted successfully');
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

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="group relative transition-all duration-300 bg-white/80 dark:bg-slate-800/60 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/10 hover:bg-white/90 dark:hover:bg-slate-800/70 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.1)_inset] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.5)_inset] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.15)_inset] overflow-hidden rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <Link
              to={`/profile/${post.Post.owner_id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-medium">
                    {getInitials(post.Post.owner.email)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <p className="text-sm font-medium hover:text-primary transition-colors">
                  {post.Post.owner.email}
                </p>
                <p className="text-xs text-muted-foreground">
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
                  <Badge variant="secondary" className="text-xs font-medium">
                    Draft
                  </Badge>
                </motion.div>
              )}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit?.(post)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setDeleteDialogOpen(true)} 
                      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <Link to={`/posts/${post.Post.id}`} className="block space-y-2.5">
            <h3 className="font-semibold text-lg leading-snug hover:text-primary transition-colors line-clamp-2">
              {post.Post.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {post.Post.content}
            </p>
          </Link>
        </CardContent>

        <CardFooter className="pt-0 border-t border-border/30 mt-2 pt-3">
          <div className="flex items-center gap-1">
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
                        'gap-2 h-9 px-3 rounded-full transition-all',
                        isVoted
                          ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <motion.div
                        animate={isVoted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={cn(
                            'h-4 w-4 transition-all',
                            isVoted && 'fill-current'
                          )}
                        />
                      </motion.div>
                      <motion.span 
                        className="font-medium"
                        key={optimisticVotes}
                        initial={{ scale: 1.2, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        {optimisticVotes}
                      </motion.span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{isAuthenticated ? (isVoted ? 'Remove like' : 'Like this post') : 'Sign in to like'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={`/posts/${post.Post.id}`}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 h-9 px-3 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">View</span>
                      </Button>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>View full post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
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
              Are you sure you want to delete "<span className="font-medium text-foreground">{post.Post.title.length > 30 ? post.Post.title.slice(0, 30) + '...' : post.Post.title}</span>"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
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
