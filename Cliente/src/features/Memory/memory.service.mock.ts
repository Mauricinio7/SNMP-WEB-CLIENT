export type MemorySnapshot = {
	ts: number;
	totalBytes: number;
	usedBytes: number;
	availBytes: number;
	buffersBytes?: number;
	cachedBytes?: number;
	swapTotalBytes?: number;
	swapUsedBytes?: number;
};

export async function fetchMemorySnapshot(pcId: number): Promise<MemorySnapshot> {
	await new Promise((r) => setTimeout(r, 250));

	const totalKB = 8 * 1024 * 1024;
	const availKB = 3.8 * 1024 * 1024;
	const buffersKB = 256 * 1024;
	const cachedKB = 1.2 * 1024 * 1024;

	const swapTotalKB = 2 * 1024 * 1024;
	const swapAvailKB = 1.4 * 1024 * 1024;

	const kB = 1024;

	return {
		ts: Date.now(),
		totalBytes: totalKB * kB,
		availBytes: availKB * kB,
		usedBytes: (totalKB - availKB) * kB,
		buffersBytes: buffersKB * kB,
		cachedBytes: cachedKB * kB,
		swapTotalBytes: swapTotalKB * kB,
		swapUsedBytes: (swapTotalKB - swapAvailKB) * kB,
	};
}
