"use client";

import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";
import { useState } from "react";

export function ImagesUpload({ form }: { form: UseFormReturn<IFormInputs> }) {
	const {
		register,
		formState: { errors },
		watch,
	} = form;

	const [imageZoomIn, setImageZoomIn] = useState("");
	const handleZoom = (url: string) => setImageZoomIn(url);

	const imageArr =
		watch("imageURLs")?.length > 0
			? watch("imageURLs")
					.split("\n\n")
					.map((url) => url.trim())
			: [];

	return (
		<>
			<textarea
				autoComplete="off"
				placeholder={
					"https://example.com/image1.png" +
					"\n\nhttps://example.com/image2.png" +
					"\n\nhttps://example.com/image3.png"
				}
				id="imageURLs"
				className="border-2 border-black p-2 w-full h-full rounded-lg"
				rows={8}
				{...register("imageURLs", { required: true })}
			/>
			{imageArr.length > 0 && (
				<>
					<p className="font-bold">Image previews</p>
					<div className="py-3 flex overflow-auto">
						{imageArr.map((url, index) => (
							/* eslint-disable */
							<img
								className="object-scale-down rounded-lg mr-3 cursor-zoom-in hover:opacity-50"
								onClick={() => handleZoom(url)}
								src={url}
								alt="Upload image"
								key={index}
								width={80}
								height={80}
							/>
						))}
					</div>
				</>
			)}
			{errors.imageURLs && (
				<p className="text-red-500 italic font-bold">
					Need at least 1 image.
				</p>
			)}

			{imageZoomIn && (
				<img
					src={imageZoomIn}
					alt="Zoomed in image"
					className="rounded-lg object-scale-down cursor-zoom-out fixed z-30 top-[25vh] w-full h-full left-0"
					onClick={() => handleZoom("")}
					width={300}
					height={300}
				/>
			)}
		</>
	);
}
