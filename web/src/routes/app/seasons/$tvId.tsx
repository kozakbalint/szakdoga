import { ContentLayout } from '@/components/layouts'
import {
  getTvByIdQueryOptions,
  useGetTvById,
} from '@/features/tv/api/get-tv-by-id'
import {
  getTvSeasonsByIdQueryOptions,
  useGetTvSeasonsById,
} from '@/features/tv/api/get-tv-seasons-by-id'
import { SeasonsView } from '@/features/tv/components/seasons-view'
import { QueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useParams } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'

const queryClient = new QueryClient()

export const Route = createFileRoute('/app/seasons/$tvId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      })
    }
  },
  component: SeasonsRoute,
  loader: async ({ params }) => {
    queryClient.ensureQueryData(getTvByIdQueryOptions({ id: params.tvId }))
    queryClient.ensureQueryData(
      getTvSeasonsByIdQueryOptions({ id: params.tvId }),
    )
  },
})

function SeasonsRoute() {
  const params = useParams({ strict: false })
  const tvId = params.tvId as string
  const tvQuery = useGetTvById({ id: tvId })
  const seasonsQuery = useGetTvSeasonsById({ id: tvId })

  if (tvQuery.isLoading || seasonsQuery.isLoading) {
    return <div>Loading...</div>
  }

  const tv = tvQuery.data?.tv
  const seasons = seasonsQuery.data?.seasons
  if (!tv || !seasons) {
    return <div>Seasons not found</div>
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
  )
}
