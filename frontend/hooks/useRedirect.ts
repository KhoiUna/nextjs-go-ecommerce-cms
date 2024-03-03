"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UserResp = {
	payload: {
		isAuthenticated: boolean;
		username: string;
		role: string;
	};
};
type UseAuthProps = {
	redirectIfFound?: boolean;
};
type UseAuthReturn = {
	data: UserResp | null;
};

const swrFetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useAuth({
	redirectIfFound = false,
}: UseAuthProps): UseAuthReturn {
	const router = useRouter();

	const { data } = useSWR(`/api/auth`, swrFetcher);

	useEffect(() => {
		if (!data || !data.payload) return;

		const { isAuthenticated } = data.payload;
		if (!isAuthenticated) return router.push("/login");
		if (isAuthenticated && redirectIfFound)
			return router.push("/dashboard");
	}, [data, redirectIfFound, router]);

	return { data };
}
