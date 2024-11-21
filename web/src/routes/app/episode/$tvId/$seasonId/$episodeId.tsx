import { ContentLayout } from '@/components/layouts'
import { EpisodeView } from '@/features/tv/components/episode-view'
import {
  getTvEpisodeByIdQueryOptions,
  useGetTvEpisodeById,
} from '@/features/tv/api/get-tv-episode-by-id'
import { ErrorBoundary } from 'react-error-boundary'
import { createFileRoute, redirect, useParams } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const Route = createFileRoute('/app/episode/$tvId/$seasonId/$episodeId')(
  {
    beforeLoad: async ({ context, location }) => {
      if (context.auth.data === null) {
        throw redirect({
          to: '/auth/login',
          search: { redirect: location.pathname },
        })
      }
    },
    component: EpisodeRoute,
    loader: async ({ params }) => {
      queryClient.ensureQueryData(
        getTvEpisodeByIdQueryOptions({
          id: params.tvId,
          seasonId: params.seasonId,
          episodeId: params.episodeId,
        }),
      )
    },
  },
)

function EpisodeRoute() {
  const params = useParams({ strict: false })
  const tvId = params.tvId as string
  const seasonNumber = params.seasonId as string
  const episodeNumber = params.episodeId as string
  const episodeQuery = useGetTvEpisodeById({
    id: tvId,
    seasonId: seasonNumber,
    episodeId: episodeNumber,
  })

  if (episodeQuery.isLoading) {
    return <div>Loading...</div>
  }

  const episode = episodeQuery.data?.episode
  if (!episode) {
    return <div>Episode not found</div>
  }

  return (
    <>
      <ContentLayout head={episode.episode.name}>
        <EpisodeView
          id={tvId}
          seasonId={seasonNumber}
          episodeId={episodeNumber}
        />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load the movie. Try to refresh the page.</div>
            }
          ></ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  )
}
