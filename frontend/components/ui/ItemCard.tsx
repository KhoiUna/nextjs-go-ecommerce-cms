import { Item } from "@/types/types";
import Link from "next/link";

interface Props {
	item: Item;
}

export default function ItemCard({ item }: Props) {
	const { id, title, price, url, discount, discount_type } = item;
	const href = "/shop/" + title.replaceAll(" ", "-") + "-" + id;

	const salePrice = !discount
		? 0
		: discount_type === "dollar"
		  ? price - discount
		  : price - (price * discount) / 100;

	return (
		<Link className="mt-8 mb-20 md:mr-14 hover:drop-shadow-lg" href={href}>
			{/* eslint-disable */}
			<img
				loading="lazy"
				className="h-[450px] w-[350px] object-contain mb-3"
				src={url || "/images/logo.png"}
				alt={title}
				width={350}
				height={450}
			/>
			<p>{title}</p>
			<p className="text-xl">
				<span
					className={
						salePrice !== 0
							? "line-through mr-2 text-slate-500"
							: "font-bold"
					}
				>
					${price}
				</span>
				{salePrice !== 0 && (
					<span className={salePrice !== 0 ? "font-bold" : ""}>
						${salePrice}
					</span>
				)}
			</p>
		</Link>
	);
}
