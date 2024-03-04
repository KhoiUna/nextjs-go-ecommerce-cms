import { BRAND_SOCIALS } from "@/app/config";
import Link from "next/link";

export default function Footer({ brandName }: { brandName: string }) {
	return (
		<footer className="bg-primary py-[5%] px-[10%]">
			<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between">
					<div className="grid grid-cols-2 gap-8 sm:gap-6">
						<div>
							<h2 className="mb-4 text-sm font-bold uppercase text-white">
								Legal
							</h2>
							<ul className="text-white font-medium">
								<li className="pt-1">
									<Link
										href="/privacy-policy"
										className="hover:underline"
									>
										Privacy Policy
									</Link>
								</li>
								<li className="pt-1">
									<Link
										href="/refund-policy"
										className="hover:underline"
									>
										Refund Policy
									</Link>
								</li>
								<li className="pt-1">
									<Link
										href="/shipping-policy"
										className="hover:underline"
									>
										Shipping Policy
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="sm:flex sm:items-center sm:justify-between pt-10">
					<span className="text-sm sm:text-center text-white">
						© {new Date().getFullYear()}{" "}
						<a href="/" className="hover:underline">
							{brandName}
						</a>
						. All Rights Reserved.
					</span>

					<div className="flex items-center mt-4 space-x-6 sm:justify-center sm:mt-0">
						<a
							href={BRAND_SOCIALS.facebook}
							target="_blank"
							rel="noreferrer"
							className="text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
								/>
							</svg>
							<span className="sr-only">Facebook</span>
						</a>

						<a
							href={BRAND_SOCIALS.instagram}
							target="_blank"
							rel="noreferrer"
							className="text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								viewBox="0 0 24 24"
							>
								<g fill="none">
									<path
										stroke="currentColor"
										strokeWidth="2"
										d="M3 11c0-3.771 0-5.657 1.172-6.828C5.343 3 7.229 3 11 3h2c3.771 0 5.657 0 6.828 1.172C21 5.343 21 7.229 21 11v2c0 3.771 0 5.657-1.172 6.828C18.657 21 16.771 21 13 21h-2c-3.771 0-5.657 0-6.828-1.172C3 18.657 3 16.771 3 13z"
									/>
									<circle
										cx="16.5"
										cy="7.5"
										r="1.5"
										fill="currentColor"
									/>
									<circle
										cx="12"
										cy="12"
										r="3"
										stroke="currentColor"
										strokeWidth="2"
									/>
								</g>
							</svg>
							<span className="sr-only">Instagram</span>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
