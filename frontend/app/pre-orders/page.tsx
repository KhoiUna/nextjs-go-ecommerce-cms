import ItemCard from "@/components/ui/ItemCard";
import { Item } from "@/types/types";
import { Metadata } from "next";
import { BRAND_NAME, BRAND_URL, SITE_DESCRIPTION } from "../config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
	title: "Pre Orders",
	description: SITE_DESCRIPTION,
	metadataBase: new URL(BRAND_URL),
	openGraph: {
		title: `Home | ${BRAND_NAME}`,
		description: SITE_DESCRIPTION,
		url: BRAND_URL,
		siteName: `${BRAND_NAME}`,
		images: [
			{
				url: "/images/hero.webp",
				width: 512,
				height: 512,
			},
		],
		locale: "en-US",
		type: "website",
	},
};

type GetItemsResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: null | Item[];
};
export default async function PreordersPage() {
	const items = await getItems();

	if (!items || items.length === 0)
		return (
			<div className="min-h-screen bg-secondary pt-10">
				<section className="p-20">
					<h2 className="text-4xl mb-5 font-bold">Pre Orders</h2>
					<p className="text-xl">Nothing to see yet!</p>
				</section>
			</div>
		);

	return (
		<div className="bg-secondary pt-10">
			<section className="p-20">
				<h2 className="text-4xl mb-5 font-bold">Pre Orders</h2>
				<div className="flex flex-wrap">
					{items.map((item, index) => (
						<ItemCard key={index} item={item} />
					))}
				</div>
			</section>
		</div>
	);
}

async function getItems() {
	try {
		const res = await fetch(`${process.env.API_URL}/api/brand/preorder`, {
			next: {
				revalidate: 0,
			},
		});
		if (!res.ok) throw new Error("Failed to fetch data");

		const data: GetItemsResponse = await res.json();
		if (data.hasError) throw new Error(data.errorMessage);
		return data.payload;
	} catch (error) {
		return null;
	}
}
