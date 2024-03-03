"use client";

import TextLoader from "@/components/ui/TextLoader";
import { Site } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { SyntheticEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type GetSiteResponse = {
	payload: Site;
};

export default function SettingsPage() {
	const [isLoading, setIsLoading] = useState(false);

	const { data } = useQuery<any, any, GetSiteResponse, any>({
		queryKey: ["site"],
		queryFn: async () => await (await fetch("/api/site")).json(),
	});

	const [imageUrl, setImageUrl] = useState("");
	useEffect(() => {
		if (data?.payload) setImageUrl(data.payload.image_url || "");
	}, [data?.payload]);

	if (!data)
		return (
			<>
				<h1 className="text-3xl font-bold">Settings</h1>
				<TextLoader loadingText="Loading" />
			</>
		);

	const onSubmit = async (e: SyntheticEvent) => {
		try {
			e.preventDefault();
			setIsLoading(true);
			if (imageUrl.length !== 0) new URL(imageUrl);

			const response = await (
				await fetch("/api/site", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ imageUrl }),
				})
			).json();
			if (response.hasError) throw new Error(response.errorMessage);
			toast.success("Site settings successfully saved");
			setIsLoading(false);
		} catch (error: any) {
			toast.error(error.message || "Error saving site settings");
			setIsLoading(false);
		}
	};

	return (
		<>
			<h1 className="text-3xl font-bold">Settings</h1>
			<form className="pt-8" onSubmit={onSubmit}>
				<label className="block font-bold pb-1" htmlFor="image_url">
					Site background image
				</label>
				<input
					autoComplete="off"
					id="image_url"
					className="bg-white outline-none border-2 border-black rounded-lg p-2 w-full"
					placeholder="https://..."
					value={imageUrl}
					onChange={(e) => setImageUrl(e.target.value)}
				/>
				<button
					className="bg-primary text-white p-2 font-bold rounded-lg mt-3"
					type="submit"
				>
					{isLoading && <TextLoader loadingText="Saving" />}
					{!isLoading && "Save"}
				</button>
				<div className="mt-3">
					<p className="text-sm">Image preview</p>
					{/* eslint-disable */}
					{imageUrl && (
						<img
							className="mt-3 rounded-lg"
							alt="Site background image"
							src={imageUrl}
							width={300}
							height={300}
						/>
					)}
				</div>
			</form>
		</>
	);
}
