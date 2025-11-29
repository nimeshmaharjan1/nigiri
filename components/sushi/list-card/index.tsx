import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { T_Sushi } from '@/types/sushi.types';
import { XIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import ArchiveSushiDialog from '../delete';

const SushiCard = ({ sushi }: { sushi: T_Sushi }) => {
  const [showArchive, setShowArchive] = useState(false);
  const isNigiri = sushi.type.toLowerCase() === 'nigiri';
  return (
    <Card className="gap-1 py-1.5 pb-3">
      <CardHeader className="gap-0">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-base font-medium">{sushi.name}</h3>
          <Button
            className="w-3! h-6"
            variant={'ghost'}
            onClick={() => setShowArchive(true)}
          >
            <XIcon className="size-3"></XIcon>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row items-center gap-2">
        <img
          src={sushi.image}
          alt={sushi.name}
          className="h-14 w-16 rounded-lg object-cover"
        />
        <div className="flex flex-1 flex-col gap-1">
          {isNigiri ? (
            <Info label="Fish Type" value={sushi.fishType} />
          ) : (
            <Info label="Pieces" value={sushi.pieces} />
          )}
          <Info label="Type" value={sushi.type} />
          <Info
            label="Price"
            value={<span className="font-medium">${sushi.price}</span>}
          />
        </div>
      </CardContent>
      <ArchiveSushiDialog
        sushi={sushi}
        open={showArchive}
        onOpenChange={setShowArchive}
      />
    </Card>
  );
};

export default SushiCard;
const Info = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <div className="flex w-full justify-between">
      <p className="text-muted-foreground text-[13px]">{label}</p>
      <p className="text-[13px]">{value}</p>
    </div>
  );
};
