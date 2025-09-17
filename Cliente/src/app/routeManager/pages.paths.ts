export const PAGE_PATH = {
	main: "/",
	second: "/second",
	pc: "/pc/:id",
	pcComponent: "/pc/:id/:component",
} as const;

export const pcPath = (id: number | string) => `/pc/${id}`;

export const pcComponentPath = (id: number | string, component: string) => `/pc/${id}/${component}`;
