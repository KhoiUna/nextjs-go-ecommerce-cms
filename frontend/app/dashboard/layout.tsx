"use client";

import AppHeaderBar from "@/components/ui/AppHeaderBar";
import Loader from "@/components/ui/Loader";
import useAuth from "@/hooks/useRedirect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function DahboardRootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data } = useAuth({});

	if (!data || !data.payload.isAuthenticated) return <Loader />;

	return (
		<QueryClientProvider client={queryClient}>
			<AppHeaderBar />
			<div className="min-h-screen bg-secondary px-10 pb-10 pt-32">
				<Toaster position="top-center" richColors closeButton />
				{children}
			</div>
		</QueryClientProvider>
	);
}
