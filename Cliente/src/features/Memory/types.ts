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

export type MemoryHistoryPoint = { t: string; ramUsedPct: number; swapUsedPct: number };

export type MemorySeries = {
	now: MemorySnapshot;
	history: MemoryHistoryPoint[];
};
