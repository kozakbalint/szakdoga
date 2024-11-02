import { ContentLayout } from '@/components/layouts';
import {
  getPersonByIdQueryOptions,
  useGetPersonById,
} from '@/features/people/api/get-person-by-id';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

export const personLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.personId as string;

    const personQuery = getPersonByIdQueryOptions({ id });

    const person =
      queryClient.getQueryData(personQuery.queryKey) ??
      (await queryClient.fetchQuery(personQuery));

    return { person };
  };

export const PersonRoute = () => {
  const params = useParams();
  const personId = params.personId as string;
  const personQuery = useGetPersonById({ id: personId });

  if (personQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const person = personQuery.data?.person;
  if (!person) {
    return <div>Person not found</div>;
  }

  return (
    <>
      <ContentLayout title={person.name}>
        <div className="flex gap-4">
          <div className="w-1/3">
            <AspectRatio ratio={2 / 3}>
              <img
                src={person.profile_url}
                alt={person.name}
                className="w-full h-full object-cover rounded-md"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-2 w-2/3">
            <h1 className="text-2xl font-bold">
              {person.name}{' '}
              <span className="text-xl font-normal">
                ({person.birthday.slice(0, 4)})
              </span>
            </h1>
            <p>{person.biography}</p>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};
