import { ContentLayout } from '@/components/layouts'
import {
  getPersonByIdQueryOptions,
  useGetPersonById,
} from '@/features/people/api/get-person-by-id'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { QueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useParams } from '@tanstack/react-router'

const queryClient = new QueryClient()

export const Route = createFileRoute('/app/people/$personId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      })
    }
  },
  component: PersonRoute,
  loader: async ({ params }) => {
    queryClient.ensureQueryData(
      getPersonByIdQueryOptions({ id: params.personId }),
    )
  },
})

function PersonRoute() {
  const params = useParams({ strict: false })
  const personId = params.personId as string
  const personQuery = useGetPersonById({ id: personId })

  if (personQuery.isLoading) {
    return <div>Loading...</div>
  }

  const person = personQuery.data?.person
  if (!person) {
    return <div>Person not found</div>
  }

  return (
    <>
      <ContentLayout head={person.name}>
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
  )
}
