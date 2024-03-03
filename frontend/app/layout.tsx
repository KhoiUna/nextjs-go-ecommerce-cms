import "./globals.css";
import Analytics from "@/components/Analytics";
import HeaderBar from "@/components/ui/HeaderBar";
import Footer from "@/components/ui/Footer";
import { Metadata } from "next";
import { BRAND_NAME, BRAND_URL, SITE_DESCRIPTION } from "./config";
import { Site } from "@/types/types";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
	const site = await getSite();

	return {
		title: {
			absolute: `Home | ${BRAND_NAME}`,
			template: `%s | ${BRAND_NAME}`,
			default: BRAND_NAME,
		},
		description: SITE_DESCRIPTION,
		metadataBase: new URL(BRAND_URL),
		openGraph: {
			title: `Home | ${BRAND_NAME}`,
			description: SITE_DESCRIPTION,
			url: BRAND_URL,
			siteName: `${BRAND_NAME}`,
			images: [
				{
					url: site?.image_url || "/images/hero.webp",
					width: 512,
					height: 512,
				},
			],
			locale: "en-US",
			type: "website",
		},
	};
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Analytics />

			<body>
				<HeaderBar />
				{children}
				<Footer brandName={BRAND_NAME} />
			</body>
		</html>
	);
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
