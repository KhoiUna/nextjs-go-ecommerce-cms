import { BRAND_SOCIALS } from "@/app/config";

export default function SocialReminder() {
	return (
		<div className="border-4 border-dotted border-red-500 p-3 max-w-sm bg-white">
			<p className="pt-3">
				<strong>NOTICE:</strong> The website only introduces products,
				customers please contact{" "}
				<a
					href={BRAND_SOCIALS.facebook}
					target="_blank"
					rel="noreferrer"
					className="text-blue-500 underline underline-offset-4 font-bold"
				>
					Facebook
				</a>{" "}
				or{" "}
				<a
					href={BRAND_SOCIALS.instagram}
					target="_blank"
					rel="noreferrer"
					className="text-blue-500 underline underline-offset-4 font-bold"
				>
					Instargram
				</a>{" "}
				to make payment.
			</p>
		</div>
	);
}
