import { ContentLayout } from '@/components/layouts';
import {
  getTvByIdQueryOptions,
  useGetTvById,
} from '@/features/tv/api/get-tv-by-id';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { QueryClient } from '@tanstack/react-query';
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
    return <div>Movie not found</div>;
  }

  return (
    <>
      <ContentLayout title={tv.name}>
        <div className="flex gap-4">
          <div className="w-1/3">
            <AspectRatio ratio={2 / 3}>
              <img
                src={tv.poster_url}
                alt={tv.name}
                className="w-full h-full object-cover rounded-md"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-2 w-2/3">
            <h1 className="text-2xl font-bold">
              {tv.name}{' '}
              <span className="text-xl font-normal">
                ({tv.first_air_date.slice(0, 4)})
              </span>
            </h1>
            <p>{tv.overview}</p>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};
