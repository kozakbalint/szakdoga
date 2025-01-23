import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  EpisodeWatchedToggle,
  SeasonWatchedToggle,
} from '@/components/ui/watchedtoggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useGetTvDetails } from '../api/get-tv-details';
import {
  getTvSeasonDetailsQueryOptions,
  useGetTvSeasonDetails,
} from '../api/get-tv-season-details';

export const TvSeasons = ({ tvId }: { tvId: string }) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const queryClient = useQueryClient();
  const tvQuery = useGetTvDetails({ id: tvId });
  const tvSeasonQuery = useGetTvSeasonDetails({
    id: tvId,
    seasonId: selectedSeason.toString(),
  });
  const isMobile = useIsMobile();

  const imgWidth = isMobile ? 300 : 200;
  const imgHeight = isMobile ? 100 : 100;

  if (tvQuery.isLoading || tvSeasonQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const season = tvSeasonQuery.data?.season;

  if (!tv || !season) {
    return <div>Providers not found</div>;
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
      <Link to={`/app/seasons/${tvId}`} className="hover:underline">
        <div className="flex flex-row place-items-center gap-2">
          <div className="text-2xl font-bold">Seasons</div>
          <div className="text-xl font-thin">({tv.number_of_seasons})</div>
          <ChevronRight size={24} />
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
          <Card key={index} className="shadow-md w-full">
            <div className="flex flex-col sm:flex-row gap-4 p-2 sm:p-0 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={episode.still_url}
                  alt={episode.name}
                  width={imgWidth}
                  height={imgHeight}
                  className="rounded-xl object-cover self-center sm:self-center justify-center"
                />
                <div className="flex flex-col py-2 sm:py-0">
                  <div>
                    <CardTitle className="text-lg font-bold sm:pt-2 line-clamp-1 flex gap-2">
                      {index + 1 + '. '}
                      {episode.name}
                    </CardTitle>
                    <CardContent className="text-sm text-gray-700 py-2 sm:py-0 pb-0 px-0 line-clamp-3">
                      {episode.overview}
                    </CardContent>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 p-2 sm:p-4">
                <EpisodeWatchedToggle
                  id={tvId}
                  seasonNumber={selectedSeason.toString()}
                  episodeNumber={(index + 1).toString()}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
