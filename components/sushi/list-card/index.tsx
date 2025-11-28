import { T_Sushi } from '@/types/sushi.types';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import ArchiveSushiDialog from '../delete';

const SushiCard = ({ sushi }: { sushi: T_Sushi }) => {
  const [showArchive, setShowArchive] = useState(false);
  const isNigiri = sushi.type.toLowerCase() === 'nigiri';

  return (
    <>
      <div
        data-testid="sushi-card"
        className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Delete button in top right */}
        <button
          data-testid="delete-button"
          onClick={() => setShowArchive(true)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <XIcon className="h-4 w-4" />
        </button>

        {/* Card content */}
        <div className="flex gap-4">
          {/* Image */}
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
            <img
              src={sushi.image}
              alt={sushi.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info columns */}
          <div className="flex flex-1 flex-col justify-center gap-1.5">
            <h3
              data-testid="sushi-card-title"
              className="text-base font-semibold text-gray-900"
            >
              {sushi.name}
            </h3>

            <div className="flex flex-col gap-0.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Type</span>
                <span className="font-medium">{sushi.type}</span>
              </div>

              {isNigiri ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Fish</span>
                  <span className="font-medium">{sushi.fishType}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Pieces</span>
                  <span className="font-medium">{sushi.pieces}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Price</span>
                <span className="font-semibold text-gray-900">
                  ${sushi.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ArchiveSushiDialog
        sushi={sushi}
        open={showArchive}
        onOpenChange={setShowArchive}
      />
    </>
  );
};

export default SushiCard;
