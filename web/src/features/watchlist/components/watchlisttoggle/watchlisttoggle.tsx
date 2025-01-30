import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAddMovieToWatchlist } from '@/features/watchlist/api/add-movie-to-watchlist';
import { useRemoveMovieFromWatchlist } from '@/features/watchlist/api/remove-movie-from-watchlist';

export const WatchlistToggle = ({
  id,
  type,
  isOnWatchlist,
  addMutatuion,
  removeMutation,
}: {
  id: string;
  type: string;
  isOnWatchlist: boolean;
  addMutatuion: ReturnType<typeof useAddMovieToWatchlist>;
  removeMutation: ReturnType<typeof useRemoveMovieFromWatchlist>;
}) => {
  return (
    <div>
      {isOnWatchlist ? (
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <Button
              onClick={() => {
                removeMutation.mutate(id);
              }}
              disabled={removeMutation.isPending}
              className="flex items-center fill-primary"
              size={'icon'}
              variant={'outline'}
            >
              <Bookmark fill="primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Remove {type} from watchlist
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <Button
              onClick={() => {
                addMutatuion.mutate(id);
              }}
              disabled={addMutatuion.isPending}
              className="flex items-center"
              size={'icon'}
              variant={'outline'}
            >
              <Bookmark fill="none" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Add {type} to watchlist</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
