import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getProduct, updateProduct } from "../../client/sdk.gen";
import { throwErrorMessage } from "../../utils";
import ProductDetailPage from "../../components/products/ProductDetail";
import { CreateUpdateProductDto } from "../../components/products/CreateUpdateProductDialog";

export const Route = createFileRoute("/products/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [getProduct.name, id],
    queryFn: async () => {
      const { data, error } = await getProduct({ path: { id } });
      if (error) throwErrorMessage(error);
      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (form: CreateUpdateProductDto) => {
      const { error } = await updateProduct({
        path: { id },
        body: form,
      });
      if (error) alert(JSON.stringify(error));
      else {
        refetch();
      }
    },
  });

  if (isLoading) return <p>loading...</p>;

  return data ? (
    <ProductDetailPage {...data} mutate={mutate} />
  ) : (
    <p>{error?.message}</p>
  );
}
