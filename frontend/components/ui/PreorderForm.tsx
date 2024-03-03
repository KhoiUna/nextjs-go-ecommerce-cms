"use client";

import { ColorSize, Item } from "@/types/types";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import TextLoader from "./TextLoader";
import { Toaster, toast } from "sonner";
import { isValidUrl } from "@/lib/helpers";

interface IFormInputs {
	name: string;
	social: string;
	size: string;
	color: string;
}

export default function PreorderForm({
	colorSizeArr,
	itemId,
}: {
	colorSizeArr: Item["color_size_arr"];
	itemId: string;
}) {
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm<IFormInputs>();
	const onSubmit: SubmitHandler<IFormInputs> = async (body) => {
		try {
			setIsLoading(true);

			if (!isValidUrl(body.social))
				throw new Error(
					"Invalid URL. Make sure it starts with https://"
				);

			const response = await fetch("/api/preorder", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...body, itemId }),
			});
			if (!response.ok) throw new Error("Error submitting preorder form");
			const data = await response.json();
			if (data.hasError) throw new Error(data.errorMessage);

			toast.success("Submitted successfully");
			setIsLoading(false);
			reset();
		} catch (error: any) {
			toast.error(error.message || "Error submitting form");
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Toaster richColors position="top-center" />
			<hr className="pb-3" />
			<h2 className="text-2xl font-bold">Pre-order Form</h2>
			<p className="text-slate-600 pb-3">
				It will take 1-2 weeks for your order to be shipped to the US.
			</p>
			<div className="pb-3">
				<label className="block mb-1 font-bold" htmlFor="name">
					Name*
				</label>
				<input
					placeholder="Your Name"
					id="name"
					className="border-2 border-black p-2 w-full rounded-lg"
					{...register("name", { required: true })}
				/>
				{errors.name && (
					<p className="text-red-500 italic font-bold">
						Name is required
					</p>
				)}
			</div>

			<div className="pb-3">
				<label className="block mb-1 font-bold" htmlFor="social">
					Social URL (Facebook / Instagram)*
				</label>
				<input
					placeholder="https://..."
					id="social"
					className="border-2 border-black p-2 w-full rounded-lg"
					{...register("social", { required: true })}
				/>
				{errors.social && (
					<p className="text-red-500 italic font-bold">
						Social URL is required
					</p>
				)}
			</div>

			<div className="pb-3">
				<label className="block mb-1 font-bold" htmlFor="size">
					Choose your color & size*
				</label>
				<select
					className="border-2 border-black p-2 w-full rounded-lg bg-white"
					defaultValue={""}
					id="size"
					required
					onChange={(e) => {
						const colorSize: ColorSize = JSON.parse(e.target.value);
						setValue("color", colorSize.color);
						setValue("size", colorSize.size);
					}}
				>
					<option disabled value={""}>
						Please choose your size
					</option>
					{colorSizeArr?.map((item, index) => (
						<option key={index} value={JSON.stringify(item)}>
							{item.color}{" "}
							{item.size ? `- Size: ${item.size}` : "- Size: N/A"}
						</option>
					))}
				</select>
				{errors.size && (
					<p className="text-red-500 italic font-bold">
						Size is required
					</p>
				)}
			</div>

			<button
				className="text-lg font-bold bg-black rounded-lg p-2 text-white"
				type="submit"
			>
				{isLoading && <TextLoader loadingText="Loading" />}
				{!isLoading && "Submit"}
			</button>
		</form>
	);
}
