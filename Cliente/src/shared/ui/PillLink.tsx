import { NavLink, NavLinkProps } from "react-router-dom";
import styles from "./styles/PillLink.module.css";

type PillLinkProps = Omit<NavLinkProps, "className"> & {
	className?: string;
};

export function PillLink({ className, ...props }: PillLinkProps) {
	return (
		<NavLink
			{...props}
			className={({ isActive }) =>
				[styles.pill, isActive ? styles.pillActive : "", className ?? ""].join(" ").trim()
			}
		/>
	);
}
export default PillLink;
