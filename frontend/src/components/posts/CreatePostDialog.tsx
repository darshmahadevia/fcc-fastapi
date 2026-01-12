import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import type { PostWithVotes } from '@/types';
import { toast } from 'sonner';
import { Loader2, PenLine, Sparkles } from 'lucide-react';

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

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPost?: PostWithVotes | null;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  editPost,
}: CreatePostDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editPost;

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      published: true,
    },
  });

  // Reset form when dialog opens or editPost changes
  useEffect(() => {
    if (open) {
      if (editPost) {
        form.reset({
          title: editPost.Post.title,
          content: editPost.Post.content,
          published: editPost.Post.published,
        });
      } else {
        form.reset({
          title: '',
          content: '',
          published: true,
        });
      }
    }
  }, [open, editPost, form]);

  const createMutation = useMutation({
    mutationFn: (data: PostFormData) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PostFormData) =>
      postsApi.updatePost(editPost!.Post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', editPost!.Post.id.toString()] });
      toast.success('Post updated successfully!');
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to update post');
    },
  });

  const onSubmit = (data: PostFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const contentLength = form.watch('content')?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <PenLine className="h-5 w-5 text-primary" />
                Edit Post
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                Create New Post
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Make changes to your post below.'
              : 'Share something interesting with the community.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Give your post a catchy title..."
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind? Share your thoughts..."
                      className="min-h-[160px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    <span className={contentLength > 4500 ? 'text-amber-500' : ''}>
                      {contentLength.toLocaleString()}
                    </span>{' '}
                    / 5,000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[100px]">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Publish'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
