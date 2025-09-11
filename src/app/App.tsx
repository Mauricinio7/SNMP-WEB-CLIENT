import { Outlet, NavLink } from "react-router-dom";
import { PAGE_PATH } from "./routeManager/pages.paths";

export default function App() {
	return (
		<div style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "auto 1fr auto" }}>
			<header
				style={{ padding: "16px", borderBottom: "1px solid #eee", height: "100%", width: "100%" }}
			>
				<h1 style={{ margin: 0 }}>Generic app</h1>
				<nav style={{ marginTop: 8, display: "flex", gap: 12 }}>
					<NavLink to={PAGE_PATH.main}>Page 1</NavLink>
					<NavLink to={PAGE_PATH.second}>Page 2</NavLink>
				</nav>
			</header>

			<main style={{ padding: "16px" }}>
				<Outlet />
			</main>

			<footer style={{ padding: "16px", borderTop: "1px solid #eee" }}>
				<small>© {new Date().getFullYear()} Generic app</small>
			</footer>
		</div>
	);
}
