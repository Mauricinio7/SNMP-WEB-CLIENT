import { Outlet } from "react-router-dom";
import { PAGE_PATH } from "./routeManager/pages.paths";
import { pcPath } from "./routeManager/pages.paths";
import style from "../shared/styles/AppLayout.module.css";
import PillLink from "../shared/ui/PillLink";

const pcs = [
	{ to: pcPath(1), label: "PC 1" },
	{ to: pcPath(2), label: "PC 2" },
	{ to: pcPath(3), label: "PC 3" },
	{ to: pcPath(4), label: "PC 4" },
];

export default function App() {
	return (
		<div className={style.app}>
			<div className={style.frame}>
				<header className={style.header}>
					<div className={style.headerRow}>
						<div className={style.leftGroup}>
							<PillLink to={PAGE_PATH.main} aria-label="Ir al menú principal">
								Menu principal
							</PillLink>
						</div>

						<nav className={style.centerGroup} aria-label="PCs">
							{pcs.map((p) => (
								<PillLink key={p.label} to={p.to}>
									{p.label}
								</PillLink>
							))}
						</nav>

						<div />
					</div>
				</header>

				<main className={style.main}>
					<div className={style.contentCard}>
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
