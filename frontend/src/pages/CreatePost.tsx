import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { postsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const postSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters'),
  published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export function CreatePost() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      published: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PostFormData) => postsApi.createPost(data),
    onSuccess: (post) => {
      toast.success('Post published successfully!');
      navigate(`/posts/${post.id}`);
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });

  const onSubmit = (data: PostFormData) => {
    createMutation.mutate(data);
  };

  const contentLength = form.watch('content')?.length || 0;

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
        <Card className="border-border/50 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
              Create New Post
            </CardTitle>
            <CardDescription>
              Share something interesting with the community
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <motion.form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Give your post a catchy title..."
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What's on your mind? Share your thoughts, ideas, or stories..."
                            className="min-h-[250px] resize-none text-base leading-relaxed"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          <motion.span 
                            className={contentLength > 4500 ? 'text-amber-500' : ''}
                            animate={{ 
                              scale: contentLength > 4500 ? [1, 1.05, 1] : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {contentLength.toLocaleString()}
                          </motion.span>{' '}
                          / 5,000 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div 
                  className="flex items-center justify-end gap-3 pt-2"
                  variants={itemVariants}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate('/feed')}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="min-w-[120px]"
                    >
                      {createMutation.isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        'Publish Post'
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
