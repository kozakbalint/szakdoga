import { Button } from '@/components/ui/button';
import { useAddMovieToWatched } from '@/features/watched/api/add-movie-to-watched';
import { useRemoveMovieFromWatched } from '@/features/watched/api/remove-movie-from-watched';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Eye, EyeOff } from 'lucide-react';

export const WatchedToggle = ({
  id,
  type,
  isOnWatched,
  addMutation,
  removeMutation,
}: {
  id: string;
  type: string;
  isOnWatched: boolean;
  addMutation: ReturnType<typeof useAddMovieToWatched>;
  removeMutation: ReturnType<typeof useRemoveMovieFromWatched>;
}) => {
  return (
    <div className="flex">
      <div>
        {isOnWatched ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  removeMutation.mutate(id);
                }}
                disabled={removeMutation.isPending}
                className="flex items-center"
                size={'icon'}
                variant={'outline'}
              >
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Remove {type} from watched
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  addMutation.mutate(id);
                }}
                disabled={addMutation.isPending}
                className="flex items-center"
                size={'icon'}
                variant={'outline'}
              >
                <EyeOff />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add {type} to watched</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
