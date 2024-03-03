import ItemCard from "@/components/ui/ItemCard";
import { Item, Site } from "@/types/types";
import { BRAND_NAME } from "./config";

export default async function Home() {
	const items = await getItems();
	const site = await getSite();
	const backgroundImageUrl = site?.image_url || "/images/hero.webp";

	return (
		<div className="bg-secondary">
			<section
				id="hero"
				className={`min-h-screen bg-no-repeat bg-center md:bg-fixed bg-scroll landscape:bg-top bg-contain`}
				style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
			>
				<div className="bg-black pt-[25vh] min-h-screen bg-opacity-10">
					<div className="text-center">
						<h1 className="sm:text-8xl text-5xl text-white bg-black/20 backdrop-blur-lg w-fit m-auto p-2">
							{BRAND_NAME}
						</h1>

						<a
							href="#new"
							className="inline-block w-fit sm:text-2xl text-lg font-bold border-white border-2 text-background py-2 px-6 rounded-full cursor-pointer mt-10 transition-all hover:bg-white hover:text-black bg-black/20 backdrop-blur-lg"
						>
							SHOP NOW
						</a>
					</div>
				</div>
			</section>

			<section id="new" className="p-20">
				<h1 className="text-4xl mb-5 font-bold sm:ml-20">NEW IN</h1>
				<div className="flex flex-wrap justify-center">
					{items?.map((item, index) => (
						<ItemCard key={index} item={item} />
					))}
				</div>
			</section>
		</div>
	);
}

type GetItemsResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: null | Item[];
};
async function getItems() {
	try {
		const res = await fetch(`${process.env.API_URL}/api/brand/all`, {
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

type GetSiteResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: Site;
};
async function getSite() {
	try {
		const res = await fetch(`${process.env.API_URL}/api/site`, {
			next: {
				revalidate: 0,
			},
		});
		if (!res.ok) throw new Error("Failed to fetch data");
		const data: GetSiteResponse = await res.json();
		if (data.hasError) throw new Error(data.errorMessage);
		return data.payload;
	} catch (error) {
		return null;
	}
}
