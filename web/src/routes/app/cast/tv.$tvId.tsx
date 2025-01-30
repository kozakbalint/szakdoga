import { ContentLayout } from '@/components/layouts';
import {
  getTvDetailsQueryOptions,
  useGetTvDetails,
} from '@/features/tv/api/get-tv-details';
import {
  getTvCastQueryOptions,
  useGetTvCast,
} from '@/features/cast/api/get-tv-cast';
import { QueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  redirect,
  useParams,
} from '@tanstack/react-router';
import { castTvColumns } from '@/features/cast/components/cast-data-table/tv-cast-columns';
import { CastDataTable } from '@/features/cast/components/cast-data-table/data-table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

const queryClient = new QueryClient();

export const Route = createFileRoute('/app/cast/tv/$tvId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: TvCastRoute,
  loader: async ({ params }) => {
    queryClient.ensureQueryData(getTvDetailsQueryOptions({ id: params.tvId }));
    queryClient.ensureQueryData(getTvCastQueryOptions({ id: params.tvId }));
  },
});

function TvCastRoute() {
  const params = useParams({ strict: false });
  const tvId = params.tvId as string;

  const tvQuery = useGetTvDetails({ id: tvId });
  const tvCastQuery = useGetTvCast({ id: tvId });

  if (tvCastQuery.isLoading || tvQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const tv = tvQuery.data?.tv;
  const cast = tvCastQuery.data?.cast;

  if (!cast || !tv) {
    return <div>Cast not found</div>;
  }

  return (
    <>
      <ContentLayout head={tv.name + ' Cast'}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-2xl text-primary hover:underline">
              <Link to={`/app/tv/` + `${tvId}`}>{tv.name}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary">
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-2xl text-primary">
              Cast
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CastDataTable columns={castTvColumns} data={cast} isTv={true} />
      </ContentLayout>
    </>
  );
}
