import { Metadata } from "next";
import { BRAND_NAME } from "../config";

export const metadata: Metadata = {
	title: `Shipping Policy | ${BRAND_NAME}`,
};

export default function PrivacyPolicy() {
	return (
		<div className="bg-background">
			<section className="px-10 pt-[15vh] min-h-[90vh] pb-10">
				<h1 className="pb-8 text-5xl font-bold">Shipping Policy</h1>

				<h2 className="text-xl font-bold">In-Stock</h2>

				<p className="pt-3 pb-5">
					We aim to have all orders shipped the next day if placed
					before 12AM Central Time.
				</p>

				<h2 className="text-xl font-bold">Pre-Orders</h2>

				<p className="pt-3">
					With pre-orders, we will have all shipped the next day when
					we receive them.
					<br />
					All of our shipments will ship via USPS, which usually takes
					about 3-4 days depending on your location. You will receive
					a shipment notification email with tracking once your order
					has shipped.
				</p>
			</section>
		</div>
	);
}
