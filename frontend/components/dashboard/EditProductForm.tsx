"use client";

import TextLoader from "@/components/ui/TextLoader";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUpload } from "./ImagesUpload";
import { BrandInput } from "./BrandInput";
import { Item } from "@/types/types";
import Link from "next/link";
import { DiscountInput } from "./DiscountInput";
import { PageInput } from "./PageInput";
import { useRouter } from "next/navigation";
import { ColorSizeInput } from "./ColorSizeInput";

export interface IFormInputs {
	title: string;
	pageId: string;
	brand: string;
	price: number;
	discount: number;
	discount_type: "dollar" | "percent";
	description: string;
	material: string;
	isPreorder: boolean;
	hidden: boolean;
	imageURLs: string;
	colorSizeArr: {
		color: string;
		sizes: { size: string; quantity: number }[];
	}[];
}
interface Body {
	title: string;
	pageId: number;
	brand: string;
	price: number;
	discount: number;
	discount_type: "dollar" | "percent";
	description: string;
	material: string;
	isPreorder: boolean;
	hidden: boolean;
	imageURLs: string[];
	colorSizeArr: {
		color: string;
		sizes: { size: string; quantity: number }[];
	}[];
}
type AuthResponse = {
	hasError: boolean;
	errorMessage: string;
};

export function EditProductForm({ product }: { product: Item }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	const form = useForm<IFormInputs>({
		defaultValues: {
			brand: product.name,
			pageId: product.page_id.toString(),
			title: product.title,
			price: product.price,
			discount: product.discount,
			discount_type: product.discount_type,
			material: product.material,
			description: product.description,
			imageURLs: product.images?.map(({ url }) => url).join("\n\n"),
			isPreorder: product.is_preorder === 0 ? false : true,
			hidden: product.hidden === 0 ? false : true,
		},
	});
	const onSubmit: SubmitHandler<IFormInputs> = async (formData, event) => {
		try {
			event?.preventDefault();
			setIsLoading(true);
			setMessage("");

			const body: Body = {
				title: formData.title,
				pageId: parseInt(formData.pageId),
				brand: formData.brand,
				price: Number(formData.price),
				discount: formData.discount ? Number(formData.discount) : 0,
				discount_type: formData.discount_type,
				description: formData.description,
				material: formData.material,
				isPreorder: formData.isPreorder,
				hidden: formData.hidden,
				imageURLs: formData.imageURLs
					.split("\n\n")
					.map((url) => url.trim()),
				colorSizeArr: formData.colorSizeArr
					.filter(({ color }) => color.trim().length !== 0)
					.map((colorSize) => ({
						...colorSize,
						sizes: colorSize.sizes.filter(
							({ quantity }) => quantity > 0
						),
					})),
			};

			const res = await fetch(`/api/product/${product.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			const data: AuthResponse = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);
			toast.success("Product saved successfully");
			setIsLoading(false);
		} catch (error: any) {
			setIsLoading(false);
			toast.error(error.message);
		}
	};
	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
	} = form;
	const salePrice =
		watch("discount_type") === "dollar"
			? watch("price") - watch("discount")
			: watch("price") - (watch("discount") / 100) * watch("price");

	const deleteProduct = async () => {
		try {
			if (
				!confirm(
					"Are you sure you want to delete this product? This action cannot be reverted!"
				)
			)
				return;

			const data = await (
				await fetch(`/api/product/${product.id}`, {
					method: "DELETE",
				})
			).json();
			if (data.hasError) throw new Error(data.errorMessage);
			toast.success("Product deleted successfully");
			router.push("/dashboard/products");
		} catch (error: any) {
			toast.error(error.message || "Error deleting product");
		}
	};

	return (
		<>
			<form
				className="drop-shadow-lg bg-white border-black p-5 rounded-lg max-w-[900px] mx-auto"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Link
					className="underline underline-offset-4 block w-fit pb-5"
					href="/dashboard/products"
				>
					Back
				</Link>

				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold">Edit Product</h2>
						<p className="text-sm pb-5 text-slate-600">
							Last edited by: {product.last_edited_by_username}
						</p>
					</div>
					<button
						className="bg-red-700 p-2 rounded-lg text-white font-bold"
						type="button"
						onClick={deleteProduct}
					>
						Delete product
					</button>
				</div>

				<div className="pb-3">
					<label className="block font-bold" htmlFor="brand">
						Page
					</label>
					<p className="text-sm text-slate-600 pb-1">
						Please select a page to add this item
					</p>
					<PageInput form={form} />
				</div>

				<div className="pb-3">
					<label className="block font-bold" htmlFor="brand">
						Brand Name
						<RequiredAsterisk />
					</label>
					<sub className="text-sm pb-3 text-slate-600 block italic">
						New brand will be added automatically after submit
					</sub>
					<BrandInput form={form} />
					{errors.brand && (
						<p className="text-red-500 italic font-bold">
							Brand is required
						</p>
					)}
				</div>

				<div className="pb-3">
					<label className="block mb-1 font-bold" htmlFor="title">
						Product Title
						<RequiredAsterisk />
					</label>
					<input
						autoComplete="off"
						placeholder={`21ST Urban "BLACK MINE 2.0" Tee`}
						id="title"
						className="border-2 border-black p-2 w-full rounded-lg"
						{...register("title", { required: true })}
					/>
					{errors.title && (
						<p className="text-red-500 italic font-bold">
							Product Title is required
						</p>
					)}
				</div>

				<div className="pb-3">
					<label className="block mb-1 font-bold" htmlFor="price">
						Price (in USD)
						<RequiredAsterisk />
					</label>
					<input
						autoComplete="off"
						placeholder="59"
						id="price"
						className="border-2 border-black p-2 w-full rounded-lg"
						{...register("price", { required: true })}
					/>
					{errors.price && (
						<p className="text-red-500 italic font-bold">
							Price is required
						</p>
					)}
				</div>

				<div className="pb-3">
					<label className="block mb-1 font-bold" htmlFor="discount">
						Discount &gt; Price after disc. ${salePrice}
					</label>
					<DiscountInput form={form} />
				</div>

				<div className="pb-3">
					<label className="block mb-1 font-bold" htmlFor="material">
						Material
						<RequiredAsterisk />
					</label>
					<input
						autoComplete="off"
						placeholder="Cotton"
						id="material"
						className="border-2 border-black p-2 w-full rounded-lg"
						{...register("material", { required: true })}
					/>
					{errors.material && (
						<p className="text-red-500 italic font-bold">
							Material is required
						</p>
					)}
				</div>

				<div className="pb-3">
					<label
						className="block mb-1 font-bold"
						htmlFor="description"
					>
						Description
					</label>
					<input
						autoComplete="off"
						placeholder="Graphic: Silk print"
						id="description"
						className="border-2 border-black p-2 w-full rounded-lg"
						{...register("description")}
					/>
				</div>

				<div className="pb-3">
					<label className="block font-bold" htmlFor="description">
						Images Upload <RequiredAsterisk />
					</label>
					<sub className="text-sm pb-3 text-slate-600 block italic">
						Paste images&apos; URLs separated by 2 line breaks
					</sub>
					<ImagesUpload form={form} />
				</div>

				<div className="pb-3">
					<label
						className="block mb-1 font-bold"
						htmlFor="description"
					>
						Add Colors & Sizes
					</label>
					<ColorSizeInput
						form={form}
						defaultColorSizeArr={product.color_size_arr?.reduce(
							(acc: Body["colorSizeArr"], curr) => {
								const existingColor = acc.find(
									(item) => item.color === curr.color
								);

								if (existingColor) {
									existingColor.sizes.push({
										size: curr.size,
										quantity: curr.quantity,
									});
									return acc;
								}

								acc.push({
									color: curr.color,
									sizes: [
										{
											size: curr.size,
											quantity: curr.quantity,
										},
									],
								});
								return acc;
							},
							[]
						)}
					/>
				</div>

				<div className="pt-3 pb-3">
					<label className="block font-bold" htmlFor="isPreorder">
						Is it a pre-order item?
					</label>
					<input
						type="checkbox"
						id="isPreorder"
						{...register("isPreorder")}
					/>
				</div>

				<div className="pb-3">
					<label className="block font-bold" htmlFor="hidden">
						Hide this item?
					</label>
					<input
						type="checkbox"
						id="hidden"
						{...register("hidden")}
					/>
				</div>

				{message && (
					<p className="pb-3 text-red-500 italic font-bold">
						{message}{" "}
					</p>
				)}
				<button
					className="mt-3 text-lg font-bold bg-primary rounded-lg p-2 text-white"
					type="submit"
				>
					{!isLoading && "Save"}
					{isLoading && <TextLoader loadingText="Loading" />}
				</button>
			</form>

			<button
				className="fixed bottom-5 z-10 right-5 bg-primary rounded-full p-3 text-white drop-shadow-lg"
				type="button"
				onClick={handleSubmit(onSubmit)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="35"
					height="35"
					viewBox="0 0 24 24"
				>
					<path
						fill="currentColor"
						d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-2 .85L16.15 5H5v14h14zM12 18q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18m-6-8h9V6H6zM5 7.85V19V5z"
					/>
				</svg>
			</button>
		</>
	);
}

function RequiredAsterisk() {
	return <span className="text-red-500 ml-1">*</span>;
}
