import ItemCard from "@/components/ui/ItemCard";
import { Item, MenuItem } from "@/types/types";
import { Metadata } from "next";
import { BRAND_NAME, BRAND_URL, SITE_DESCRIPTION } from "../config";

export const dynamic = "force-dynamic";
export async function generateMetadata({
	params,
}: {
	params: { pageSlug: string };
}): Promise<Metadata> {
	const pages = await getPages();

	return {
		title: pages.find((page: MenuItem) => page.slug === params.pageSlug)
			?.text,
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
}

type GetItemsResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: null | Item[];
};

export default async function Brand({
	params,
}: {
	params: { pageSlug: string };
}) {
	const items = await getItems({ pageSlug: params.pageSlug });
	const pageTitle = (await getPages()).find(
		(page: MenuItem) => page.slug === params.pageSlug
	)?.text;

	if (!items || items.length === 0)
		return (
			<div className="min-h-screen bg-secondary pt-10">
				<section className="p-20">
					<h2 className="text-4xl mb-5 font-bold">{pageTitle}</h2>
					<p className="text-xl">Nothing to see yet!</p>
				</section>
			</div>
		);

	return (
		<div className="bg-secondary pt-10">
			<section className="p-20">
				<h2 className="text-4xl mb-5 font-bold">{pageTitle}</h2>
				<div className="flex flex-wrap">
					{items.map((item, index) => (
						<ItemCard key={index} item={item} />
					))}
				</div>
			</section>
		</div>
	);
}

async function getItems({ pageSlug }: { pageSlug: string }) {
	try {
		const res = await fetch(
			`${process.env.API_URL}/api/brand/${pageSlug}`,
			{
				next: {
					revalidate: 0,
				},
			}
		);
		if (!res.ok) throw new Error("Failed to fetch data");

		const data: GetItemsResponse = await res.json();
		if (data.hasError) throw new Error(data.errorMessage);
		return data.payload;
	} catch (error) {
		return null;
	}
}
async function getPages() {
	const { payload }: { payload: MenuItem[] } = await (
		await fetch(`${process.env.API_URL}/api/page`)
	).json();
	return payload;
}
