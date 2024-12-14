import { Button } from '@/components/ui/button';
import { useAddMovieToWatched } from '@/features/watched/movies/api/add-movie-to-watched';
import { useRemoveMovieFromWatched } from '@/features/watched/movies/api/remove-movie-from-watched';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Eye, EyeOff } from 'lucide-react';

export const MovieWatched = ({
  movieID,
  watchedDates,
}: {
  movieID: string;
  watchedDates: string[];
}) => {
  const id = movieID;
  const isWatched = watchedDates.length > 0;

  const addMovieToWatchedMutation = useAddMovieToWatched();
  const removeMovieFromWatchedMutation = useRemoveMovieFromWatched();

  return (
    <div className="flex">
      <div>
        {isWatched ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  removeMovieFromWatchedMutation.mutate({
                    id: Number(id),
                  });
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
                  addMovieToWatchedMutation.mutate({ movie_id: Number(id) });
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
