import { useState } from "react";
import {
  CreateUpdateProductDto,
  CreateUpdateProductDialog,
} from "./CreateUpdateProductDialog";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "../../client/sdk.gen";

export function CreateProductButton({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(1);

  const { mutate } = useMutation({
    mutationFn: async (form: CreateUpdateProductDto) => {
      const { error } = await createProduct({
        body: form,
      });
      if (error) alert(JSON.stringify(error));
      else {
        refetch();
        setKey((prev) => ++prev);
      }
    },
  });

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-1 rounded-xl text-sm font-medium bg-amber-500 text-stone-900 hover:bg-amber-400 transition-colors"
      >
        Add Product
      </button>

      <CreateUpdateProductDialog
        key={key}
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data) => mutate(data)}
        product={{
          customAttributes: "{}",
          description: "",
          name: "",
          price: 0,
          categoryId: 1,
          Image: undefined,
          imagePath: undefined,
        }}
      />
    </div>
  );
}
