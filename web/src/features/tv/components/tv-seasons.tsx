import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  SeasonWatchedToggle,
  SuspenseWatchedToggle,
} from '@/features/watched/components/watchedtoggle';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
  getTvSeasonDetailsQueryOptions,
  useGetTvSeasonDetails,
} from '../api/get-tv-season-details';
import { SuspenseTvEpisodeItem, TvEpisodeItem } from './tv-episode-item';
import { TvDetails } from '@/types/types.gen';

export const TvSeasons = ({
  tvId,
  data,
}: {
  tvId: string;
  data: TvDetails;
}) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const queryClient = useQueryClient();
  const tvSeasonQuery = useGetTvSeasonDetails({
    id: tvId,
    seasonId: selectedSeason.toString(),
  });

  if (tvSeasonQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = data;
  const season = tvSeasonQuery.data?.season;

  if (!tv || !season) {
    return <div>Seasons not found</div>;
  }

  const prefetchNextSeason = async (tvId: string, seasonNumber: number) => {
    queryClient.prefetchQuery(
      getTvSeasonDetailsQueryOptions({
        id: tvId,
        seasonId: seasonNumber.toString(),
      }),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`/app/seasons/` + tvId}
        resetScroll={true}
        className="hover:underline"
      >
        <div className="flex flex-row place-items-center gap-1">
          <p className="text-2xl font-bold">
            Seasons{' '}
            <span className="text-xl font-thin">({tv.number_of_seasons})</span>
          </p>
          <ChevronRight size={32} className="align-baseline" />
        </div>
      </Link>
      <div className="flex justify-between">
        <div>
          <Select
            onValueChange={(value) => {
              const seasonNumber = parseInt(value);
              setSelectedSeason(seasonNumber);
            }}
          >
            <SelectTrigger className="w-[180px]">
              Season {selectedSeason}
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: tv.number_of_seasons },
                (_, i) => i + 1,
              ).map((seasonNumber) => (
                <SelectItem
                  key={seasonNumber}
                  value={seasonNumber.toString()}
                  onMouseEnter={() => {
                    prefetchNextSeason(tvId, seasonNumber);
                  }}
                >
                  Season {seasonNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <SeasonWatchedToggle
            key={selectedSeason}
            id={tvId}
            seasonNumber={selectedSeason.toString()}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 h-96 overflow-scroll">
        {season.episodes.map((episode, index) => (
          <TvEpisodeItem
            key={index}
            episode={episode}
            tvId={tvId}
            seasonNumber={selectedSeason}
            episodeNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export const SuspenseTvSeasons = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row place-items-center gap-1">
        <p className="text-2xl font-bold">Seasons</p>
        <ChevronRight size={32} className="align-baseline" />
      </div>
      <div className="flex justify-between">
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">Season 1</SelectTrigger>
            <SelectContent>
              <SelectItem value="season-1">Season 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <SuspenseWatchedToggle />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 h-96 overflow-scroll">
        {[...Array(10)].map((_, index) => (
          <SuspenseTvEpisodeItem key={index} index={index + 1} />
        ))}
      </div>
    </div>
  );
};
