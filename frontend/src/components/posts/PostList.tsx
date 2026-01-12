import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { motion } from 'motion/react';
import type { PostWithVotes } from '@/types';

interface PostListProps {
  posts: PostWithVotes[];
  isLoading?: boolean;
  onEdit?: (post: PostWithVotes) => void;
}

function PostSkeleton() {
  return (
    <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/60 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.1)_inset] rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

// Simplified animation - direct control without variants

export function PostList({ posts, isLoading, onEdit }: PostListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <PostSkeleton />
          </motion.div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-16 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.3 }}
        >
          <FileText className="w-8 h-8 text-muted-foreground" />
        </motion.div>
        <motion.h3 
          className="font-semibold text-lg mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          No posts yet
        </motion.h3>
        <motion.p 
          className="text-muted-foreground text-sm max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Be the first to share something with the community!
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((post, index) => (
        <motion.div 
          key={post.Post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.05,
            ease: "easeOut"
          }}
        >
          <PostCard post={post} onEdit={onEdit} />
        </motion.div>
      ))}
    </div>
  );
}
