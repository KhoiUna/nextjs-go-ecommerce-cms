import PreorderForm from "@/components/ui/PreorderForm";
import SocialReminder from "@/components/ui/SocialReminder";
import { ImageGallery } from "./ImageGallery";
import { Item, SIZES } from "@/types/types";
import { Metadata } from "next";
import { BRAND_NAME, BRAND_URL, SITE_DESCRIPTION } from "@/app/config";

export const dynamic = "force-dynamic";
export async function generateMetadata({
	params,
}: {
	params: { itemSlug: string };
}): Promise<Metadata> {
	const itemSlugArr = params.itemSlug.split("-");
	const itemId = itemSlugArr[itemSlugArr.length - 1];
	const item = await getItem({ itemId });

	return {
		title: item?.title,
		description: SITE_DESCRIPTION,
		metadataBase: new URL(BRAND_URL),
		openGraph: {
			title: `Home | ${BRAND_NAME}`,
			description: SITE_DESCRIPTION,
			url: BRAND_URL,
			siteName: `${BRAND_NAME}`,
			images: [
				{
					url: item?.images?.[0].url || "/images/hero.webp",
					width: 512,
					height: 512,
				},
			],
			locale: "en-US",
			type: "website",
		},
	};
}

type GetItemResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: null | Item;
};

export default async function ItemPage({
	params,
}: {
	params: { itemSlug: string };
}) {
	const itemSlugArr = params.itemSlug.split("-");
	const itemId = itemSlugArr[itemSlugArr.length - 1].trim();
	const item = await getItem({ itemId });

	if (!item)
		return (
			<div className="min-h-screen bg-secondary pt-20 p-10">
				<p className="text-xl pt-10">Nothing to see here!</p>
			</div>
		);

	const salePrice = !item.discount
		? 0
		: item.discount_type === "dollar"
		  ? item.price - item.discount
		  : item.price - (item.price * item.discount) / 100;

	return (
		<div className="bg-secondary pt-28 p-10 flex flex-wrap justify-evenly">
			<ImageGallery images={item.images!} />

			<section className="sm:pt-0 pt-10">
				<h2 className="text-xl">{item.title}</h2>
				<div className="text-3xl">
					<span
						className={
							salePrice !== 0
								? "line-through mr-2 text-slate-500"
								: "font-bold"
						}
					>
						${item.price}
					</span>
					{salePrice !== 0 && (
						<span className={salePrice !== 0 ? "font-bold" : ""}>
							${salePrice}
						</span>
					)}
				</div>
				<p className="text-lg pt-8">
					<strong>Material:</strong> {item.material}
				</p>
				<p className="text-lg pt-3 max-w-sm">{item.description}</p>

				{item.color_size_arr && item.color_size_arr.length > 0 && (
					<p className="text-xl pt-3 pb-5 font-bold">
						Available colors & sizes
					</p>
				)}
				<div className="flex flex-wrap pb-5">
					{item.color_size_arr?.map(({ color, size }) => (
						<button
							key={color}
							className={
								"flex justify-center items-center rounded-lg border-2 border-black p-2 mb-3 mr-5 text-center bg-white"
							}
						>
							<span className="font-bold">
								{color} - Size: {size ? size : "N/A"}
							</span>
						</button>
					))}
				</div>
				{item.is_preorder ? (
					<PreorderForm
						colorSizeArr={item.color_size_arr}
						itemId={itemId}
					/>
				) : (
					<SocialReminder />
				)}
			</section>
		</div>
	);
}

async function getItem({ itemId }: { itemId: string }) {
	try {
		const res = await fetch(
			`${process.env.API_URL}/api/brand/item/${itemId}`,
			{
				next: {
					revalidate: 0,
				},
			}
		);
		if (!res.ok) throw new Error("Failed to fetch data");

		const data: GetItemResponse = await res.json();
		if (data.hasError) throw new Error(data.errorMessage);
		if (!data.payload) return null;

		return data.payload;
	} catch (error) {
		return null;
	}
}

function sortSizes(sizeArr: { type: string }[]) {
	if (!sizeArr) return [];

	const sortByObject = SIZES.reduce(
		(
			obj: { [key: (typeof SIZES)[number]]: number },
			SIZE: (typeof SIZES)[number],
			index: number
		) => {
			obj[SIZE] = index;
			return obj;
		},
		{}
	);

	sizeArr.sort((a, b) => sortByObject[a.type] - sortByObject[b.type]);
	return sizeArr;
}
