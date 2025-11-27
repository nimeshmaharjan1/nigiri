import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GET_ALL_SUSHI_QUERY_KEY } from '@/hooks/sushi/use-get-all-sushi.hook';
import { deleteSushi } from '@/services/sushi/delete.service';
import { T_Sushi } from '@/types/sushi.types';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ArchiveSushiDialog = ({
  sushi,
  ...props
}: AlertDialogProps & {
  sushi: T_Sushi;
}) => {
  const queryClient = useQueryClient();
  const archiveMutation = useMutation({
    mutationFn: () => deleteSushi(sushi.id),
    onSuccess: async () => {
      toast.success(`${sushi.name} archived successfully`);
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_SUSHI_QUERY_KEY],
      });
    },
    onError: () => {
      toast.error(
        'Failed to archive item or this item has already been archived'
      );
    },
  });
  return (
    <AlertDialog {...props}>
      <AlertDialogContent data-testid="delete-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Archive {sushi.name} (${sushi.price})?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently archive the
            item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-testid="cancel-delete"
            disabled={archiveMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-testid="confirm-delete"
            disabled={archiveMutation.isPending}
            onClick={() => archiveMutation.mutate()}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {archiveMutation.isPending ? 'Archiving...' : 'Archive'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ArchiveSushiDialog;
