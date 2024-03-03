"use client";

import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";

interface Props {
	form: UseFormReturn<IFormInputs>;
}
export function DiscountInput({ form }: Props) {
	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = form;

	return (
		<>
			<div className="flex">
				<input
					autoComplete="off"
					placeholder={
						watch("discount_type") === "dollar"
							? "$15 off"
							: "30% off"
					}
					id="discount"
					className="border-l-2 border-y-2 border-black p-2 rounded-l-lg w-full outline-none"
					{...register("discount", { min: 0 })}
				/>
				<button
					type="button"
					onClick={() => setValue("discount_type", "dollar")}
					className={`border-y-2 border-black bg-slate-100 p-2 whitespace-nowrap ${
						watch("discount_type") === "dollar" ? "font-bold" : ""
					}`}
				>
					in $
				</button>
				<button
					type="button"
					onClick={() => setValue("discount_type", "percent")}
					className={`border-y-2 border-r-2 border-r-black border-y-black rounded-r-lg bg-slate-100 p-2 whitespace-nowrap ${
						watch("discount_type") === "percent" ? "font-bold" : ""
					}`}
				>
					in %
				</button>
			</div>
			{errors.discount && (
				<p className="text-red-500 italic font-bold">
					Invalid discount value
				</p>
			)}
		</>
	);
}
