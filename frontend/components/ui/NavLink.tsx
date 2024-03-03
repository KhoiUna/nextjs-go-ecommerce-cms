import Link from "next/link";

interface NavLinkProps {
	href: string;
	text: string;
}

const NavLink = ({ href, text }: NavLinkProps) => {
	return (
		<Link
			className="block w-full hover:underline underline-offset-4"
			href={href.toLowerCase()}
		>
			<span className="cursor-pointer inline">{text}</span>
		</Link>
	);
};

export default NavLink;
