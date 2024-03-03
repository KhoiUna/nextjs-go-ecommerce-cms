import { Metadata } from "next";
import { BRAND_NAME } from "../config";

export const metadata: Metadata = {
	title: `Refund Policy | ${BRAND_NAME}`,
};

export default function RefundPolicy() {
	return (
		<div className="bg-background">
			<section className="px-10 pt-[15vh] min-h-[90vh]">
				<h1 className="pb-8 text-5xl font-bold">Refund Policy</h1>
				<p className="text-lg pb-5">
					Unfortunately, we do not accept any kind of
					return/refund/exchange at the moment, sorry for the
					inconvenience. We are still working on to make it possible.
				</p>
				<p className="text-lg pb-5">
					Send us an email with any concerns at{" "}
					<a
						href="mailto:5piecesclothing123@gmail.com"
						className="underline font-bold text-blue-700 underline-offset-4"
					>
						5piecesclothing123@gmail.com
					</a>
				</p>
			</section>
		</div>
	);
}
