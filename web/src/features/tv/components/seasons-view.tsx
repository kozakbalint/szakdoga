import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useGetTvDetails } from '../api/get-tv-details';
import { TvSeasonItem } from './tv-season-item';
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const SeasonsView = ({ id }: { id: string }) => {
  const tvQuery = useGetTvDetails({ id });

  if (tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;

  if (!tv) {
    return <div>No seasons found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-2xl text-primary hover:underline">
            <Link to={`/app/tv/` + `${id}`}>{tv.name}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primary">
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem className="text-2xl text-primary">
            Seasons
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {tv.seasons.map((season, index) => (
        <TvSeasonItem
          key={index + 1}
          season={season}
          tvId={id}
          seasonNumber={index + 1}
        />
      ))}
    </div>
  );
};
