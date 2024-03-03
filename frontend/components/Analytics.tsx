import Script from "next/script";

const GA_ID = "G-CDNE35JTXE";

export default function Analytics() {
	if (process.env.NODE_ENV !== "production") return <></>;

	return (
		<>
			{/* Google tag (gtag.js)  */}
			<Script
				async
				strategy="afterInteractive"
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
			/>
			<Script
				id="google_analytics"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');`,
				}}
			/>
		</>
	);
}
