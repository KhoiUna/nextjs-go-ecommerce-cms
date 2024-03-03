import { MetadataRoute } from "next";
import { BRAND_URL } from "./config";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		"/",
		"/privacy-policy",
		"/refund-policy",
		"/shipping-policy",
		"/pre-orders",
	];

	return routes.map((route) => ({
		url: BRAND_URL + route,
		lastModified: new Date(),
	}));
}
