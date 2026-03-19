import { createFileRoute } from "@tanstack/react-router";
import ManageCategoriesPage from "../../components/categories/CategoriesPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCategory,
  queryCategories,
  updateCategory,
} from "../../client/sdk.gen";
import { throwErrorMessage } from "../../utils";
import { CreateUpdateCategoryDto } from "../../client/types.gen";

export const Route = createFileRoute("/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, refetch } = useQuery({
    queryKey: [queryCategories.name],
    queryFn: async ({ signal }) => {
      const { data, error } = await queryCategories({ signal });
      if (error) throwErrorMessage(error);
      return data;
    },
    placeholderData: [],
  });

  const { mutate: mutateCreateCategory } = useMutation({
    mutationFn: async (form: CreateUpdateCategoryDto) => {
      const { error } = await createCategory({ body: form });
      if (error) alert(JSON.stringify(error));
      else {
        refetch();
      }
    },
  });

  const { mutate: mutateUpdateCategory } = useMutation({
    mutationFn: async (form: { id: number; data: CreateUpdateCategoryDto }) => {
      const { error } = await updateCategory({
        path: { id: form.id },
        body: form.data,
      });
      if (error) alert(JSON.stringify(error));
      else {
        refetch();
      }
    },
  });

  return (
    <ManageCategoriesPage
      data={data!}
      onCreate={mutateCreateCategory}
      onUpdate={mutateUpdateCategory}
    />
  );
}
