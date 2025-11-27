import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RippleButton } from '@/components/ui/ripple-button';
import { T_Sushi } from '@/types/sushi.types';
import { CircleDotIcon, FishIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import ArchiveSushiDialog from '../delete';

const SushiCard = ({ sushi }: { sushi: T_Sushi }) => {
  const [showArchive, setShowArchive] = useState(false);
  const isNigiri = sushi.type.toLowerCase() === 'nigiri';
  return (
    <Card data-testid="sushi-card" className="max-w-md pb-4 pt-0">
      <CardContent className="relative px-0">
        <img
          src={sushi.image}
          alt="Banner"
          className="h-42 w-full rounded-t-xl object-cover"
        />
        <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
          <span className="text-primary text-lg font-bold">${sushi.price}</span>
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle data-testid="sushi-card-title">{sushi.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{sushi.type}</span>
          {isNigiri ? (
            <span className="flex items-center gap-1.5 text-slate-600">
              <FishIcon className="text-primary h-4 w-4" />
              <span className="font-medium">{sushi.fishType}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-600">
              <CircleDotIcon className="text-primary h-4 w-4" />
              <span className="font-medium">{sushi.pieces} pieces</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end gap-3 max-sm:flex-col max-sm:items-stretch">
        <RippleButton
          data-testid="delete-button"
          size={'sm'}
          variant={'destructive'}
          onClick={() => setShowArchive(true)}
        >
          <TrashIcon className="text-destructive size-3"></TrashIcon>Archive
        </RippleButton>
      </CardFooter>
      <ArchiveSushiDialog
        sushi={sushi}
        open={showArchive}
        onOpenChange={setShowArchive}
      />
    </Card>
  );
};

export default SushiCard;
