import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { projectCategories } from '@/lib/utils';
import { insertProjectSchema } from '@shared/schema';

const formSchema = insertProjectSchema.extend({
  thumbnail: z.instanceof(FileList).transform(list => list.item(0)),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddProjectForm() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      tag: '',
      url: '',
    },
  });

  // Watch for changes to display dynamic UI elements
  const watchCategory = watch('category');

  const createProject = useMutation({
    mutationFn: async (data: FormValues) => {
      setIsUploading(true);
      
      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('tag', data.tag || '');
        formData.append('url', data.url);
        
        if (data.thumbnail) {
          formData.append('thumbnail', data.thumbnail);
        }
        
        // Special fields for videos
        if (data.category === 'video' && data.videoLength) {
          formData.append('videoLength', data.videoLength);
        }
        
        const response = await fetch('/api/projects', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to create project');
        }
        
        return await response.json();
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Project added',
        description: 'Your project has been added successfully.',
      });
      reset();
      setThumbnailPreview(null);
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add project. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createProject.mutate(data);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('thumbnail', e.target.files as unknown as FileList);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="admin" className="py-16 px-4 bg-cyber-black border-t border-b border-neon-cyan/30">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold inline-block">
            <span className="text-neon-cyan">CREATOR</span>
            <span className="text-white"> DASHBOARD</span>
            <div className="h-[2px] w-full bg-gradient-to-r from-neon-cyan to-neon-magenta mt-2"></div>
          </h2>
          <p className="text-cyber-text/80 mt-4">Simple interface to quickly add new works to your catalog.</p>
        </div>
        
        <div className="bg-cyber-slate border border-neon-cyan/30 rounded-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neon-cyan text-sm font-orbitron mb-2" htmlFor="project-title">
                  PROJECT TITLE
                </label>
                <input
                  {...register('title')}
                  id="project-title"
                  placeholder="Enter project title"
                  className="w-full bg-cyber-dark border border-neon-cyan/30 focus:border-neon-cyan p-3 rounded-sm text-cyber-text focus:outline-none text-sm"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-neon-cyan text-sm font-orbitron mb-2" htmlFor="project-category">
                  CATEGORY
                </label>
                <select
                  {...register('category')}
                  id="project-category"
                  className="w-full bg-cyber-dark border border-neon-cyan/30 focus:border-neon-cyan p-3 rounded-sm text-cyber-text focus:outline-none text-sm"
                >
                  <option value="">Select category</option>
                  {projectCategories.filter(c => c.value !== 'all').map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-neon-cyan text-sm font-orbitron mb-2" htmlFor="project-description">
                DESCRIPTION
              </label>
              <textarea
                {...register('description')}
                id="project-description"
                rows={4}
                placeholder="Enter project description"
                className="w-full bg-cyber-dark border border-neon-cyan/30 focus:border-neon-cyan p-3 rounded-sm text-cyber-text focus:outline-none text-sm"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neon-cyan text-sm font-orbitron mb-2" htmlFor="project-tag">
                  TAG (OPTIONAL)
                </label>
                <input
                  {...register('tag')}
                  id="project-tag"
                  placeholder="Enter tag (e.g. INTERACTIVE, PRODUCTIVITY)"
                  className="w-full bg-cyber-dark border border-neon-cyan/30 focus:border-neon-cyan p-3 rounded-sm text-cyber-text focus:outline-none text-sm"
                />
              </div>
              
              {watchCategory === 'video' && (
                <div>
                  <label className="block text-neon-cyan text-sm font-orbitron mb-2" htmlFor="video-length">
                    VIDEO LENGTH
                  </label>
                  <input
                    {...register('videoLength')}
                    id="video-length"
                    placeholder="MM:SS (e.g. 04:32)"
                    className="w-full bg-cyber-dark border border-neon-cyan/30 focus:border-neon-cyan p-3 rounded-sm text-cyber-text focus:outline-none text-sm"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-neon-cyan text-sm font-orbitron mb-2" htmlFor="project-url">
                  PROJECT URL
                </label>
                <input
                  {...register('url')}
                  id="project-url"
                  type="url"
                  placeholder="https://"
                  className="w-full bg-cyber-dark border border-neon-cyan/30 focus:border-neon-cyan p-3 rounded-sm text-cyber-text focus:outline-none text-sm"
                />
                {errors.url && (
                  <p className="text-red-500 text-xs mt-1">{errors.url.message as string}</p>
                )}
              </div>
              
              <div>
                <label className="block text-neon-cyan text-sm font-orbitron mb-2" htmlFor="project-thumbnail">
                  THUMBNAIL
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-cyber-dark border border-neon-cyan/30 focus:border-neon-cyan p-3 rounded-sm text-cyber-text focus:outline-none text-sm relative overflow-hidden">
                    <input
                      id="project-thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-cyber-text/60">
                        {thumbnailPreview ? 'File selected' : 'Choose file...'}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-neon-cyan"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {errors.thumbnail && (
                  <p className="text-red-500 text-xs mt-1">{errors.thumbnail.message as string}</p>
                )}
                
                {thumbnailPreview && (
                  <div className="mt-2">
                    <div className="relative w-20 h-20 rounded-sm overflow-hidden">
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="neonMagenta"
                size="lg"
                disabled={isUploading || createProject.isPending}
              >
                {isUploading || createProject.isPending ? 'ADDING...' : 'ADD PROJECT'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
