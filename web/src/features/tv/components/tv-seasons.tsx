import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useGetTvSeasonsById } from '../api/get-tv-seasons-by-id';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TvSeasons = ({ tvId }: { tvId: string }) => {
  const tvSeasonsQuery = useGetTvSeasonsById({ id: tvId });
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  if (tvSeasonsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const seasons = tvSeasonsQuery.data?.seasons;

  if (!seasons) {
    return <div>Providers not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row place-items-center gap-2">
        <div className="text-2xl font-bold">Seasons</div>
        <div className="text-xl font-thin">({seasons.number_of_seasons})</div>
      </div>
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
          {seasons.seasons.map((season) => (
            <SelectItem
              key={season.season_number}
              value={season.season_number.toString()}
            >
              {season.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-2 max-h-96 overflow-scroll">
        {seasons.seasons[selectedSeason - 1].episodes.map((episode) => (
          <Card className="flex flex-row h-32 w-full">
            <CardHeader className="p-0 min-w-fit">
              <img
                src={episode.still_url}
                alt={episode.name}
                className="h-full w-full rounded-xl"
              />
            </CardHeader>
            <CardContent className="py-2 w-full">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <div className="flex flex-row gap-2 font-bold text-xl">
                    <div>{episode.episode_number}.</div>
                    <div>{episode.name}</div>
                  </div>
                  <div className="line-clamp-3">{episode.overview}</div>
                </div>
                <div className="flex flex-row gap-2 flex-grow justify-end">
                  <Button size={'icon'} variant={'default'}></Button>
                  <Button size={'icon'} variant={'default'}></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
