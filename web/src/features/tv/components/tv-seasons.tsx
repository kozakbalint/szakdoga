import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  getTvSeasonByIdQueryOptions,
  useGetTvSeasonById,
} from '../api/get-tv-season-by-id';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetTvById } from '../api/get-tv-by-id';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const TvSeasons = ({ tvId }: { tvId: string }) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const queryClient = useQueryClient();
  const tvQuery = useGetTvById({ id: tvId });
  const tvSeasonQuery = useGetTvSeasonById({
    id: tvId,
    seasonId: selectedSeason.toString(),
  });

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
      getTvSeasonByIdQueryOptions({
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
          {Array.from({ length: tv.number_of_seasons }, (_, i) => i + 1).map(
            (seasonNumber) => (
              <SelectItem
                key={seasonNumber}
                value={seasonNumber.toString()}
                onMouseEnter={() => {
                  prefetchNextSeason(tvId, seasonNumber);
                }}
              >
                Season {seasonNumber}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
      <div className="flex flex-col items-center gap-2 h-96 overflow-scroll">
        {season.season.episodes.map((episode) => (
          <Link
            to={`/app/episode/${tvId}/${season.season.season_number}/${episode.episode_number}`}
            className="hover:underline w-full"
            key={episode.episode_number}
          >
            <Card
              key={episode.episode_number}
              className="flex flex-col h-4/5 w-full md:flex-row md:h-32"
            >
              <CardHeader className="p-0 min-w-fit">
                <img
                  src={episode.still_url}
                  alt={episode.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              </CardHeader>
              <CardContent className="py-2 w-full">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 font-bold text-lg md:text-xl">
                      <div>{episode.episode_number}.</div>
                      <div className="line-clamp-2">{episode.name}</div>
                    </div>
                    <div className="line-clamp-2 lg:line-clamp-3">
                      {episode.overview}
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-2 flex-grow justify-center lg:justify-end">
                    <Button size={'icon'} variant={'default'}></Button>
                    <Button size={'icon'} variant={'default'}></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
