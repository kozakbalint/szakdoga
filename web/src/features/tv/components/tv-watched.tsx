import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useAddTvShowToWatched } from '@/features/watched/tv/api/add-tv-show-to-watched';
import { useRemoveTvShowFromWatched } from '@/features/watched/tv/api/remove-tv-show-watched';
import { Eye, EyeOff } from 'lucide-react';

export const TvWatched = ({
  tvID,
  watchedDates,
}: {
  tvID: string;
  watchedDates: string[];
}) => {
  const id = tvID;
  const isWatched = watchedDates.length > 0;

  const addTvShowToWatchedMutation = useAddTvShowToWatched();
  const removeTvShowFromWatchedMutation = useRemoveTvShowFromWatched();

  return (
    <div className="flex">
      <div>
        {isWatched ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  removeTvShowFromWatchedMutation.mutate({
                    id: Number(id),
                  });
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
                  addTvShowToWatchedMutation.mutate({ tv_id: Number(id) });
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
