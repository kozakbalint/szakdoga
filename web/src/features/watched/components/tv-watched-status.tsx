import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useAddTvToWatched } from '@/features/watched/api/add-tv-to-watched';
import { useRemoveTvFromWatched } from '@/features/watched/api/remove-tv-from-watched';
import { Eye, EyeOff } from 'lucide-react';

export const TvWatchedStatus = ({
  tvID,
  isOnWatched,
}: {
  tvID: string;
  isOnWatched: boolean;
}) => {
  const id = tvID;

  const addTvShowToWatchedMutation = useAddTvToWatched({ id: tvID });
  const removeTvShowFromWatchedMutation = useRemoveTvFromWatched({ id: tvID });

  return (
    <div className="flex">
      <div>
        {isOnWatched ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  removeTvShowFromWatchedMutation.mutate(id);
                }}
                disabled={removeTvShowFromWatchedMutation.isPending}
                className="flex items-center"
                size={'icon'}
                variant={'outline'}
              >
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Remove from watched</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  addTvShowToWatchedMutation.mutate(id);
                }}
                disabled={addTvShowToWatchedMutation.isPending}
                className="flex items-center"
                size={'icon'}
                variant={'outline'}
              >
                <EyeOff />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add to watched</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
