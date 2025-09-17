export const PAGE_PATH = {
	main: "/",
	second: "/second",
	pc: "/pc/:id",
	cpu: "/pc/:id/cpu",
	memory: "/pc/:id/memory",
	disk: "/pc/:id/disk",
	system: "/pc/:id/system",
} as const;

export const pcPath = (id: number | string) => `/pc/${id}`;
export const cpuPath = (id: number | string) => `/pc/${id}/cpu`;
export const memoryPath = (id: number | string) => `/pc/${id}/memory`;
export const diskPath = (id: number | string) => `/pc/${id}/disk`;
export const systemPath = (id: number | string) => `/pc/${id}/system`;
