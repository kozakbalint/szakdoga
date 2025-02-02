import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Eye, EyeOff } from 'lucide-react';

export const WatchedToggle = ({
  type,
  isOnWatched,
  disabled,
  addOnClicked,
  removeOnClicked,
}: {
  type: string;
  isOnWatched: boolean;
  disabled: boolean;
  addOnClicked: () => void;
  removeOnClicked: () => void;
}) => {
  return (
    <div className="flex">
      <div>
        {isOnWatched ? (
          <Tooltip>
            <TooltipTrigger asChild className="cursor-pointer">
              <Button
                onClick={removeOnClicked}
                disabled={disabled}
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
            <TooltipTrigger asChild className="cursor-pointer">
              <Button
                onClick={addOnClicked}
                disabled={disabled}
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

export const SuspenseWatchedToggle = () => {
  return (
    <Button className="flex items-center" size={'icon'} variant={'outline'}>
      <Eye />
    </Button>
  );
};
