import { ContentLayout } from '@/components/layouts';
import { EpisodeView } from '@/features/tv/components/episode-view';
import {
  getTvEpisodeDetailsQueryOptions,
  useGetTvEpisodeDetails,
} from '@/features/tv/api/get-tv-episode-details';
import { ErrorBoundary } from 'react-error-boundary';
import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { useGetTvDetails } from '@/features/tv/api/get-tv-details';

const queryClient = new QueryClient();

export const Route = createFileRoute('/app/episode/$tvId/$seasonId/$episodeId')(
  {
    beforeLoad: async ({ context, location }) => {
      if (context.auth.data === null) {
        throw redirect({
          to: '/auth/login',
          search: { redirect: location.pathname },
        });
      }
    },
    component: EpisodeRoute,
    loader: async ({ params }) => {
      queryClient.ensureQueryData(
        getTvEpisodeDetailsQueryOptions({
          id: params.tvId,
          seasonId: params.seasonId,
          episodeId: params.episodeId,
        }),
      );
    },
  },
);

function EpisodeRoute() {
  const params = useParams({ strict: false });
  const tvId = params.tvId as string;
  const seasonNumber = params.seasonId as string;
  const episodeNumber = params.episodeId as string;
  const tvQuery = useGetTvDetails({
    id: tvId,
  });
  const episodeQuery = useGetTvEpisodeDetails({
    id: tvId,
    seasonId: seasonNumber,
    episodeId: episodeNumber,
  });

  if (episodeQuery.isLoading || tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const episode = episodeQuery.data?.episode;
  if (!episode || !tv) {
    return <div>Episode not found</div>;
  }

  return (
    <>
      <ContentLayout head={`${tv.name}: S${seasonNumber}:E${episodeNumber}`}>
        <EpisodeView
          id={tvId}
          seasonId={seasonNumber}
          episodeId={episodeNumber}
        />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load the episode. Try to refresh the page.</div>
            }
          ></ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  );
}
