import { ContentLayout } from '@/components/layouts';
import {
  getTvByIdQueryOptions,
  useGetTvById,
} from '@/features/tv/api/get-tv-by-id';
import { TvView } from '@/features/tv/components/tv-view';
import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

export const tvLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.tvId as string;

    const tvQuery = getTvByIdQueryOptions({ id });

    const tv =
      queryClient.getQueryData(tvQuery.queryKey) ??
      (await queryClient.fetchQuery(tvQuery));

    return { tv };
  };

export const TvRoute = () => {
  const params = useParams();
  const tvId = params.tvId as string;
  const tvQuery = useGetTvById({ id: tvId });

  if (tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  if (!tv) {
    return <div>Tv Show not found</div>;
  }

  return (
    <>
      <ContentLayout head={tv.name}>
        <TvView tvId={tvId} />
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
