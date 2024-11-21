import { ContentLayout } from '@/components/layouts';
import {
  getTvByIdQueryOptions,
  useGetTvById,
} from '@/features/tv/api/get-tv-by-id';
import {
  getTvSeasonsByIdQueryOptions,
  useGetTvSeasonsById,
} from '@/features/tv/api/get-tv-seasons-by-id';
import { SeasonsView } from '@/features/tv/components/seasons-view';
import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

export const seasonsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.tvId as string;

    const tvQuery = getTvByIdQueryOptions({ id });
    const seasonsQuery = getTvSeasonsByIdQueryOptions({ id });

    const tv =
      queryClient.getQueryData(tvQuery.queryKey) ??
      (await queryClient.fetchQuery(tvQuery));

    const seasons =
      queryClient.getQueryData(seasonsQuery.queryKey) ??
      (await queryClient.fetchQuery(seasonsQuery));

    return { seasons, tv };
  };

export const SeasonsRoute = () => {
  const params = useParams();
  const tvId = params.tvId as string;
  const tvQuery = useGetTvById({ id: tvId });
  const seasonsQuery = useGetTvSeasonsById({ id: tvId });

  if (tvQuery.isLoading || seasonsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const seasons = seasonsQuery.data?.seasons;
  if (!tv || !seasons) {
    return <div>Seasons not found</div>;
  }

  return (
    <>
      <ContentLayout head={tv.name + 'Seasons'}>
        <SeasonsView id={tvId} />
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
