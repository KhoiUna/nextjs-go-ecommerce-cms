"use client";

import Loader from "@/components/ui/Loader";
import TextLoader from "@/components/ui/TextLoader";
import useRedirect from "@/hooks/useRedirect";
import { Item } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

type GetProductsResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: Item[];
};
type GetBrandResponse = {
	payload: { name: string }[];
};

export default function ProductsPage() {
	const { data: userData } = useRedirect({});

	const [brandName, setBrandName] = useState("");
	const { data: productResponse } = useQuery<
		any,
		any,
		GetProductsResponse,
		any
	>({
		queryKey: ["products", brandName],
		queryFn: async () => {
			if (!userData?.payload.isAuthenticated) return;
			const res = await fetch(`/api/product?brandName=${brandName}`);
			const data = await res.json();
			return data;
		},
	});

	const { data: brandResponse } = useQuery<any, any, GetBrandResponse, any>({
		queryKey: ["brands", userData?.payload.isAuthenticated],
		queryFn: async () => {
			if (!userData?.payload.isAuthenticated) return;
			const res = await fetch(`/api/brand`);
			const data = await res.json();
			return data;
		},
	});

	if (!userData || !userData.payload.isAuthenticated) return <Loader />;

	if (!productResponse)
		return (
			<>
				<h1 className="text-3xl font-bold">Products</h1>
				<div className="py-10">
					<div className="p-5 rounded-lg bg-white border-2 border-black w-full h-[800px]">
						<div className="flex items-baseline justify-between">
							<p className="font-bold text-xl">My Inventory</p>
							<Link
								className="bg-slate-200 p-2 rounded-lg hover:drop-shadow-lg"
								href={"/dashboard/add"}
							>
								+ Add Product
							</Link>
						</div>
						<p className="font-bold text-sm pt-3 pb-1">
							Filter by brand
						</p>
						<select
							defaultValue={""}
							className="bg-white text-sm outline-none p-1 rounded-lg border-2 border-black"
						>
							<option disabled value={""}>
								Filter by brand
							</option>
							{brandResponse?.payload.map(({ name }) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
						<div className="text-center text-lg mt-10">
							<TextLoader loadingText="Loading" />
						</div>
					</div>
				</div>
			</>
		);

	return (
		<>
			<h1 className="text-3xl font-bold">Products</h1>
			<div className="py-8">
				<div className="p-5 rounded-lg bg-white border-2 border-black w-full">
					<div className="flex items-baseline justify-between">
						<p className="font-bold text-2xl">My Inventory</p>

						<Link
							className="bg-slate-200 p-2 rounded-lg hover:drop-shadow-lg"
							href={"/dashboard/products/add"}
						>
							+ Add Product
						</Link>
					</div>

					<p className="font-bold pt-3 text-sm pb-1">
						Filter by brand
					</p>
					<select
						onChange={({ target }) => setBrandName(target.value)}
						value={brandName}
						className="bg-white text-sm outline-none p-1 rounded-lg border-2 border-black"
					>
						<option value={""}>None</option>
						{brandResponse?.payload.map(({ name }) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</select>

					<div className="flex flex-wrap justify-center mt-10">
						{productResponse.payload?.length === 0 && (
							<p className="text-slate-500 italic">
								No products in inventory.
							</p>
						)}
						{productResponse.payload?.map((product) => (
							<ItemCard item={product} key={product.id} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

function ItemCard({ item }: { item: Item }) {
	const {
		id,
		title,
		price,
		discount,
		discount_type,
		url,
		name,
		hidden,
		last_edited_by_username,
		slug,
		text,
	} = item;
	const href = "/dashboard/edit/" + id;

	const salePrice = !discount
		? 0
		: discount_type === "dollar"
		  ? price - discount
		  : price - (price * discount) / 100;

	return (
		<Link className="mt-8 mb-20 md:mr-14" href={href}>
			<div
				className={`flex flex-col bg-white hover:bg-slate-50 hover:drop-shadow-lg border-2 border-black p-5 rounded-lg ${
					hidden === 1 ? "opacity-70" : ""
				}
				`}
			>
				{hidden === 1 && (
					<svg
						className="absolute text-black bg-white rounded-br-lg"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 20 20"
					>
						<path
							fill="currentColor"
							d="M17.3 3.3c-.4-.4-1.1-.4-1.6 0l-2.4 2.4a9.6 9.6 0 0 0-3.3-.6c-3.8.1-7.2 2.1-9 5.4c.2.4.5.8.8 1.2c.8 1.1 1.8 2 2.9 2.7L3 16.1c-.4.4-.5 1.1 0 1.6c.4.4 1.1.5 1.6 0L17.3 4.9c.4-.5.4-1.2 0-1.6m-10.6 9l-1.3 1.3c-1.2-.7-2.3-1.7-3.1-2.9C3.5 9 5.1 7.8 7 7.2c-1.3 1.4-1.4 3.6-.3 5.1M10.1 9c-.5-.5-.4-1.3.1-1.8c.5-.4 1.2-.4 1.7 0zm8.2.5c-.5-.7-1.1-1.4-1.8-1.9l-1 1c.8.6 1.5 1.3 2.1 2.2C15.9 13.4 13 15 9.9 15h-.8l-1 1c.7-.1 1.3 0 1.9 0c3.3 0 6.4-1.6 8.3-4.3c.3-.4.5-.8.8-1.2c-.3-.3-.5-.7-.8-1M14 10l-4 4c2.2 0 4-1.8 4-4"
						/>
					</svg>
				)}
				{/* eslint-disable */}
				<img
					className="h-[300px] w-[300px] object-scale-down mb-3 mx-auto"
					src={url || "/images/logo.png"}
					alt={title}
					width={300}
					height={300}
				/>

				<p className="bg-blue-100 w-fit p-1 rounded-lg">
					<b>Brand:</b> {name}
				</p>
				<p
					className={`w-fit p-1 rounded-lg flex items-baseline ${
						text ? "bg-green-100" : "bg-orange-100"
					}`}
				>
					{text ? (
						<>
							<b>Page:</b>
							<span className="ml-1 truncate block max-w-[90px]">
								{text}
							</span>
							<span className="ml-1 text-sm">{`</${slug}>`}</span>
						</>
					) : (
						"Not in any pages"
					)}
				</p>

				<p className="mt-3">{title}</p>
				<p className="text-xl">
					<span
						className={
							salePrice !== 0
								? "line-through mr-2 text-slate-500"
								: "font-bold"
						}
					>
						${price}
					</span>
					{salePrice !== 0 && (
						<span className={salePrice !== 0 ? "font-bold" : ""}>
							${salePrice}
						</span>
					)}
				</p>
				<p className="text-sm pt-3">
					Last edited by: {last_edited_by_username}
				</p>
			</div>
		</Link>
	);
}
