import { ContentLayout } from '@/components/layouts';
import { useParams } from 'react-router-dom';

export const CategoriesRoute = () => {
  const params = useParams();
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
};
