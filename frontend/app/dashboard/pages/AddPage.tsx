"use client";

import { MenuItem } from "@/types/types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IFormInputs {
	slug: string;
	text: string;
}

export function AddPage({ addPage }: { addPage: (newPage: MenuItem) => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const {
		watch,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm<IFormInputs>();

	if (!isOpen)
		return (
			<button
				className="bg-slate-200 rounded-lg p-2 w-full hover:drop-shadow-lg"
				onClick={() => setIsOpen(true)}
			>
				+ Add Page
			</button>
		);

	const onSubmit: SubmitHandler<IFormInputs> = async (formData, event) => {
		try {
			event?.preventDefault();
			formData.slug = formatInput(formData.slug);
			setValue("slug", formData.slug);
			let res = await fetch(`/api/page`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);

			toast.success("Add new page successfully");
			addPage({
				ID: data.payload.ID,
				order: data.payload.order,
				slug: formData.slug,
				text: formData.text,
				is_permanent: 0,
			});
			reset();
			setIsOpen(false);
		} catch (err: any) {
			toast.error(err.message || "Error adding new page");
		}
	};

	const formatInput = (str: string) =>
		str.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();

	return (
		<form
			className="w-full border-2 border-black rounded-lg bg-white p-5 mb-10"
			onSubmit={handleSubmit(onSubmit)}
		>
			<p className="text-xl font-bold pb-5">Add new page</p>

			<label className="font-bold block pb-1">Text*</label>
			<input
				autoComplete="off"
				placeholder="Text"
				className="border-2 border-black rounded-lg p-2 outline-none w-full"
				{...register("text", { required: true })}
			/>
			{errors.text && (
				<p className="text-red-500 italic font-bold">
					Text is required
				</p>
			)}

			<label className="font-bold block pt-5 pb-">Slug*</label>
			<p className="text-slate-600 text-sm pb-2">
				The path of the URL. Eg:{" "}
				{!watch("slug") ? "/<slug>" : `/${watch("slug")}`}
			</p>
			<input
				autoComplete="off"
				placeholder="Slug"
				className="border-2 border-black rounded-lg p-2 outline-none w-full"
				{...register("slug", { required: true })}
				onBlur={() => setValue("slug", formatInput(watch("slug")))}
			/>
			{errors.slug && (
				<p className="text-red-500 italic font-bold">
					Slug is required
				</p>
			)}

			<div className="flex flex-wrap justify-end">
				<button
					type="button"
					className="bg-slate-200 rounded-lg p-2 font-bold mt-5 mr-3 w-[80px]"
					onClick={() => {
						reset();
						setIsOpen(false);
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="bg-black text-white rounded-lg p-2 font-bold mt-5 w-[80px]"
				>
					Add
				</button>
			</div>
		</form>
	);
}
