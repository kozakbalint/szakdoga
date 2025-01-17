import { Button } from '@/components/ui/button';
import { useAddMovieToWatched } from '@/features/watched/api/add-movie-to-watched';
import { useRemoveMovieFromWatched } from '@/features/watched/api/remove-movie-from-watched';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Eye, EyeOff } from 'lucide-react';

export const MovieWatchedStatus = ({
  movieID,
  isOnWatched,
}: {
  movieID: string;
  isOnWatched: boolean;
}) => {
  const id = movieID;

  const addMovieToWatchedMutation = useAddMovieToWatched({ id });
  const removeMovieFromWatchedMutation = useRemoveMovieFromWatched({ id });

  return (
    <div className="flex">
      <div>
        {isOnWatched ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  removeMovieFromWatchedMutation.mutate(id);
                }}
                disabled={addMovieToWatchedMutation.isPending}
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
                  addMovieToWatchedMutation.mutate(id);
                }}
                disabled={addMovieToWatchedMutation.isPending}
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
