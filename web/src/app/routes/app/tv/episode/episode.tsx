import { ContentLayout } from '@/components/layouts';
import { EpisodeView } from '@/features/tv/components/episode-view';
import {
  getTvEpisodeByIdQueryOptions,
  useGetTvEpisodeById,
} from '@/features/tv/api/get-tv-episode-by-id';
import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

export const episodeLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const tvId = params.tvId as string;
    const seasonNumber = params.seasonNumber as string;
    const episodeNumber = params.episodeNumber as string;

    const episodeQuery = getTvEpisodeByIdQueryOptions({
      id: tvId,
      seasonId: seasonNumber,
      episodeId: episodeNumber,
    });

    const episode =
      queryClient.getQueryData(episodeQuery.queryKey) ??
      (await queryClient.fetchQuery(episodeQuery));

    return { episode };
  };

export const EpisodeRoute = () => {
  const params = useParams();
  const tvId = params.tvId as string;
  const seasonNumber = params.seasonNumber as string;
  const episodeNumber = params.episodeNumber as string;
  const episodeQuery = useGetTvEpisodeById({
    id: tvId,
    seasonId: seasonNumber,
    episodeId: episodeNumber,
  });

  if (episodeQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const episode = episodeQuery.data?.episode;
  if (!episode) {
    return <div>Episode not found</div>;
  }

  return (
    <>
      <ContentLayout head={episode.episode.name}>
        <EpisodeView />
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
