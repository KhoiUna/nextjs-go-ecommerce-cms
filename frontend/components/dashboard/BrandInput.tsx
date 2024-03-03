"use client";

import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { IFormInputs } from "./AddProductForm";

type GetBrandResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: { name: string }[];
};
interface Props {
	form: UseFormReturn<IFormInputs>;
}

export function BrandInput({ form }: Props) {
	const { register, setValue, watch } = form;
	const [inputText, setInputText] = useState("");
	const [selectValue, setSelectValue] = useState("");

	const { data } = useQuery<any, any, GetBrandResponse, any>({
		queryKey: ["brands"],
		queryFn: async () => {
			const res = await fetch("/api/brand");
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
				id="brand"
				className="border-2 border-black p-2 w-full rounded-lg"
			/>
		);

	const brandArr =
		inputText.length === 0
			? data.payload
			: data.payload.filter(({ name }) => {
					const removeNonLetters = (str: string) =>
						str.replace(/[^a-zA-Z]/g, "");
					const removeSpaces = (str: string) =>
						str.replace(/\s/g, "");

					return removeSpaces(
						removeNonLetters(name.toLowerCase())
					).includes(
						removeSpaces(removeNonLetters(inputText.toLowerCase()))
					);
			  });

	const formatInput = (str: string) =>
		str.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();

	return (
		<>
			<input
				autoComplete="off"
				placeholder="Type to filter"
				id="brand"
				className="border-x-2 border-t-2 border-black p-2 w-full rounded-t-lg outline-none"
				{...register("brand", { required: true })}
				onChange={(event) => {
					setInputText(formatInput(event.target.value));
					setSelectValue("");
				}}
				onBlur={() => setValue("brand", formatInput(inputText))}
			/>
			<select
				onChange={(event) => setValue("brand", event.target.value)}
				id="brand"
				className="w-full bg-white p-2 border-l-2 border-r-2 border-b-2 border-black rounded-b-lg bg-slate-100 outline-none mb-2"
				value={selectValue}
			>
				<option value={""} disabled={true}>
					{brandArr.length !== 0
						? `Suggestions (${brandArr.length})`
						: `${(inputText || watch("brand")).slice(
								0,
								5
						  )}... will be added after submit`}
				</option>
				{brandArr.map(({ name }) => (
					<option value={name} key={name}>
						{name}
					</option>
				))}
			</select>
		</>
	);
}
