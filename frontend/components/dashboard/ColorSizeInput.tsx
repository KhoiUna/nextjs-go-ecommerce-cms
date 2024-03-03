"use client";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";
import { SIZES } from "@/types/types";

interface Props {
	defaultColorSizeArr?: {
		color: string;
		sizes: { size: string; quantity: number }[];
	}[];
	form: UseFormReturn<IFormInputs>;
}

const initialState = [{ color: "", sizes: [{ size: "", quantity: 0 }] }];

export function ColorSizeInput({ form, defaultColorSizeArr }: Props) {
	const [colors, setColors] = useState(defaultColorSizeArr || initialState);

	useEffect(() => {
		form.setValue("colorSizeArr", colors);
	}, [colors, form]);

	const addColor = () => {
		setColors([
			...colors,
			{ color: "", sizes: [{ size: "", quantity: 0 }] },
		]);
	};

	const addSize = (colorIndex: number) => {
		const newColors = [...colors];
		newColors[colorIndex].sizes.push({ size: "", quantity: 0 });
		setColors(newColors);
	};

	const handleColorChange = (colorIndex: number, value: string) => {
		const newColors = [...colors];
		newColors[colorIndex].color = value;
		setColors(newColors);
	};

	const handleSizeChange = (
		colorIndex: number,
		sizeIndex: number,
		value: string
	) => {
		const newColors = [...colors];
		newColors[colorIndex].sizes[sizeIndex].size = value;
		setColors(newColors);
	};

	const handleInventoryChange = (
		colorIndex: number,
		sizeIndex: number,
		value: string
	) => {
		const newColors = [...colors];
		newColors[colorIndex].sizes[sizeIndex].quantity = parseInt(value);
		setColors(newColors);
	};

	return (
		<>
			{colors.map((color, colorIndex) => (
				<>
					<div
						className="border-2 border-black flex items-center mb-3 rounded-lg p-2 bg-slate-50"
						key={colorIndex}
					>
						<label className="font-bold mr-3">
							Color:{" "}
							<small>(leave blank to not add this color)</small>
						</label>
						<input
							className="w-full outline-none bg-transparent border-b-2 border-black"
							type="text"
							placeholder="Color"
							value={color.color}
							onChange={(e) =>
								handleColorChange(colorIndex, e.target.value)
							}
						/>
					</div>

					{color.sizes.map((size, sizeIndex) => (
						<>
							<div
								className="p-5 flex flex-wrap items-center border-x-2 border-b-2 border-black rounded-b-lg my-3 bg-slate-50"
								key={sizeIndex}
							>
								<div className="w-full">
									<label className="block font-bold my-2">
										Size:
									</label>
									<select
										className="border-b-2 border-black w-full outline-none bg-transparent"
										value={size.size}
										onChange={(e) =>
											handleSizeChange(
												colorIndex,
												sizeIndex,
												e.target.value
											)
										}
									>
										<option value={""}>
											Select a size, or leave blank
										</option>
										{SIZES.map((size) => (
											<option value={size} key={size}>
												Size: {size}
											</option>
										))}
									</select>
								</div>

								<div className="w-full mt-3">
									<label className="font-bold my-2 block">
										Quantity:{" "}
										<small>
											(set to 0 to not add this size)
										</small>
									</label>
									<input
										className="border-b-2 border-black w-full outline-none bg-transparent"
										type="number"
										placeholder="Quantity"
										value={size.quantity}
										onChange={(e) =>
											handleInventoryChange(
												colorIndex,
												sizeIndex,
												e.target.value
											)
										}
									/>
								</div>
							</div>
						</>
					))}
					<button
						type="button"
						className="my-3 block border-2 border-black hover:bg-slate-50 rounded-lg p-2 font-bold w-[115px]"
						onClick={() => addSize(colorIndex)}
					>
						Add Size +
					</button>
				</>
			))}

			<button
				type="button"
				className="block border-2 border-black hover:bg-slate-50 rounded-lg p-2 font-bold w-[115px]"
				onClick={addColor}
			>
				Add Color +
			</button>
		</>
	);
}
