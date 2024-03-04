"use client";

import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../Logo";

type NavLink = { slug: string; text: string };

const MenuSidebar = ({
	toggleMenu,
	navLinks,
}: {
	toggleMenu: () => void;
	navLinks: NavLink[];
}) => {
	return (
		<>
			{/* Dark overlay */}
			<div
				onClick={() => toggleMenu()}
				className="cursor-pointer sm:hidden absolute z-10 left-0 top-0 opacity-95 bg-gradient-to-l from-primary to-background w-screen h-screen"
			></div>

			{/* Menu sidebar */}
			<div
				className={`drop-shadow-xl sm:hidden absolute z-20 top-0 right-0 h-screen w-fit`}
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

					{navLinks.slice(0, 5).map((item, index) => (
						<p
							key={index}
							className="sm:hidden mx-5 my-8 text-2xl decoration-white text-white font-semibold"
							onClick={() => toggleMenu()}
						>
							<NavLink href={`/${item.slug}`} text={item.text} />
						</p>
					))}
					<MobileOthersDropdown
						navLinks={navLinks.slice(5)}
						closeSidebar={toggleMenu}
					/>
				</div>
			</div>
		</>
	);
};

export default function HeaderBar() {
	const [menuOpened, setMenuOpened] = useState<Boolean>(false);
	const toggleMenu = () => setMenuOpened(!menuOpened);

	const [navLinks, setNavLinks] = useState<NavLink[]>([]);
	useEffect(() => {
		fetch("/api/page")
			.then((res) => res.json())
			.then((res) => {
				if (res.hasError) throw new Error("Error fetching nav links");
				setNavLinks(res.payload);
			});
	}, []);

	return (
		<header
			className={`fixed z-10 w-full bg-primary bg-opacity-90 backdrop-blur-lg backdrop-filter`}
		>
			<nav
				className={`flex p-3 items-center justify-between md:justify-around`}
			>
				<Link href="/">
					<div className="cursor-pointer">
						<Logo />
					</div>
				</Link>

				<div className="flex">
					{navLinks.length !== 0 &&
						navLinks.slice(0, 5).map((item, index) => (
							<p
								key={index}
								className={
									"hidden md:block mx-5 text-lg font-semibold text-white drop-shadow-lg"
								}
								onClick={() => toggleMenu()}
							>
								<NavLink
									href={`/${item.slug}`}
									text={item.text}
								/>
							</p>
						))}
					<OthersDropdown navLinks={navLinks.slice(5)} />
				</div>

				{navLinks.length !== 0 && !menuOpened && (
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
					</button>
				)}

				{menuOpened && (
					<MenuSidebar toggleMenu={toggleMenu} navLinks={navLinks} />
				)}
			</nav>
		</header>
	);
}

function OthersDropdown({ navLinks }: { navLinks: NavLink[] }) {
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => setIsOpen(!isOpen);

	if (navLinks.length === 0) return null;
	return (
		<>
			{isOpen && (
				<div
					onClick={toggleMenu}
					className="cursor-pointer absolute left-0 top-0 w-screen h-screen"
				/>
			)}

			<div className="hidden md:block mx-5 text-lg font-semibold text-white">
				<button
					type="button"
					className="inline-flex justify-center items-center"
					id="options-menu"
					aria-expanded="true"
					aria-haspopup="true"
					onClick={toggleMenu}
				>
					Others
					<svg
						className={isOpen ? "rotate-180" : ""}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path fill="currentColor" d="m7 10l5 5l5-5z" />
					</svg>
				</button>

				{isOpen && (
					<div
						className="absolute rounded-lg drop-shadow-lg bg-[#191919] bg-opacity-90"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						{navLinks.map((item, index) => (
							<p
								key={index}
								className="mx-5 my-8 text-lg decoration-white text-white font-semibold"
								onClick={toggleMenu}
							>
								<NavLink
									href={`/${item.slug}`}
									text={item.text}
								/>
							</p>
						))}
					</div>
				)}
			</div>
		</>
	);
}

function MobileOthersDropdown({
	navLinks,
	closeSidebar,
}: {
	navLinks: NavLink[];
	closeSidebar: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => setIsOpen(!isOpen);

	if (navLinks.length === 0) return null;
	return (
		<div className="sm:hidden mx-5 my-8 text-2xl text-white">
			<button
				type="button"
				className="inline-flex justify-center items-center font-semibold"
				id="options-menu"
				aria-expanded="true"
				aria-haspopup="true"
				onClick={toggleMenu}
			>
				Others
				<svg
					className={isOpen ? "rotate-180" : ""}
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
				>
					<path fill="currentColor" d="m7 10l5 5l5-5z" />
				</svg>
			</button>

			{isOpen &&
				navLinks.map((item, index) => (
					<div
						key={index}
						className="my-5 text-2xl decoration-white font-semibold"
						onClick={() => closeSidebar()}
					>
						<NavLink href={`/${item.slug}`} text={item.text} />
					</div>
				))}
		</div>
	);
}
