import { ContentLayout } from '@/components/layouts';
import {
  getTvDetailsQueryOptions,
  useGetTvDetails,
} from '@/features/tv/api/get-tv-details';
import { SeasonsView } from '@/features/tv/components/seasons-view';
import { QueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient();

export const Route = createFileRoute('/app/seasons/$tvId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: SeasonsRoute,
  loader: async ({ params }) => {
    queryClient.ensureQueryData(getTvDetailsQueryOptions({ id: params.tvId }));
  },
});

function SeasonsRoute() {
  const params = useParams({ strict: false });
  const tvId = params.tvId as string;
  const tvQuery = useGetTvDetails({ id: tvId });

  if (tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  if (!tv) {
    return <div>Seasons not found</div>;
  }

  return (
    <>
      <ContentLayout head={tv.name + 'Seasons'}>
        <SeasonsView id={tvId} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load the seasons. Try to refresh the page.</div>
            }
          ></ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  );
}
