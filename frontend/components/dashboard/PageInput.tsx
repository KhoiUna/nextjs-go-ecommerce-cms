"use client";

import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";
import { MenuItem } from "@/types/types";

interface Props {
	form: UseFormReturn<IFormInputs>;
}

export function PageInput({ form }: Props) {
	const { register } = form;
	const { data } = useQuery<
		any,
		any,
		{
			errorMessage: string;
			hasError: boolean;
			metadata: null | {
				[key: string]: any;
			};
			payload: MenuItem[];
		},
		any
	>({
		queryKey: ["pages"],
		queryFn: async () => {
			const res = await fetch("/api/page");
			const data = await res.json();
			return data;
		},
	});

	if (!data)
		return (
			<input
				readOnly={true}
				autoComplete="off"
				placeholder="Loading..."
				id="page"
				className="border-2 border-black p-2 w-full rounded-lg"
			/>
		);

	return (
		<select
			id="page"
			className="w-full bg-white p-2 border-2 border-r-2 border-b-2 border-black rounded-bl-lg rounded-lg bg-slate-100 outline-none mb-2"
			{...register("pageId")}
			defaultValue={0}
		>
			<option value={0}>
				{data.payload.length === 0
					? "Please add a page in Pages"
					: "Select a page"}
			</option>
			{data.payload.map(({ slug, ID, text, is_permanent }) =>
				is_permanent === 1 ? null : (
					<option value={ID} key={ID}>
						{text} {`</${slug}>`}
					</option>
				)
			)}
		</select>
	);
}
