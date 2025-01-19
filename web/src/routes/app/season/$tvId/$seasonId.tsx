import { ContentLayout } from '@/components/layouts'
import { SeasonView } from '@/features/tv/components/season-view'
import { QueryClient } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import {
  getTvSeasonDetailsQueryOptions,
  useGetTvSeasonDetails,
} from '@/features/tv/api/get-tv-season-details'
import { createFileRoute, redirect, useParams } from '@tanstack/react-router'

const queryClient = new QueryClient()

export const Route = createFileRoute('/app/season/$tvId/$seasonId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      })
    }
  },
  component: SeasonRoute,
  loader: async ({ params }) => {
    queryClient.ensureQueryData(
      getTvSeasonDetailsQueryOptions({
        id: params.tvId,
        seasonId: params.seasonId,
      }),
    )
  },
})

function SeasonRoute() {
  const params = useParams({ strict: false })
  const tvId = params.tvId as string
  const seasonId = params.seasonId as string
  const seasonQuery = useGetTvSeasonDetails({
    id: tvId,
    seasonId: seasonId,
  })

  if (seasonQuery.isLoading) {
    return <div>Loading...</div>
  }

  const season = seasonQuery.data?.season
  if (!season) {
    return <div>Episode not found</div>
  }

  return (
    <>
      <ContentLayout head={season.name}>
        <SeasonView id={tvId} seasonId={seasonId} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load the season. Try to refresh the page.</div>
            }
          ></ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  )
}
