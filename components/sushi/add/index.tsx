import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RippleButton } from '@/components/ui/ripple-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GET_ALL_SUSHI_QUERY_KEY } from '@/hooks/sushi/use-get-all-sushi.hook';
import { cn } from '@/lib/utils';
import { createSushi } from '@/services/sushi/create.service';
import { createSushiSchema, T_CreateSushi } from '@/types/sushi.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AddSushiDialog = ({ ...props }: AlertDialogProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {}
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<T_CreateSushi>({
    resolver: zodResolver(createSushiSchema),
    defaultValues: {
      name: '',
      type: 'Nigiri',
      price: '',
      fishType: '',
      pieces: '',
    },
  });

  const selectedType = watch('type');

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });
  };

  const addMutation = useMutation({
    mutationFn: (data: T_CreateSushi) => {
      return createSushi(data);
    },
    onSuccess: async () => {
      toast.success('Item added successfully');
      // Close dialog first
      props.onOpenChange?.(false);
      // Then cleanup state
      reset();
      setUploadedFiles([]);
      setFileProgresses({});
      // Finally invalidate queries
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_SUSHI_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to add item');
    },
  });
  const onSubmit = (data: T_CreateSushi) => {
    console.log('Form submitted:', data);
    console.log('Uploaded files:', uploadedFiles);
    addMutation.mutate(data);
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent
        data-testid="add-sushi-dialog"
        className="h-[calc(100vh-6rem)] gap-6"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Add a New Sushi Item</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details and upload an image to add a new sushi item.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="add-sushi-form"
          className="max-h-[calc(100vh-14rem)] space-y-6 overflow-y-auto px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Name Field */}
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Salmon Nigiri"
                {...register('name')}
                className="mt-2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Type Field */}
            <div>
              <Label htmlFor="type">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue="Nigiri"
                onValueChange={(value) => {
                  setValue('type', value as 'Nigiri' | 'Roll');
                  // Clear conditional fields when type changes
                  setValue('fishType', '');
                  setValue('pieces', '');
                }}
              >
                <SelectTrigger id="type" className="mt-2 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigiri">Nigiri</SelectItem>
                  <SelectItem value="Roll">Roll</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Conditional Field: Fish Type (for Nigiri) */}
            {selectedType === 'Nigiri' && (
              <div>
                <Label htmlFor="fishType">
                  Fish Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fishType"
                  type="text"
                  placeholder="e.g., Salmon, Tuna"
                  {...register('fishType')}
                  className="mt-2"
                />
                {errors.fishType && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fishType.message}
                  </p>
                )}
              </div>
            )}

            {/* Conditional Field: Pieces (for Roll) */}
            {selectedType === 'Roll' && (
              <div>
                <Label htmlFor="pieces">
                  Number of Pieces <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pieces"
                  type="number"
                  placeholder="e.g., 6, 8, 12"
                  {...register('pieces')}
                  className="mt-2"
                />
                {errors.pieces && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.pieces.message}
                  </p>
                )}
              </div>
            )}

            {/* Price Field */}
            <div>
              <Label htmlFor="price">
                Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="text"
                placeholder="e.g., 12.99"
                {...register('price')}
                className="mt-2"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <Label>Sushi Image</Label>
            <div
              className="border-border mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center"
              onClick={handleBoxClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="bg-muted mb-2 rounded-full p-3">
                <Upload className="text-muted-foreground h-5 w-5" />
              </div>
              <p className="text-foreground text-sm font-medium">
                Upload a sushi image
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                or,{' '}
                <label
                  htmlFor="fileUpload"
                  className="text-primary hover:text-primary/90 cursor-pointer font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  click to browse
                </label>{' '}
                (4MB max)
              </p>
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          </div>

          {/* Uploaded Files List */}
          <div
            className={cn(
              'space-y-3',
              uploadedFiles.length > 0 ? 'mt-4' : 'hidden'
            )}
          >
            {uploadedFiles.map((file, index) => {
              const imageUrl = URL.createObjectURL(file);

              return (
                <div
                  className="border-border flex flex-col rounded-lg border p-2"
                  key={file.name + index}
                  onLoad={() => {
                    return () => URL.revokeObjectURL(imageUrl);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-18 bg-muted row-span-2 flex h-14 items-center justify-center self-start overflow-hidden rounded-sm">
                      <img
                        src={imageUrl}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 pr-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground max-w-[250px] truncate text-sm">
                            {file.name}
                          </span>
                          <span className="text-muted-foreground whitespace-nowrap text-sm">
                            {Math.round(file.size / 1024)} KB
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="bg-transparent! h-8 w-8 hover:text-red-500"
                          onClick={() => removeFile(file.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                          <div
                            className="bg-primary h-full"
                            style={{
                              width: `${fileProgresses[file.name] || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-muted-foreground whitespace-nowrap text-xs">
                          {Math.round(fileProgresses[file.name] || 0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </form>
        <AlertDialogFooter>
          <Button
            data-testid="cancel-add"
            disabled={addMutation.isPending}
            type="button"
            variant="outline"
            onClick={() => {
              props.onOpenChange?.(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <RippleButton
            disabled={addMutation.isPending}
            form="add-sushi-form"
            type="submit"
          >
            {addMutation.isPending ? 'Adding...' : 'Add Item'}
          </RippleButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddSushiDialog;
