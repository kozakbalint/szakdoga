import { ContentLayout } from '@/components/layouts';
import { SeasonView } from '@/features/tv/components/season-view';
import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import {
  getTvSeasonByIdQueryOptions,
  useGetTvSeasonById,
} from '@/features/tv/api/get-tv-season-by-id';

export const seasonLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const tvId = params.tvId as string;
    const seasonNumber = params.seasonNumber as string;

    const seasonQuery = getTvSeasonByIdQueryOptions({
      id: tvId,
      seasonId: seasonNumber,
    });

    const season =
      queryClient.getQueryData(seasonQuery.queryKey) ??
      (await queryClient.fetchQuery(seasonQuery));

    return { season };
  };

export const SeasonRoute = () => {
  const params = useParams();
  const tvId = params.tvId as string;
  const seasonNumber = params.seasonNumber as string;
  const seasonQuery = useGetTvSeasonById({
    id: tvId,
    seasonId: seasonNumber,
  });

  if (seasonQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const season = seasonQuery.data?.season;
  if (!season) {
    return <div>Episode not found</div>;
  }

  return (
    <>
      <ContentLayout head={season.season.name}>
        <SeasonView id={tvId} seasonId={seasonNumber} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load the movie. Try to refresh the page.</div>
            }
          ></ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  );
};
