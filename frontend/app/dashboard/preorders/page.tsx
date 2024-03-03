"use client";

import TextLoader from "@/components/ui/TextLoader";
import { isValidUrl } from "@/lib/helpers";
import { Preorder } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

interface GetPreordersResponse {
	payload?: Preorder[];
}

const formatHref = ({ title, itemId }: { title: string; itemId: number }) =>
	"/shop/" + title.replaceAll(" ", "-") + "-" + itemId;

export default function PreordersPage() {
	const { data, refetch } = useQuery<any, any, GetPreordersResponse, any>({
		queryKey: ["preorders"],
		queryFn: async () => {
			const res = await fetch("/api/preorder");
			const data = await res.json();
			return data;
		},
	});

	if (!data)
		return (
			<>
				<h1 className="text-3xl font-bold">Preorders</h1>
				<div className="pt-10 text-lg">
					<TextLoader loadingText="Loading" />
				</div>
			</>
		);

	const notCompletedPreorders = data.payload
		? data.payload?.filter((preorder) => preorder.completed === 0)
		: [];
	const completedPreorders = data.payload
		? data.payload?.filter((preorder) => preorder.completed === 1)
		: [];

	const markCompleted = async ({
		preorderId,
		title,
	}: {
		preorderId: number;
		title: string;
	}) => {
		try {
			if (!confirm(`Are you sure to mark order ${title} as completed?`))
				return;

			const data = await (
				await fetch(`/api/preorder/complete/${preorderId}`, {
					method: "PUT",
				})
			).json();
			if (data.hasError) throw new Error(data.errorMessage);

			toast.success("Marked preorder as completed successfully");
			refetch();
		} catch (error: any) {
			toast.error(error.message || "Error marking preorder as completed");
		}
	};

	return (
		<>
			<h1 className="text-3xl font-bold">Preorders</h1>
			<p className="pb-5 pt-1 text-slate-700">Newest to Oldest</p>

			<div className="overflow-auto max-w-full h-[60vh]">
				<table className="border-2 border-black sm:w-full w-screen">
					<thead className="font-bold bg-slate-200 sticky top-0 border-2 border-black">
						<tr className="text-center">
							<td className="p-2">Mark as completed</td>
							<td className="p-2">Product</td>
							<td className="p-2">Customer</td>
							<td className="p-2">Social</td>
							<td className="p-2">Color</td>
							<td className="p-2">Size</td>
							<td className="p-2">Created at</td>
						</tr>
					</thead>

					<tbody>
						{notCompletedPreorders.length === 0 && (
							<tr className="bg-white text-center">
								<td className="p-2 text-slate-700" colSpan={7}>
									There are no preorders yet.
								</td>
							</tr>
						)}
						{notCompletedPreorders.map((preorder, index) => (
							<tr
								key={index}
								className="bg-white border-2 border-black text-center"
							>
								<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
									<button
										type="button"
										aria-label="Mark preorder as completed"
										onClick={() =>
											markCompleted({
												preorderId: preorder.id,
												title: preorder.title,
											})
										}
									>
										<svg
											className="text-slate-600 hover:text-green-600"
											xmlns="http://www.w3.org/2000/svg"
											width="30"
											height="30"
											viewBox="0 0 2048 2048"
										>
											<path
												fill="currentColor"
												d="M1024 0q141 0 272 36t244 104t207 160t161 207t103 245t37 272q0 141-36 272t-104 244t-160 207t-207 161t-245 103t-272 37q-141 0-272-36t-244-104t-207-160t-161-207t-103-245t-37-272q0-141 36-272t104-244t160-207t207-161T752 37t272-37m603 685l-136-136l-659 659l-275-275l-136 136l411 411z"
											/>
										</svg>
									</button>
								</td>

								<td className="p-2 flex flex-wrap justify-center items-center border-r-2 border-black">
									<Link
										target="_blank"
										href={formatHref({
											title: preorder.title,
											itemId: preorder.item_id,
										})}
										className="font-bold pb-3 underline"
									>
										{preorder.title}
									</Link>
									{/* eslint-disable */}
									<img
										className="rounded-lg"
										src={preorder.image_url}
										alt={preorder.title}
										width={100}
										height={100}
									/>
								</td>
								<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
									{preorder.customer_name}
								</td>
								<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
									{isValidUrl(preorder.social) ? (
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={preorder.social}
											className="underline font-bold"
										>
											{new URL(preorder.social).hostname}
										</a>
									) : (
										preorder.social
									)}
								</td>
								<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
									{preorder.color || "n/a"}
								</td>
								<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
									{preorder.size}
								</td>
								<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
									{new Date(
										preorder.created_at
									).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className="pt-10 text-2xl font-bold">Completed preorders</h2>
			<p className="pb-5 text-sm pt-1 text-slate-700">Newest to Oldest</p>
			<CompletedPreordersTable preorders={completedPreorders} />
		</>
	);
}

function CompletedPreordersTable({ preorders }: { preorders: Preorder[] }) {
	return (
		<div className="overflow-auto max-w-full h-[60vh]">
			<table className="border-2 border-black sm:w-full w-screen">
				<thead className="font-bold bg-slate-200 sticky top-0 border-2 border-black">
					<tr className="text-center">
						<td className="p-2">Product</td>
						<td className="p-2">Customer</td>
						<td className="p-2">Social</td>
						<td className="p-2">Color</td>
						<td className="p-2">Size</td>
						<td className="p-2">Created at</td>
					</tr>
				</thead>

				<tbody>
					{(!preorders || preorders?.length === 0) && (
						<tr className="bg-white text-center">
							<td className="p-2 text-slate-700" colSpan={7}>
								There are no completed preorders yet.
							</td>
						</tr>
					)}
					{preorders?.map((preorder, index) => (
						<tr
							key={index}
							className="bg-green-50 border-2 border-black text-center"
						>
							<td className="p-2 flex flex-wrap justify-center items-center border-r-2 border-black">
								<Link
									target="_blank"
									href={formatHref({
										title: preorder.title,
										itemId: preorder.item_id,
									})}
									className="font-bold pb-3 underline"
								>
									{preorder.title}
								</Link>
								{/* eslint-disable */}
								<img
									className="rounded-lg"
									src={preorder.image_url}
									alt={preorder.title}
									width={100}
									height={100}
								/>
							</td>
							<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
								{preorder.customer_name}
							</td>
							<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
								{isValidUrl(preorder.social) ? (
									<a
										href={preorder.social}
										rel="noopener noreferrer"
										target="_blank"
										className="underline font-bold"
									>
										{new URL(preorder.social).hostname}
									</a>
								) : (
									preorder.social
								)}
							</td>
							<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
								{preorder.color || "n/a"}
							</td>
							<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
								{preorder.size}
							</td>
							<td className="p-2 whitespace-nowrap w-[100px] border-r-2 border-black">
								{new Date(preorder.created_at).toLocaleString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
