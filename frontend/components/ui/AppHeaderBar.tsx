"use client";

import NavLink from "./NavLink";
import { useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Preorder } from "@/types/types";

type NavLink = {
	href: string;
	text: string;
};
const NAV_LINKS: NavLink[] = [
	{
		href: "/dashboard/pages",
		text: "Pages",
	},
	{
		href: "/dashboard/products",
		text: "Products",
	},
	{
		href: "/dashboard/preorders",
		text: "Preorders",
	},
	{
		href: "/dashboard/settings",
		text: "Settings",
	},
];

const MenuSidebar = ({
	toggleMenu,
	logout,
}: {
	toggleMenu: () => void;
	logout: () => void;
}) => {
	return (
		<>
			{/* Dark overlay */}
			<div
				onClick={() => toggleMenu()}
				className="cursor-pointer sm:hidden absolute z-10 left-0 top-0 opacity-95 bg-gradient-to-l from-primary to-background w-[100vw] h-[100vh]"
			></div>

			{/* Menu sidebar */}
			<div
				className={`drop-shadow-xl sm:hidden absolute z-20 top-0 right-0 h-[100vh] w-fit`}
			>
				<div className="text-right">
					<button
						type="button"
						aria-label="Close dropdown menu"
						className={"sm:hidden mr-3 mt-6 text-white"}
						onClick={() => toggleMenu()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					{NAV_LINKS.map((item, index) => (
						<p
							key={index}
							className="sm:hidden mx-5 my-8 text-2xl decoration-white text-white font-semibold"
							onClick={() => toggleMenu()}
						>
							<NavLink href={item.href} text={item.text} />
						</p>
					))}
					<p
						className="cursor-pointer sm:hidden mx-5 my-8 text-2xl decoration-white text-white font-semibold"
						onClick={() => logout()}
					>
						Logout
					</p>
				</div>
			</div>
		</>
	);
};

export default function AppHeaderBar() {
	const router = useRouter();
	const [menuOpened, setMenuOpened] = useState<boolean>(false);
	const toggleMenu = () => setMenuOpened(!menuOpened);

	const logout = () => {
		fetch("/api/auth/logout", {
			method: "POST",
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.payload.isAuthenticated) router.push("/login");
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<header
			className={`fixed z-10 w-full bg-[#191919] bg-opacity-90 backdrop-blur-lg backdrop-filter`}
		>
			<nav
				className={`flex p-3 items-center justify-between md:justify-around`}
			>
				<Link href="/dashboard">
					<div className="cursor-pointer">
						<Logo />
					</div>
				</Link>

				<div className="flex">
					{NAV_LINKS.length !== 0 &&
						NAV_LINKS.map((item, index) => (
							<p
								key={index}
								className={
									"hidden md:block mx-5 text-lg font-semibold text-white drop-shadow-lg"
								}
								onClick={() => toggleMenu()}
							>
								<NavLink href={item.href} text={item.text} />
								{item.text === "Preorders" && <Alert />}
							</p>
						))}
					<p
						className={
							"hidden md:block mx-5 text-lg font-semibold text-white drop-shadow-lg cursor-pointer"
						}
						onClick={logout}
					>
						Logout
					</p>
				</div>

				{NAV_LINKS.length !== 0 && !menuOpened && (
					<button
						type="button"
						aria-label="Open dropdown menu"
						className="md:hidden pb-1 text-white rounded-lg drop-shadow-lg"
						onClick={toggleMenu}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 6h16M4 12h16m-7 6h7"
							/>
						</svg>
						<Alert />
					</button>
				)}

				{menuOpened && (
					<MenuSidebar toggleMenu={toggleMenu} logout={logout} />
				)}
			</nav>
		</header>
	);
}

interface GetPreordersResponse {
	payload?: Preorder[];
}
function Alert() {
	const { data } = useQuery<any, any, GetPreordersResponse, any>({
		queryKey: ["preorders"],
		queryFn: async () => {
			const res = await fetch("/api/preorder");
			const data = await res.json();
			return data;
		},
	});

	if (
		!data ||
		!data.payload ||
		data.payload?.filter(({ completed }) => completed === 0).length === 0
	)
		return <></>;

	return (
		<div
			className="flex items-center justify-center absolute w-6 h-6 top-5 -right-0 bg-red-700 rounded-full text-xs"
			style={{ fontFamily: "sans-serif" }}
		>
			{data?.payload?.filter(({ completed }) => completed === 0).length}
		</div>
	);
}
