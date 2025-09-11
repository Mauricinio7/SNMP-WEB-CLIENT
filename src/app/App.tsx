import { Outlet, NavLink } from "react-router-dom";
import { PAGE_PATH } from "./routeManager/pages.paths";
import style from "./AppLayout.module.css";

export default function App() {
	return (
		<div className={style.app}>
			<div className={style.frame}>
				<header className={style.header}>
					<div className={style.headerRow}>
						<div className={style.leftGroup}>
							<NavLink
								to={PAGE_PATH.main}
								className={({ isActive }) =>
									[style.pill, isActive ? style.pillActive : ""].join(" ").trim()
								}
							>
								Menu principal
							</NavLink>
						</div>

						<nav className={style.centerGroup} aria-label="PCs">
							<NavLink
								to={PAGE_PATH.main}
								className={({ isActive }) =>
									[style.pill, isActive ? style.pillActive : ""].join(" ").trim()
								}
							>
								PC 1
							</NavLink>
							<NavLink
								to={PAGE_PATH.second}
								className={({ isActive }) =>
									[style.pill, isActive ? style.pillActive : ""].join(" ").trim()
								}
							>
								PC 2
							</NavLink>
							<NavLink
								to="/pc3"
								className={({ isActive }) =>
									[style.pill, isActive ? style.pillActive : ""].join(" ").trim()
								}
							>
								PC 3
							</NavLink>
							<NavLink
								to="/pc4"
								className={({ isActive }) =>
									[style.pill, isActive ? style.pillActive : ""].join(" ").trim()
								}
							>
								PC 4
							</NavLink>
						</nav>

						<div />
					</div>
				</header>

				<main className={style.main}>
					<div className={style.contentCard}>
						<h1 className={style.title}>Administración de dispositivos disponibles</h1>
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
