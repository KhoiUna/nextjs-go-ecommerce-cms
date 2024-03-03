export const SIZES = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"FREE SIZE",
	"ONE SIZE",
	"XXS",
	"XS",
	"S",
	"M",
	"L",
	"XL",
	"2XL",
	"3XL",
	"4XL",
];

export type ColorSize = {
	color: string;
	size: (typeof SIZES)[number];
	quantity: number;
};
export type Item = {
	id: number;
	title: string;
	price: number;
	url: string;

	page_id: number;
	slug: string;
	text: string;
	ID?: number;
	last_edited_by_username?: string;
	discount?: number;
	discount_type?: "dollar" | "percent";
	name?: string;
	description?: string;
	material?: string;
	is_preorder?: 0 | 1;
	hidden?: 0 | 1;
	images?: { url: string }[];
	color_size_arr?: ColorSize[];
	//sizes?: { type: (typeof SIZES)[number]; quantity: number }[];
	//colors?: { color: string }[];
};

export type Preorder = {
	created_at: string;
	id: number;
	item_id: number;
	title: string;
	customer_name: string;
	social: string;
	image_url: string;
	completed: 0 | 1;
	size: (typeof SIZES)[number];
	color: string | null;
};

export type MenuItem = {
	ID: number;
	slug: string;
	text: string;
	order: number;
	is_permanent: number;
};

export type Site = {
	image_url?: string;
};
