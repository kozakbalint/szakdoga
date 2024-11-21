import { ContentLayout } from '@/components/layouts';
import { createFileRoute, redirect, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/app/categories/$categoryId')({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.data === null) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: CategoriesRoute,
});

function CategoriesRoute() {
  const params = useParams({ strict: false });
  const categoryId = params.categoryId;

  return (
    <>
      <ContentLayout title="Categories" head="Categories">
        <div>Categories</div>
        <div>
          <h1>Category ID: {categoryId}</h1>
        </div>
      </ContentLayout>
    </>
  );
}
