"use client";

import { EditProductForm } from "@/components/dashboard/EditProductForm";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";

interface Props {
	params: { itemId: string };
}
export default function EditItemPage({ params }: Props) {
	const itemId = params.itemId;

	const {
		data: product,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["editProduct", itemId],
		queryFn: async () => {
			const response = await fetch(`/api/product/${itemId}`);
			return await response.json();
		},
		select: (productResponse) => productResponse.payload,
	});

	if (isLoading) return <Loader />;
	if (error) return <>Error loading item.</>;
	if (!product) return <>Product not found.</>;
	return <EditProductForm product={product} />;
}
