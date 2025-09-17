import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PAGE_PATH } from "./pages.paths";
import { LoaderFallback } from "../../shared/ui/LoaderFallback";

const App = lazy(() => import("../App"));
const MainPage = lazy(() => import("../../pages/MainPage"));
const SecondPage = lazy(() => import("../../pages/SecondPage"));
const DeviceDetailsPage = lazy(() => import("../../pages/DeviceDetailsPage"));
const CPUDetailsPage = lazy(() => import("../../pages/ CPUDetailsPage"));
const MemoryDetailsPage = lazy(() => import("../../pages/MemoryDetailsPage"));
const DiskDetailsPage = lazy(() => import("../../pages/DiskDetailsPage"));
const SystemDetailsPage = lazy(() => import("../../pages/SystemDetailsPage"));
const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));

const Fallback = <p style={{ padding: 16 }}>Cargando…</p>;

const routes: RouteObject[] = [
	{
		element: (
			<Suspense fallback={<LoaderFallback />}>
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
				path: "/pc/:id",
				element: (
					<Suspense fallback={Fallback}>
						<DeviceDetailsPage />
					</Suspense>
				),
			},
			{
				path: "/pc/:id/cpu",
				element: (
					<Suspense fallback={Fallback}>
						<CPUDetailsPage />
					</Suspense>
				),
			},
			{
				path: "/pc/:id/memory",
				element: (
					<Suspense fallback={Fallback}>
						<MemoryDetailsPage />
					</Suspense>
				),
			},
			{
				path: "/pc/:id/disk",
				element: (
					<Suspense fallback={Fallback}>
						<DiskDetailsPage />
					</Suspense>
				),
			},
			{
				path: "/pc/:id/system",
				element: (
					<Suspense fallback={Fallback}>
						<SystemDetailsPage />
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
