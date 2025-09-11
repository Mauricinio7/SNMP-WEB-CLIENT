import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PAGE_PATH } from "./pages.paths";

const App = lazy(() => import("../App"));
const MainPage = lazy(() => import("../../pages/MainPage"));
const SecondPage = lazy(() => import("../../pages/SecondPage"));
const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));

const Fallback = <p style={{ padding: 16 }}>Cargando…</p>;

const routes: RouteObject[] = [
	{
		element: (
			<Suspense fallback={Fallback}>
				<App />
			</Suspense>
		),
		children: [
			{
				path: PAGE_PATH.main,
				element: (
					<Suspense fallback={Fallback}>
						<MainPage />
					</Suspense>
				),
			},
			{
				path: PAGE_PATH.second,
				element: (
					<Suspense fallback={Fallback}>
						<SecondPage />
					</Suspense>
				),
			},
			{
				path: "*",
				element: (
					<Suspense fallback={Fallback}>
						<NotFoundPage />
					</Suspense>
				),
			},
		],
	},
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
