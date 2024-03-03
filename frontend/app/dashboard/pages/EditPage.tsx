"use client";

import { MenuItem } from "@/types/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IFormInputs {
	slug: string;
	text: string;
}
export function EditPage({
	menuItem,
	toggleEditPage,
	refetch,
}: {
	menuItem: MenuItem;
	toggleEditPage: () => void;
	refetch: () => void;
}) {
	const {
		watch,
		register,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<IFormInputs>({
		defaultValues: {
			text: menuItem.text,
			slug: menuItem.slug,
		},
	});

	const onSubmit: SubmitHandler<IFormInputs> = async (formData, event) => {
		try {
			event?.preventDefault();
			formData.slug = formatInput(formData.slug);
			setValue("slug", formData.slug);
			const res = await fetch(`/api/page/${menuItem.ID}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);
			toast.success("Edit page successfully");
			toggleEditPage();
			refetch();
		} catch (err: any) {
			toast.error(err.message || "Error adding new page");
		}
	};

	const formatInput = (str: string) =>
		str.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();

	return (
		<>
			<div
				className="bg-black z-10 opacity-50 fixed w-screen h-screen top-0 left-0 right-0"
				onClick={toggleEditPage}
			/>

			<div className="max-w-[400px] absolute mx-auto z-20 left-0 right-0 cursor-default">
				<form
					className="border-2 border-black rounded-lg bg-white p-5"
					onSubmit={handleSubmit(onSubmit)}
				>
					<h1 className="pb-8 text-3xl font-bold">Edit Page</h1>

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
						onBlur={() =>
							setValue("slug", formatInput(watch("slug")))
						}
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
							onClick={toggleEditPage}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="bg-black text-white rounded-lg p-2 font-bold mt-5 w-[80px]"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
