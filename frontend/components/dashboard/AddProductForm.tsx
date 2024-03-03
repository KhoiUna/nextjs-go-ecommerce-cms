"use client";

import TextLoader from "@/components/ui/TextLoader";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUpload } from "./ImagesUpload";
import { BrandInput } from "./BrandInput";
import { DiscountInput } from "./DiscountInput";
import { ColorSizeInput } from "./ColorSizeInput";
import { PageInput } from "./PageInput";
import Link from "next/link";

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

export function AddProductForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	const form = useForm<IFormInputs>({
		defaultValues: {
			discount_type: "dollar",
			brand: "",
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

			const res = await fetch(`/api/product`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			const data: AuthResponse = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);

			toast("Product added successfully");
			setIsLoading(false);
			reset();
		} catch (error: any) {
			setIsLoading(false);
			toast(error.message);
		}
	};
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		watch,
	} = form;
	const salePrice =
		watch("discount_type") === "dollar"
			? watch("price") - watch("discount")
			: watch("price") - (watch("discount") / 100) * watch("discount");

	return (
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
			<h2 className="text-2xl font-bold pb-5">Add Product</h2>

			<div className="pb-3">
				<label className="block mb-1 font-bold" htmlFor="page">
					Page
				</label>
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
				<label className="block mb-1 font-bold" htmlFor="description">
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
				<label className="block mb-1 font-bold">
					Add Colors & Sizes
				</label>
				<ColorSizeInput form={form} />
			</div>

			<div className="pt-3 pb-3">
				<label className="block mb-1 font-bold" htmlFor="isPreorder">
					Is it a pre-order item?
				</label>
				<input
					type="checkbox"
					id="isPreorder"
					{...register("isPreorder")}
				/>
			</div>

			<div className="pb-3">
				<label className="block mb-1 font-bold" htmlFor="hidden">
					Hide this item?
				</label>
				<input type="checkbox" id="hidden" {...register("hidden")} />
			</div>

			{message && (
				<p className="pb-3 text-red-500 italic font-bold">{message} </p>
			)}
			<button
				className="mt-3 text-lg font-bold bg-black rounded-lg p-2 text-white"
				type="submit"
			>
				{!isLoading && "Submit"}
				{isLoading && <TextLoader loadingText="Loading" />}
			</button>
		</form>
	);
}

function RequiredAsterisk() {
	return <span className="text-red-500 ml-1">*</span>;
}
