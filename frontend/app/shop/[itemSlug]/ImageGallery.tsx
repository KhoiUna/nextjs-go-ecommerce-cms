"use client";

import ReactImageGallery from "react-image-gallery";

export function ImageGallery({ images }: { images: { url: string }[] }) {
	const items = images.map(({ url }) => ({
		thumbnail: url,
		original: url,
	}));

	return (
		<ReactImageGallery
			thumbnailPosition="left"
			items={items}
			showPlayButton={false}
			lazyLoad={false}
		/>
	);
}
